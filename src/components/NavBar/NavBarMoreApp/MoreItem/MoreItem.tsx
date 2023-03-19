import { content } from '@/common/navbar';
import classnames from 'classnames';
import { FC, memo, ReactElement, CSSProperties, LegacyRef } from 'react';

import styles from './index.module.scss';

interface MoreItemType {
  item: content;
  moreItemRef?: LegacyRef<HTMLDivElement>;
  type?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactElement | null;

  handleClick?: Function;
  handleDragStart?: Function;
  handleDrag?: Function;
  handleDragEnd?: Function;
  handleDragOver?: Function;
  handleMouseDown?: Function;
  handleMouseUp?: Function;
}

function MoreItem(props: MoreItemType) {
  return (
    <div
      // date-id={props.item.id}
      style={{ cursor: props.type ? 'grap' : 'pointer', ...props.style }}
      // draggable={props.type ? true : false}
      ref={props.moreItemRef}
      className={classnames(props.className, 'next-badge', styles['more-item'])}
      onClick={() => props.handleClick?.(props.item.path, props.item.id)}
    >
      <span className={styles['nav_bar_detail-app-item']}>
        <span className="next-badge">
          <span
            className={styles['nav_bar_detail-app-item-icon']}
            style={{ backgroundImage: `url(${props.item.url})` }}
          ></span>
        </span>
        <span className={styles['nav_bar_detail-app-item-text']}>
          {props.item.text}
        </span>
      </span>
      <span>{props.children}</span>
    </div>
  );
}
export default memo(MoreItem);
