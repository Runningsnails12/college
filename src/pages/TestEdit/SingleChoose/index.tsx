import { memo, useState } from 'react';
import styles from './index.module.scss';
import { Button, InputNumber, Tooltip } from 'antd';
import cn from 'classnames';
import { list, problemTypeStr } from '../';
import Editor from '@/components/Editor';
import CheckableTag from 'antd/es/tag/CheckableTag';

interface singleChooseProps {
  data: list;
  onOk: (d: list) => void;
}
function SingleChoose(props: singleChooseProps) {
  const { data, onOk } = props;

  const [listData, setListData] = useState<list>(data);

  const [answer, setAnswer] = useState<number[]>(data.res);
  const [focusRes, setFocusRes] = useState(-1);
  const [focusAnalysis, setFocusAnalysis] = useState(-1);
  const [focusTip, setFocusTip] = useState(-1);

  const handleChange = (index: number, checked: boolean) => {
    const nextAnswer = checked
      ? [...answer, index]
      : answer.filter((t) => t !== index);
    setAnswer(nextAnswer);
    listData.res = nextAnswer;
    setListData({ ...listData });
  };

  const numberToLetter = (i: number) => {
    return String.fromCharCode('A'.charCodeAt(0) + i);
  };
  const finish = () => {
    setFocusTip(-1);
    setFocusRes(-1);
    setFocusAnalysis(-1);
    // listData.problemId = '' + Date.now();
    onOk(listData);
  };

  const onChangeInputNumber = (value: number | null) => {
    listData.score = value ?? 0;
    setListData({ ...listData });
  };

  return (
    <div className={styles['single-choose']}>
      <div className={styles['type']}>{problemTypeStr[data.type]}</div>
      <div className={styles['item-title']}>题目</div>
      <div>
        <span>分数</span>
        <InputNumber
          value={listData.score}
          min={0}
          max={100}
          defaultValue={1}
          step={0.5}
          onChange={onChangeInputNumber}
        />
      </div>
      <div className={styles['item-title']}>题目</div>

      <Editor
        val={listData.title}
        handleValue={(s) => {
          listData.title = s;
          setListData({ ...listData });
        }}
        style={{ marginBottom: '20px' }}
      />
      {listData.item?.map((list, i) => (
        <div className={styles['list-item']} key={i}>
          <Tooltip title="设为答案">
            <CheckableTag
              className={styles['letter']}
              checked={answer.includes(list.problemItemId)}
              onChange={(checked) =>
                handleChange(
                  list.problemItemId === -1 ? i : list.problemItemId,
                  checked
                )
              }
            >
              {numberToLetter(i)}
            </CheckableTag>
          </Tooltip>
          <div className={cn(styles['answer'], styles['input-wrapper'])}>
            <textarea
              className={styles['input']}
              placeholder="请输入内容"
              value={list.content}
              onChange={(e) => {
                listData.item[i].content = e.target.value;
                setListData({ ...listData });
              }}
              style={{
                display: focusRes === list.problemItemId ? 'none' : 'block'
              }}
            ></textarea>
            <Editor
              val={list.content}
              style={{
                display: focusRes === list.problemItemId ? 'block' : 'none'
              }}
              handleValue={(s) => {
                listData.item[i].content = s;
                setListData({ ...listData });
              }}
            />
            <div
              className={styles['input-right']}
              onClick={() => {
                if (focusRes === list.problemItemId) {
                  setFocusRes(-1);
                } else {
                  setFocusRes(list.problemItemId);
                }
              }}
            >
              {focusRes === list.problemItemId ? 'TXT' : 'MD'}
            </div>
          </div>
          <div
            className={styles['delete']}
            onClick={() => {
              listData.item.splice(i, 1);
              setListData({ ...listData });
              answer.sort((a, b) => a - b);
              const showRemoveIdx = answer.indexOf(i);
              for (let j = 0; j < answer.length; j++) {
                if (answer[j] > i) answer[j]--;
              }
              answer.splice(showRemoveIdx, 1);
              setAnswer([...answer]);
            }}
          >
            <span>删除</span>
          </div>
        </div>
      ))}
      <div
        className={styles['center']}
        onClick={() => {
          listData.item.push({
            problemItemId: listData.item.length,
            content: ''
          });
          setListData({ ...listData });
        }}
      >
        添加选项
      </div>
      <div className={styles['item-title']}>解析</div>
      <div className={styles['container']}>
        <div className={styles['input-wrapper']}>
          <textarea
            className={styles['input']}
            placeholder="请输入内容"
            value={listData.analysis}
            onChange={(e) => {
              listData.analysis = e.target.value;
              setListData({ ...listData });
            }}
            style={{
              display: focusAnalysis === 1 ? 'none' : 'block'
            }}
          ></textarea>
          <Editor
            val={listData.analysis}
            handleValue={(s) => {
              listData.analysis = s;
              setListData(listData);
            }}
            style={{ display: focusAnalysis === 1 ? 'block' : 'none' }}
          />
          <div
            className={styles['input-right']}
            onClick={() => {
              if (focusAnalysis === 0) {
                setFocusAnalysis(1);
              } else if (focusAnalysis === 1) {
                setFocusAnalysis(0);
              }
            }}
          >
            {focusAnalysis === 0 && 'MD'}
            {focusAnalysis === 1 && 'TXT'}
          </div>
        </div>
      </div>
      <div className={styles['item-title']}>提示</div>
      <div className={styles['tips']}>
        {listData.tips?.map((item, i) => (
          <div className={styles['tip']} key={i}>
            <span className={styles['input-title']}>提示{i + 1}</span>
            <div className={styles['input-wrapper']}>
              <textarea
                className={styles['input']}
                placeholder="请输入内容"
                value={item}
                onChange={(e) => {
                  listData.tips[i] = e.target.value;
                  setListData({ ...listData });
                }}
                style={{
                  display: focusTip === i ? 'none' : 'block'
                }}
              ></textarea>
              <Editor
                val={item}
                handleValue={(s) => {
                  listData.tips[i] = s;
                  setListData({ ...listData });
                }}
                style={{
                  display: focusTip === i ? 'block' : 'none',
                  flex: 'auto'
                }}
              />
              <div
                className={styles['input-right']}
                onClick={() => {
                  if (focusTip === i) {
                    setFocusTip(-1);
                  } else {
                    setFocusTip(i);
                  }
                }}
              >
                {focusTip === i ? 'TXT' : 'MD'}
              </div>
            </div>
            <div
              className={styles['delete']}
              onClick={() => {
                listData.tips.splice(i, 1);
                setListData({ ...listData });
              }}
            >
              <span>删除</span>
            </div>
          </div>
        ))}
      </div>
      <div
        className={styles['center']}
        onClick={() => {
          listData.tips.push('');
          setListData({ ...listData });
        }}
      >
        添加提示
      </div>
      <Button type="primary" onClick={finish}>
        完成
      </Button>
    </div>
  );
}
export default memo(SingleChoose);
