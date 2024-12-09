import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day9b = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = (await Deno.readTextFile(filePath)).trim();

  const diskMap: [number | null, number][] = text
    .split("")
    .map((x, i) => [i % 2 === 0 ? i / 2 : null, Number(x)]);

  let i = 0;
  let j = diskMap.length - 1;
  let gap = diskMap[i];
  let block = diskMap[j];
  while (j > 0) {
    if (j <= i) {
      i = 0;
      j -= 1;
    }
    block = diskMap[j];
    gap = diskMap[i];
    if (block[0] !== null) {
      if (gap[0] === null) {
        if (gap[1] >= block[1]) {
          gap[1] -= block[1];
          diskMap.splice(i, 0, [block[0], block[1]]);
          block[0] = null;
          if (gap[1] === 0) {
            diskMap.splice(i + 1, 1);
            j -= 1;
          }
          i = 0;
        } else {
          i += 1;
        }
      } else {
        i += 1;
      }
    } else {
      j -= 1;
    }
  }

  const result = (diskMap as [number, number][]).reduce(
    (total, block) =>
      block[0] === null
        ? [total[0], total[1] + block[1]]
        : [
            total[0] +
              (block[0] *
                ((block[1] + total[1]) * (block[1] + total[1] - 1) -
                  total[1] * (total[1] - 1))) /
                2,
            total[1] + block[1],
          ],
    [0, 0]
  );

  return result[0];
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day9_input.txt";
  await day9b(fileName).then(console.log);
}

Deno.test("Test small case", async function day9bTest() {
  const result = await day9b("day9_input_small.txt");
  assertEquals(result, 2858);
});

Deno.test("Test big case", async function day9bTest() {
  const result = await day9b("day9_input.txt");
  assertEquals(result, 6326952672104);
});
