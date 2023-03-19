import React, {
  memo,
  useState,
  useEffect,
  MouseEvent,
  ChangeEventHandler,
  useRef,
  CSSProperties
} from 'react';
import styles from './index.module.scss';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  Divider,
  Input,
  List,
  Row,
  Skeleton,
  Space,
  Statistic,
  Cascader,
  message
} from 'antd';
import LeftNav from './LeftNav';
import { useInfiniteScroll } from 'ahooks';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  cancelStar,
  getCycleText,
  saveStar,
  getMyCycle,
  addText,
  getCycleArticle,
  getCycleUserInfo
} from '@/service/cycle';

const IconText = ({
  icon,
  text,
  onClick,
  style
}: {
  icon: React.FC;
  text: number;
  onClick?: () => void;
  style?: CSSProperties;
}) => (
  <Space onClick={() => onClick?.()} style={style}>
    {React.createElement(icon)}
    {text}
  </Space>
);

interface sectionItem {
  textId: number;
  articleId: number;
  username: string;
  avatar: string;
  content: string;
  star: number;
  isStar: number;
  message: number;
  loading: boolean;
}
interface scroll {
  list: sectionItem[];
  total: number;
}
interface Page {
  page: number;
  pageSize: number;
}

export interface topic {
  label: string;
  value: number;
}

interface article {
  articleId: number;
  title: string;
  content: string;
  username: string;
  avatar: string;
  createTime: string;
}

interface CycleUserInfo {
  articleCount: number;
  cycleCount: number;
}

function Cycle() {
  const PAGE_SIZE = 20;
  const { TextArea } = Input;
  const [value, setValue] = useState('');
  const [cycleId, setCycleId] = useState<number|null>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [myCycle, setMyCycle] = useState([]);
  const [search, setSearch] = useSearchParams();
  const [articles, setArticles] = useState<article[]>([]);
  const [cycleUserInfo, setCycleUserInfo] = useState<CycleUserInfo>(
    {} as CycleUserInfo
  );

  useEffect(() => {
    fetchMyCycle();
    fetchArticles();
    fetchCycleUserInfo();
  }, []);
  const fetchMyCycle = async () => {
    const { data } = await getMyCycle();
    setMyCycle(data);
  };
  const fetchArticles = async () => {
    const { data } = await getCycleArticle();
    setArticles(data);
  };

  const fetchCycleUserInfo = async () => {
    const { data } = await getCycleUserInfo();
    setCycleUserInfo(data);
  };

  const { data, loading, loadMore, loadingMore, noMore, mutate } =
    useInfiniteScroll<scroll>(
      (d) => {
        const page = d ? Math.ceil(d.list.length / PAGE_SIZE) + 1 : 1;
        return onLoadMore({
          page,
          pageSize: PAGE_SIZE
        });
      },
      {
        target: scrollRef,
        isNoMore: (d) => (d ? d.total <= d.list.length : false)
      }
    );
  const onLoadMore = async (page: Page) => {
    const { data } = await getCycleText(page.page, page.pageSize);

    return {
      list: data.list,
      total: data.total
    };
  };
  const handleSubmitCycle = (c: number | null) => {
    setCycleId(c);
  };

  const handleSaveStar = async (textId: number) => {
    const { code } = await saveStar(textId);
    if (code === 0) {
      const d = data?.list.find((v) => v.textId === textId) as sectionItem;
      d.isStar = 1;
      d.star++;
      mutate({ ...data! });
    }
  };
  const handleCancelStar = async (textId: number) => {
    const { code } = await cancelStar(textId);
    if (code === 0) {
      const d = data?.list.find((v) => v.textId === textId) as sectionItem;
      d.isStar = 0;
      d.star--;
      mutate({ ...data! });
    }
  };

  const submitText = async () => {
    if (value.trim() === '') {
      message.error('请输入文字');
      return;
    }
    const { code } = await addText(cycleId, value);
    if (code === 0) {
      message.success('发布成功');
    } else {
      message.error('发布失败');
    }
  };

  return (
    <div className={styles['cycle-container']} ref={scrollRef}>
      <div className={styles['cycle-page']}>
        <LeftNav options={myCycle} changeCurCycleId={setCycleId} />
        <div className={styles['content']}>
          {search.get('key') != 'article' && (
            <div className={styles['editor']}>
              <TextArea
                showCount
                value={value}
                maxLength={100}
                style={{ height: 120, resize: 'none' }}
                onChange={(e) => setValue(e.target.value)}
                placeholder="请输入文字"
              />
              <div>
                <Cascader
                  allowClear
                  value={cycleId}
                  options={myCycle}
                  onChange={(v) =>
                    handleSubmitCycle(v?.[0] ? Number(v[0]) : null)
                  }
                  placeholder="请选择发布的圈子"
                />
              </div>
              <Button onClick={submitText}>发布</Button>
            </div>
          )}

          <div className={styles['pin-list']}>
            {search.get('key') != 'article' &&
              !loading &&
              data !== undefined && (
                <List
                  itemLayout="vertical"
                  size="large"
                  dataSource={data.list}
                  renderItem={(item, i) => (
                    // <a href={'/section/' + item.sectionId} target="_blank">
                    <List.Item
                      actions={[
                        <IconText
                          icon={LikeOutlined}
                          text={item.star ?? 0}
                          key="list-vertical-like-o"
                          onClick={() =>
                            item.isStar
                              ? handleCancelStar(item.textId)
                              : handleSaveStar(item.textId)
                          }
                          style={{
                            cursor: 'pointer',
                            color: item.isStar ? 'red' : 'inherit'
                          }}
                        />,
                        <IconText
                          icon={MessageOutlined}
                          text={item.message ?? 0}
                          key="list-vertical-message"
                          style={{ cursor: 'pointer' }}
                        />
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={item.username}
                      />
                      {item.content}
                    </List.Item>
                    // </a>
                  )}
                />
              )}
            {search.get('key') === 'article' && (
              <List
                itemLayout="vertical"
                size="large"
                dataSource={articles}
                renderItem={(item, i) => (
                  <a href={'/section/' + item.articleId} target="_blank">
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={item.username}
                      />
                      {item.title}
                    </List.Item>
                  </a>
                )}
              />
            )}
            {noMore && <Divider plain>到底了</Divider>}
          </div>
        </div>
        <div className={styles['right-bar']}>
          <div className={styles['fixed']}>
            <Row gutter={16}>
              <Col span={5}>
                <Statistic title="圈子" value={cycleUserInfo.cycleCount} />
              </Col>

              <Col span={5}>
                <Statistic title="文章" value={cycleUserInfo.articleCount} />
              </Col>
            </Row>
            <div className={styles['operate']}>
              <a href="/section/new" target="_blank">
                <Button type="primary" block>
                  写文章
                </Button>
              </a>
            </div>
            <div className={styles['recommend']}>推荐</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Cycle);
