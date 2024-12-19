import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day19b = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = (await Deno.readTextFile(filePath)).split("\n\n");

  const towels = new Set<string>(text[0].trim().split(", "));
  const patterns = text[1].trim().split("\n");

  const cache = new Map<string, number>();

  const checkPattern = (pattern: string, towels: Set<string>): number => {
    if (cache.has(pattern)) {
      return cache.get(pattern)!;
    }
    if (pattern === "") {
      cache.set(pattern, 1);
      return 1;
    }
    let arrangements = 0;
    pattern.split("").forEach((_, i) => {
      if (towels.has(pattern.slice(0, i + 1))) {
        arrangements += checkPattern(pattern.slice(i + 1), towels);
      }
    });
    cache.set(pattern, arrangements);
    return arrangements;
  };

  const result = patterns
    .map((pattern): number => checkPattern(pattern, towels))
    .reduce((a, b) => a + b);
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day19_input.txt";
  await day19b(fileName).then(console.log);
}

Deno.test("Test small case", async function day19bTest() {
  const result = await day19b("day19_input_small.txt");
  assertEquals(result, 16);
});

Deno.test("Test big case", async function day19bTest() {
  const result = await day19b("day19_input.txt");
  assertEquals(result, 619970556776002);
});
