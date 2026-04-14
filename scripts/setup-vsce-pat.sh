#!/usr/bin/env bash
# scripts/setup-vsce-pat.sh
#
# Reads a VSCE_PAT from stdin (or prompts interactively) and sets it as a
# GitHub Actions secret on the amfaro/jarify-vscode repo.
#
# Prerequisites: gh CLI authenticated (run `gh auth login` if needed)
#
# Usage:
#   ./scripts/setup-vsce-pat.sh              # interactive prompt
#   echo "$MY_PAT" | ./scripts/setup-vsce-pat.sh  # pipe

set -euo pipefail

REPO="amfaro/jarify-vscode"
SECRET_NAME="VSCE_PAT"

# Check gh is available
if ! command -v gh &>/dev/null; then
  echo "ERROR: gh CLI not found. Install from https://cli.github.com" >&2
  exit 1
fi

# Check authenticated
if ! gh auth status --hostname github.com &>/dev/null; then
  echo "ERROR: not authenticated. Run: gh auth login" >&2
  exit 1
fi

# Read PAT — from pipe or interactive prompt
if [ -t 0 ]; then
  printf "Paste your Azure DevOps Personal Access Token (input hidden): "
  read -rs PAT
  echo
else
  read -r PAT
fi

if [ -z "$PAT" ]; then
  echo "ERROR: no token provided" >&2
  exit 1
fi

printf '%s' "$PAT" | gh secret set "$SECRET_NAME" --repo "$REPO"

echo "✓ $SECRET_NAME set on $REPO"
echo ""
echo "Verify: gh secret list --repo $REPO"
