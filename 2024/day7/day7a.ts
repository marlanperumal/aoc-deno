import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day7a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);
  const reduceNumbers = (numbers: number[], target: number): number => {
    if (numbers.length == 1) {
      return numbers[0] === target ? target : 0;
    }
    return Math.max(
      reduceNumbers([numbers[0] + numbers[1], ...numbers.slice(2)], target),
      reduceNumbers([numbers[0] * numbers[1], ...numbers.slice(2)], target)
    );
  };
  const result = text
    .split("\n")
    .map((line) => line.split(":"))
    .map(([testValue, strNumbers]) => {
      const numbers = strNumbers
        .trim()
        .split(" ")
        .map((num) => Number(num));
      return reduceNumbers(numbers, Number(testValue));
    })
    .reduce((a, b) => a + b);

  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day7_input.txt";
  await day7a(fileName).then(console.log);
}

Deno.test("Test small case", async function day7aTest() {
  const result = await day7a("day7_input_small.txt");
  assertEquals(result, 3749);
});

Deno.test("Test big case", async function day7aTest() {
  const result = await day7a("day7_input.txt");
  assertEquals(result, 5030892084481);
});
