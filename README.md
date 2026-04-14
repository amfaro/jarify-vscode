# Jarify for VS Code

VS Code extension providing **formatting** and **diagnostics** via the [`jarify`](https://github.com/amfaro/jarify) CLI.

## Features

- **Format on save** — pipes the active buffer through `jarify fmt --stdin-filename <file> -`
- **Diagnostics** — runs `jarify lint --format json --stdin-filename <file> -` and surfaces errors and warnings inline

## Requirements

If `jarify` is not found on activation, the extension will prompt you to install it via **mise** or **cargo** — or you can configure a custom path via `jarify.executable`.

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `jarify.executable` | `"jarify"` | Path to the `jarify` binary |
| `jarify.configPath` | `""` | Optional path to a `jarify.toml` config file |

## Format on Save

Set jarify as your default formatter for a language in your VS Code settings:

```jsonc
{
  "[sql]": {
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

> **Prerequisite:** `code` must be in your `$PATH`. If not: `Cmd+Shift+P` → **Shell Command: Install 'code' command in PATH**.

## Development

```bash
mise run install   # install dependencies
mise run compile   # compile TypeScript
mise run watch     # watch mode
mise run package   # build .vsix
```
