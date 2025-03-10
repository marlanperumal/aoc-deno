import * as path from "@std/path";
import { assertEquals } from "@std/assert";

export const day23a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);
  const connections = new Map<string, Set<string>>();
  text
    .trim()
    .split("\n")
    .forEach((line) => {
      const [a, b] = line.trim().split("-");
      if (!connections.has(a)) {
        connections.set(a, new Set<string>());
      }
      if (!connections.has(b)) {
        connections.set(b, new Set<string>());
      }
      connections.get(a)!.add(b);
      connections.get(b)!.add(a);
    });

  const games = new Set<string>();
  connections.keys().forEach((node1) => {
    connections.get(node1)!.forEach((node2) => {
      connections.get(node2)!.forEach((node3) => {
        if (node1 === node3) {
          return;
        }
        if (
          connections.get(node3)!.has(node1) &&
          (node1.slice(0, 1) === "t" ||
            node2.slice(0, 1) === "t" ||
            node3.slice(0, 1) === "t")
        ) {
          games.add([node1, node2, node3].toSorted().join(""));
        }
      });
    });
  });

  const result = games.size;
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day23_input.txt";
  await day23a(fileName).then(console.log);
}

Deno.test("Test small case", async function day23aTest() {
  const result = await day23a("day23_input_small.txt");
  assertEquals(result, 7);
});

Deno.test("Test big case", async function day23aTest() {
  const result = await day23a("day23_input.txt");
  assertEquals(result, 1344);
});
