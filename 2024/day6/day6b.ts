import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day6b = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = (await Deno.readTextFile(filePath)).split("\n");

  let result = 0;

  let [i0, j0] = [0, 0];
  const grid = new Map<string, string>();

  text.forEach((row, i) => {
    row.split("").forEach((col, j) => {
      grid.set([i, j].join(","), col);
      if (col == "^") {
        [i0, j0] = [i, j];
      }
    });
  });

  const walk = (i0: number, j0: number, grid: Map<string, string>) => {
    const route = new Array<string>();
    const visited = new Map<string, Set<string>>();
    const directions = ["N", "E", "S", "W"];
    let directionId = 0;
    while (grid.has([i0, j0].join(","))) {
      const direction = directions[directionId % 4];
      if (visited.has([i0, j0].join(","))) {
        const previousVisits = visited.get([i0, j0].join(","));
        if (previousVisits?.has(direction)) {
          return route;
        } else {
          previousVisits?.add(direction);
        }
      } else {
        visited.set([i0, j0].join(","), new Set([direction]));
      }
      let [i, j] = [0, 0];
      if (direction === "N") {
        [i, j] = [i0 - 1, j0];
      } else if (direction === "E") {
        [i, j] = [i0, j0 + 1];
      } else if (direction === "S") {
        [i, j] = [i0 + 1, j0];
      } else {
        [i, j] = [i0, j0 - 1];
      }

      const nextPos = grid.get([i, j].join(","));
      if (nextPos === "#") {
        directionId += 1;
      } else {
        [i0, j0] = [i, j];
        route.push([i, j].join(","));
      }
    }
    return route;
  };

  const route = walk(i0, j0, grid);
  for (const pos of new Set(route)) {
    const newGrid = new Map(grid);
    newGrid.set(pos, "#");
    const newPath = walk(i0, j0, newGrid);
    if (grid.has(newPath[newPath.length - 1])) {
      result += 1;
    }
  }
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day6_input.txt";
  await day6b(fileName).then(console.log);
}

Deno.test("Test small case", async function day6bTest() {
  const result = await day6b("day6_input_small.txt");
  assertEquals(result, 6);
});

Deno.test("Test big case", async function day6bTest() {
  const result = await day6b("day6_input.txt");
  assertEquals(result, 1753);
});
