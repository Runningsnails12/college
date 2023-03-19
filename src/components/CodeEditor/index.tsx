import React, {
  memo,
  useState,
  useRef,
  useEffect,
  ForwardedRef,
  forwardRef,
  useImperativeHandle
} from 'react';
import { CodeType, ThemeType } from '@/utils/editorCode';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import styles from './index.module.scss';
import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution';
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution';

interface Props {
  className?: string;
  theme?: ThemeType;
  language?: monacoLang;
  code?: string;
}

type monacoLang =
  | 'typescript'
  | 'javascript'
  | 'cpp'
  | 'go'
  | 'python'
  | 'java'
  | 'php'
  | 'rust'
  | 'c'
  | 'csharp';

export const languageMap: Record<CodeType, monacoLang> = {
  [CodeType.nodejs]: 'javascript',
  [CodeType.cpp]: 'cpp',
  [CodeType.go]: 'go',
  [CodeType.python3]: 'python',
  [CodeType.java]: 'java',
  [CodeType.php]: 'php',
  [CodeType.rust]: 'rust',
  [CodeType.c]: 'c',
  [CodeType.dotnet]: 'csharp',
  [CodeType.ts]: 'typescript'
};
export interface Expose {
  getEditor: () => monaco.editor.IStandaloneCodeEditor | null;
}

function CodeEditor(props: Props, ref: ForwardedRef<Expose>) {
  const {
    className,
    language = 'cpp',
    theme = ThemeType['Visual Studio'],
    code = ''
  } = props;
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const monacoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getEditor: () => {
      if (editorRef.current) return editorRef.current;
      return null;
    }
  }));

  useEffect(() => {
    editorRef.current?.setValue(code);
  }, [code]);

  useEffect(() => {
    if (monacoRef.current) {
      editorRef.current = monaco.editor.create(monacoRef.current, {
        value: code,
        language,
        theme,
        smoothScrolling: true,
        readOnly: false,
        tabSize: 4,
        automaticLayout: true
      });
      return () => editorRef.current?.dispose();
    }
  }, [language, theme]);

  return <div className={cn(styles.editor, className)} ref={monacoRef}></div>;
}

export default observer(forwardRef(CodeEditor));
