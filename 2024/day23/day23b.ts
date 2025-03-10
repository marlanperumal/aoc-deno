import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day23b = async (fileName: string) => {
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

  const unvisited = new Map<string, Set<Set<string>>>();
  const visited = new Map<string, Set<Set<string>>>();

  const networks = new Set<Set<string>>();

  const visit = (comp: string) => {
    const compNetworks = unvisited.get(comp)!;
    compNetworks.add(new Set([comp]));
    unvisited.delete(comp);
    visited.set(comp, compNetworks);
    connections.get(comp)!.forEach((neighbour) => {
      if (visited.has(neighbour)) {
        return;
      }
      compNetworks.forEach((network) => {
        if (
          [...network].every((node) => connections.get(node)!.has(neighbour))
        ) {
          const newNetwork = network.union(new Set([neighbour]));
          unvisited.get(neighbour)!.add(newNetwork);
          networks.add(newNetwork);
        }
      });
    });
    connections.get(comp)!.forEach((neighbour) => {
      if (!visited.has(neighbour)) {
        visit(neighbour);
      }
    });
  };

  while (unvisited.size > 0) {
    const comp = unvisited.keys().next().value!;
    visit(comp);
  }

  let largestNetwork = Array.from(networks)[0];
  Array.from(networks).forEach((network) => {
    if (network.size > largestNetwork.size) {
      largestNetwork = network;
    }
  });
  const result = Array.from(largestNetwork).toSorted().join(",");
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day23_input.txt";
  await day23b(fileName).then(console.log);
}

Deno.test("Test small case", async function day23bTest() {
  const result = await day23b("day23_input_small.txt");
  assertEquals(result, "co,de,ka,ta");
});

Deno.test("Test big case", async function day23bTest() {
  const result = await day23b("day23_input.txt");
  assertEquals(result, "ab,al,cq,cr,da,db,dr,fw,ly,mn,od,py,uh");
});
