import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day0a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);

  let result = 0;
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day0_input.txt";
  await day0a(fileName).then(console.log);
}

Deno.test("Test small case", async function day0aTest() {
  const result = await day0a("day0_input_small.txt");
  assertEquals(result, 0);
});

Deno.test("Test big case", async function day0aTest() {
  const result = await day0a("day0_input.txt");
  assertEquals(result, 0);
});
