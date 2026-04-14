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

### Build the `.vsix`

```bash
mise run package
```

This compiles TypeScript and produces `jarify-vscode-<version>.vsix` in the repo root.

### Install locally

```bash
code --install-extension jarify-vscode-*.vsix
```

Then reload VS Code to activate the extension:

- `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Linux/Windows) → **Developer: Reload Window**

### Verify it's active

- Open the **Extensions** panel (`Cmd+Shift+X`) and search for `Jarify` — it should appear as installed.
- Open a file and run **Format Document** (`Shift+Alt+F`) — if `jarify` is on your `$PATH`, it will format via `jarify fmt`.
- Check the **Problems** panel for diagnostics on save (requires amfaro/jarify#55).

### Update to a newer build

Rebuild and reinstall — VS Code will replace the previous version:

```bash
mise run package
code --install-extension jarify-vscode-*.vsix
```

Then reload the window again.

## Development

```bash
mise run install   # install dependencies
mise run compile   # compile TypeScript
mise run watch     # watch mode
mise run package   # build .vsix
```
