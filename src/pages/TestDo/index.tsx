import React, { memo, useEffect, useState, MouseEvent, useMemo } from 'react';
import styles from './index.module.scss';
import cn from 'classnames';
import 'highlight.js/scss/default.scss';
import 'highlight.js/styles/github.css';
import ProblemItem from './ProblemItem';
import { Button, message } from 'antd';
import { useParams } from 'react-router-dom';
import { convertToChinaNum, numberToLetter } from '@/utils/util';
import { addTestResult, getStuTest } from '@/service/test';

export interface testApi {
  title: string;
  testId: string;
  startTime: string;
  expireTime: string;
  type: number;
  test: test[];
}
interface test {
  type: string;
  content: problem[];
}
export interface problem {
  problemId: number;
  title: string;
  score: string;
  item: problemItem[];
  res: number[];
  analysis: string;
  tips: string[];
  type: number;
}
export interface problemItem {
  problemItemId: number;
  content: string;
}

export interface userChooseRes {
  problemId: number;
  choose: number[];
  type: number;
  chooseTime?: number;
}

function TestDo() {
  const params = useParams();

  const [data, setData] = useState<testApi>({} as testApi);
  useEffect(() => {
    fetchTest();
  }, []);
  const fetchTest = async () => {
    if (!params.id) return;
    const { data } = await getStuTest(params.id);
    setData(data);
    setCurProblem(0);
  };

  const problesList = useMemo(() => {
    const list: Record<string, problem> = {}; //根据problemId获取problem
    const index: number[] = []; //按顺序存储problemId
    const type: Record<string, string> = {}; //每个类型的题下面的problemId
    data.test?.forEach((item) => {
      item.content?.forEach((v, i) => {
        list[v.problemId] = v;
        index.push(v.problemId);
        type[v.problemId] = item.type;
      });
    });
    return {
      list,
      index,
      type
    };
  }, [data]);
  const [curProblem, setCurProblem] = useState(-1);
  const [userChooseRes, setUserChooseRes] = useState<userChooseRes[]>([]);

  const changeProblem = (trigger: string) => {
    if (trigger === 'up') {
      setCurProblem(curProblem - 1);
    } else {
      setCurProblem(curProblem + 1);
    }
  };

  const go = (problemId: number) => {
    const arr = problesList.index;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === problemId) {
        setCurProblem(i);
      }
    }
  };

  const getTypeAndIndex = (problemId: number): [number, string, number] => {
    const d = data.test;
    if (!d) {
      return [-1, '', -1];
    }
    for (let i = 0; i < d.length; i++) {
      const t = d[i].content;
      for (let j = 0; j < t.length; j++) {
        if (t[j].problemId === problemId) {
          return [i, d[i].type, j]; //[类型的序号,类型(选择题),题目在当前类型的序号]
        }
      }
    }
    return [-1, '', -1];
  };
  const curTypeAndIndex = useMemo(() => {
    return getTypeAndIndex(problesList.index[curProblem]);
  }, [curProblem]);

  const handleChoose = (
    problemId: number,
    choose: any[],
    chooseTime: number,
    type: number
  ) => {
    let f = true;
    for (let i = 0; i < userChooseRes.length; i++) {
      if (userChooseRes[i].problemId === problemId) {
        userChooseRes[i].choose = choose;
        f = false;
      }
    }
    f && userChooseRes.push({ problemId, choose, chooseTime, type });
    setUserChooseRes([...userChooseRes]);
  };
  const getCurUserChooseRes = () => {
    const a = userChooseRes.filter(
      (v) => v.problemId === problesList.index[curProblem]
    );
    return a.length ? a[0] : { problemId: -1, choose: [], chooseTime: 0 };
  };

  const submitRes = async () => {
    userChooseRes.map((v) => {
      delete v.chooseTime;
      return v;
    });
    const { code } = await addTestResult(userChooseRes, data.testId);
    if (code !== 0) {
      message.error('提交失败');
    } else {
      message.success('提交成功');
    }
  };
  return (
    <div className={styles['test-do-page']}>
      <div className={styles['test-wrapper']}>
        <div className={styles['header']}>
          <div className={styles['header-left']}>
            <div className={styles['title']}>{data.title}</div>
            <div className={styles['time']}>
              <span className={styles['start-time']}>{data.startTime}</span>
              <span className={styles['expire-time']}>{data.expireTime}</span>
            </div>
          </div>
          <div className={styles['header-right']}>
            <span className={styles['finished-num']}>
              已完成题目&nbsp;&nbsp;
              {userChooseRes.length}/{problesList.index.length}
            </span>
            <Button onClick={submitRes}>提交</Button>
          </div>
        </div>
        <div className={styles['content']}>
          <div className={styles['left']}>
            {data.test?.map((item, i) => (
              <div key={i}>
                <div className={styles['type']}>
                  {convertToChinaNum(i + 1) + '、' + item.type}
                </div>
                <div className={styles['num']}>
                  {item.content?.map((v, i) => (
                    <div
                      key={v.problemId}
                      className={
                        problesList.index[curProblem] === v.problemId
                          ? cn(styles['num-item'], styles['active'])
                          : styles['num-item']
                      }
                      onClick={() => go(v.problemId)}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={styles['right']}>
            <div className={styles['part']}>
              <div className={styles['part-title']}>
                {convertToChinaNum(curTypeAndIndex[0] + 1)}、
                {curTypeAndIndex[1]}
              </div>
              <div>
                {problesList.list[problesList.index[curProblem]] && (
                  <ProblemItem
                    data={problesList.list[problesList.index[curProblem]]}
                    testType={data.type}
                    index={curTypeAndIndex[2]}
                    showAnalysis={false}
                    userChooseRes={getCurUserChooseRes()}
                    handleChoose={handleChoose}
                    success={() => changeProblem('down')}
                  />
                )}

                <div className={styles['btn']}>
                  <Button
                    onClick={() => changeProblem('up')}
                    disabled={curProblem === 0}
                  >
                    上一题
                  </Button>
                  <Button
                    onClick={() => changeProblem('down')}
                    disabled={curProblem === problesList.index.length - 1}
                  >
                    下一题
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default memo(TestDo);
