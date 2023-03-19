import React, { ChangeEvent, memo, useEffect, useState } from 'react';
import styles from './index.module.scss';
import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  TabsProps,
  Tag,
  TimePicker,
  Typography,
  Upload,
  message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { useNavigate, useParams } from 'react-router-dom';
import { getCatalogue } from '@/service/project';
import dayjs from 'dayjs';
import { RangePickerProps } from 'antd/es/date-picker';
import { InboxOutlined } from '@ant-design/icons';
import ArticleList from './ArticleList';
import { getMyArticle, deleteArticle } from '@/service/article';

export interface Article {
  articleId: number;
  userId: number;
  title: string;
  createTime: string;
  lastModifyTime: string;
  isPublic: number;
  isFinish: number;
}
function TArticle() {
  const [data, setData] = useState<Article[]>([]);
  useEffect(() => {
    fetchArticle();
  }, []);
  const fetchArticle = async () => {
    const { data } = await getMyArticle();
    setData(data);
  };
  const onChange = (key: string) => {
    console.log(key);
  };
  const open = () => {
    window.open('/section/new');
  };

  const removeArticle = async (articleId: number) => {
    const { code } = await deleteArticle(articleId);
    if (code != 0) {
      message.error('删除失败');
      return;
    }
    fetchArticle();
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '全部',
      children: (
        <ArticleList
          data={data.filter((v) => v.isFinish === 1)}
          onDelete={(id) => removeArticle(id)}
        />
      )
    },
    {
      key: '2',
      label: '草稿箱',
      children: (
        <ArticleList
          data={data.filter((v) => v.isFinish === 0)}
          onDelete={(id) => removeArticle(id)}
        />
      )
    }
  ];
  return (
    <div className={styles['article-wrapper']}>
      <div className={styles['article']}>
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
          tabBarExtraContent={{
            right: <Button onClick={open}>新建文章</Button>
          }}
        />
      </div>
    </div>
  );
}

export default memo(TArticle);
