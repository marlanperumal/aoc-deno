import * as path from "@std/path";
import { assertEquals } from "@std/assert";

export const day11a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);
  const N = 25;
  const cache = new Map<string, number>();
  const blink = (value: number, generation: number): number => {
    let result: number;
    const key = `${value}|${generation}`;
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    if (generation === N) {
      result = 1;
    } else if (value === 0) {
      result = blink(1, generation + 1);
    } else if (`${value}`.length % 2 === 0) {
      const len = `${value}`.length;
      result =
        blink(Number(`${value}`.slice(0, len / 2)), generation + 1) +
        blink(Number(`${value}`.slice(len / 2, len)), generation + 1);
    } else {
      result = blink(value * 2024, generation + 1);
    }
    cache.set(`${value}|${generation}`, result);
    return result;
  };
  const result = text
    .trim()
    .split(" ")
    .map((i) => Number(i))
    .map((i) => blink(i, 0))
    .reduce((a, b) => a + b);
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day11_input.txt";
  await day11a(fileName).then(console.log);
}

Deno.test("Test small case", async function day11aTest() {
  const result = await day11a("day11_input_small.txt");
  assertEquals(result, 55312);
});

Deno.test("Test big case", async function day11aTest() {
  const result = await day11a("day11_input.txt");
  assertEquals(result, 211306);
});
