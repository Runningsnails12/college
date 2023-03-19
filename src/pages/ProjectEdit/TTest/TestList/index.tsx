import { memo, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { List, message } from 'antd';
import dayjs from 'dayjs';
import { getTestList, getTestDrafts, deleteTestById } from '@/service/test';

interface List {
  testId: number;
  title: string;
  time: string;
}
interface TestProps {
  type?: 'list' | 'draft';
}

function TTest(props: TestProps) {
  const { type = 'list' } = props;
  const [data, setData] = useState<List[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    if (type === 'list') {
      const { data: d } = await getTestList();
      setData(d);
    } else {
      const { data: d } = await getTestDrafts();
      setData(d);
    }
  };
  const handleDelete = async (testId: any) => {
    const { code } = await deleteTestById(testId);
    if (code !== 0) {
      message.error('删除失败');
      return;
    }
    message.success('删除成功');
    fetchData();
  };
  return (
    <div className={styles['test-list']}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            actions={[
              <div
                className={styles['btn']}
                onClick={() => handleDelete(item.testId)}
              >
                删除
              </div>
            ]}
          >
            <a
              href={`/test/${item.testId}/edit`}
              target="_blank"
              className={styles['link']}
            >
              <List.Item.Meta title={item.title} />
            </a>
            <div className={styles['time']}>
              发布于 {dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

export default memo(TTest);
