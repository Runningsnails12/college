import { ForwardRefExoticComponent, memo, RefAttributes } from 'react';
import styles from './index.module.scss';
import { Tabs } from 'antd';
import TCatalogue from './TCatalogue';
import TInformation from './TInformation';
import TArticle from './TArticle';
import TTest from './TTest';

interface ClassItem {
  title: string;
  Component: ForwardRefExoticComponent<RefAttributes<HTMLDivElement>>;
}

const data: ClassItem[] = [
  {
    title: '目录',
    Component: TCatalogue
  },
  {
    title: '资料',
    Component: TInformation
  },
  {
    title: '文章管理',
    Component: TArticle
  },
  {
    title: '测试管理',
    Component: TTest
  }
];

function ProjectEdit() {
  return (
    <div className={styles['project-edit-wrapper']}>
      <Tabs
        defaultActiveKey="0"
        centered
        style={{ height: '100%' }}
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
  );
}

export default memo(ProjectEdit);
