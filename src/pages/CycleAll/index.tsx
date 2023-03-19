import React, { memo, useState, useEffect, useMemo } from 'react';
import styles from './index.module.scss';
import subjectType from '@/utils/subjectType.json';
import subject from '@/utils/subject.json';
import { getMyCycle, joinCycle } from '@/service/cycle';
import { message, Popconfirm } from 'antd';

interface subject {
  id: string;
  name: string;
}

interface Join {
  label: string;
  value: number;
}

function CycleAll() {
  const [active, setActive] = useState(subject[0].id);
  const [myCycle, setMyCycle] = useState<Join[]>([]);
  useEffect(() => {
    fetchMyCycle();
  }, []);

  const fetchMyCycle = async () => {
    const { data } = await getMyCycle();
    setMyCycle(data);
  };

  const data = useMemo<subject[]>(() => {
    let res: subject[] = [];
    subject.forEach((item) => item.id.startsWith(active) && res.push(item));
    return res;
  }, [active]);

  const join = async (id: string) => {
    const { code } = await joinCycle(+id);
    if (code === 0) {
      message.success('加入成功');
      fetchMyCycle();
    } else {
      message.error('加入失败');
    }
  };

  return (
    <div className={styles['cycleAll-page']}>
      <div className={styles['page-content']}>
        <div className={styles['left']}>
          <div className={styles['cycle-my']}>
            <div className={styles['cycle-my-title']}>已加入</div>
            <div className={styles['item-wrapper']}>
              {myCycle?.map((v, i) => (
                <div key={i} className={styles['item']}>
                  {v.label}
                </div>
              ))}
            </div>
          </div>
          <div className={styles['cycle-all']}>
            <div className={styles['cycle-tags']}>
              {Object.entries(subjectType).map(([id, name], i) => (
                <span
                  key={i}
                  onClick={() => setActive(id)}
                  className={id === active ? styles['active'] : undefined}
                >
                  {name}
                </span>
              ))}
            </div>
            <div className={styles['item-list']}>
              {data.map((v, i) => (
                <Popconfirm
                  key={i}
                  title="确认加入吗"
                  onConfirm={() => join(v.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <div className={styles['card']} style={{ cursor: 'pointer' }}>
                    <div>{v.name}</div>
                  </div>
                </Popconfirm>
              ))}
            </div>
          </div>
        </div>
        <div className={styles['right']}></div>
      </div>
    </div>
  );
}
export default memo(CycleAll);
