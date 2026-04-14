import * as vscode from 'vscode';

export interface JarifyConfig {
  executable: string;
  configPath: string | undefined;
}

export function getConfig(): JarifyConfig {
  const config = vscode.workspace.getConfiguration('jarify');
  return {
    executable: config.get<string>('executable', 'jarify'),
    configPath: config.get<string>('configPath') || undefined,
  };
}

export function buildConfigArgs(config: JarifyConfig): string[] {
  return config.configPath ? ['--config', config.configPath] : [];
}
