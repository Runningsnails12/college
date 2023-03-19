import { memo, useState, useContext, useMemo } from 'react';
import { Tag, Card, Button, Popconfirm, message } from 'antd';
import dayjs from 'dayjs';
import styles from './index.module.scss';
import {
  ExclamationCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Input } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import { deleteTodoNotion } from '@/service/todo';
import { todoContext } from '../';

export interface notionApi {
  notionId: number;
  classId: number;
  title: string;
  content: string;
  expireTime: string;
}
function Notion() {
  const { myClass, todoNotionDate, fetchTodoNotion } = useContext(todoContext);
  const [list, setList] = useState<notionApi[] | null>(todoNotionDate);

  const [searchParam, setSearchParam] = useState('');

  const deleteClassNotion = async (notionId: number) => {
    const { data } = await deleteTodoNotion(notionId);
    if (data) {
      message.success('删除成功');
      fetchTodoNotion && fetchTodoNotion();
    }
  };
  const updata = useMemo(() => {
    return (
      todoNotionDate?.filter((v) => {
        const t = dayjs(v.expireTime),
          now = dayjs(new Date());
        if (now.valueOf() - t.valueOf() < 1000 * 60 * 60 * 24) {
          return v;
        }
      }).length ?? 0
    );
  }, [todoNotionDate]);

  return (
    <>
      <div className={styles.info}>
        <div className={styles['info-wrapper']}>
          <div className={styles['info-header']}>
            <span className={styles['info-header-text']}>班级公告</span>
            {updata > 0 && (
              <Tag icon={<ClockCircleOutlined />} color="error">
                今日新增公告{updata}条
              </Tag>
            )}
          </div>
          <Input
            className={styles.search}
            value={searchParam}
            onChange={(v) => setSearchParam(v)}
            placeholder="搜索"
            prefix={<IconSearch />}
          />
          <div className={styles['card-warpper-scroll']}>
            <div className={styles['card-warpper']}>
              {searchParam === ''
                ? todoNotionDate?.map((item, i) => (
                    <Card
                      title={item.title}
                      bordered={false}
                      key={i}
                      className={styles['card-item']}
                      extra={
                        myClass?.find((v) => v.value === item.classId) !==
                          undefined && (
                          <Popconfirm
                            title="准备删除"
                            description="确认删除吗？"
                            onConfirm={() => deleteClassNotion(item.notionId)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button>删除</Button>
                          </Popconfirm>
                        )
                      }
                    >
                      <div className={styles['card-content']}>
                        {item.content}
                      </div>
                      <Tag icon={<ExclamationCircleOutlined />} color="warning">
                        截止时间{' '}
                        {dayjs(item.expireTime).format('YYYY-MM-DD HH:mm:ss')}
                      </Tag>
                    </Card>
                  ))
                : todoNotionDate
                    ?.filter(
                      (v, i) =>
                        v.content.includes(searchParam) ||
                        v.title.includes(searchParam)
                    )
                    .map((item, i) => (
                      <Card
                        title={item.title}
                        bordered={false}
                        key={i}
                        className={styles['card-item']}
                        extra={
                          myClass?.find((v) => v.value === item.classId) !==
                            undefined && (
                            <Popconfirm
                              title="准备删除"
                              description="确认删除吗？"
                              onConfirm={() => deleteClassNotion(item.notionId)}
                              okText="确定"
                              cancelText="取消"
                            >
                              <Button>删除</Button>
                            </Popconfirm>
                          )
                        }
                      >
                        <div className={styles['card-content']}>
                          {item.content}
                        </div>
                        <Tag
                          icon={<ExclamationCircleOutlined />}
                          color="warning"
                        >
                          截止时间{' '}
                          {dayjs(item.expireTime).format('YYYY-MM-DD HH:mm:ss')}
                        </Tag>
                      </Card>
                    ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default memo(Notion);
