import {
  BankOutlined,
  CopyOutlined,
  GlobalOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import React, {
  memo,
  useState,
  useEffect,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
import styles from './index.module.scss';
import cn from 'classnames';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import useUrlState from '@ahooksjs/use-url-state';
import type { topic } from '../';

interface nav {
  name: string;
  id: number;
  param: string;
  icon: React.ReactElement;
}
const leftNav: nav[] = [
  {
    name: '最新',
    id: 0,
    param: 'new',
    icon: <HistoryOutlined />
  },
  {
    name: '文章',
    id: 1,
    param: 'article',
    icon: <CopyOutlined />
  },
  {
    name: '我的圈子',
    id: 2,
    param: 'circle',
    icon: <GlobalOutlined />
  }
];
interface NavProps {
  options: topic[];
  changeCurCycleId: Function;
}

function LeftNav(props: NavProps) {
  const { options: data, changeCurCycleId } = props;
  const params = useParams();
  const location = useLocation();

  const [active, setActive] = useState(-1);
  const [secondActive, setSecondActive] = useState(-1);

  const [state, setState] = useUrlState({ key: '' });

  useEffect(() => {
    let a = 0;
    leftNav.forEach((v, i) => state.key === v.param && (a = i));
    setActive(a);
  }, []);

  const handleActive = (first: number, second: number) => {
    if (first === 2 && second === -1) {
      handleActive(first, 0);
      return;
    }
    let param = '';
    leftNav.forEach((v) => v.id === first && (param = v.param));
    setActive(first);

    setState({ key: param });
    setSecondActive(second);
  };
  return (
    <div className={styles['left-bar']}>
      <div className={styles['dock-nav']}>
        {leftNav.map(({ name, icon }, i) => (
          <div className={styles['item']} key={i}>
            <div
              className={cn(styles['title'], {
                [styles['active']]: active === i && secondActive === -1
              })}
              onClick={() => handleActive(i, -1)}
            >
              {icon}
              {name}
            </div>
            <div className={styles['topic_list']}>
              {name === '我的圈子' &&
                data.map((item, second_i) => (
                  <div
                    className={cn(styles['topic'], {
                      [styles['active']]:
                        active === i && secondActive === second_i
                    })}
                    key={item.value}
                    onClick={() => {
                      changeCurCycleId(item.value);
                      handleActive(i, second_i);
                    }}
                  >
                    {item.label}
                  </div>
                ))}
            </div>
          </div>
        ))}
        <div className={styles['item']}>
          <a href="/cycle/all" className={styles['title']}>
            <BankOutlined />
            圈子广场
          </a>
        </div>
      </div>
    </div>
  );
}
export default memo(LeftNav);
