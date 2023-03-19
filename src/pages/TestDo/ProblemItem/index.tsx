import React, { memo, useEffect, useState, MouseEvent, useRef } from 'react';
import styles from './index.module.scss';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import mk from '@iktakahiro/markdown-it-katex';
import cn from 'classnames';
import 'highlight.js/scss/default.scss';
import 'highlight.js/styles/github.css';
import { problem, userChooseRes } from '..';
import { numberToLetter } from '@/utils/util';
import { Button, Input, message } from 'antd';
import '@/components/Editor/index.scss';
import CodeRun from '@/pages/CodeRun';
import { problemCodeRun } from '@/service/codeRun';

interface ProblemItemProps {
  data: problem;
  index: number;
  testType?: number;
  showAnalysis?: boolean;
  userChooseRes?: userChooseRes;
  handleChoose?: Function;
  success?: Function;
}
const NUM = 2;
function ProblemItem(props: ProblemItemProps) {
  const {
    data,
    index,
    testType,
    showAnalysis,
    handleChoose,
    success,
    userChooseRes
  } = props;
  const { title, item } = data;
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

  //用户选的答案
  const [choose, setChoose] = useState(
    new Set<number>(userChooseRes?.choose || [])
  );
  //用户提交的次数
  const [chooseTime, setChooseTime] = useState(0);
  //是否展示答案
  const [showRes, setShowRes] = useState(false);
  //当前提示的索引
  const [tipIndex, setTipIndex] = useState(-1);

  const [finistProblemList, setFinistProblemList] = useState<number[]>([]);

  //题目改变要reset
  useEffect(() => {
    setTipIndex(finistProblemList.includes(data.problemId) ? -1 : 0);
    if (
      finistProblemList.length > 0 &&
      finistProblemList.includes(data.problemId)
    ) {
      setShowRes(true);
    } else {
      setShowRes(false);
    }
    setChoose(new Set(userChooseRes?.choose || []));
    setTipIndex(-1);
    setChooseTime(0);
  }, [index]);

  const chooseRes = (i: number) => {
    if (chooseTime >= NUM || showRes) {
      return;
    }
    const newChoose = new Set(choose);
    if (newChoose.has(i)) newChoose.delete(i);
    else newChoose.add(i);
    setChoose(newChoose);

    handleChoose?.(
      data.problemId,
      Array.from(newChoose),
      chooseTime,
      data.type
    );
  };
  const handleRes = () => {
    if (choose.size === 0) {
      message.warning('请选择答案');
      return;
    }
    finistProblemList.push(data.problemId);
    setFinistProblemList([...finistProblemList]);
    setChooseTime(chooseTime + 1); //异步执行
    if (chooseTime + 1 === NUM) {
      setShowRes(true);
      return;
    }
    const res = data.res.sort().toString();
    const choosed = Array.from(choose).sort().toString();
    if (res !== choosed) {
      chooseTime < NUM && message.warning('回答错误，请重新选择');
      return;
    }
    success && success();
    setChoose(new Set());
  };

  const [codeState, setCodeState] = useState(false);

  const handleCodeRes = () => {
    finistProblemList.push(data.problemId);
    setFinistProblemList([...finistProblemList]);
    handleChoose?.(data.problemId, [codeState], 0, data.type);
    setChooseTime(chooseTime + 1); //异步执行
    if (chooseTime + 1 === NUM) {
      setShowRes(true);
      return;
    }
  };
  const handleFillRes = () => {
    finistProblemList.push(data.problemId);
    setFinistProblemList([...finistProblemList]);
    handleChoose?.(data.problemId, [fillValue], 0, data.type);
    setChooseTime(chooseTime + 1); //异步执行
    if (chooseTime + 1 === NUM) {
      setShowRes(true);
      return;
    }
  };

  const showTips = () => {
    if (tipIndex === data.tips.length - 1) return;
    setTipIndex(tipIndex + 1);
  };

  const [fillValue, setFillValue] = useState<string | null | undefined>(
    //@ts-ignore
    () => userChooseRes?.choose[0]
  );

  return (
    <div className={styles['problem-item']}>
      <div className={styles['problem-title']}>
        <span>{index + 1}.</span>
        <div
          dangerouslySetInnerHTML={{
            __html: mdParser.render(title)
          }}
        ></div>
        <span>({data.score}分)</span>
      </div>
      <div className={styles['problem-content']}>
        {data.type <= 1 &&
          item.map((problem, i) => (
            <div
              className={cn(styles['problem-choose'], {
                [styles['choosed']]: choose.has(problem.problemItemId),
                [styles['error']]:
                  showRes &&
                  ((choose.has(problem.problemItemId) &&
                    !data.res.includes(problem.problemItemId)) ||
                    (!choose.has(problem.problemItemId) &&
                      data.res.includes(problem.problemItemId)))
              })}
              onClick={() => chooseRes(problem.problemItemId)}
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
        {data.type === 2 && (
          <div>
            <Input
              placeholder="请输入答案"
              // value={userChooseRes?.choose[0]}
              value={fillValue ?? ''}
              onChange={(e) => {
                setFillValue(e.target.value);
              }}
            />
          </div>
        )}
        {data.type === 3 && (
          <CodeRun
            code={data.item[1].content}
            handleRun={async (code: string, type: string) => {
              const { data: d } = await problemCodeRun({
                problemId: data.problemId,
                code,
                type
              });
              setCodeState(String(d).includes('true') ? true : false);
              return d;
            }}
          />
        )}
      </div>
      {testType === 1 && (
        <>
          {data.type < 2 && <Button onClick={handleRes}>提交</Button>}
          {data.type === 2 && <Button onClick={handleFillRes}>提交</Button>}
          {data.type === 3 && <Button onClick={handleCodeRes}>提交</Button>}
          <Button
            disabled={tipIndex >= data.tips.length - 1}
            onClick={showTips}
          >
            {tipIndex > -1 && '再'}提示一下
          </Button>
          {tipIndex >= 0 &&
            data.tips.map(
              (tip, i) => i <= tipIndex && <div key={i}>{tip}</div>
            )}
        </>
      )}
      {showRes && testType === 1 && (
        <>
          <div>
            <span>正确答案</span>
            <span>
              {data.res.map((v) =>
                numberToLetter(
                  item.findIndex(
                    (problemItem, i) => problemItem.problemItemId === v
                  )
                )
              )}
            </span>
            <span>你的答案</span>
            <span>
              {data.type <= 1 &&
                [...choose]
                  .sort()
                  .map((v) =>
                    numberToLetter(
                      item.findIndex(
                        (problemItem, i) => problemItem.problemItemId === v
                      )
                    )
                  )}
              {data.type === 2 && <div>{[...choose][0]}</div>}
            </span>
          </div>
          <div>解析</div>
          <div>{data.analysis}</div>
        </>
      )}
    </div>
  );
}
export default memo(ProblemItem);
