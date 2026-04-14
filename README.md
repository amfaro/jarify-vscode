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

Publishing requires a **free Microsoft account** only — no Azure subscription, no Azure DevOps organization.

---

### 1 — Create a Marketplace PAT

1. Go to [https://marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage) and sign in with your Microsoft account.
2. Click your name/avatar in the top right → **Personal access tokens**.
3. Click **+ New Token**.
4. Fill in:
   - **Name:** `vsce-jarify`
   - **Organization:** **All accessible organizations**
   - **Expiration:** up to 1 year — note it for renewal
   - **Scopes:** Custom defined → scroll to **Marketplace** → check **Manage**
5. Click **Create** and **copy the token immediately** — it won't be shown again.

---

### 2 — Create the `amfaro` publisher (skip if it already exists)

1. Still on [https://marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage), click **Create publisher**.
2. Set **ID** to `amfaro` (must match `publisher` in `package.json`; cannot change later).
3. Click **Create**.

Verify locally (optional):

```bash
./node_modules/.bin/vsce login amfaro
# paste the PAT when prompted
```

---

### 3 — Set the GitHub secret (automated)

```bash
mise run setup-vsce-pat
# prompts for the PAT, sets VSCE_PAT on amfaro/jarify-vscode
```

Verify:

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
