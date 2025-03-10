import * as path from "@std/path";
import { assertEquals } from "@std/assert";

const secret()

export const day21a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);

  let result = 0;
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day21_input.txt";
  await day21a(fileName).then(console.log);
}

Deno.test("Test small case", async function day21aTest() {
  const result = await day21a("day21_input_small.txt");
  assertEquals(result, 126384);
});

Deno.test("Test big case", async function day21aTest() {
  const result = await day21a("day21_input.txt");
  assertEquals(result, 163086);
});
