import React, {
  memo,
  useState,
  useEffect,
  useRef,
  createContext,
  useCallback
} from 'react';
import {
  Button,
  Drawer,
  MenuProps,
  Space,
  Tag,
  Menu,
  Card,
  Col,
  Row,
  Input,
  DatePicker,
  Switch,
  message,
  Select
} from 'antd';
import styles from './index.module.scss';
import {
  FormOutlined,
  StarOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  FileDoneOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import {
  Outlet,
  useNavigate,
  useLocation,
  useOutletContext
} from 'react-router-dom';
import { addTodoNotion, addTodoTask, getTodoNotion } from '@/service/todo';
import { getMyClass, getMyClassmate } from '@/service/class';
import { notionApi } from './Notion';

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
    '公告',
    'notion',
    null,
    [getItem('班级公告', 'a0', <ExclamationCircleOutlined />)],
    'group'
  ),
  getItem(
    '任务',
    'task',
    null,
    [
      getItem('全部', 'b0', <FormOutlined />),
      getItem('星标', 'b1', <StarOutlined />),
      getItem('今天', 'b2', <ClockCircleOutlined />),
      getItem('我发起的', 'b3', <UserOutlined />)
    ],
    'group'
  )
];

export const menuActive = createContext<string>('');
export const todoContext = createContext<todoContext>({} as todoContext);
export interface myClass {
  value: number; //id
  label: string; //name
}
interface todoContext {
  myClass: myClass[] | null;
  todoNotionDate: notionApi[] | null;
  fetchTodoNotion: Function | null;
}

type myClassmate = myClass;

