import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day14b = async (fileName: string, X: number[]) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);
  const robots = text
    .trim()
    .split("\n")
    .map((line) => {
      const [ps, vs] = line.trim().split(" ");
      const p = [Number(ps.split(",")[0].slice(2)), Number(ps.split(",")[1])];
      const v = [Number(vs.split(",")[0].slice(2)), Number(vs.split(",")[1])];
      return [p, v];
    });
  let i = 0;
  while (true) {
    i += 1;
    const positions = new Set<string>();
    for (const robot of robots) {
      const [p, v] = robot;
      robot[0] = [
        (((p[0] + v[0]) % X[0]) + X[0]) % X[0],
        (((p[1] + v[1]) % X[1]) + X[1]) % X[1],
      ];
      positions.add(`${robot[0][0]}|${robot[0][1]}`);
    }
    if (positions.size === robots.length) {
      break;
    }
  }
  const result = i;
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day14_input.txt";
  await day14b(fileName, [101, 103]).then(console.log);
}

Deno.test("Test big case", async function day14bTest() {
  const result = await day14b("day14_input.txt", [101, 103]);
  assertEquals(result, 6668);
});
