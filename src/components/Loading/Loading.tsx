import React, { memo } from 'react'

import styles from './index.module.scss'

function Loading() {
  return (
    <div className={styles['next-loading']}>
      <div className={styles['next-loading-tip']}>
        <span className={styles['next-loading-dot']}></span>
        <span className={styles['next-loading-dot']}></span>
        <span className={styles['next-loading-dot']}></span>
      </div>
    </div>
  )
}
export default memo(Loading)
