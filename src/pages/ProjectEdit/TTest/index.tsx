import { memo } from 'react';
import styles from './index.module.scss';
import { Button, Tabs, TabsProps } from 'antd';
import TestList from './TestList';

function TTest() {
  const open = () => {
    window.open('/test/new');
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '全部',
      children: <TestList />
    },
    {
      key: '2',
      label: '草稿箱',
      children: <TestList type="draft" />
    }
  ];
  return (
    <div className={styles['test-wrapper']}>
      <div className={styles['test']}>
        <Tabs
          defaultActiveKey="1"
          items={items}
          tabBarExtraContent={{
            right: <Button onClick={open}>新建测试</Button>
          }}
        />
      </div>
    </div>
  );
}

export default memo(TTest);
