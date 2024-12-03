import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day2a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);
  const lines = text.split("\n");

  const safeLines = lines.map((line: string) => {
    const levels = line.split(" ").map(Number);
    const isClose = levels
      .toSpliced(0, 1)
      .every(
        (level: number, i: number) =>
          Math.abs(level - levels[i]) > 0 && Math.abs(level - levels[i]) < 4
      );
    const isIncreasing = levels.every(
      (level: number, i: number) =>
        level === levels.toSorted((a, b) => a - b)[i]
    );
    const isDecreasing = levels.every(
      (level: number, i: number) =>
        level === levels.toSorted((a, b) => b - a)[i]
    );
    const isSafe = isClose && (isIncreasing || isDecreasing);
    return isSafe;
  });

  const result = safeLines.reduce((a, b) => a + (b ? 1 : 0), 0);
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day2_input.txt";
  await day2a(fileName).then(console.log);
}

Deno.test("Test small case", async function day2aTest() {
  const result = await day2a("day2_input_small.txt");
  assertEquals(result, 2);
});

Deno.test("Test big case", async function day2aTest() {
  const result = await day2a("day2_input.txt");
  assertEquals(result, 341);
});
