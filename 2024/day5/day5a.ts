import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day5a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);
  let result = 0;

  const [rulesText, updatesText] = text.split("\n\n");
  const rules = rulesText.split("\n");
  const updates = updatesText.split("\n");

  updates.forEach((line) => {
    const update = line.split(",");
    const sortedUpdate = update.toSorted((x, y) =>
      rules.includes(`${x}|${y}`) ? -1 : 1
    );
    if (update.every((x, i) => x === sortedUpdate[i])) {
      result += Number(sortedUpdate[Math.floor(sortedUpdate.length / 2)]);
    }
  });

  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day5_input.txt";
  await day5a(fileName).then(console.log);
}

Deno.test("Test small case", async function day5aTest() {
  const result = await day5a("day5_input_small.txt");
  assertEquals(result, 143);
});

Deno.test("Test big case", async function day5aTest() {
  const result = await day5a("day5_input.txt");
  assertEquals(result, 4569);
});
