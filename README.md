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

```bash
mise run install-extension
```

Builds the `.vsix` and installs it into VS Code. Then reload: `Cmd+Shift+P` → **Developer: Reload Window**.

To update to a newer build, run the same command and reload again.

## Development

```bash
mise run install   # install dependencies
mise run compile   # compile TypeScript
mise run watch     # watch mode
mise run package   # build .vsix
```
