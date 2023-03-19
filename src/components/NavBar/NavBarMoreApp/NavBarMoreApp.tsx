import classnames from 'classnames';
import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';

import styles from './index.module.scss';
import { Copy } from '@/utils/typeTool';
import Loading from '@/components/Loading/Loading';
import { content } from '@/common/navbar';

const Main = lazy(() => import('./Main/Main'));
const Edit = lazy(() => import('./Edit/Edit'));

interface NavBarMoreAppType {
  top: number;
  isShow: boolean;
  // more: content[]
  // recommend: content[]
}

enum moreAppIdx {
  MAIN = 1,
  EDIT = 2
}
const FIRST_MORE_APP_HEIGHT = 314;

function NavBarMoreApp(props: NavBarMoreAppType) {
  const moreAppEl = useRef<HTMLDivElement>(null);
  const [moreHeight, setMoreHeight] = useState<number>(238);
  const [editFlag, setEditFlag] = useState<boolean>(false);
  const [active, setActive] = useState<number>(1);

  const handleMoreHeight = useCallback(() => {
    if (!moreAppEl.current || (props.isShow === false && props.top === 0))
      return;
    const bound = moreAppEl.current.getBoundingClientRect();
    const a = props.top - (bound.height || FIRST_MORE_APP_HEIGHT) / 2;
    setMoreHeight(Math.floor(a));
  }, [props.top, props.isShow]);

  useEffect(() => handleMoreHeight(), [handleMoreHeight]);

  const handleEditFlag = () => {
    setEditFlag(true);
    setActive(moreAppIdx.EDIT);
  };

  return (
    <div
      style={{
        top: `${moreHeight}px`,
        left: '90px',
        display: props.isShow ? 'flex' : 'none'
      }}
      className={classnames(styles['next-overlay-inner'])}
      ref={moreAppEl}
    >
      <Suspense fallback={<Loading />}>
        <div
          className={styles['nav_bar_detail-more']}
          style={{ display: active === moreAppIdx.MAIN ? 'flex' : 'none' }}
        >
          <Main {...props} handleEditFlag={handleEditFlag} />
        </div>
        <div
          className={styles['nav_bar_detail-more']}
          style={{
            display: active === moreAppIdx.EDIT ? 'flex' : 'none',
            width: '320px'
          }}
        >
          {editFlag ? <Edit /> : null}
        </div>
      </Suspense>
    </div>
  );
}
export default memo(NavBarMoreApp);
