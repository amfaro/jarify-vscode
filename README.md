# Jarify for VS Code

VS Code extension providing **formatting** and **diagnostics** via the [`jarify`](https://github.com/amfaro/jarify) CLI.

## Features

- **Format on save** — pipes the active buffer through `jarify fmt --stdin-filename <file> -`
- **Diagnostics** — runs `jarify lint --format json --stdin-filename <file> -` and surfaces errors and warnings inline

## Requirements

The `jarify` binary must be installed and available on your `$PATH`, or you can configure a full path via `jarify.executable`.

> **Note:** Diagnostics depend on `jarify lint --format json` (amfaro/jarify#55).

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `jarify.executable` | `"jarify"` | Path to the `jarify` binary |
| `jarify.configPath` | `""` | Optional path to a `jarify.toml` config file |

## Format on Save

Set jarify as your default formatter for a language in your VS Code settings:

```jsonc
{
  "[yaml]": {
    "editor.defaultFormatter": "amfaro.jarify-vscode",
    "editor.formatOnSave": true
  }
}
```

## Distribution

### Internal (`.vsix`)

Package and install locally without touching the Marketplace:

```bash
mise run package
code --install-extension jarify-vscode-*.vsix
```

### VS Code Marketplace

Publishing is automated via `.github/workflows/publish.yml`. Push a `v*` tag to trigger it:

```bash
git tag v0.2.0
git push origin v0.2.0
```

The workflow runs `vsce publish` using a `VSCE_PAT` repository secret. See [Setting up VSCE_PAT](#setting-up-vsce_pat) below for one-time setup.

## Setting up VSCE_PAT

Publishing to the VS Code Marketplace requires:
- a **Personal Access Token** (PAT) from Azure DevOps
- a registered **publisher** on the VS Code Marketplace
- the PAT stored as a **GitHub Actions secret** on this repo

Do this once before the first release. Steps 1–3 require a browser. Step 4 is automated.

---

### 1 — Get an Azure DevOps organization (skip if you already have one)

> If you can already reach `https://dev.azure.com/{yourorg}` — skip to step 2.

1. Go to [https://dev.azure.com](https://dev.azure.com) and sign in with a **Microsoft account** (personal or work).
2. After sign-in you land on the Azure DevOps home page. If you have no organization yet, you'll be prompted to create one automatically. If not, look for **Create new organization** in the left sidebar or at `https://dev.azure.com/?createOrg=true`.
3. Choose a name and a hosting region, then click **Continue**.

---

### 2 — Create a Personal Access Token

> Azure DevOps sign-in URL: `https://dev.azure.com/{yourorg}` — substitute your org slug.

1. Sign in to `https://dev.azure.com/{yourorg}`.
2. In the **top-right corner**, click the ⚙️ **user settings gear icon** (not your profile picture — the gear icon beside it).
3. In the dropdown, select **Personal access tokens**.
4. Click **+ New Token**.
5. Fill in the form:
   - **Name:** `vsce-jarify` (anything recognizable)
   - **Organization:** choose **All accessible organizations** — a single-org token is rejected by `vsce`
   - **Expiration:** pick a date; note it for renewal (Azure DevOps max is 1 year)
   - **Scopes:** select **Custom defined**, then click **Show all scopes** at the bottom of the list, scroll to **Marketplace**, and check **Manage**
6. Click **Create**.
7. **Copy the token immediately** — Azure DevOps will never show it again. Save it somewhere safe (1Password, etc.) for the next steps.

---

### 3 — Create the `amfaro` publisher (skip if it already exists)

> Must use the **same Microsoft account** as step 2.

1. Go to [https://marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage) and sign in.
2. Click **Create publisher** in the left pane.
3. Fill in:
   - **ID:** `amfaro` — must match `publisher` in `package.json`; cannot be changed later
   - **Display name:** anything (e.g. `Amfaro`)
4. Click **Create**.

Verify locally (optional but recommended):

```bash
./node_modules/.bin/vsce login amfaro
# paste the PAT from step 2 when prompted
```

---

### 4 — Set the GitHub secret (automated)

Once you have the PAT, run the setup script — it handles the GitHub secret for you:

```bash
./scripts/setup-vsce-pat.sh
# you'll be prompted to paste the token (input is hidden)
```

Or pipe it directly:

```bash
echo "<your-pat>" | ./scripts/setup-vsce-pat.sh
```

The script uses `gh secret set` to write `VSCE_PAT` to `amfaro/jarify-vscode` Actions secrets. You can verify it was saved:

```bash
gh secret list --repo amfaro/jarify-vscode
```

---

After completing these steps, every push of a `v*` tag will trigger the publish workflow automatically.

## Development

```bash
mise run install          # install dependencies
mise run compile          # compile TypeScript
mise run watch            # watch mode
mise run package          # build .vsix
mise run setup-vsce-pat   # set VSCE_PAT GitHub secret (one-time)
```
