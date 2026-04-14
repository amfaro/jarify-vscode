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

Publishing to the VS Code Marketplace requires a Personal Access Token (PAT) from Azure DevOps and a registered publisher identity. Do this once before the first release.

### 1 — Create an Azure DevOps organization (skip if you have one)

1. Go to [https://dev.azure.com](https://dev.azure.com) and sign in with a Microsoft account.
2. Click **New organization** and follow the prompts.

### 2 — Create a Personal Access Token

1. In the Azure DevOps portal, click your profile picture (top right) → **Personal access tokens**.
2. Click **+ New Token**.
3. Fill in the form:
   - **Name:** `vsce-jarify` (or any name you'll recognize)
   - **Organization:** select **All accessible organizations** — this is required; a single-org token will be rejected by `vsce`
   - **Expiration:** set an appropriate date (max 1 year; calendar this for renewal)
   - **Scopes:** choose **Custom defined**, then scroll to **Marketplace** and check **Manage**
4. Click **Create** and **copy the token immediately** — Azure DevOps will not show it again.

### 3 — Create the `amfaro` publisher (skip if it already exists)

1. Go to [https://marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage) — sign in with the **same Microsoft account** used for the PAT.
2. Click **Create publisher**.
3. Set **ID** to `amfaro` (must match `publisher` in `package.json`) and fill in a display name.
4. Click **Create**.

Verify the publisher and token work locally:

```bash
npx @vscode/vsce login amfaro
# paste the PAT when prompted
```

### 4 — Add `VSCE_PAT` to GitHub

1. In the `amfaro/jarify-vscode` repo, go to **Settings → Secrets and variables → Actions**.
2. Click **New repository secret**.
3. Name: `VSCE_PAT`, Value: the token from step 2.
4. Click **Add secret**.

The publish workflow will now succeed on every `v*` tag push.

## Development

```bash
mise run install   # install dependencies
mise run compile   # compile TypeScript
mise run watch     # watch mode
mise run package   # build .vsix
```
