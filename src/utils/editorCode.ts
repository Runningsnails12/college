export enum CodeType {
  cpp = 'cpp',
  nodejs = 'nodejs',
  go = 'go',
  python3 = 'python3',
  java = 'java',
  php = 'php',
  rust = 'rust',
  c = 'c',
  dotnet = 'dotnet',
  ts = 'typescript',
}

export enum CodeEnv {
  cpp = 'cpp:11',
  nodejs = 'nodejs:lts',
  go = 'go:latest',
  python3 = 'python:3',
  java = 'java:latest',
  php = 'php:8',
  rust = 'rust:latest',
  c = 'cpp:11',
  dotnet = 'mono:lts',
  ts = 'nodejs:lts',
}

export enum FileSuffix {
  cpp = 'cpp',
  nodejs = 'js',
  go = 'go',
  python3 = 'py',
  java = 'java',
  php = 'php',
  rust = 'rs',
  c = 'c',
  dotnet = 'cs',
  ts = 'ts',
}

export const enum ThemeType {
  'Visual Studio' = 'vs',
  'Visual Studio Dark' = 'vs-dark',
  'High Contrast' = 'hc-light',
  'High Contrast Dark' = 'hc-black',
}