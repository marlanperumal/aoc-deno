import * as math from "mathjs";
import * as path from "@std/path";
import { assertEquals } from "@std/assert";

const J = math.complex(0, 1);
const nJ = math.complex(0, -1);

export const day15a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = (await Deno.readTextFile(filePath)).trim().split("\n\n");
  const grid = new Map<string, [math.Complex, string]>();
  text[0].split("\n").forEach((row, i) => {
    row.split("").forEach((col, j) => {
      grid.set(`${i}|${j}`, [math.complex(i, j), col]);
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

  const moveBlock = (
    pos: math.Complex,
    dir: math.Complex,
    grid: Map<string, [math.Complex, string]>
  ) => {
    const posStr = `${pos.re}|${pos.im}`;
    const newPos = math.add(pos, dir);
    const newPosStr = `${newPos.re}|${newPos.im}`;
    if (grid.get(newPosStr)![1] === "#") {
      return false;
    }
    if (grid.get(newPosStr)![1] === "O") {
      moveBlock(newPos, dir, grid);
    }
    if (grid.get(newPosStr)![1] === ".") {
      grid.get(newPosStr)![1] = grid.get(posStr)![1];
      grid.get(posStr)![1] = ".";
      return true;
    }
    return false;
  };

  for (const move of moves) {
    const moved = moveBlock(pos, move, grid);
    if (moved) {
      pos = math.add(pos, move);
    }
  }

  const result = grid
    .values()
    .map(([pos, val]) => (val === "O" ? pos.re * 100 + pos.im : 0))
    .reduce((a, b) => a + b);
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day15_input.txt";
  await day15a(fileName).then(console.log);
}

Deno.test("Test small case 1", async function day15aTest() {
  const result = await day15a("day15_input_small_1.txt");
  assertEquals(result, 2028);
});

Deno.test("Test small case 2", async function day15aTest() {
  const result = await day15a("day15_input_small_2.txt");
  assertEquals(result, 10092);
});

Deno.test("Test big case", async function day15aTest() {
  const result = await day15a("day15_input.txt");
  assertEquals(result, 1517819);
});
