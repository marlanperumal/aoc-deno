import * as math from "mathjs";
import * as path from "@std/path";
import { assertEquals } from "@std/assert";

const j = math.complex(0, 1);
const nj = math.multiply(-1, j);

interface Plot {
  pos: math.MathType;
  key: string;
  val: string;
  fences: Set<math.MathType>;
  region: Region;
}

interface Region {
  plots: Array<Plot>;
  val: string;
  area: number;
  perimeter: number;
  sides: number;
}

export const day12a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);

  const grid = new Map<string, Plot>();
  const regions = new Set<Region>();

  const newPlot = (r: number, c: number, val: string): Plot => {
    const pos = math.add(c, math.multiply(r, j));
    const plot = {
      pos,
      key: pos.toString(),
      val: val,
      fences: new Set([1, -1, j, nj]),
      region: {
        plots: new Array<Plot>(),
        val: val,
        area: 1,
        perimeter: 4,
        sides: 4,
      },
    };
    plot.region.plots.push(plot);
    grid.set(plot.key, plot);
    regions.add(plot.region);
    return plot;
  };

  const mergeRegions = (region1: Region, region2: Region) => {
    if (region1 !== region2) {
      for (const plot of region2.plots) {
        plot.region = region1;
      }
      region1.plots = [...region1.plots, ...region2.plots];
      region1.area += region2.area;
      region1.perimeter += region2.perimeter;
      region1.sides += region2.sides;
      region2.area = 0;
      region2.perimeter = 0;
      region2.plots = [];
      regions.delete(region2);
    }
    region1.perimeter -= 2;
    region1.sides -= 2;
    return region1;
  };

  text
    .trim()
    .split("\n")
    .forEach((row, r) => {
      row.split("").forEach((col, c) => {
        const pos = math.add(c, math.multiply(r, j));
        const plot = newPlot(r, c, col);
        [-1, nj].forEach((k) => {
          const nPos = math.add(pos, k);
          const nPosKey = nPos.toString();
          if (grid.has(nPosKey)) {
            const neighbour = grid.get(nPosKey)!;
            if (neighbour.val !== plot.val) {
              return;
            }
            plot.region = mergeRegions(plot.region, neighbour.region);
            plot.fences.delete(k);
            neighbour.fences.delete(math.multiply(-1, k));
            [j, nj].forEach((z) => {
              const kz = math.multiply(k, z);
              if (plot.fences.has(kz) === neighbour.fences.has(kz)) {
                plot.region.sides += 1;
              } else {
                plot.region.sides -= 1;
              }
            });
          }
        });
      });
    });

  const result = regions
    .values()
    .map((region) => region.area * region.perimeter)
    .reduce((a, b) => a + b);
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day12_input.txt";
  await day12a(fileName).then(console.log);
}

Deno.test("Test small case", async function day12aTest() {
  const result = await day12a("day12_input_small.txt");
  assertEquals(result, 140);
});

Deno.test("Test big case", async function day12aTest() {
  const result = await day12a("day12_input.txt");
  assertEquals(result, 1533024);
});
