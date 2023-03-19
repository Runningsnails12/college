import React, { memo, useState } from 'react';
import {
  Menu,
  MenuProps,
  Card,
  Badge,
  Tag,
  Table,
  Space,
  Button,
  Input,
  Modal,
  message
} from 'antd';
import Todostyles from '../Todo/index.module.scss';
import styles from './index.module.scss';
import { DesktopOutlined, FunnelPlotOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useMount } from 'ahooks';
import { joinClass, getMyClassInfo } from '@/service/class';
import dayjs from 'dayjs';

type MenuItem = Required<MenuProps>['items'][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem(
    '',
    'project',
    null,
    [
      getItem(
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>我上的课</span>
          {/* <Badge style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }} count="5" /> */}
        </div>,
        'a0',
        <DesktopOutlined />
      ),
      getItem('我教的课', 'a1', <FunnelPlotOutlined />)
    ],
    'group'
  )
];
interface DataType {
  key: string;
  classId: number;
  className: string;
  createTime: string;
  studentNum: number;
  code: string;
  tags: string[]; //课程状态
  hasNewTask: boolean;
  imgUrl: string;
  school: string;
  teacherName: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '课程名',
    dataIndex: 'className',
    key: 'className'
    // render: (text) => <a>{text}</a>
  },
  { title: '课程码', dataIndex: 'code', key: 'code' },
  {
    title: '学生人数',
    dataIndex: 'studentNum',
    key: 'studentNum'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (v) => dayjs(v).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '状态',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags?.map((tag) => {
          return (
            <Tag color="red" key={tag}>
              {tag}
            </Tag>
          );
        })}
      </>
    )
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a href="/t/live" target="_blank">
          开始直播
        </a>
        <a href={'/project/edit/' + record.key} target="_blank">
          修改
        </a>
        <a>删除</a>

      </Space>
    )
  }
];

function Project() {
  const [defaultMenu, setDefaultMenu] = useState('a0');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [classInfoData, setClassInfoData] = useState<DataType[]>([]);
  useMount(() => {
    fetchData();
  });

  async function fetchData() {
    const { data } = await getMyClassInfo();
    const d = (data as DataType[]).map((v) => {
      v.key = String(v.classId);
      return v;
    });
    setClassInfoData(d);
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    setDefaultMenu(key);
  };
  const addClass = async () => {
    if (!classCode) return;
    const { code, msg } = await joinClass(classCode);
    if (code === 0) {
      message.success('加入成功');
      fetchData();
    } else message.error(msg);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={Todostyles['sidebar-wrapper']}>
        <div className={Todostyles.header}>
          <div className={Todostyles['app-title']}>我的课程</div>
        </div>
        <Menu
          onClick={onClick}
          selectedKeys={[defaultMenu]}
          mode="inline"
          items={items}
          className={Todostyles['menu']}
        />
        <Button>创建课程</Button>
        <Button onClick={() => setIsModalOpen(true)}>加入课程</Button>
      </div>
      <div className={styles['project']}>
        {defaultMenu == 'a0' ? (
          <div className={styles['project-wrapper']}>
            <div className={styles['title']}>我的课程</div>
            <div className={styles['content']}>
              {classInfoData.map((v, i) => (
                <a href={'/project/' + v.classId} target="_blank" key={i}>
                  <div className={styles['project-item']}>
                    <Badge.Ribbon text="有新任务" color="red">
                      <Card cover={<img alt={v.className} src={v.imgUrl} />}>
                        <div className={styles['project-info']}>
                          <div className={styles['project-content']}>
                            <div className={styles['project-title']}>
                              {v.className}
                            </div>
                            <div className={styles['project-school']}>
                              {v.school}
                            </div>
                            <div className={styles['project-teacher']}>
                              {v.teacherName}
                            </div>
                          </div>
                          <div className={styles['project-extra']}>
                            {v.tags?.map((tag, ii) => (
                              <Tag key={ii}>{tag}</Tag>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </Badge.Ribbon>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles['project-wrapper']}>
            <Table columns={columns} dataSource={classInfoData} />;
          </div>
        )}
      </div>
      <Modal
        title="加入课程"
        open={isModalOpen}
        onOk={addClass}
        onCancel={() => {
          setClassCode('');
          setIsModalOpen(false);
        }}
      >
        <Input
          placeholder="请输入课程码"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
        />
      </Modal>
    </>
  );
}

export default memo(Project);
