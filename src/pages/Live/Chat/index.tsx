import React, { memo, useState, useRef, useEffect } from 'react';
import styles from './index.module.scss';
import type { ChatType } from '../';
import { Input, Button } from 'antd';

const { TextArea } = Input;

interface ChatProps {
  data: ChatType[];
  sendMsg: (msg: string) => void;
}

function Chat(props: ChatProps) {
  const { data, sendMsg } = props;
  const [value, setValue] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={styles['chat-wrap']}>
      <div className={styles['chat-list']}>
        {data?.map((v, i) => (
          <div>
            用户{v.username}:{v.content}
          </div>
        ))}
      </div>
      <div className={styles['text-editor']}>
        <TextArea
          value={value}
          showCount
          maxLength={100}
          style={{ height: 120, resize: 'none' }}
          onChange={onChange}
          placeholder="请输入文字"
        />
        <Button
          onClick={() => {
            sendMsg(value);
          }}
        >
          发送
        </Button>
      </div>
    </div>
  );
}

export default memo(Chat);
