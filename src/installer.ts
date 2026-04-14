import * as cp from 'child_process';
import * as vscode from 'vscode';
import { getConfig } from './config';

export async function ensureJarify(): Promise<boolean> {
  const { executable } = getConfig();

  if (await isAvailable(executable)) {
    return true;
  }

  const pick = await vscode.window.showErrorMessage(
    `jarify not found at "${executable}". Install it to enable formatting and diagnostics.`,
    'Install via uv',
    'Install via pip',
    'Configure path',
  );

  if (pick === 'Install via uv') {
    openTerminal('uv tool install jarify');
  } else if (pick === 'Install via pip') {
    openTerminal('pip install jarify');
  } else if (pick === 'Configure path') {
    await vscode.commands.executeCommand(
      'workbench.action.openSettings',
      'jarify.executable',
    );
  }

  return false;
}

function isAvailable(executable: string): Promise<boolean> {
  return new Promise((resolve) => {
    const proc = cp.spawn(executable, ['--version']);
    proc.on('error', () => resolve(false));
    proc.on('close', (code) => resolve(code === 0));
  });
}

function openTerminal(command: string): void {
  const term = vscode.window.createTerminal('jarify install');
  term.show();
  term.sendText(command);
}
