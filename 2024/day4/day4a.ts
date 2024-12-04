import * as path from "jsr:@std/path";
import { assertEquals } from "@std/assert";

export const day4a = async (fileName: string) => {
  const folder = path.dirname(path.fromFileUrl(import.meta.url));
  const filePath = path.join(folder, fileName);
  const text = await Deno.readTextFile(filePath);
  const lines = text.split("\n");

  let result = 0;
  const mask = [...Array(4).keys()];
  lines.forEach((row, i) => {
    row.split("").forEach((col, j) => {
      if (col != "X") {
        return;
      }
      if (j < row.length - 3) {
        if (mask.map((k) => lines[i][j + k]).join("") == "XMAS") {
          result += 1;
        }
        if (i < lines.length - 3) {
          if (mask.map((k) => lines[i + k][j + k]).join("") == "XMAS") {
            result += 1;
          }
        }
        if (i > 2) {
          if (mask.map((k) => lines[i - k][j + k]).join("") == "XMAS") {
            result += 1;
          }
        }
      }
      if (j > 2) {
        if (mask.map((k) => lines[i][j - k]).join("") == "XMAS") {
          result += 1;
        }
        if (i < lines.length - 3) {
          if (mask.map((k) => lines[i + k][j - k]).join("") == "XMAS") {
            result += 1;
          }
        }
        if (i > 2) {
          if (mask.map((k) => lines[i - k][j - k]).join("") == "XMAS") {
            result += 1;
          }
        }
      }
      if (i < lines.length - 3) {
        if (mask.map((k) => lines[i + k][j]).join("") == "XMAS") {
          result += 1;
        }
      }
      if (i > 2) {
        if (mask.map((k) => lines[i - k][j]).join("") == "XMAS") {
          result += 1;
        }
      }
    });
  });
  return result;
};

if (import.meta.main) {
  const fileName = Deno.args[0] || "day4_input.txt";
  await day4a(fileName).then(console.log);
}

Deno.test("Test small case", async function day4aTest() {
  const result = await day4a("day4_input_small.txt");
  assertEquals(result, 18);
});

Deno.test("Test big case", async function day4aTest() {
  const result = await day4a("day4_input.txt");
  assertEquals(result, 2613);
});
