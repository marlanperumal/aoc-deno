# Advent of Code (AoC) solutions in Deno

Solutions to [Advent of Code](https://adventofcode.com/)

This repo is organised by year and day inot folders of the form `2024/day1`. Each folder container separate Typescript files for the 2 parts of the puzzle e.g. `day1a.ts` and `day1b.ts`. Additionally, the test files are stored as `day1_input.txt` and `day1_input_small.txt`. However, in keeping with the instructions in the AoC FAQs, the actual input files have not been committed to the repo.

Individual files can be run at the command line from inside their folder locations with

```bash
cd 2024/day1
deno run --allow-read day1a.ts
```

The project is designed to integrate with VSCode to run, debug and test. A template folder `day0` contains template files that can be copied to a new day `X` with the command

```bash
    deno task newday --year=2024 --day=1
```

or else by running the `newday` task in VSCode.

This will then allow running of the solutions in either the debugger or test runner.