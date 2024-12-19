import * as math from "mathjs";
import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

const J = math.complex(0, 1);
const nJ = math.complex(0, -1);
const replacements = new Map<string, string>(
  Object.entries({
    "#": "##",
    O: "[]",
    ".": "..",
    "@": "@.",
  })
);

const transformCursor = (c: string, dir: math.Complex) => {
  if (c !== "@") {
    return c;
  }
  if (math.equal(dir, math.complex(1, 0))) {
    return "v";
  } else if (math.equal(dir, math.complex(-1, 0))) {
    return "^";
  } else if (math.equal(dir, math.complex(0, 1))) {
    return ">";
  } else if (math.equal(dir, math.complex(0, -1))) {
    return "<";
  } else {
    return c;
  }
};

const printGrid = (
  grid: Map<string, [math.Complex, string]>,
  move: math.Complex = math.complex(0, 0)
) => {
  console.clear();
  const nRows =
    grid
      .values()
      .map((x) => x[0].re)
      .reduce((a, b) => Math.max(a, b)) + 1;
  const nCols =
    grid
      .values()
      .map((x) => x[0].im)
      .reduce((a, b) => Math.max(a, b)) + 1;
  Array.from(Array(nRows).keys()).forEach((i: number) => {
    console.log(
      Array.from(Array(nCols).keys())
        .map((j) => transformCursor(grid.get(`${i}|${j}`)![1], move))
        .join("")
    );
  });
};

export const day15b = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = (await Deno.readTextFile(filePath)).trim().split("\n\n");
  const grid = new Map<string, [math.Complex, string]>();
  text[0].split("\n").forEach((row, i) => {
    row.split("").forEach((col, j) => {
      grid.set(`${i}|${2 * j}`, [
        math.complex(i, 2 * j),
        replacements.get(col)!.slice(0, 1),
      ]);
      grid.set(`${i}|${2 * j + 1}`, [
        math.complex(i, 2 * j + 1),
        replacements.get(col)!.slice(1, 2),
      ]);
    });
  });
  const moves = text[1]
    .replaceAll("\n", "")
    .split("")
    .map((c) => {
      switch (c) {
        case "v":
          return 1;
        case "^":
          return -1;
        case ">":
          return J;
        case "<":
          return nJ;
        default:
          return 0;
      }
    }) as math.Complex[];

  let pos: math.Complex = math.complex(0, 0);
  grid.forEach(([z, val]) => {
    if (val === "@") {
      pos = z;
    }
  });

  printGrid(grid);

  const checkClear = (
    pos: math.Complex,
    dir: math.Complex,
    grid: Map<string, [math.Complex, string]>,
    pair: boolean = true
  ) => {
    const posStr = `${pos.re}|${pos.im}`;
    const node = grid.get(posStr)!;
    if (!pair) {
      if (node[1] === "[") {
        if (!checkClear(math.add(pos, J), dir, grid)) {
          return false;
        }
      }
      if (node[1] === "]") {
        if (!checkClear(math.add(pos, nJ), dir, grid)) {
          return false;
        }
      }
    }
    if (node[1] === "#") {
      return false;
    }
    if (node[1] === ".") {
      return true;
    }
    return checkClear(math.add(pos, dir), dir, grid, false);
  };

  const moveBlock = (
    pos: math.Complex,
    dir: math.Complex,
    grid: Map<string, [math.Complex, string]>,
    pair: boolean = true
  ) => {
    const posStr = `${pos.re}|${pos.im}`;
    const newPos = math.add(pos, dir);
    const newPosStr = `${newPos.re}|${newPos.im}`;
    const node = grid.get(posStr)!;
    const neighbour = grid.get(newPosStr)!;
    if (neighbour[1] === "#") {
      return false;
    }
    if (dir === J || dir === nJ) {
      if (neighbour[1] === "[" || neighbour[1] === "]") {
        moveBlock(newPos, dir, grid);
      }
      if (neighbour[1] === ".") {
        neighbour[1] = node[1];
        node[1] = ".";
        return true;
      }
      return false;
    }
    const clear = checkClear(newPos, dir, grid, false);
    if (clear) {
      if (!pair) {
        if (node[1] === "[") {
          moveBlock(math.add(pos, J), dir, grid, true);
        } else if (node[1] === "]") {
          moveBlock(math.add(pos, nJ), dir, grid, true);
        }
      }
      if (neighbour[1] === "[" || neighbour[1] === "]") {
        moveBlock(newPos, dir, grid, false);
      }
      if (neighbour[1] === ".") {
        neighbour[1] = node[1];
        node[1] = ".";
        return true;
      }
    }
    return false;
  };

  moves.forEach((move: math.Complex, _i: number) => {
    const moved = moveBlock(pos, move, grid, false);
    if (moved) {
      pos = math.add(pos, move);
    }
    // printGrid(grid, move);
  });

  const result = grid
    .values()
    .map(([pos, val]) => (val === "[" ? pos.re * 100 + pos.im : 0))
    .reduce((a, b) => a + b);
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day15_input_small_2.txt";
  await day15b(fileName).then(console.log);
}

Deno.test("Test small case", async function day15bTest() {
  const result = await day15b("day15_input_small_2.txt");
  assertEquals(result, 9021);
});

Deno.test("Test big case", async function day15bTest() {
  const result = await day15b("day15_input.txt");
  assertEquals(result, 1538862);
});
