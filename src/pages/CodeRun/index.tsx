import React, {
  memo,
  useState,
  useRef,
  useEffect,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useCallback
} from 'react';
import { CodeType, ThemeType } from '@/utils/editorCode';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import styles from './index.module.scss';
import CodeEditor, { Expose, languageMap } from '@/components/CodeEditor';
import Header from './Header';
import Operation from './Operation';
import EditorConfigStore from '@/store/EditorConfigStore';
import { template } from '@/components/CodeEditor/const';

interface CodeRunProps {
  code?: string;
  handleRun?: (code: string,type:string) => Promise<any>;
}

function CodeRun(props: CodeRunProps) {
  const { code = '', handleRun } = props;
  const editorRef = useRef<Expose>(null);
  const [editorConfig] = useState(() => EditorConfigStore);
  const { editorThemeType, codeType } = editorConfig;

  const getEditor = useCallback(() => {
    return editorRef.current?.getEditor();
  }, [editorRef.current]);

  useEffect(() => {
    const codeCache =
      code ?? window.localStorage.getItem(codeType) ?? template[codeType];
    getEditor()?.setValue(codeCache);
  }, [codeType, getEditor]);

  return (
    <div className={styles.main}>
      <Header></Header>
      <CodeEditor
        ref={editorRef}
        theme={editorThemeType}
        language={languageMap[codeType]}
        className={styles.editor}
        code={code}
      ></CodeEditor>
      <Operation getEditor={getEditor} handleRun={handleRun}></Operation>
    </div>
  );
}

export default observer(CodeRun);
