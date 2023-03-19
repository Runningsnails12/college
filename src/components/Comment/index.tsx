import { LikeOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import cn from 'classnames';
import React, {
  memo,
  PropsWithChildren,
  useRef,
  useState,
  CSSProperties,
  ReactNode,
  useContext
} from 'react';
import CommentInput from '@/components/Comment/CommentInput';
import styles from './index.module.scss';
import { CommentApi } from './type';
import ReplyBox from './ReplyBox';
import dayjs from 'dayjs';
import { CommentContext } from '@/pages/Section';

interface CommentProps {
  comment: CommentApi;
  type?: string;
  parentId?: number | null;
  style?: CSSProperties;
  className?: string;
}

function Comment(props: PropsWithChildren<CommentProps>) {
  const { onSubmit: submit, avatar } = useContext(CommentContext);
  const { comment, className: c = '', parentId, type = 'common' } = props;
  const [active, setActive] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const btnRef = useRef<HTMLDivElement>(null);
  const [replyUserId, setReplyUserId] = useState<number | null>(null);
  const hide = (event: Event) => {
    const target = event.target as HTMLElement;
    if (!btnRef.current?.contains(target)) {
      setActive(false);
    }
  };
  const close = () => setActive(false);
  const reply = (username: string) => {
    setPlaceholder(`回复 @${username}:`);
    setActive(!active);
  };

  return (
    <>
      <div
        className={cn(styles['reply-item'], c)}
        style={props.style}
        key={comment.id}
      >
        <div className={styles['root-reply-container']}>
          <div className={styles['root-reply-avatar']}>
            <Avatar src={comment.avatar} />
          </div>
          <div className={styles['content-warp']}>
            <div className={styles['user-info']}>
              <div className={styles['user-name']}>{comment.username}</div>
            </div>
            <div className={styles['root-reply']}>
              <div className={styles['reply-content']}>
                {comment.parentName ? (
                  <a
                    href={comment.link}
                    target="_blank"
                    style={{
                      textDecoration: 'none',
                      color: '#008ac5',
                      cursor: 'pointer'
                    }}
                  >
                    @{comment.parentName}&nbsp;&nbsp;
                  </a>
                ) : null}
                {comment.content}
              </div>
              <div className={styles['reply-info']}>
                <div className={styles['reply-time']}>
                  {dayjs(comment.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </div>

                <div className={styles['reply-like']}>
                  <LikeOutlined className={styles['reply-like-icon']} />
                  <span>{comment.like}</span>
                </div>
                <div
                  className={styles['reply-btn']}
                  onClick={() => {
                    reply(comment.username);
                    setReplyUserId(comment.uid);
                  }}
                  ref={btnRef}
                >
                  回复
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['sub-reply-container']}>
          <ReplyBox data={comment.reply} parentId={comment.id}></ReplyBox>
        </div>
        {active ? (
          <CommentInput
            parentId={type === 'common' ? comment.id : parentId}
            placeholder={placeholder}
            hide={hide}
            close={close}
            avatar={avatar}
            replyUserId={replyUserId}
          ></CommentInput>
        ) : null}
      </div>
    </>
  );
}

export default memo(Comment);
