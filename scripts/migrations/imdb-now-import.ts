import { defaultImportOptions, runImport } from "../../src/lib/nowImport/index";

const parseArgs = (argv: string[]) => {
  const args = new Map<string, string | boolean>();

  for (let i = 0; i < argv.length; i += 1) {
    const part = argv[i];

    if (part === "--dry-run") {
      args.set("dryRun", true);
      continue;
    }

    if (part.startsWith("--input=")) {
      args.set("inputPath", part.replace("--input=", ""));
      continue;
    }

    if (part.startsWith("--limit=")) {
      args.set("limit", part.replace("--limit=", ""));
    }
  }

  return args;
};

const main = () => {
  const args = parseArgs(process.argv.slice(2));

  const inputPath = (args.get("inputPath") as string) || defaultImportOptions.inputPath;
  const limit = Number(args.get("limit") || defaultImportOptions.limit);
  const dryRun = Boolean(args.get("dryRun") ?? defaultImportOptions.dryRun);

  const summary = runImport({
    inputPath,
    limit,
    dryRun,
  });

  console.log("IMDb one-time import finished");
  console.log(JSON.stringify({ inputPath, limit, dryRun, summary }, null, 2));
};

main();
