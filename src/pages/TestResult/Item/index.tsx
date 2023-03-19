import { problem, userChooseRes } from '@/pages/TestDo';
import React, { memo, useEffect, useRef, useState } from 'react';
import styles from '../../TestDo/ProblemItem/index.module.scss';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import mk from '@iktakahiro/markdown-it-katex';
import cn from 'classnames';
import { numberToLetter } from '@/utils/util';

interface ItemProps {
  index: number;
  data: problem;
  choose: number[] | null | undefined;
}
function Item(props: ItemProps) {
  const { index, data, choose } = props;
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
  return (
    <div className={styles['problem-item']}>
      <div className={styles['problem-title']}>
        <span>{index + 1}.</span>
        <div
          dangerouslySetInnerHTML={{
            __html: mdParser.render(data.title)
          }}
        ></div>
        <span>({data.score}分)</span>
      </div>
      <ul className={styles['problem-content']}>
        {data.item?.map((problem, i) => (
          <div
            className={cn(styles['problem-choose'], {
              [styles['choosed']]: choose?.includes(problem.problemItemId)
            })}
            key={problem.problemItemId}
          >
            <span>{numberToLetter(i)}.</span>
            <div
              key={i}
              className={styles['md-wrapper']}
              dangerouslySetInnerHTML={{
                __html: mdParser.render(problem.content)
              }}
            ></div>
          </div>
        ))}
      </ul>
      <div>
        <span>正确答案</span>
        <span>
          {data.res.map((v) =>
            numberToLetter(
              data.item?.findIndex(
                (problemItem, i) => problemItem.problemItemId === v
              )
            )
          )}
        </span>
        <span>你的答案</span>
        <span>
          {choose &&
            choose.length > 0 &&
            [...choose]
              .sort()
              .map((v) =>
                numberToLetter(
                  data.item?.findIndex(
                    (problemItem, i) => problemItem.problemItemId === v
                  )
                )
              )}
        </span>
      </div>{' '}
      <div>解析</div>
      <div>{data.analysis}</div>
    </div>
  );
}

export default memo(Item);
