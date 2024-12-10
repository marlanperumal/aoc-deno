import * as math from "mathjs";
import * as path from "@std/path";
import { assertEquals } from "@std/assert";

export const day10a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);
  const grid = new Map<string, number>();
  text.split("\n").forEach((row, i) =>
    row.split("").forEach((col, j) => {
      grid.set(math.complex(Number(i), Number(j)).toString(), Number(col));
    })
  );

  const hike = (
    z: string,
    val: number = -1,
    hills: Set<string>
  ): Set<string> => {
    if (!grid.has(z)) {
      return hills;
    }
    if (grid.get(z)! - val !== 1) {
      return hills;
    }
    if (grid.get(z) === 9) {
      hills.add(z);
      return hills;
    }
    for (const x of [1, -1, math.complex(0, 1), math.complex(0, -1)]) {
      hike(math.add(math.complex(z), x).toString(), grid.get(z), hills);
    }
    return hills;
  };

  let result = 0;
  grid.forEach((_, z) => {
    const hills = new Set<string>();
    result += hike(z, -1, hills).size;
  });

  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day10_input.txt";
  await day10a(fileName).then(console.log);
}

Deno.test("Test small case", async function day10aTest() {
  const result = await day10a("day10_input_small.txt");
  assertEquals(result, 36);
});

Deno.test("Test big case", async function day10aTest() {
  const result = await day10a("day10_input.txt");
  assertEquals(result, 512);
});
