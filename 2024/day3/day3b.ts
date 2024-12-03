import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day3b = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  let text = await Deno.readTextFile(filePath);

  let doFlag = true;
  let result = 0;
  while (text.length > 0) {
    if (doFlag) {
      let nextDont = text.indexOf("don't()");
      if (nextDont < 0) {
        nextDont = text.length;
      }
      const doText = text.slice(0, nextDont);
      text = text.slice(nextDont + 7);
      const matches = doText
        .matchAll(/mul\((\-?\d+),(\-?\d+)\)/g)
        .map(([_, x, y]) => parseInt(x) * parseInt(y));
      result += matches.reduce((a, b) => a + b, 0);
      doFlag = false;
    } else {
      let nextDo = text.indexOf("do()");
      if (nextDo < 0) {
        nextDo = text.length;
      }
      text = text.slice(nextDo + 4);
      doFlag = true;
    }
  }

  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day3_input.txt";
  await day3b(fileName).then(console.log);
}

Deno.test("Test small case", async function day3bTest() {
  const result = await day3b("day3_input_small_2.txt");
  assertEquals(result, 48);
});

Deno.test("Test big case", async function day3bTest() {
  const result = await day3b("day3_input.txt");
  assertEquals(result, 95846796);
});
