import { memo } from 'react';
import styles from './index.module.scss';
import { List, message } from 'antd';
import dayjs from 'dayjs';
import type { Article } from '../';


interface ListProps {
  data: Article[];
  onDelete:(article:number)=>void
}

function ArticleList(props: ListProps) {
  const { data,onDelete } = props;


  return (
    <div className={styles['article-list']}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            actions={[
              <div
                className={styles['btn']}
                onClick={() => onDelete(item.articleId)}
              >
                删除
              </div>
            ]}
          >
            <a
              href={`/section/${item.articleId}/edit`}
              target="_blank"
              className={styles['link']}
            >
              <List.Item.Meta title={item.title} />
            </a>
            <div className={styles['time']}>
              发布于 {dayjs(item.createTime).format('MM-DD HH:mm:ss')}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

export default memo(ArticleList);
