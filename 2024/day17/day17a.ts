import * as path from "@std/path";
import { assertEquals } from "@std/assert";

export const day17a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);
  const [block1, block2] = text.split("\n\n");
  let [A, B, C] = block1
    .split("\n")
    .map((line) => Number(line.split(":")[1].trim()));
  const program = block2.split(":")[1].trim().split(",").map(Number);

  let output: number[] = [];
  let i = 0;
  while (i < program.length) {
    const opcode = program[i];
    const operand = program[i + 1];

    let comboOperand = operand;
    switch (operand) {
      case 4:
        comboOperand = A;
        break;
      case 5:
        comboOperand = B;
        break;
      case 6:
        comboOperand = C;
        break;
    }

    switch (opcode) {
      case 0:
        A >>= comboOperand;
        break;
      case 1:
        B ^= operand;
        break;
      case 2:
        B = comboOperand % 8;
        break;
      case 3:
        if (A !== 0) {
          i = operand - 2;
        }
        break;
      case 4:
        B ^= C;
        break;
      case 5:
        output = output.concat(comboOperand % 8);
        break;
      case 6:
        B = A >> comboOperand;
        break;
      case 7:
        C = A >> comboOperand;
        break;
    }

    i += 2;
  }
  const result = output.join(",");
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day17_input.txt";
  await day17a(fileName).then(console.log);
}

Deno.test("Test small case 1", async function day17aTest() {
  const result = await day17a("day17_input_small_1.txt");
  assertEquals(result, "4,6,3,5,6,3,5,2,1,0");
});

Deno.test("Test big case", async function day17aTest() {
  const result = await day17a("day17_input.txt");
  assertEquals(result, "7,5,4,3,4,5,3,4,6");
});
