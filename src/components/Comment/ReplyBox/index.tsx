import React, { memo, useEffect, useState } from 'react';
import styles from './index.module.scss';
import Comment from '@/components/Comment';
import { CommentApi, ReplyApi } from '../type';
import { Pagination } from 'antd';

interface ReplyBoxProps {
  data: ReplyApi | null | undefined;
  parentId:number|null
}

const SIZE = 3;
const PAGE_SIZE = 4;

function ReplyBox(props: ReplyBoxProps) {
  const { data: rawData,parentId } = props;

  const [data, setData] = useState({
    // total: rawData?.total ?? 0,
    list: [] as CommentApi[]
  });
  const [state, setState] = useState({
    isShowMore: true,
    isShowPagination: false,
    pageNum: 1,
    pageSize: PAGE_SIZE
  });
  const viewMore = () => {
    state.isShowPagination = true;
    state.isShowMore = false;
    setState({ ...state });
    data.list = rawData!.list.slice(0, PAGE_SIZE);
    setData({ list: data.list });
  };

  const pageChange = (page: number) => {
    data.list = rawData!.list.slice(PAGE_SIZE * (page - 1), PAGE_SIZE * page);
    setData({ list: data.list });
    state.pageNum = page;
    setState({ ...state });
  };

  useEffect(() => {
    if (rawData) {
      setData({
        // total: data.total,
        list: rawData.list.slice(0, SIZE)
      });
    }
  }, []);

  return (
    <>
      {!rawData || rawData.total == 0 ? null : (
        <div>
          <div>
            {data.list.map((v) => (
              <Comment comment={v} key={v.id} parentId={parentId} type="reply"></Comment>
            ))}
          </div>

          <div
            className={styles['view-more']}
            style={{
              display:
                rawData.total > SIZE && state.isShowMore ? 'block' : 'none'
            }}
          >
            <span>共{rawData.total}条回复，</span>
            <span className={styles['view-more-btn']} onClick={viewMore}>
              点击查看
            </span>
          </div>

          {state.isShowPagination ? (
            <Pagination
              current={state.pageNum}
              pageSize={state.pageSize}
              total={rawData.total}
              size="small"
              hideOnSinglePage={true}
              onChange={pageChange}
            />
          ) : null}
        </div>
      )}
    </>
  );
}

export default memo(ReplyBox);
