import classnames from 'classnames';
import React, {
  memo,
  useContext,
  useState,
  useRef,
  useLayoutEffect,
  useEffect
} from 'react';

import { content, contents } from '@/common/navbar';
import { AppContext } from '../..';
import styles from './index.module.scss';
import mainStyles from '../Main/index.module.scss';
import MoreItem from '../MoreItem/MoreItem';
import DragSort from '@/components/DragSort';

function Edit() {
  const context = useContext(AppContext);

  // 用来渲染的数据
  const [apps, setApps] = useState<content[]>(contents);

  return (
    <>
      <header className={styles['nav_bar_detail-edit-header']}>
        <h5 className={styles['nav_bar_detail-edit-header-title']}>编辑导航</h5>
        <p className={styles['nav_bar_detail-edit-header-des']}>
          可通过拖拽，对导航上的应用进行编辑和排序
        </p>
        <hr className={styles['nav_bar_detail-edit-header-bottom-border']} />
      </header>
      <div className={styles['nav_bar_detail-more-main']}>
        <div className={styles['next-loading-wrap']}>
          <p
            className={styles['nav_bar_detail-app-group-title']}
            style={{ marginBottom: '12px' }}
          >
            已常驻应用
          </p>
          <div>
            <div className={mainStyles['nav_bar_detail-app-group']}>
              <DragSort
                activeClassName={styles['__dnd_drag_item_dragging__']}
                newPositionClassName={
                  styles['__dnd_drag_item_dragging_new_position__']
                }
                ids={apps.map((v, i) => v.id)}
              >
                {apps.map((ele, i) => (
                  <MoreItem
                    key={ele.id}
                    item={ele}
                    className={classnames(
                      styles['nav_bar_detail-edit-app-item_hover']
                    )}
                  >
                    <sup
                      className={styles['next-badge-scroll-number']}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        // console.log(1)
                      }}
                    >
                      <div className={styles['nav_bar_detail-edit-icon']}>
                        ×
                      </div>
                    </sup>
                  </MoreItem>
                ))}
              </DragSort>
            </div>
          </div>
          <div>
            <hr className={styles['nav_bar_detail-more-separator']} />
            <p className={styles['nav_bar_detail-app-group-title']}>
              可常驻应用
            </p>
          </div>
          <div>
            <div className={styles['nav_bar_detail-empty-group']}>暂无应用</div>
          </div>
        </div>
      </div>
      <footer className={styles['nav_bar_detail-edit-footer']}>
        <button
          type="button"
          className={classnames(
            'next-btn',
            'next-medium',
            'next-btn-normal',
            styles['nav_bar_detail-edit-footer-cancel']
          )}
        >
          取消
        </button>
        <button
          type="button"
          className={classnames(
            'next-btn',
            'next-medium',
            'next-btn-primary',
            styles['nav_bar_detail-edit-footer-save']
          )}
        >
          保存
        </button>
      </footer>
    </>
  );
}
export default memo(Edit);
