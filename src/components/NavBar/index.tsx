import {
  createContext,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classnames from 'classnames';
import { throttle } from 'lodash-es';

import { content, contents as apps, more, recommend } from '@/common/navbar';
import styles from './index.module.scss';
import NavBarAppItem from './NavBarAppItem/NavBarAppItem';
import NavBarMoreApp from './NavBarMoreApp/NavBarMoreApp';

interface AppContextType {
  moveRecommendApp: Function;
  moveUsuallyApp: Function;
  more: content[];
  recommend: content[];
}
export const AppContext = createContext<AppContextType>({} as AppContextType);

function NavBar() {
  //每一个item的高度
  const APP_HEIGHT = 58;
  const BASE_RECOMMEND_NUM = 100;
  const navigate = useNavigate();
  const location = useLocation();
  //哪一个item被激活
  const [appActive, setAppActive] = useState(1);
  //点击更多后的弹框是否显示
  const [isShowNavBarMore, setIsShowNavBarMore] = useState(false);
  //点击更多后的弹框的top位置
  const [morePosition, setMorePostion] = useState(0);
  //需要展示的item序号
  const [showArr, setShowArr] = useState<number[]>([]);
  const [recommendApp, setRecommendApp] = useState<content[]>(recommend);
  const divEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/todo')) setAppActive(1);
    if (path.startsWith('/project')) setAppActive(2);
    if (path.startsWith('/calendar')) setAppActive(3);
    if (path.startsWith('/article')) setAppActive(4);
    if (path.startsWith('/cycle')) setAppActive(5);
  }, []);

  const handleAppActive = (id: number, path: string) => {
    setAppActive(id);
    setRecommendApp(recommend);
    navigate(path);
  };

  const handleAppMore = () => setIsShowNavBarMore(!isShowNavBarMore);

  const handlePageResize = useCallback(() => {
    if (!divEl.current) return;
    const height = Math.floor(divEl.current.getBoundingClientRect().height);
    //左侧列表能放sum个
    const sum = Math.floor(height / APP_HEIGHT);
    const set = new Set<number>();
    set.add(appActive);

    let a = Math.min(apps.length - 1, sum - 2);

    //除了选中的元素,还需要放x个
    for (let i = 1, x = 0; x < a; i++) {
      if (!set.has(i)) {
        set.add(i);
        x++;
      }
    }
    setShowArr(Array.from(set));
  }, [appActive]);

  const moveRecommendApp = (path: string, id: number) => {
    const temp = recommend.filter((ele) => ele.id !== id);
    setRecommendApp(temp);
    setAppActive(id);
    setIsShowNavBarMore(false);
    navigate(path);
  };

  const moveUsuallyApp = (path: string, id: number) => {
    const temp = showArr;
    temp.pop();
    temp.push(id);
    setShowArr(temp);
    setRecommendApp(recommend);
    setAppActive(id);
    setIsShowNavBarMore(false);
    navigate(path);
  };

  useEffect(() => {
    const a = throttle(handlePageResize, 100);
    window.addEventListener('resize', a);
    return () => window.removeEventListener('resize', a);
  });
  //点击其他选项时要重新调用
  useEffect(() => handlePageResize(), [handlePageResize]);

  return (
    <header className={styles['nav_bar']}>
      <section className={styles['nav_bar-logo']}>
        <div className={styles['nav_bar_detail-logo']}></div>
      </section>
      <section className={styles['nav_bar-apps']} ref={divEl}>
        {apps.map((ele) => (
          <NavBarAppItem
            {...ele}
            key={ele.id}
            isShow={showArr.includes(ele.id)}
            isActive={appActive === ele.id}
            handleClick={() => handleAppActive(ele.id, ele.path)}
          />
        ))}
        {appActive > BASE_RECOMMEND_NUM ? (
          <NavBarAppItem
            {...recommend.filter((ele) => ele.id === appActive)[0]}
            isShow={true}
            isActive={true}
          />
        ) : null}
        <NavBarAppItem
          {...more}
          type="more"
          isShow={true}
          isActive={isShowNavBarMore}
          handleClick={() => handleAppMore()}
          handleMorePosition={setMorePostion}
        />
      </section>
      <section className={styles['nav_bar-tools']}>
        <div className={styles['nav_bar_detail-tool']}>
          <div className={styles['nav_bar_detail-create']}></div>
        </div>
        <div
          className={classnames(
            styles['nav_bar_detail-tool'],
            styles['with-background']
          )}
        >
          <i className="next-icon next-medium">
            <svg viewBox="0 0 1024 1024">
              <path d="M283.5456 789.0944A206.2848 206.2848 0 0 0 317.44 675.328V482.304A194.7648 194.7648 0 0 1 512 287.6416a194.7648 194.7648 0 0 1 194.5088 194.56v193.024c0 40.7552 11.7248 79.9232 33.9968 113.8176H283.5456zM516.096 163.84a23.8592 23.8592 0 1 1-0.0512 47.7696 23.8592 23.8592 0 0 1 0-47.7696z m302.2336 628.9408l-23.296-32.768a146.2272 146.2272 0 0 1-27.136-84.736V482.304c0-115.456-77.824-212.48-183.296-244.1216 10.4448-14.1824 16.7936-31.488 16.7936-50.432a85.2992 85.2992 0 1 0-155.4944 48.384C337.1008 265.5744 256 364.4416 256 482.2016v193.0752c0 30.3616-9.4208 59.9552-27.0336 84.736l-23.296 32.768a36.608 36.608 0 0 0 29.7984 57.7536h174.1824A109.4656 109.4656 0 0 0 512 921.6c46.9504 0 86.6816-29.6448 102.3488-71.0656H788.48a36.4544 36.4544 0 0 0 32.4608-19.8144 36.4544 36.4544 0 0 0-2.6624-37.888z"></path>
            </svg>
          </i>
        </div>
        <div
          className={classnames(
            styles['nav_bar_detail-tool'],
            styles['with-background']
          )}
        >
          <i className="next-icon next-medium">
            <svg viewBox="0 0 1024 1024">
              <path d="M912.0256 788.7872c6.4 5.3248 9.5744 12.288 9.5744 20.7872a30.72 30.72 0 0 1-9.6256 22.4256l-79.9744 80.0256a30.72 30.72 0 0 1-22.4256 9.5744c-9.5744 0-16.4864-3.2256-20.7872-9.6256l-177.6128-175.9744c-17.0496-19.2-25.6-39.9872-25.6-62.4128 0-11.7248 2.7136-24.0128 8.0384-36.8128l-20.7872-20.7872c-54.4256 42.7008-114.688 64-180.8384 64a300.544 300.544 0 0 1-109.568-20.7872 273.2032 273.2032 0 0 1-95.232-62.4128 285.2352 285.2352 0 0 1-63.1808-94.4128A288.768 288.768 0 0 1 102.4 391.9872c0-39.424 7.168-76.544 21.6064-111.2064a287.5392 287.5392 0 0 1 63.1808-93.5936 263.3216 263.3216 0 0 1 95.232-64A298.496 298.496 0 0 1 391.168 102.4a298.496 298.496 0 0 1 108.8 20.7872c35.7376 13.8752 67.9936 35.2256 96.768 64a287.5392 287.5392 0 0 1 63.232 93.5936c14.336 34.6624 21.5552 71.7312 21.5552 111.2064 0 67.2256-21.8624 127.488-65.536 180.8384l20.736 20.7872a87.9104 87.9104 0 0 1 52.0192-6.4c17.6128 3.1744 33.3312 11.2128 47.2064 24.0128l176.0256 177.5616zM230.4 551.9872a222.72 222.72 0 0 0 75.9808 50.432c28.2624 11.1616 56.832 16.7936 85.6064 16.7936a224.8192 224.8192 0 0 0 160-67.2256 224.8192 224.8192 0 0 0 67.2256-160c0-28.7744-5.632-57.344-16.7936-85.6064A222.72 222.72 0 0 0 551.936 230.4a207.0016 207.0016 0 0 0-74.3936-50.3808 228.6592 228.6592 0 0 0-172.032 0A224.8192 224.8192 0 0 0 230.4 230.4c-22.4256 22.4256-38.912 47.7184-49.6128 75.9808a234.4448 234.4448 0 0 0 0 170.3936c10.7008 27.7504 27.2384 52.8384 49.6128 75.264z m617.6256 257.5872l-155.2384-155.136a29.7984 29.7984 0 0 0-19.2-6.4512 29.7984 29.7984 0 0 0-19.2 6.4c-4.2496 4.3008-6.4 10.7008-6.4 19.2 0 8.5504 2.1504 14.9504 6.4 19.2l155.1872 155.1872 38.4-38.4z"></path>
            </svg>
          </i>
        </div>
      </section>
      <section className={styles['nav_bar-avatar']}>
        <span
          className={styles['nav_bar_detail-avatar']}
          style={{
            backgroundImage: `url(${'https://tcs.teambition.net/thumbnail/111zca37ad0c9faba1a8d96eb7f12466f8eb/w/200/h/200'})`
          }}
        >
          <i className={styles['next-medium nav_bar_detail-avatar-icon']}>
            <svg viewBox="0 0 1024 1024">
              <path d="M215.04 419.84a92.16 92.16 0 1 1 0 184.32 92.16 92.16 0 0 1 0-184.32z m296.96 0a92.16 92.16 0 1 1 0 184.32 92.16 92.16 0 0 1 0-184.32z m296.96 0a92.16 92.16 0 1 1 0 184.32 92.16 92.16 0 0 1 0-184.32z"></path>
            </svg>
          </i>
        </span>
      </section>
      <AppContext.Provider
        value={{
          moveRecommendApp: moveRecommendApp,
          moveUsuallyApp: moveUsuallyApp,
          more: apps.filter((ele) => !showArr.includes(ele.id)),
          recommend: recommendApp
        }}
      >
        <NavBarMoreApp top={morePosition} isShow={isShowNavBarMore} />
      </AppContext.Provider>
    </header>
  );
}
export default memo(NavBar);
