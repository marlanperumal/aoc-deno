import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day13b = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);

  let totalTokens = 0;
  const P = 1e13;
  for (const block of text.trim().split("\n\n")) {
    const [x, y, p] = block.split("\n").map((line) =>
      line
        .trim()
        .split(":")[1]
        .split(",")
        .map((s) => Number(s.trim().slice(2)))
    );
    p[0] += P;
    p[1] += P;
    const [a, b, c, d] = [x[0], y[0], x[1], y[1]];
    const detInv = a * d - b * c;

    const m = (d * p[0] - b * p[1]) / detInv;
    const n = (-c * p[0] + a * p[1]) / detInv;

    if (Math.floor(m) === m && Math.floor(n) === n) {
      const tokens = 3 * m + n;
      totalTokens += tokens;
    }
  }

  return totalTokens;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day13_input.txt";
  await day13b(fileName).then(console.log);
}

Deno.test("Test small case", async function day13bTest() {
  const result = await day13b("day13_input_small.txt");
  assertEquals(result, 875318608908);
});

Deno.test("Test big case", async function day13bTest() {
  const result = await day13b("day13_input.txt");
  assertEquals(result, 79352015273424);
});
