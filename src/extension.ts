import * as vscode from 'vscode';
import { JarifyDiagnosticsProvider } from './diagnostics';
import { JarifyFormatter } from './formatter';
import { ensureJarify } from './installer';

export function activate(context: vscode.ExtensionContext): void {
  ensureJarify();

  const formatter = new JarifyFormatter();
  const diagnostics = new JarifyDiagnosticsProvider();

  context.subscriptions.push(
    // Register as a formatting provider for all file-scheme documents.
    // Users can set jarify as the default formatter per language via
    // editor.defaultFormatter in their settings.
    vscode.languages.registerDocumentFormattingEditProvider(
      { scheme: 'file' },
      formatter,
    ),
    vscode.workspace.onDidOpenTextDocument((doc) => diagnostics.update(doc)),
    vscode.workspace.onDidSaveTextDocument((doc) => diagnostics.update(doc)),
    vscode.workspace.onDidCloseTextDocument((doc) => diagnostics.clear(doc)),
    { dispose: () => diagnostics.dispose() },
  );

  // Lint documents already open when the extension activates.
  for (const doc of vscode.workspace.textDocuments) {
    diagnostics.update(doc);
  }
}

export function deactivate(): void {
  // Subscriptions are disposed automatically by VS Code.
}
