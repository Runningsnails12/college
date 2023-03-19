import { CodeType } from "@/utils/editorCode";
import { makeAutoObservable, runInAction } from "mobx";

export const enum ThemeType {
  'Visual Studio' = 'vs',
  'Visual Studio Dark' = 'vs-dark',
  'High Contrast' = 'hc-light',
  'High Contrast Dark' = 'hc-black',
}

class EditorConfigStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
  editorThemeType = ThemeType['Visual Studio'];
  codeType = CodeType.cpp;

  setCodeType(type: CodeType) {
    this.codeType = type;
  }

  setEditorThemeType(type: ThemeType) {
    this.editorThemeType = type;
  }
}

export default new EditorConfigStore()