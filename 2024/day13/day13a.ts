import * as path from "@std/path";
import { assertEquals } from "@std/assert";

export const day13a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);

  let totalTokens = 0;
  for (const block of text.trim().split("\n\n")) {
    const [x, y, p] = block.split("\n").map((line) =>
      line
        .trim()
        .split(":")[1]
        .split(",")
        .map((s) => Number(s.trim().slice(2)))
    );
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
  await day13a(fileName).then(console.log);
}

Deno.test("Test small case", async function day13aTest() {
  const result = await day13a("day13_input_small.txt");
  assertEquals(result, 480);
});

Deno.test("Test big case", async function day13aTest() {
  const result = await day13a("day13_input.txt");
  assertEquals(result, 36954);
});
