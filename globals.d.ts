declare module '@douyinfe/semi-icons'
declare module '@formily/antd'
declare module 'markdown-it'
declare module '@iktakahiro/markdown-it-katex'

interface ImportMetaEnv {
  readonly MODE: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}