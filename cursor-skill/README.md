# Jobflow Cursor Skill (installer entry)

This repo ships a Cursor Skill at `skills/jobflow/`. This `cursor-skill/` folder is kept as a **convenience entry point** for users who look for a Cursor skill folder name directly.

Repo: `https://github.com/ShousenZHANG/jobflow-web.git`

## Install

### Option A — manual copy (Cursor)

Copy `skills/jobflow` into your Cursor skills directory:

```bash
mkdir -p ~/.cursor/skills
cp -r skills/jobflow ~/.cursor/skills/jobflow
```

Windows (PowerShell):

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.cursor\skills"
Copy-Item -Recurse -Force "skills\jobflow" "$env:USERPROFILE\.cursor\skills\jobflow"
```

### Option B — skills CLI

```bash
npx skills add https://github.com/ShousenZHANG/jobflow-web.git --skill jobflow -y -g
```

