import * as path from "@std/path";
import { assertEquals } from "@std/assert";

export const day14a = async (fileName: string, X: number[], N: number) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);
  const quadrants = { 1: 0, 2: 0, 3: 0, 4: 0 };
  text
    .trim()
    .split("\n")
    .forEach((line) => {
      const [ps, vs] = line.trim().split(" ");
      const p0 = [Number(ps.split(",")[0].slice(2)), Number(ps.split(",")[1])];
      const v0 = [Number(vs.split(",")[0].slice(2)), Number(vs.split(",")[1])];
      const p = [
        (((p0[0] + N * v0[0]) % X[0]) + X[0]) % X[0],
        (((p0[1] + N * v0[1]) % X[1]) + X[1]) % X[1],
      ];
      if (p[0] < Math.floor(X[0] / 2)) {
        if (p[1] < Math.floor(X[1] / 2)) {
          quadrants[1] += 1;
        } else if (p[1] > Math.floor(X[1] / 2)) {
          quadrants[2] += 1;
        }
      }
      if (p[0] > Math.floor(X[0] / 2)) {
        if (p[1] < Math.floor(X[1] / 2)) {
          quadrants[3] += 1;
        } else if (p[1] > Math.floor(X[1] / 2)) {
          quadrants[4] += 1;
        }
      }
    });

  const result = Object.values(quadrants).reduce((a, b) => a * b);
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day14_input.txt";
  await day14a(fileName, [101, 103], 100).then(console.log);
}

Deno.test("Test small case", async function day14aTest() {
  const result = await day14a("day14_input_small.txt", [11, 7], 100);
  assertEquals(result, 12);
});

Deno.test("Test big case", async function day14aTest() {
  const result = await day14a("day14_input.txt", [101, 103], 100);
  assertEquals(result, 230461440);
});
