import { CommentContext } from '@/pages/Section';
import useClickOutside from '@/utils/hooks';
import { Avatar } from 'antd';
import React, {
  ChangeEventHandler,
  memo,
  useContext,
  useRef,
  useState
} from 'react';
import styles from './index.module.scss';

interface CommentInputType {
  avatar: string;
  replyUserId: number | null;
  parentId?: number|null;
  placeholder?: string;
  hide?: (e: MouseEvent) => void;
  close?: (e: MouseEvent) => void;
}

function CommentInput(props: CommentInputType) {
  const { onSubmit } = useContext(CommentContext);
  const { avatar, replyUserId, hide, placeholder, parentId = null } = props;
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState('');
  const handleFocus = () => setFocus(!focus);
  const boxRef = useRef<HTMLDivElement>(null);
  const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) =>
    setValue(e.target.value);

  useClickOutside(boxRef, (e: MouseEvent) => {
    const textValue = value.replace(/&nbsp;|<br>| /g, '');
    if (textValue == '') {
      hide && hide(e);
    }
  });

  const submitComment = () => {
    const t = parentId === null ? null : Number(parentId);
    onSubmit(t, value, replyUserId);
    setValue('');
  };

  return (
    <div
      ref={boxRef}
      className={styles['reply-box']}
      style={{ height: focus ? '65px' : '' }}
    >
      <div className={styles['reply-box-avatar']}>
        <Avatar src={avatar} style={{ width: '40px', height: '40px' }} />
      </div>
      <div className={styles['reply-box-warp']}>
        <textarea
          style={{
            lineHeight: value == '' ? '38px' : 'normal'
          }}
          onMouseEnter={handleFocus}
          onMouseOut={handleFocus}
          className={styles['reply-box-textarea']}
          value={value}
          onChange={onChange}
          placeholder={placeholder ? placeholder : '发一条友善的评论'}
          maxLength={400}
        ></textarea>
      </div>
      <div className={styles['reply-box-send']}>
        <div className={styles['send-text']} onClick={submitComment}>
          发布
        </div>
      </div>
    </div>
  );
}

export default memo(CommentInput);
