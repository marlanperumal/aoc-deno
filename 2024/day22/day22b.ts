import * as path from "jsr:@std/path";
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

export const day22b = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);

  const allBids = new Map<string, bigint>();
  text.split("\n").forEach((line: string) => {
    let i = BigInt(line.trim());
    const bids = new Map<string, bigint>();
    let sequence: bigint[] = [];
    Array(N)
      .keys()
      .forEach((_) => {
        const j = secret(i);
        const diff = (j % BigInt(10)) - (i % BigInt(10));
        i = j;
        sequence.push(diff);
        sequence = sequence.slice(-4);
        const sequenceStr = JSON.stringify(Number(sequence));
        if (sequence.length === 4 && !bids.has(sequenceStr)) {
          bids.set(sequenceStr, j % BigInt(10));
        }
        i = secret(i);
      });
    const allBidsSet = new Set(allBids.keys());
    const bidsSet = new Set(bids.keys());
    for (const k of allBidsSet.union(bidsSet)) {
      allBids.set(
        k,
        (allBids.get(k) || BigInt(0)) + (bids.get(k) || BigInt(0))
      );
    }
  });
  return allBids.values().reduce((a, b) => (a > b ? a : b));
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day22_input.txt";
  await day22b(fileName).then(console.log);
}

Deno.test("Test small case", async function day22bTest() {
  const result = await day22b("day22_input_small_2.txt");
  assertEquals(result, BigInt(23));
});

Deno.test("Test big case", async function day22bTest() {
  const result = await day22b("day22_input.txt");
  assertEquals(result, BigInt(2399));
});
