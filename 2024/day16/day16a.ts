import * as path from "@std/path";
import { assertEquals } from "@std/assert";

type Vec2d = [number, number];
type Node = [Vec2d, Vec2d, number, Vec2d[]];
const directions: Vec2d[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function vecEquals(a: Vec2d, b: Vec2d): boolean {
  return a.every((v, i) => v === b[i]);
}

function vecAdd(a: Vec2d, b: Vec2d): Vec2d {
  return a.map((v, i) => v + b[i]) as Vec2d;
}

export const day16a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);
  const grid = text
    .trim()
    .split("\n")
    .map((row) => row.trim().split(""));

  let [start, target]: [Vec2d, Vec2d] = [
    [0, 0],
    [0, 0],
  ];
  grid.forEach((row, i) => {
    row.forEach((col, j) => {
      if (col === "S") {
        start = [i, j];
      } else if (col == "E") {
        target = [i, j];
      }
    });
  });

  const visited = new Map<string, Node>();
  let node: Node = [start, [0, 1], 0, [[0, 1]]];
  const unvisited = new Map<string, Node>();
  unvisited.set(JSON.stringify([node[0], node[1]]), node);

  while (unvisited.size > 0) {
    const minKey = unvisited
      .keys()
      .reduce(
        (a, b) => (unvisited.get(a)![2] < unvisited.get(b)![2] ? a : b),
        unvisited.keys().next().value!
      );
    if (!unvisited.has(minKey)) {
      console.log(minKey);
    }
    node = unvisited.get(minKey)!;
    unvisited.delete(minKey);
    if (vecEquals(node[0], target)) {
      break;
    }
    directions.forEach((nDir) => {
      let score = 0;
      if (vecEquals(nDir, node[1])) {
        score = 1;
      } else if (nDir[0] * node[1][0] === 0 && nDir[1] * node[1][1] === 0) {
        score = 1001;
      } else {
        return;
      }
      const nPos = vecAdd(node[0], nDir);
      if (
        nPos[0] < 0 ||
        nPos[1] < 0 ||
        nPos[0] > grid.length ||
        nPos[1] > grid[0].length
      ) {
        return;
      }
      if (grid[nPos[0]][nPos[1]] === "#") {
        return;
      }
      if (visited.has(JSON.stringify([nPos, nDir]))) {
        return;
      }
      if (!unvisited.has(JSON.stringify([nPos, nDir]))) {
        const neighbour: Node = [
          nPos,
          nDir,
          node[2] + score,
          node[3].concat(nDir),
        ];
        unvisited.set(JSON.stringify([nPos, nDir]), neighbour);
      } else {
        const neighbour = unvisited.get(JSON.stringify([nPos, nDir]))!;
        if (neighbour[2] > node[2] + score) {
          neighbour[1] = nDir;
          neighbour[2] = node[2] + score;
          neighbour[3] = node[3].concat(nPos);
        }
      }
    });
    visited.set(JSON.stringify([node[0], node[1]]), node);
  }

  const result = node[2];
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day16_input_small_1.txt";
  await day16a(fileName).then(console.log);
}

Deno.test("Test small case 1", async function day16aTest() {
  const result = await day16a("day16_input_small_1.txt");
  assertEquals(result, 7036);
});

Deno.test("Test small case 2", async function day16aTest() {
  const result = await day16a("day16_input_small_2.txt");
  assertEquals(result, 11048);
});

Deno.test("Test big case", async function day16aTest() {
  const result = await day16a("day16_input.txt");
  assertEquals(result, 104516);
});
