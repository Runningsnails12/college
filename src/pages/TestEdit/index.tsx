import { ChangeEvent, memo, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { Button, Input, message, Radio, RadioChangeEvent } from 'antd';
import { useParams } from 'react-router-dom';
import {
  getTestById,
  createTest,
  addTestProblem,
  changeExamType,
  changeTitle,
  changeState,
  getTestTitle
} from '@/service/test';
import { useRequest } from 'ahooks';
import { debounce } from 'lodash-es';
import SingleChoose from './SingleChoose';
import {
  addMultipleChooseProblem,
  updateMultipleChooseProblem
} from '@/service/problem';

interface test {
  单选题?: list[];
  多选题?: list[];
}

export enum problemTypeEnum {
  sin = 0,
  mul = 1,
  fill = 2,
  code = 3
}
export const problemTypeStr: Record<number, string> = {
  0: '单选题',
  1: '多选题',
  2: '填空题',
  3: '代码题'
};

export interface list {
  problemId: string;
  title: string;
  item: item[];
  res: number[];
  analysis: string;
  tips: string[];
  score: number;
  type: number;
}
interface item {
  problemItemId: number;
  content: string;
}
// interface TestInfo{
//   testId:number;
//   userId:number;
//   title:string;
//   type:number;
//   createTime:string;
//   state:number
// }
const options = [
  { label: '刷题模式', value: 'common' },
  { label: '考试模式', value: 'exam' }
];
const template: list = {
  problemId: '',
  title: '',
  item: [
    {
      problemItemId: 0,
      content: ''
    }
  ],
  res: [],
  analysis: '',
  tips: [],
  score: 0,
  type: 0
};
function TestEdit() {
  const params = useParams();
  const [examType, setExamType] = useState('common');
  const [data, setData] = useState<test>({});
  const [listData, setListData] = useState<list>(template);
  const [testId, setTestId] = useState(params.id);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchTestData();
    fetchTestInfo();
    !params.id && fetchTestId();
  }, []);
  const fetchTestInfo = async () => {
    const { data: d } = await getTestTitle(testId);
    setTitle(d);
  };
  const fetchTestData = async () => {
    if (!testId) return;
    const { data: d } = await getTestById(testId);
    setData(d);
  };
  const fetchTestId = async () => {
    const { data } = await createTest();
    setTestId(data);
  };
  const onChangeExamType = async ({ target: { value } }: RadioChangeEvent) => {
    const { code } = await changeExamType(testId, value);
    if (code !== 0) {
      message.error('更改失败');
      return;
    }
    setExamType(value);
  };

  const onChangeTitle = async (value: any) => {
    const { code } = await changeTitle(testId, value);
    if (code !== 0) {
      message.error('更改失败');
      return;
    }
  };
  const { run } = useRequest(onChangeTitle, {
    debounceWait: 1000,
    manual: true
  });
  const onChangeState = async () => {
    const { code } = await changeState(testId);
    if (code !== 0) {
      message.error('更改失败');
      return;
    }
    message.success('提交成功');
  };
  const add = (type: number) => {
    template.type = type;
    setListData({ ...template });
  };
  const submitData = async (d: list) => {
    if (d.problemId === '') {
      const { code, data: problemId } = await addMultipleChooseProblem(d);
      if (code !== 0) {
        message.error('添加失败');
        return;
      }
      await addTestProblem(testId, problemId);
      message.success('添加成功');
    } else {
      const { code } = await updateMultipleChooseProblem(d);
      if (code !== 0) {
        message.error('添加失败');
        return;
      }
      message.success('更新成功');
    }
    fetchTestData();
  };
  return (
    <div className={styles['test-wrapper']}>
      <div className={styles['test']}>
        <div className={styles['header']}>
          <div>
            <span>标题</span>
            <Input
              placeholder="请输入标题"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                run(e.target.value);
              }}
            />
          </div>
          <div>
            <span>做题模式</span>
            <Radio.Group
              options={options}
              onChange={onChangeExamType}
              value={examType}
              optionType="button"
              buttonStyle="solid"
              size="small"
            />
          </div>
          <Button onClick={onChangeState}>提交</Button>
        </div>
        <div className={styles['main']}>
          <div className={styles['left']}>
            {Object.entries(data).map(
              ([k, v], i) =>
                v.length > 0 && (
                  <div key={i}>
                    <div className={styles['left-problem-title']}>{k}</div>
                    {v.map((item: list) => (
                      <div
                        key={item.problemId}
                        onClick={() => setListData(item)}
                        className={styles['left-problem-item']}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                )
            )}
          </div>
          <div className={styles['right']}>
            <div>
              <div className={styles['add']}>
                <span
                  onClick={() => add(problemTypeEnum.sin)}
                  className={styles['create-problem']}
                >
                  单选题
                </span>
                <span
                  onClick={() => add(problemTypeEnum.mul)}
                  className={styles['create-problem']}
                >
                  多选题
                </span>
                <span
                  onClick={() => add(problemTypeEnum.fill)}
                  className={styles['create-problem']}
                >
                  填空题
                </span>
                <span
                  onClick={() => add(problemTypeEnum.code)}
                  className={styles['create-problem']}
                >
                  代码题
                </span>
              </div>
              <div className={styles['content']}>
                <SingleChoose
                  data={listData}
                  onOk={submitData}
                  key={listData.problemId}
                ></SingleChoose>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TestEdit);
