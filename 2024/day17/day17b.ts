import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day17b = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);

  const [_, block2] = text.split("\n\n");
  const program = block2.split(":")[1].trim().split(",").map(Number);

  let A = [BigInt(0)];

  program.toReversed().forEach((output) => {
    const A1: bigint[] = [];
    A.forEach((aa) => {
      Array(8)
        .keys()
        .forEach((i) => {
          const a = BigInt(aa + BigInt(i));
          let b = BigInt(a % BigInt(8));
          b ^= BigInt(1);
          const c = BigInt(a >> b);
          b ^= BigInt(5);
          b ^= c;
          b %= BigInt(8);
          if (b === BigInt(output)) {
            A1.push(a << BigInt(3));
          }
        });
    });
    A = A1;
  });

  const result = A.reduce((a, b) => (a < b ? a : b)) >> BigInt(3);
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day17_input.txt";
  await day17b(fileName).then(console.log);
}

Deno.test("Test big case", async function day17bTest() {
  const result = await day17b("day17_input.txt");
  assertEquals(result, BigInt(164278899142333));
});
