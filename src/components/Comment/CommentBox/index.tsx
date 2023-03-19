import React, { CSSProperties, memo, useState } from 'react';
import styles from './index.module.scss';
import Comment from '@/components/Comment';
import { CommentApi, ReplyApi } from '../type';

interface CommentBoxProps {
  data: CommentApi[];
  style?: CSSProperties;
  className?: string;
}

function CommentBox(props: CommentBoxProps) {
  const { data, className } = props;
  return (
    <>
      {data.map((v) => (
        <Comment comment={v} key={v.id} className={className}></Comment>
      ))}
      <div className={styles['no-more-reply']}>没有更多评论</div>
    </>
  );
}

export default memo(CommentBox);
