import React, {
  ChangeEvent,
  memo,
  useEffect,
  useState,
  CSSProperties
} from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import hljs from 'highlight.js';
import mk from '@iktakahiro/markdown-it-katex';

// 引入默认样式
import 'highlight.js/scss/default.scss';
// 引入个性化的vs2015样式
import 'highlight.js/styles/github.css';
import './index.scss';

interface EditorProps {
  val?: string;
  handleValue?: (s: string) => void;
  style?: CSSProperties;
}

function Editor(props: EditorProps) {
  const { handleValue, val, style } = props;

  // markdown-it 利用设置参数，具体查询markdown-it官网
  const mdParser = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str: string, lang: string) {
      // 得到经过highlight.js之后的html代码
      let preCode = '';
      if (lang && hljs.getLanguage(lang)) {
        preCode = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true
        }).value;
      } else {
        preCode = mdParser.utils.escapeHtml(str);
      }
      // 以换行进行分割

      const lines = preCode.split(/\n/).slice(0, -1);
      // 添加自定义行号
      let html = lines
        .map((item, index) => {
          return `<li><span class="line_num">${
            index + 1
          }</span><span class="code_item">${item}</span></li>`;
        })
        .join('');
      html = '<ol>' + html + '</ol>';
      const node = `
          <div class="showCode">
            ${lang && '<div class="code_header">' + lang + '</div>'}
            <div class="hl"><div>${html}</div></div>
          </div>
          `;
      return node;
    }
  })
    .enable('image')
    .use(mk);

  // 检测markdown数据变化
  function handleEditorChange({ html, text }: { html: string; text: string }) {
    handleValue && handleValue(text);
  }
  function renderHTML(text: string) {
    return mdParser.render(text);
  }

  return (
    <MdEditor
      value={val}
      onChange={handleEditorChange}
      renderHTML={renderHTML}
      style={{ ...style }}
    ></MdEditor>
  );
}
export default memo(Editor);
