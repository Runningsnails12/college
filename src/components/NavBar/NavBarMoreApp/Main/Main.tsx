import classnames from 'classnames';
import { memo, useContext } from 'react';

import { content } from '@/common/navbar';
import styles from './index.module.scss';
import MoreItem from '../MoreItem/MoreItem';
import { AppContext } from '../..';

interface MainType {
  handleEditFlag: Function;
}

function Main(props: MainType) {
  const context = useContext(AppContext);

  return (
    <>
      <span className={styles['next-search-simple']}>
        <span className={styles['next-input']}>
          <span className={styles['next-input-inner']}>
            <i className={classnames('next-icon', styles['next-search'])}>
              <svg
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M937.798221 769.855766 714.895525 546.869159c23.821545-45.681412 37.589107-97.495498 37.589107-152.564721 0-182.559872-148.560524-331.078441-331.079464-331.078441-182.623317 0-331.098907 148.517545-331.098907 331.078441 0 182.559872 148.47559 331.078441 331.098907 331.078441 60.575634 0 117.27089-16.647145 166.206416-45.221948L807.552831 900.100132c17.938558 17.939581 41.551348 26.867928 65.12423 26.867928s47.182602-8.928347 65.123206-26.867928c17.396205-17.396205 27.033703-40.550555 27.033703-65.164139C964.831924 810.321386 955.194426 787.16806 937.798221 769.855766M133.027248 394.304438c0-158.989037 129.34795-288.358477 288.378943-288.358477 158.948105 0 288.3595 129.36944 288.3595 288.358477 0 99.206466-50.437739 186.899714-126.950344 238.795665-1.044796 0.416486-1.876744 1.252527-2.877537 1.835811-45.515636 30.03813-99.999528 47.727001-158.530596 47.727001C262.375198 682.662915 133.027248 553.336454 133.027248 394.304438M907.594315 869.896226c-19.273972 19.191084-50.562583 19.191084-69.836555 0L623.6995 655.797034c26.157753-20.274766 49.186236-44.305065 68.292386-71.421656l215.601406 215.683271c9.344832 9.262968 14.518668 21.694091 14.518668 34.877345S916.939147 860.551394 907.594315 869.896226"></path>
              </svg>
            </i>
          </span>
          <input placeholder="搜索应用"></input>
        </span>
      </span>
      <div className={styles['nav_bar_detail-more-main']}>
        {context.more.length ? (
          <>
            <p className={styles['nav_bar_detail-app-group-title']}>常驻</p>
            <div className={styles['nav_bar_detail-app-group']}>
              {context.more.map((ele) => (
                <MoreItem
                  item={ele}
                  key={ele.id}
                  handleClick={context.moveUsuallyApp}
                />
              ))}
            </div>
            <hr className={styles['nav_bar_detail-more-separator']} />
          </>
        ) : (
          ''
        )}
        <p className={styles['nav_bar_detail-app-group-title']}>其他</p>
        <div className={styles['nav_bar_detail-app-group']}>
          {context.recommend.map((ele) => (
            <MoreItem
              item={ele}
              key={ele.id}
              handleClick={context.moveRecommendApp}
              className={styles['nav_bar_detail-app-item_hover']}
            />
          ))}
        </div>
      </div>
      <div
        className={styles['nav_bar_detail-more-footer']}
        onClick={() => props.handleEditFlag()}
      >
        <i className="next-icon next-medium">
          <svg viewBox="0 0 1024 1024">
            <path d="M779.9808 491.1616c0-16.896 13.824-30.72 30.72-30.72 16.896 0 30.72 13.824 30.72 30.72V819.2c0 56.32-46.08 102.4-102.4 102.4H204.8c-56.32 0-102.4-46.08-102.4-102.4V284.9792c0-56.32 46.08-102.4 102.4-102.4h312.6784c16.896 0 30.72 13.824 30.72 30.72 0 16.896-13.824 30.72-30.72 30.72H204.8a41.472 41.472 0 0 0-40.96 40.96V819.2c0 22.1696 18.7904 40.96 40.96 40.96h534.2208a41.472 41.472 0 0 0 40.96-40.96V491.1616z m56.0128-372.1728l68.352 68.352a58.7776 58.7776 0 0 1 0 82.8928l-334.592 334.5408a55.808 55.808 0 0 1-26.112 14.7968l-136.8064 34.2016a30.8224 30.8224 0 0 1-37.2224-37.2736l34.1504-136.8576c2.56-9.8304 7.5776-18.7904 14.6944-26.0096l334.6432-334.6432c22.1184-22.1696 60.7744-22.1184 82.944 0z m-73.0112 77.0048l64.4096 64.4096 33.4848-33.5872-66.2528-62.4128-31.6416 31.5904zM441.344 581.8368l87.552-21.9136 255.1808-256-64.512-64.4608-257.536 257.536-20.6848 84.8384z"></path>
          </svg>
        </i>
        <span className={styles['text']}>编辑导航</span>
      </div>
    </>
  );
}

export default memo(Main);
