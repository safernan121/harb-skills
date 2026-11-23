#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";

// Checks agent guidance that prose rules alone keep drifting: skill and
// subagent frontmatter, Codex invocation policy, Claude/Codex skill folders
// pointing at the same files, CLAUDE.md importing AGENTS.md, Related features
// listed in both directions, and local Markdown links. Run from the repo root.
//   --tracked          check the staged (index) version of tracked files only,
//                      for commits and the push/merge gate
//   --vendored a,b     skills copied from elsewhere: check frontmatter only
const args = process.argv.slice(2);
const tracked = args.includes("--tracked");
const vendoredArg = args[args.indexOf("--vendored") + 1];
const vendored = args.includes("--vendored") && vendoredArg ? vendoredArg.split(",") : [];
const root = process.cwd();
const problems = [];

// Exact-case repo paths, so a link that only resolves on a case-insensitive
// disk or to an untracked file (in --tracked mode) still fails.
const repoFiles = new Set(
  execFileSync("git", ["ls-files", "-z", "--cached", ...(tracked ? [] : ["--others", "--exclude-standard"])], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  })
    .split("\0")
    .filter((file) => file && (tracked || existsSync(file))),
);
const repoDirs = new Set([...repoFiles].flatMap((file) => file.split("/").slice(0, -1).map((_, i, parts) => parts.slice(0, i + 1).join("/"))));
const inRepo = (file) => repoFiles.has(file) || repoDirs.has(file);
const has = (file) => (tracked ? repoFiles.has(file) : existsSync(file));
const read = (file) =>
  tracked ? execFileSync("git", ["show", `:${file}`], { encoding: "utf8" }) : readFileSync(path.join(root, file), "utf8");
const isDir = (file) => statSync(file, { throwIfNoEntry: false })?.isDirectory() ?? false;
// Repo-relative real path, or null when a link leaves the repository.
const canonical = (file) => {
  const relative = path.relative(root, realpathSync(file)).split(path.sep).join("/");
  return relative.startsWith("..") ? null : relative;
};

