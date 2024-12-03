import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day3a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);

  const matches = text.matchAll(/mul\((\-?\d+),(\-?\d+)\)/g);
  const result = matches
    .map(([_, x, y]) => parseInt(x) * parseInt(y))
    .reduce((a, b) => a + b, 0);
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day3_input.txt";
  await day3a(fileName).then(console.log);
}

Deno.test("Test small case", async function day3aTest() {
  const result = await day3a("day3_input_small_1.txt");
  assertEquals(result, 161);
});

Deno.test("Test big case", async function day3aTest() {
  const result = await day3a("day3_input.txt");
  assertEquals(result, 167650499);
});
