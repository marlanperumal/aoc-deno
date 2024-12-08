import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day8b = async (fileName: string) => {
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
        const gap = [y2 - y1, x2 - x1];
        let antinode = [y1, x1];
        while (
          antinode[0] >= 0 &&
          antinode[0] < text.length &&
          antinode[1] >= 0 &&
          antinode[1] < text[0].length
        ) {
          antinodes.add(`${antinode[0]}|${antinode[1]}`);
          antinode = [antinode[0] + gap[0], antinode[1] + gap[1]];
        }
        antinode = [y1, x1];
        while (
          antinode[0] >= 0 &&
          antinode[0] < text.length &&
          antinode[1] >= 0 &&
          antinode[1] < text[0].length
        ) {
          antinodes.add(`${antinode[0]}|${antinode[1]}`);
          antinode = [antinode[0] - gap[0], antinode[1] - gap[1]];
        }
      });
    });
  });

  const result = antinodes.size;
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day8_input.txt";
  await day8b(fileName).then(console.log);
}

Deno.test("Test small case", async function day8bTest() {
  const result = await day8b("day8_input_small.txt");
  assertEquals(result, 34);
});

Deno.test("Test big case", async function day8bTest() {
  const result = await day8b("day8_input.txt");
  assertEquals(result, 839);
});
