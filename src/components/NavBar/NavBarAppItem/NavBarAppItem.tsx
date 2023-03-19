import { memo, useEffect, useRef } from 'react';
import classnames from 'classnames';

import { content } from '@/common/navbar';
import styles from './index.module.scss';
import { Copy } from '@/utils/typeTool';

type navBarAppItemType = Copy<
  content & {
    isShow: boolean;
    isActive: boolean;
    handleClick?: Function;
    type?: string;
    className?: string;
    handleMorePosition?: Function;
  }
>;

const NavBarAppItem = (props: navBarAppItemType) => {
  const moreEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.type !== 'more' || !props.handleMorePosition) return;
    if (!moreEl.current) return;
    const bound = moreEl.current.getBoundingClientRect();
    props.handleMorePosition!(bound.top + bound.height / 2);
  });

  return (
    <div
      style={{ display: props.isShow ? '' : 'none' }}
      className={classnames([styles['nav_bar_detail-apps']], {
        [styles['nav_bar_detail-app-active']]: props.isActive
      })}
      onClick={() => props.handleClick?.()}
      ref={moreEl}
    >
      <span className={styles['nav_bar_detail-app-icon']}>
        <span style={{ backgroundImage: `url(${props.url})` }}></span>
      </span>
      <span className={styles['nav_bar_detail-app-text']}>{props.text}</span>
    </div>
  );
};

export default memo(NavBarAppItem);
