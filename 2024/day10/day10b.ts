import * as math from "mathjs";
import * as path from "@std/path";
import { assertEquals } from "@std/assert";

export const day10b = async (fileName: string) => {
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
    hills: Array<string>
  ): Array<string> => {
    if (!grid.has(z)) {
      return hills;
    }
    if (grid.get(z)! - val !== 1) {
      return hills;
    }
    if (grid.get(z) === 9) {
      hills.push(z);
      return hills;
    }
    for (const x of [1, -1, math.complex(0, 1), math.complex(0, -1)]) {
      hike(math.add(math.complex(z), x).toString(), grid.get(z), hills);
    }
    return hills;
  };

  let result = 0;
  grid.forEach((_, z) => {
    const hills = new Array<string>();
    result += hike(z, -1, hills).length;
  });

  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day10_input.txt";
  await day10b(fileName).then(console.log);
}

Deno.test("Test small case", async function day10bTest() {
  const result = await day10b("day10_input_small.txt");
  assertEquals(result, 81);
});

Deno.test("Test big case", async function day10bTest() {
  const result = await day10b("day10_input.txt");
  assertEquals(result, 1045);
});
