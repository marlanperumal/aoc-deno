import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day2b = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);
  const lines = text.split("\n");

  const checkSafe = (levels: number[]) => {
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
  };

  const safeLines = lines.map((line: string) => {
    const levels = line.split(" ").map(Number);
    if (checkSafe(levels)) {
      return true;
    }
    for (let i = 0; i < levels.length; i++) {
      const newLevels = levels.toSpliced(i, 1);
      if (checkSafe(newLevels)) {
        return true;
      }
    }
    return false;
  });

  const result = safeLines.reduce((a, b) => a + (b ? 1 : 0), 0);
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day2_input.txt";
  await day2b(fileName).then(console.log);
}

Deno.test("Test small case", async function day2bTest() {
  const result = await day2b("day2_input_small.txt");
  assertEquals(result, 4);
});

Deno.test("Test big case", async function day2bTest() {
  const result = await day2b("day2_input.txt");
  assertEquals(result, 404);
});
