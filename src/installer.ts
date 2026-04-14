import * as cp from 'child_process';
import * as vscode from 'vscode';
import { getConfig } from './config';

export async function ensureJarify(): Promise<boolean> {
  const { executable } = getConfig();

  if (await isAvailable(executable)) {
    return true;
  }

  return vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: 'Installing jarify…' },
    () => install(),
  );
}

function install(): Promise<boolean> {
  return new Promise((resolve) => {
    cp.exec('uv tool install jarify', (err) => {
      if (err) {
        vscode.window.showErrorMessage(
          `jarify install failed: ${err.message}. Install manually with: uv tool install jarify`,
        );
        resolve(false);
      } else {
        vscode.window.showInformationMessage('jarify installed successfully.');
        resolve(true);
      }
    });
  });
}

function isAvailable(executable: string): Promise<boolean> {
  return new Promise((resolve) => {
    const proc = cp.spawn(executable, ['--version']);
    proc.on('error', () => resolve(false));
    proc.on('close', (code) => resolve(code === 0));
  });
}
