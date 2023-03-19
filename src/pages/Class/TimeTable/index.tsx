import React, { memo, useState } from 'react';
import styles from './index.module.scss';

function TimeTable() {
  return (
    <div className={styles['catelogue-wrapper']}>
      <div className={styles['catelogue']}></div>
    </div>
  );
}

export default memo(TimeTable);