function Todo() {
  const { TextArea } = Input;
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.pathname;
  const [defaultMenu, setDefaultMenu] = useState('a0');
  const [notionOpen, setnotionOpen] = useState(false);
  const [notionVal, setNotionVal] = useState({
    classId: undefined as unknown as number,
    title: '',
    content: '',
    expireTime: ''
  });
  const [taskOpen, setTaskOpen] = useState(false);
  const [taskVal, setTaskVal] = useState({
    title: '',
    content: '',
    expireTime: '',
    urgency: 0,
    classId: undefined as unknown as number,
    classmateId: [] as number[],
    isLoad: false,
    fileFormat: ''
  });
  const [myClass, setMyClass] = useState<myClass[]>([]);
  const [myClassmate, setMyClassmate] = useState<myClassmate[]>([]);
  // const [todoNotionDate, settodoNotionDate] = useState<notionApi[]>([]);
  const [todoContextObj, setTodoContextObj] = useState({
    myClass: [] as myClass[],
    todoNotionDate: [] as notionApi[],
    fetchTodoNotion
  });

  useEffect(() => {
    if (name.includes('notion')) {
      setDefaultMenu('a0');
    } else if (name.includes('task')) {
      setDefaultMenu('b0');
    }
    fetchDate();

    async function fetchDate() {
      fetchMyClass();
      fetchTodoNotion();
    }
  }, []);

  async function fetchMyClass() {
    const { data } = await getMyClass();
    setMyClass(data);
    todoContextObj.myClass = data;
    setTodoContextObj({ ...todoContextObj });
  }
  async function fetchTodoNotion() {
    const { data } = await getTodoNotion();
    // settodoNotionDate(data);
    todoContextObj.todoNotionDate = data;
    setTodoContextObj({ ...todoContextObj });
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key.includes('a') && !name.includes('notion')) {
      navigate('/todo/notion');
    } else if (key.includes('b') && !name.includes('task')) {
      navigate('/todo/task');
    }
    setDefaultMenu(key);
  };

  const submitNotion = async () => {
    for (let [k, v] of Object.entries(notionVal)) {
      if (v === '' || v === undefined) {
        message.error('请不要留空');
        return;
      }
    }
    const { code } = await addTodoNotion(notionVal);
    if (code === 0) {
      setnotionOpen(false);
      setNotionVal({
        classId: undefined as unknown as number,
        title: '',
        content: '',
        expireTime: ''
      });
      message.success('提交成功');
      fetchTodoNotion();
    } else {
      message.error('提交失败');
    }
  };
  const submitTask = async () => {
    for (let [k, v] of Object.entries(taskVal)) {
      if (v === '' || v === undefined) {
        message.error('请不要留空');
        return;
      }
    }
    const { code } = await addTodoTask(taskVal);
    if (code === 0) {
      setTaskOpen(false);
      setTaskVal({
        title: '',
        content: '',
        expireTime: '',
        urgency: 0,
        classId: undefined as unknown as number,
        classmateId: [],
        isLoad: false,
        fileFormat: ''
      });
      message.success('提交成功');
      // fetchTodoTask()
    } else {
      message.error('提交失败');
    }
  };

  const fetchClassmate = async (value: number) => {
    const { data } = await getMyClassmate(value);
    setMyClassmate(data);
  };

  return (
    <>
      <div className={styles['sidebar-wrapper']}>
        <div className={styles.header}>
          <div className={styles['app-title']}>公告和任务</div>
        </div>
        <Menu
          onClick={onClick}
          selectedKeys={[defaultMenu]}
          mode="inline"
          items={items}
          className={styles['menu']}
        />
        <div className={styles['operation']}>
          <Button onClick={() => setnotionOpen(true)}>发布公告</Button>
          <Button onClick={() => setTaskOpen(true)}>发布任务</Button>
        </div>
      </div>
      <menuActive.Provider value={defaultMenu}>
        <todoContext.Provider value={todoContextObj}>
          <Outlet />
        </todoContext.Provider>
      </menuActive.Provider>
      <Drawer
        title="发布公告"
        width={720}
        onClose={() => setnotionOpen(false)}
        open={notionOpen}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button
              onClick={() => {
                setnotionOpen(false);
                setNotionVal({
                  classId: undefined as unknown as number,
                  title: '',
                  content: '',
                  expireTime: ''
                });
              }}
            >
              取消
            </Button>
            <Button onClick={submitNotion} type="primary">
              提交
            </Button>
          </Space>
        }
      >
        <div>
          <div>请选择发布的班级</div>
          <Select
            showSearch
            placeholder="选择一个班级"
            optionFilterProp="children"
            onChange={(value: number) => {
              setNotionVal({ ...notionVal, classId: Number(value) });
            }}
            filterOption={(input: string, option: any) =>
              (option?.className ?? '').includes(input)
            }
            options={myClass}
          />
          <Input
            placeholder="标题"
            value={notionVal.title}
            onChange={(e) => {
              setNotionVal({ ...notionVal, title: e.target.value });
            }}
          />
          <TextArea
            showCount
            value={notionVal.content}
            maxLength={100}
            style={{ height: 120, resize: 'none' }}
            onChange={(e) => {
              setNotionVal({ ...notionVal, content: e.target.value });
            }}
            placeholder="请输入内容"
          />
          <DatePicker
            showTime
            onChange={(value) => {
              if (!value) return;
              setNotionVal({ ...notionVal, expireTime: value.toISOString() });
            }}
            onOk={(value) => {
              setNotionVal({ ...notionVal, expireTime: value.toISOString() });
            }}
          />
        </div>
      </Drawer>
      <Drawer
        title="发布任务"
        width={720}
        onClose={() => setTaskOpen(false)}
        open={taskOpen}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button
              onClick={() => {
                setTaskOpen(false);
                setTaskVal({
                  title: '',
                  content: '',
                  expireTime: '',
                  urgency: 0,
                  classId: undefined as unknown as number,
                  classmateId: [],
                  isLoad: false,
                  fileFormat: ''
                });
              }}
            >
              取消
            </Button>
            <Button onClick={submitTask} type="primary">
              提交
            </Button>
          </Space>
        }
      >
        <div>
          <Input
            placeholder="标题"
            value={taskVal.title}
            onChange={(e) => {
              setTaskVal({ ...taskVal, title: e.target.value });
            }}
          />
          <div className={styles.title}>参与人员</div>
          <div>
            <Select
              style={{ width: '100%' }}
              placeholder="班级选择"
              value={taskVal.classId}
              onChange={(value) => {
                if (!value) return;
                fetchClassmate(value);
                setTaskVal({ ...taskVal, classId: value });
              }}
              options={myClass}
            />
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="人员选择"
              onChange={(value: number[]) => {
                taskVal.classmateId = value;
                setTaskVal({ ...taskVal });
              }}
              options={myClassmate}
              disabled={myClassmate.length === 0}
            />
          </div>
          <div className={styles.title}>紧急程度</div>
          <Select
            value={taskVal.urgency}
            style={{ width: 120 }}
            onChange={(value) => {
              setTaskVal({ ...taskVal, urgency: value });
            }}
            options={[
              { value: 0, label: '低' },
              { value: 1, label: '普通' },
              { value: 2, label: '高' },
              { value: 3, label: '紧急' }
            ]}
          />
          <div>
            <div className={styles.title}>任务内容</div>
            <TextArea
              showCount
              value={taskVal.content}
              maxLength={100}
              style={{ height: 120, resize: 'none' }}
              onChange={(e) => {
                setTaskVal({ ...taskVal, content: e.target.value });
              }}
              placeholder="请输入内容"
            />
          </div>
          <div>
            <div className={styles.title}>截止日期</div>
            <DatePicker
              showTime
              onOk={(value) => {
                setTaskVal({ ...taskVal, expireTime: value.toISOString() });
              }}
            />
          </div>
          <div>
            <div className={styles.title}>文件</div>
            <div>
              <span>是否要上传文件</span>
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                checked={taskVal.isLoad}
                onChange={(v) => {
                  setTaskVal({ ...taskVal, isLoad: v });
                }}
              />
            </div>
          </div>
          {taskVal.isLoad && (
            <div>
              <div className={styles.title}>文件格式</div>
              <Input
                placeholder="标题"
                value={taskVal.fileFormat}
                onChange={(e) => {
                  setTaskVal({ ...taskVal, fileFormat: e.target.value });
                }}
              />
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
export default memo(Todo);
