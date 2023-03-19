import React, {
  memo,
  useState,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import styles from './index.module.scss';
import Catalogue from './Catalogue';
import Information from './Information';
import Notion from './Notion';
import TimeTable from './TimeTable';

interface ClassItem {
  title: string;
  Component: ForwardRefExoticComponent<RefAttributes<HTMLDivElement>>;
}

const data: ClassItem[] = [
  {
    title: '目录',
    Component: Catalogue
  },
  {
    title: '资料',
    Component: Information
  },
  {
    title: '课程表',
    Component: Notion
  },
  {
    title: '公告',
    Component: TimeTable
  }
];

function Class() {
  return (
    <>
      <div className={styles['classPage']}>
        <Tabs
          defaultActiveKey="0"
          centered
          items={data.map(({ title, Component }, i) => {
            const id = String(i);
            return {
              label: title,
              key: id,
              children: <Component />
            };
          })}
        />
      </div>
    </>
  );
}

export default memo(Class);
