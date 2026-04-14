import * as cp from 'child_process';
import * as vscode from 'vscode';
import { buildConfigArgs, getConfig } from './config';

/**
 * Shape of a single diagnostic emitted by `jarify lint --format json`.
 * Depends on amfaro/jarify#55 (--format json).
 */
interface LintDiagnostic {
  file: string;
  line: number;    // 1-based
  column: number;  // 1-based
  message: string;
  severity: 'error' | 'warning' | 'info' | 'hint';
}

const SEVERITY_MAP: Record<LintDiagnostic['severity'], vscode.DiagnosticSeverity> = {
  error: vscode.DiagnosticSeverity.Error,
  warning: vscode.DiagnosticSeverity.Warning,
  info: vscode.DiagnosticSeverity.Information,
  hint: vscode.DiagnosticSeverity.Hint,
};

export class JarifyDiagnosticsProvider {
  private readonly collection: vscode.DiagnosticCollection;

  constructor() {
    this.collection = vscode.languages.createDiagnosticCollection('jarify');
  }

  async update(document: vscode.TextDocument): Promise<void> {
    const diagnostics = await lint(document);
    this.collection.set(document.uri, diagnostics);
  }

  clear(document: vscode.TextDocument): void {
    this.collection.delete(document.uri);
  }

  dispose(): void {
    this.collection.dispose();
  }
}

function lint(document: vscode.TextDocument): Promise<vscode.Diagnostic[]> {
  const config = getConfig();
  const args = [
    'lint',
    '--format', 'json',
    '--stdin-filename', document.fileName,
    '-',
    ...buildConfigArgs(config),
  ];

  return new Promise((resolve) => {
    const proc = cp.spawn(config.executable, args);
    let stdout = '';

    proc.stdout.on('data', (chunk: Buffer) => (stdout += chunk.toString()));
    proc.stdin.on('error', () => {});
    proc.stdin.write(document.getText());
    proc.stdin.end();

    proc.on('close', () => {
      try {
        const raw: LintDiagnostic[] = JSON.parse(stdout || '[]');
        resolve(raw.map(toDiagnostic));
      } catch {
        resolve([]);
      }
    });

    proc.on('error', () => resolve([]));
  });
}

function toDiagnostic(d: LintDiagnostic): vscode.Diagnostic {
  const line = Math.max(0, d.line - 1);
  const col = Math.max(0, d.column - 1);
  const range = new vscode.Range(line, col, line, col);
  const severity = SEVERITY_MAP[d.severity] ?? vscode.DiagnosticSeverity.Error;
  return new vscode.Diagnostic(range, d.message, severity);
}
