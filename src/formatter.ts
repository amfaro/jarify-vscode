import * as cp from 'child_process';
import * as vscode from 'vscode';
import { buildConfigArgs, getConfig } from './config';

export class JarifyFormatter implements vscode.DocumentFormattingEditProvider {
  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
  ): Thenable<vscode.TextEdit[]> {
    return format(document);
  }
}

function format(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
  const config = getConfig();
  const args = [
    'fmt',
    '--stdin-filename', document.fileName,
    '-',
    ...buildConfigArgs(config),
  ];

  return new Promise((resolve, reject) => {
    const proc = cp.spawn(config.executable, args);
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (chunk: Buffer) => (stdout += chunk.toString()));
    proc.stderr.on('data', (chunk: Buffer) => (stderr += chunk.toString()));
    // Suppress EPIPE — jarify may close stdin before we finish writing
    proc.stdin.on('error', () => {});
    proc.stdin.write(document.getText());
    proc.stdin.end();

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `jarify fmt exited with code ${code}`));
        return;
      }
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length),
      );
      resolve([vscode.TextEdit.replace(fullRange, stdout)]);
    });

    proc.on('error', (err) => reject(err));
  });
}
