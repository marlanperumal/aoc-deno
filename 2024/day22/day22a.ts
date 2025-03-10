import * as path from "@std/path";
import { assertEquals } from "@std/assert";

const secret = (x: bigint) => {
  x = (x << BigInt(6)) ^ x;
  x %= BigInt(16777216);
  x = (x >> BigInt(5)) ^ x;
  x %= BigInt(16777216);
  x = (x << BigInt(11)) ^ x;
  x %= BigInt(16777216);
  return x;
};

const N = 2000;

export const day22a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);

  let result = BigInt(0);
  text.split("\n").forEach((line: string) => {
    let i = BigInt(line.trim());
    Array(N)
      .keys()
      .forEach((_) => {
        i = secret(i);
      });
    result += i;
  });
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day22_input.txt";
  await day22a(fileName).then(console.log);
}

Deno.test("Test small case", async function day22aTest() {
  const result = await day22a("day22_input_small_1.txt");
  assertEquals(result, BigInt(37327623));
});

Deno.test("Test big case", async function day22aTest() {
  const result = await day22a("day22_input.txt");
  assertEquals(result, BigInt(19877757850));
});
