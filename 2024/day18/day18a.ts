import * as path from "@std/path";
import { assertEquals } from "@std/assert";

export const day18a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);

  let result = 0;
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day18_input.txt";
  await day18a(fileName).then(console.log);
}

Deno.test("Test small case", async function day18aTest() {
  const result = await day18a("day18_input_small.txt");
  assertEquals(result, 0);
});

Deno.test("Test big case", async function day18aTest() {
  const result = await day18a("day18_input.txt");
  assertEquals(result, 0);
});
