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
import { Button } from 'antd';
import { useRequest } from 'ahooks';
import { editor } from 'monaco-editor';
import EditorConfigStore from '@/store/EditorConfigStore';
import { runCode } from '@/service/codeRun';

interface Props {
  getEditor: () => editor.IStandaloneCodeEditor | null | undefined;
  handleRun?: (code: string, type: string) => Promise<any>;
}
function Operation(props: Props) {
  const { getEditor, handleRun } = props;
  const [editorConfig] = useState(() => EditorConfigStore);
  const { codeType } = editorConfig;

  const [codeRes, setCodeRes] = useState('');

  const handleRunCode = async () => {
    if (getEditor()) {
      const code = getEditor()?.getValue() || '';
      if (handleRun) {
        const data = await handleRun(code, codeType);
        setCodeRes(data);
      } else {
        const { data } = await runCode({
          code: code,
          type: codeType
        });
        setCodeRes(data);
      }
    }
  };
  const { loading, run } = useRequest(handleRunCode, {
    debounceWait: 1000,
    manual: true
  });

  return (
    <div>
      <div>
        <Button onClick={run}>运行</Button>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: loading ? '运行中...' : codeRes?.replaceAll('\r\n', '<br/>')
        }}
      ></div>
    </div>
  );
}

export default observer(Operation);
