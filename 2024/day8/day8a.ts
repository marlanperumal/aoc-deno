import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day8a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = (await Deno.readTextFile(filePath)).split("\n");
  const nodes = new Map<string, [number, number][]>();
  text.forEach((row, i) => {
    row.split("").forEach((col, j) => {
      if (col !== ".") {
        if (!nodes.has(col)) {
          nodes.set(col, [[i, j]]);
        } else {
          nodes.get(col)?.push([i, j]);
        }
      }
    });
  });
  const antinodes = new Set<string>();

  nodes.forEach((nodeLocations, _) => {
    nodeLocations.forEach(([y1, x1], i) => {
      nodeLocations.slice(0, i).forEach(([y2, x2]) => {
        const antinode1 = [2 * y1 - y2, 2 * x1 - x2] as [number, number];
        const antinode2 = [2 * y2 - y1, 2 * x2 - x1] as [number, number];
        if (
          antinode1[0] >= 0 &&
          antinode1[0] < text.length &&
          antinode1[1] >= 0 &&
          antinode1[1] < text[0].length
        ) {
          antinodes.add(`${antinode1[0]}|${antinode1[1]}`);
        }
        if (
          antinode2[0] >= 0 &&
          antinode2[0] < text.length &&
          antinode2[1] >= 0 &&
          antinode2[1] < text[0].length
        ) {
          antinodes.add(`${antinode2[0]}|${antinode2[1]}`);
        }
      });
    });
  });

  const result = antinodes.size;
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day8_input.txt";
  await day8a(fileName).then(console.log);
}

Deno.test("Test small case", async function day8aTest() {
  const result = await day8a("day8_input_small.txt");
  assertEquals(result, 14);
});

Deno.test("Test big case", async function day8aTest() {
  const result = await day8a("day8_input.txt");
  assertEquals(result, 252);
});
