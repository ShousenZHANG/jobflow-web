import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const pkgPath = path.join(cwd, "package.json");
const policyPath = path.join(cwd, "tools", "ci", "dependency-allowlist.json");

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const policy = JSON.parse(fs.readFileSync(policyPath, "utf8"));

const deps = Object.keys(pkg.dependencies ?? {});
const devDeps = Object.keys(pkg.devDependencies ?? {});
const banned = new Set(policy.banned ?? []);
const allowDeps = new Set(policy.allowlist?.dependencies ?? []);
const allowDevDeps = new Set(policy.allowlist?.devDependencies ?? []);

const violations = [];

for (const name of [...deps, ...devDeps]) {
  if (banned.has(name)) {
    violations.push(`banned dependency detected: ${name}`);
  }
}

for (const name of deps) {
  if (!allowDeps.has(name)) {
    violations.push(`dependency not in allowlist: ${name}`);
  }
}

for (const name of devDeps) {
  if (!allowDevDeps.has(name)) {
    violations.push(`devDependency not in allowlist: ${name}`);
  }
}

if (violations.length) {
  console.error("Dependency policy check failed:");
  for (const msg of violations) {
    console.error(`- ${msg}`);
  }
  process.exit(1);
}

console.log("Dependency policy check passed.");
