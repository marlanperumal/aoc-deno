import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day1a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);

  const m: number[] = [];
  const n: number[] = [];
  text.split("\n").forEach((line) => {
    const [i, j] = line.split("   ").map(Number) as [number, number];
    if (!i || !j) return;
    m.push(i);
    n.push(j);
  });
  const ms = m.toSorted();
  const ns = n.toSorted();
  const result = ms
    .map((x, i) => Math.abs(x - ns[i]))
    .reduce((a, b) => a + b, 0);
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day1_input.txt";
  await day1a(fileName).then(console.log);
}

Deno.test("Test small case", async function day1aTest() {
  const result = await day1a("day1_input_small.txt");
  assertEquals(result, 11);
});

Deno.test("Test big case", async function day1aTest() {
  const result = await day1a("day1_input.txt");
  assertEquals(result, 2166959);
});
