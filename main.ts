import { copy, walk } from "jsr:@std/fs";
import { parseArgs } from "jsr:@std/cli/parse-args";

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const flags = parseArgs(Deno.args, {
    string: ["day", "year"],
    alias: { day: "d", year: "y" },
    default: { year: "2024" },
  });
  const year = flags.year;
  let day = flags.day;
  if (!day) {
    day = prompt("Please provide a day number:")?.trim();
    if (!day) {
      console.error("No day number provided. Exiting.");
      Deno.exit(1);
    }
  }
  const srcDir = `${year}/day0`;
  const destDir = `${year}/day${day}`;

  await copy(srcDir, destDir);
  for await (const entry of walk(destDir, { includeFiles: true })) {
    if (entry.isFile) {
      const content = await Deno.readTextFile(entry.path);
      const updatedContent = content.replace(/day0/g, `day${day}`);
      await Deno.writeTextFile(entry.path, updatedContent);
      const newPath = entry.path.replace(/day0/g, `day${day}`);
      await Deno.rename(entry.path, newPath);
    }
  }
}
