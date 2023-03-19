import React, { ChangeEvent, memo, useEffect, useState, useMemo } from 'react';
import styles from './index.module.scss';
import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  TimePicker,
  Typography,
  Upload,
  Cascader
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { useNavigate, useParams } from 'react-router-dom';
import { addCatalogue, getCatalogue, updateCatalogue } from '@/service/project';
import dayjs from 'dayjs';
import { RangePickerProps } from 'antd/es/date-picker';
import { InboxOutlined } from '@ant-design/icons';
import ChooseType from './ChooseType';

export interface Item {
  parentId: number;
  sectionId: number;
  classId: number;
  title: string;
  type: 'video' | 'txt' | 'test' | null;
  isClosed: number;
  priority: 'low' | 'common' | 'high';
  expireTime: string;
  remark: string;
  articleId?: number;
  testId?: number;
  videoId?: number;
  children?: Item[];
}
const tagsData = [
  {
    title: '视频',
    key: 'video'
  },
  {
    title: '文本',
    key: 'txt'
  },
  {
    title: '测试',
    key: 'test'
  }
];
const priority = [
  {
    title: '高级',
    key: 'high'
  },
  {
    title: '普通',
    key: 'common'
  },
  {
    title: '低级',
    key: 'low'
  }
];

function TCatalogue() {
  const [data, setData] = useState<Item[]>([]);
  const [editingKey, setEditingKey] = useState('');
  const params = useParams();
  const { TextArea } = Input;
  const [apiType, setApiType] = useState('add');
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data } = await getCatalogue(params.id!);
    setData(data);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: ColumnsType<Item> = [
    {
      title: '名称',
      dataIndex: 'title',
      width: 250
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
      render: (_, record) => {
        let t = '';
        if (record.type == 'video') t = '视频';
        if (record.type == 'txt') t = '文本';
        if (record.type == 'test') t = '测验';
        return t === '' ? '-' : <Tag color="success">{t}</Tag>;
      }
    },
    {
      title: '截止日期',
      dataIndex: 'expireTime',
      width: 160,
      render: (_, record) => {
        return dayjs(record.expireTime).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      title: '开放状态',
      dataIndex: 'state',
      width: 120,
      render: (_, record) => (
        <div>
          {record.isClosed === 1 ? (
            <Tag color="error">关闭</Tag>
          ) : (
            <Tag color="success">开放</Tag>
          )}
        </div>
      )
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true
    },
    {
      title: '操作',
      dataIndex: 'tags',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <div
            onClick={() => {
              let d;
              for (let i = 0; i < data.length; i++) {
                let flag = false;
                if (data[i].sectionId === record.sectionId) {
                  d = Object.assign({}, data[i]);
                  break;
                }
                if (data[i].children) {
                  const t = data[i].children as Item[];
                  for (let j = 0; j < t.length; j++) {
                    if (t[j].sectionId === record.sectionId) {
                      d = Object.assign({}, t[j]);
                      flag = true;
                    }
                  }
                }
                if (flag) break;
              }
              if (!d) return;
              showModal();
              setItem(d);
              setApiType('update');
            }}
            style={{ cursor: 'pointer' }}
          >
            修改
          </div>
          <div>删除</div>
        </Space>
      )
    }
  ];

  const [item, setItem] = useState<Item>({
    parentId: null as unknown as number,
    sectionId: null as unknown as number,
    classId: Number(params.id),
    title: '',
    isClosed: 0,
    type: null,
    priority: 'common',
    expireTime: new Date().toISOString(),
    remark: ''
  });
  const clearItem = () => {
    setItem({
      parentId: null as unknown as number,
      sectionId: null as unknown as number,
      classId: Number(params.id),
      title: '',
      isClosed: 0,
      type: null,
      priority: 'common',
      expireTime: new Date().toISOString(),
      remark: ''
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (apiType === 'update') {
      const clone = Object.assign({}, item);
      if (clone.children) delete clone.children;
      const { code } = await updateCatalogue(clone);
      if (code === 0) {
        message.success('修改成功');
        setIsModalOpen(false);
        clearItem();
      } else {
        message.success('修改失败');
        return;
      }
    } else {
      const { code } = await addCatalogue(item);
      if (code === 0) {
        message.success('添加成功');
      } else {
        message.error('添加失败');
        return;
      }
    }
    fetchData();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const options = useMemo(() => {
    const res = [] as { label: string; value: number }[];
    data.forEach((d) => {
      res.push({
        label: d.title,
        value: d.sectionId
      });
    });
    return res;
  }, [data]);
  return (
    <div className={styles['project-edit-wrapper']}>
      <div className={styles['project-edit']}>
        <Button
          onClick={() => {
            showModal();
            clearItem();
            setApiType('add');
          }}
        >
          新建章节
        </Button>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.sectionId}
        />
      </div>
      <Modal
        title={apiType === 'add' ? '章节添加' : '章节编辑'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="取消"
        okText="确定"
        width={800}
      >
        <div className={styles['operate']}>
          {apiType === 'add' && (
            <div className={styles['operate-item']}>
              <span className={styles['item-left']}>章节</span>
              <div className={styles['item-right']}>
                <Cascader
                  options={options}
                  onChange={(value) => {
                    item.parentId = value[0] as unknown as number;
                    setItem({ ...item });
                  }}
                  placeholder="请选择二级章节"
                />
                <span>默认是一级章节</span>
              </div>
            </div>
          )}
          <div className={styles['operate-item']}>
            <span className={styles['item-left']}>标题</span>
            <div className={styles['item-right']}>
              <Input
                placeholder="请输入标题"
                value={item.title}
                onChange={(e) => {
                  item.title = e.target.value;
                  setItem({ ...item });
                }}
              />
            </div>
          </div>
          <div className={styles['operate-item']}>
            <span className={styles['item-left']}>开放状态</span>
            <div className={styles['item-right']}>
              <Switch
                checked={item.isClosed === 1 ? false : true}
                checkedChildren="开放"
                unCheckedChildren="不开放"
                defaultChecked
                onChange={(checked) => {
                  item.isClosed = Number(!checked);
                  setItem({ ...item });
                }}
              />
            </div>
          </div>
          <div className={styles['operate-item']}>
            <span className={styles['item-left']}>类型</span>
            <div className={styles['item-right']}>
              <Radio.Group
                defaultValue="video"
                size="small"
                value={item.type}
                onChange={(e) => {
                  item.type = e.target.value;
                  setItem({ ...item });
                }}
                disabled={item.parentId === null}
              >
                {tagsData.map((tag) => (
                  <Radio.Button value={tag.key} key={tag.key}>
                    {tag.title}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </div>
          <ChooseType
            item={item}
            type={item.type!}
            style={{ display: item.parentId === null ? 'none' : 'block' }}
            onChange={(v: number) => {
              if (item.type === 'txt') {
                item.articleId = v;
              } else if (item.type === 'test') {
                item.testId = v;
              } else {
                item.videoId = v;
              }
              setItem({ ...item });
            }}
          />
          <div className={styles['operate-item']}>
            <span className={styles['item-left']}>优先级</span>
            <div className={styles['item-right']}>
              <Radio.Group
                defaultValue="common"
                size="small"
                value={item.priority}
                onChange={(e) => {
                  item.priority = e.target.value;
                  setItem({ ...item });
                }}
                disabled={item.parentId === null}
              >
                {priority.map((tag) => (
                  <Radio.Button value={tag.key} key={tag.key}>
                    {tag.title}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </div>
          <div className={styles['operate-item']}>
            <span className={styles['item-left']}>截止日期</span>
            <div className={styles['item-right']}>
              <DatePicker
                showTime
                defaultValue={dayjs(item.expireTime)}
                onChange={(value) => {
                  if (!value) return;
                  item.expireTime = value.toISOString();
                  setItem({ ...item });
                }}
                disabled={item.parentId === null}
              />
            </div>
          </div>
          <div className={styles['operate-item']}>
            <span className={styles['item-left']}>备注</span>
            <div className={styles['item-right']}>
              <TextArea
                value={item.remark}
                onChange={(e) => {
                  item.remark = e.target.value;
                  setItem({ ...item });
                }}
                placeholder="请输入文字"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(TCatalogue);
