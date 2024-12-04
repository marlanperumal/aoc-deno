import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day4b = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);
  const lines = text.split("\n");

  let result = 0;
  const findXMas = (i: number, j: number, lines: string[]) => {
    if (i < 1 || j < 1 || i > lines.length - 2 || j > lines[0].length - 2) {
      return false;
    }
    if (lines[i][j] != "A") {
      return false;
    }
    const masks = [
      [
        [-1, -1],
        [-1, 1],
        [1, 1],
        [1, -1],
      ],
      [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ],
      [
        [1, 1],
        [1, -1],
        [-1, -1],
        [-1, 1],
      ],
      [
        [1, 1],
        [-1, 1],
        [-1, -1],
        [1, -1],
      ],
    ];
    for (const mask of masks) {
      if (mask.every(([ii, jj], k) => lines[i + ii][j + jj] == "MMSS"[k])) {
        return true;
      }
    }
  };
  lines.forEach((row, i) => {
    row.split("").forEach((_, j) => {
      if (findXMas(i, j, lines)) {
        result += 1;
      }
    });
  });
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day4_input.txt";
  await day4b(fileName).then(console.log);
}

Deno.test("Test small case", async function day4bTest() {
  const result = await day4b("day4_input_small.txt");
  assertEquals(result, 9);
});

Deno.test("Test big case", async function day4bTest() {
  const result = await day4b("day4_input.txt");
  assertEquals(result, 1905);
});
