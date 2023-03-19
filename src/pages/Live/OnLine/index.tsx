import React, { memo, useState, useRef, useEffect } from 'react';
import type { userList } from '..';
import styles from './index.module.scss';

interface OnLineProps {
  data: userList[];
  kickOut: (id: number) => void;
}

function OnLine(props: OnLineProps) {
  const { data, kickOut } = props;
  return (
    <div className={styles['list']}>
      <div className={styles['item']}>
        {data?.map((v, i) => (
          <div key={i}>
            <div>{'id:' + v.id + '----display:' + v.display}</div>
            <span onClick={() => kickOut(v.id)}>踢出</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(OnLine);
