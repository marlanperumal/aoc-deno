import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day1b = async (fileName: string) => {
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

  const ns = new Map<number, number>();
  for (const x of n) {
    ns.set(x, (ns.get(x) || 0) + 1);
  }
  let result = 0;
  m.forEach((x) => {
    result = result + x * (ns.get(x) || 0);
  });
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day1_input.txt";
  await day1b(fileName).then(console.log);
}

Deno.test("Test small case", async function day1bTest() {
  const result = await day1b("day1_input_small.txt");
  assertEquals(result, 31);
});

Deno.test("Test big case", async function day1bTest() {
  const result = await day1b("day1_input.txt");
  assertEquals(result, 23741109);
});
