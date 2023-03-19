import CommentBox from '@/components/Comment/CommentBox';
import { CommentApi } from '@/components/Comment/type';
import { MessageOutlined, StarOutlined, LikeOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React, {
  CSSProperties,
  ForwardedRef,
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import styles from './index.module.scss';
import datas from './data.json';
import ReplyBox from '@/components/Comment/ReplyBox';
import useClickOutside from '@/utils/hooks';
import { getSectionLineInfo } from '@/service/sectionLine';
import dayjs from 'dayjs';

export interface NoteProps {
  comment: any;
  // comment: CommentApi;
  cb?: Function;
  style?: CSSProperties;
  className?: string;
}

interface LineInfo {
  createTime: string;
  username: string;
  avatar: string;
  star: number;
  likes: number;
}

function Note(props: NoteProps) {
  const { comment, style, cb } = props;
  const noteRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<LineInfo>({} as LineInfo);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await getSectionLineInfo(comment.id);
    setData(data);
  };

  useClickOutside(noteRef, (e: MouseEvent) => {
    cb && cb();
  });

  return (
    <div className={styles['note-warpper']} style={style} ref={noteRef}>
      <div className={styles['note']}>
        <div className={styles['content']}>{comment.text}</div>
        <div className={styles['info']}>
          <div className={styles['author']}>
            <Avatar src={data.avatar} />
            <div className={styles['avatar-name']}>贾铭</div>
            <div>
              写于{dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </div>
          <div className={styles['operation']}>
            {/* <div>
              <MessageOutlined />
              <span className={styles['count']}>1</span>
            </div> */}
            <div>
              <StarOutlined />
              <span className={styles['count']}>{data.star ?? 0}</span>
            </div>
            <div>
              <LikeOutlined />
              <span className={styles['count']}>{data.likes ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default memo(Note);
