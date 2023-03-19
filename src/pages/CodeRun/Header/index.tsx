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
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import EditorConfigStore from '@/store/EditorConfigStore';

const codeOptions: SelectProps['options'] = [
  { label: 'C++', value: CodeType.cpp },
  { label: 'C', value: CodeType.c },
  { label: 'Java', value: CodeType.java },
  // { label: 'Rust', value: CodeType.rust },
  // { label: 'Nodejs', value: CodeType.nodejs },
  // { label: 'Go', value: CodeType.go },
  // { label: 'C#', value: CodeType.dotnet },
  { label: 'Python3', value: CodeType.python3 }
  // { label: 'php', value: CodeType.php },
  // { label: 'Typescript', value: CodeType.ts }
];

const themeOptions: SelectProps['options'] = [
  {
    label: 'Visual Studio',
    value: ThemeType['Visual Studio']
  },
  {
    label: 'Visual Studio Dark',
    value: ThemeType['Visual Studio Dark']
  },
  {
    label: 'High Contrast light',
    value: ThemeType['High Contrast']
  },
  {
    label: 'High Contrast Dark',
    value: ThemeType['High Contrast Dark']
  }
];

function Header() {
  const [editorConfig] = useState(() => EditorConfigStore);
  const { codeType, editorThemeType, setCodeType, setEditorThemeType } =
    editorConfig;
  return (
    <div>
      <Select
        value={codeType}
        style={{ width: 120 }}
        onChange={(type) => setCodeType(type)}
        options={codeOptions}
      />
      <Select
        value={editorThemeType}
        style={{ width: 120 }}
        onChange={(type) => setEditorThemeType(type)}
        options={themeOptions}
      />
    </div>
  );
}

export default observer(Header);