function frontmatter(file) {
  const text = read(file);
  const end = text.indexOf("\n---\n", 4);
  if (!text.startsWith("---\n") || end === -1) {
    problems.push(`${file}: needs frontmatter between --- lines`);
    return null;
  }
  const fields = {};
  const lines = text.slice(4, end).split("\n");
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^([\w-]+):\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    // Block scalars (`>-`, `|`) carry their text on the indented lines below.
    if (/^[>|][+-]?$/.test(value)) {
      const body = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) body.push(lines[++i].trim());
      value = body.join(" ");
    }
    fields[match[1]] = value.replace(/^(["'])(.*)\1$/, "$2");
  }
  return fields;
}

function withoutCode(text) {
  let fence = null;
  return text
    .split("\n")
    .filter((line) => {
      const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
      if (marker && !fence) fence = marker;
      else if (marker && marker[0] === fence[0] && marker.length >= fence.length) fence = null;
      else return !fence;
      return false;
    })
    .join("\n")
    .replace(/`[^`\n]*`/g, "");
}

// Skill folders: `skills/` in a skill collection, `.agents/skills` for Codex,
// `.claude/skills` for Claude Code. A skill reached through several roots is
// checked once, at its real path.
const roots = ["skills", ".agents/skills", ".claude/skills"].filter(isDir);
const skills = new Map(); // name -> repo-relative real folder
const seen = new Map(); // root -> Map(name -> real folder or null)
for (const dir of roots) {
  const entries = new Map();
  for (const name of readdirSync(dir)) {
    const folder = path.join(dir, name);
    if (!isDir(folder)) continue;
    const real = canonical(folder);
    entries.set(name, real);
    if (!real) continue; // linked from outside the repository, e.g. a global install
    if (tracked && !repoDirs.has(real)) continue;
    if (!skills.has(name)) skills.set(name, real);
    else if (skills.get(name) !== real) {
      problems.push(`${dir}/${name}: separate copy of ${skills.get(name)}; link one to the other so Claude Code and Codex read the same files`);
    }
  }
  seen.set(dir, entries);
}
const codex = seen.get(".agents/skills");
const claude = seen.get(".claude/skills");
if (codex && claude) {
  for (const name of codex.keys()) if (!claude.has(name)) problems.push(`.claude/skills: missing ${name} (present for Codex)`);
  for (const name of claude.keys()) if (!codex.has(name)) problems.push(`.agents/skills: missing ${name} (present for Claude Code)`);
}

if (has("AGENTS.md") && has("CLAUDE.md") && canonical("CLAUDE.md") !== canonical("AGENTS.md") && !read("CLAUDE.md").includes("@AGENTS.md")) {
  problems.push("CLAUDE.md: must import @AGENTS.md so Claude Code and Codex share instructions");
}

const related = new Map();
for (const [name, folder] of skills) {
  const file = `${folder}/SKILL.md`;
  if (!has(file)) {
    problems.push(`${folder}: has no SKILL.md`);
    continue;
  }
  const fields = frontmatter(file);
  if (!fields) continue;
  if (fields.name !== name) problems.push(`${file}: name must be "${name}"`);
  if (!fields.description) problems.push(`${file}: needs a description`);
  const manual = fields["disable-model-invocation"];
  if (manual !== undefined && !["true", "false"].includes(manual)) {
    problems.push(`${file}: disable-model-invocation must be true or false`);
  }
  // `allow_implicit_invocation: false` is Codex's counterpart of
  // `disable-model-invocation: true`.
  const policyFile = `${folder}/agents/openai.yaml`;
  const codexManual =
    has(policyFile) && /^policy:[ \t]*\n(?:[ \t]+.*\n)*?[ \t]+allow_implicit_invocation:[ \t]*false[ \t]*$/m.test(read(policyFile));
  if (manual === "true" && !codexManual) {
    problems.push(`${file}: user-invoked, so ${policyFile} needs policy: allow_implicit_invocation: false`);
  } else if (manual !== "true" && codexManual) {
    problems.push(`${policyFile}: blocks Codex invocation but ${file} is model-invoked`);
  }

  const section = read(file).match(/^## Related features\b.*\n([\s\S]*?)(?=^## |(?![\s\S]))/m);
  if (section) related.set(name, [...section[1].matchAll(/^- `([\w-]+)`/gm)].map((match) => match[1]));
}

for (const [name, links] of related) {
  for (const other of links) {
    if (!skills.has(other)) {
      problems.push(`${skills.get(name)}/SKILL.md: Related features names unknown skill \`${other}\``);
    } else if (related.has(other) && !related.get(other).includes(name)) {
      problems.push(`${skills.get(other)}/SKILL.md: Related features must list \`${name}\` (listed by ${name})`);
    }
  }
}

const agentsDir = ".claude/agents";
if (isDir(agentsDir)) {
  for (const entry of readdirSync(agentsDir).filter((file) => file.endsWith(".md"))) {
    const file = `${agentsDir}/${entry}`;
    if (tracked && !repoFiles.has(file)) continue;
    const fields = frontmatter(file);
    if (!fields) continue;
    if (fields.name !== path.basename(entry, ".md")) problems.push(`${file}: name must match the file name`);
    if (!fields.description) problems.push(`${file}: needs a description`);
  }
}

const skillFolders = [...skills.values()];
const guidance = [...repoFiles].filter(
  (file) =>
    file.endsWith(".md") &&
    (!file.includes("/") || file.startsWith("docs/") || file.startsWith(".claude/") || skillFolders.some((folder) => file.startsWith(`${folder}/`))) &&
    !vendored.some((name) => skills.has(name) && file.startsWith(`${skills.get(name)}/`)),
);
for (const file of guidance) {
  for (const match of withoutCode(read(file)).matchAll(/\]\(([^)\s]+)\)/g)) {
    const target = match[1].replace(/^<|>$/g, "").split("#")[0];
    if (!target || /^[a-z][a-z\d+.-]*:/i.test(target)) continue;
    let decoded;
    try {
      decoded = decodeURI(target);
    } catch {
      problems.push(`${file}: malformed link ${match[1]}`);
      continue;
    }
    const relative = path.relative(root, path.resolve(path.dirname(path.join(root, file)), decoded)).split(path.sep).join("/");
    if (relative.startsWith("..") || !inRepo(relative)) problems.push(`${file}: broken link ${match[1]}`);
  }
}

if (problems.length) {
  console.error(`harness check found ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}
console.log(`harness check OK (${skills.size} skills, ${guidance.length} guidance files${tracked ? ", tracked only" : ""})`);
