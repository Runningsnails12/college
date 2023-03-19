import { memo, useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Avatar,
  Button,
  Drawer,
  DrawerProps,
  message,
  RadioChangeEvent,
  Space,
  Switch,
  Tag,
  Tooltip,
  Upload,
  UploadProps
} from 'antd';
import {
  BookOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  FireOutlined,
  RestOutlined,
  StarOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { Input } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import styles from './index.module.scss';
import {
  addTodoTaskComment,
  getTodoTaskComment,
  getTodoTask,
  updateTodoTaskState,
  addTaskUploadList
} from '@/service/todo';
import { menuActive } from '../';
import dayjs from 'dayjs';
import { isToday } from '@/utils/dayTools';
import useStore from '@/store';
import { useUpdateEffect } from 'ahooks';
import { getFileToken } from '@/service/file';

interface TaskApi {
  taskId: number;
  title: string;
  content: string;
  urgency: number;
  star: number;
  isFinished: number;
  createPeopleId: number;
  member: string[];
  createTime: string;
  expireTime: string;
  finishTime: string;
  taskType: number; //'upload' 0    | 'text' 1
  submittedPeopleNum: number;
  totalPeopleNum: number;
  upload: Upload[];
}

interface Upload {
  taskId: number;
  userId: number;
  rawName: string;
  fileName: string;
  formatName: string;
  url: string;
  createTime: string;
}

interface TaskState {
  total: number;
  list: stateList[];
}

interface stateList {
  type: number; // 'finish' 0    | 'comment'  1
  taskId: string;
  userId: string;
  username: string;
  avator: string;
  content: string;
  time: string;
}

function Task() {
  const [list, setList] = useState<TaskApi[]>([]);
  const [rawList, setRawList] = useState<TaskApi[]>([]);
  const { UserStore } = useStore();
  const activeMenu = useContext(menuActive);
  const [willExpireNum, setWillExpireNum] = useState(0);
  const [activeItem, setActiveItem] = useState<TaskApi>(rawList[0]);
  const [open, setOpen] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const [activeItemState, setActiveItemState] = useState<TaskState>(
    {} as TaskState
  );

  const [OSS, setOSS] = useState('');
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    async function a() {
      const { data } = await getTodoTask();
      setList(data);
      setRawList(data);
      computeWillExpireNum(data);
      fetchOSS();
    }
    a();
  }, []);

  const fetchOSS = async () => {
    const { data: token } = await getFileToken();
    setOSS(token);
  };

  useUpdateEffect(() => {
    fetchStateData(activeItem.taskId);
  }, [activeItem]);

  async function fetchStateData(taskId: number) {
    if (!taskId) return;
    const { data } = await getTodoTaskComment(taskId);
    setActiveItemState(data);
  }

  const props: UploadProps = {
    action: 'http://up-z2.qiniup.com',
    onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
        console.log(file, fileList);
      }
    },
    fileList: fileList,
    customRequest({ action, data, file }) {
      //@ts-ignore
      const filename = file.name;
      //@ts-ignore
      const newFileName = filename + '@' + (crypto.randomUUID() ?? Date.now());
      setFileList([
        ...fileList,
        {
          uid: newFileName,
          name: filename,
          url: '',
          percent: 99
        }
      ]);

      const formdata = new FormData();
      formdata.append('token', OSS);
      formdata.append('key', newFileName);
      formdata.append('file', file);
      fetch('http://up-z2.qiniup.com', {
        method: 'POST',
        body: formdata
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.error) {
            message.error('上传失败');
          } else {
            setFileList([
              ...fileList,
              {
                uid: newFileName,
                name: filename,
                status: 'done',
                url: json.key
              }
            ]);
            addTaskUploadList({
              taskId: activeItem.taskId,
              rawName: filename,
              fileName: newFileName,
              url: json.key
            }).then(({ code }) => {
              if (code !== 0) {
                message.error('上传失败');
              }
            });
          }
        });
    }
  };

  const onSearch = (string?: string) => {
    let newList;
    if (string) {
      newList = list.filter((item) => item.content.includes(string));
    } else {
      newList = list;
    }
    setList(newList);
  };
  const changeUrgency = (s: number) => {
    if (s == 0) return '低';
    if (s == 1) return '普通';
    if (s == 2) return '高';
    if (s == 3) return '紧急';
  };

  useEffect(() => {
    if (activeMenu == 'b0') {
      setList(rawList);
    } else if (activeMenu == 'b1') {
      setList(rawList.filter((v) => v.star === 1));
    } else if (activeMenu == 'b2') {
      setList(rawList.filter((v) => isToday(v.expireTime)));
    } else if (activeMenu == 'b3') {
      setList(rawList.filter((v) => v.createPeopleId === UserStore.user.id));
    }
  }, [activeMenu]);

  const computeWillExpireNum = (arr: TaskApi[]) => {
    let res = 0;
    for (let x of arr) {
      if (isToday(x.expireTime)) res++;
    }
    setWillExpireNum(res);
  };

  const computerTime = (s: string) => {
    const expire = new Date(s);
    const now = new Date();
    const narrow = expire.getDate() - now.getDate();
    const day = dayjs(expire);
    if (narrow == 0) return day.format('今天 HH:mm');
    if (narrow == 1) return day.format('明天 HH:mm');
    return day.format('YYYY-MM-DD');
  };

  const itemClick = (id: number) => {
    const item = rawList.find((v) => v.taskId === id) as TaskApi;
    setActiveItem(item);
    setOpen(true);
    const uploadData = item.upload.map((v) => {
      return {
        uid: v.fileName,
        name: v.rawName,
        status: 'done',
        url: v.url
      };
    });
    setFileList(uploadData);
  };

  const onClose = () => {
    setOpen(false);
  };

  const submitComment = async () => {
    const { code } = await addTodoTaskComment({
      content: commentValue,
      taskId: activeItem.taskId
    });
    if (code === 0) {
      fetchStateData(activeItem.taskId);
    }
  };

  const toggleFinishState = async (v: boolean, taskId: number) => {
    const { code } = await updateTodoTaskState({
      state: v === true ? 1 : 0,
      taskId
    });
  };

  return (
    <>
      <div className={styles.task}>
        <div className={styles['task-wrapper']}>
          <div className={styles['info-header']}>
            <span className={styles['info-header-text']}>我的任务</span>
            {willExpireNum && (
              <Tag icon={<ClockCircleOutlined />} color="error">
                {willExpireNum}项即将到期
              </Tag>
            )}
          </div>
          <Input
            className={styles.search}
            onCompositionEnd={(v) =>
              onSearch((v.target as HTMLInputElement).value)
            }
            onChange={(v) => (!v ? onSearch() : null)}
            placeholder="搜索"
            prefix={<IconSearch />}
          />
          <div className={styles['task-content']}>
            {list.length > 0 ? (
              list.map((v) => (
                <div
                  className={styles['task-item']}
                  key={v.taskId}
                  onClick={() => {
                    itemClick(v.taskId);
                    // fetchStateData(v.taskId);
                  }}
                >
                  <div>
                    <div className={styles['task-title']}>{v.title}</div>
                    <div className={styles['task-info']}>
                      <span className={styles['task-priority']}>
                        <FireOutlined />
                        <span>{changeUrgency(v.urgency)}</span>
                      </span>
                      <span className={styles['task-expire']}>
                        <BookOutlined />
                        <span>{computerTime(v.expireTime)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>没有东西</div>
            )}
          </div>
        </div>
      </div>
      {activeItem && (
        <Drawer
          title="任务详情"
          placement="right"
          width={700}
          onClose={onClose}
          open={open}
          mask={false}
          keyboard={false}
          destroyOnClose={true}
          className={styles['drawer']}
          extra={
            <div className={styles['top-bar']}>
              <Tooltip title="收藏">
                <StarOutlined />
              </Tooltip>
              <Tooltip title="删除">
                <RestOutlined />
              </Tooltip>
              <Switch
                checkedChildren="完成"
                unCheckedChildren="未完成"
                checked={activeItem.finishTime === null ? false : true}
                onChange={(value) =>
                  toggleFinishState(value, activeItem.taskId)
                }
              />
            </div>
          }
          footer={
            <div className={styles['drawer-footer']}>
              <Input
                placeholder="请输入评论"
                value={commentValue}
                onChange={(value) => setCommentValue(value)}
              />
              <Button onClick={submitComment}>发送</Button>
            </div>
          }
        >
          <div className={styles['drawer-wrapper']}>
            <div className={styles['drawer-operation']}>
              {activeItem.finishTime && (
                <div className={styles['drawer-btn']}>
                  <span className={styles['drawer-btn-text']}>
                    该任务于{' '}
                    {dayjs(activeItem.finishTime).format('YYYY-MM-DD HH:mm:ss')}{' '}
                    被完成
                  </span>
                </div>
              )}
              <div className={styles['drawer-btn']}>
                <span className={styles['drawer-btn-text']}>
                  {dayjs(activeItem.expireTime).format('YYYY-MM-DD HH:mm:ss')}{' '}
                  截止
                </span>
              </div>
              <div className={styles['drawer-btn']}>
                <span className={styles['drawer-btn-text']}>
                  {activeItem.submittedPeopleNum}/{activeItem.totalPeopleNum}
                  &nbsp;人已交
                </span>
              </div>
            </div>
            <div className={styles['drawer-title']}>{activeItem.title}</div>
            <div className={styles['drawer-content']}>{activeItem.content}</div>
            {activeItem.taskType === 1 ? (
              <div className={styles['state']}>
                <div className={styles['state-title']}>任务上传</div>
                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </div>
            ) : null}
            <div className={styles['state']}>
              <div className={styles['state-title']}>
                状态 · {activeItemState.total}
              </div>
              <div className={styles['state-list']}>
                {activeItemState?.list?.map((item, i) => {
                  if (item.type === 0) {
                    return (
                      <div className={styles['list-item']} key={i}>
                        <div className={styles['list-item-left']}>
                          <CheckCircleOutlined />
                        </div>
                        <div className={styles['list-item-main']}>
                          <div className={styles['list-item-right']}>
                            <span>{item.username} 完成了任务</span>
                            <span>
                              {' '}
                              {dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (item.type === 1) {
                    return (
                      <div className={styles['list-item']} key={i}>
                        <div className={styles['list-item-left']}>
                          <Avatar src={item.avator} size={24} />
                        </div>
                        <div className={styles['list-item-main']}>
                          <div className={styles['list-item-right']}>
                            <span className={styles['list-item-right-title']}>
                              {item.username}
                            </span>
                            <span>
                              {dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}
                            </span>
                          </div>
                          <div className={styles['list-item-content']}>
                            <span>{item.content}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </>
  );
}

export default observer(Task);
