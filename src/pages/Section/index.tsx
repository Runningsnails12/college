import {
  createContext,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import styles from './index.module.scss';
import { FloatButton, Button, Input, MenuProps, Modal, message } from 'antd';
import { Menu } from 'antd';
import Vditor from 'vditor';
import CanvasHighlighter from 'canvas-highlighter';
import CommentInput from '@/components/Comment/CommentInput';
import CommentBox from '@/components/Comment/CommentBox';
import useClickOutside from '@/utils/hooks';
import { useUpdateEffect } from 'ahooks';

import Note from './Note';
import datas from './data.json';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllSection } from '@/service/section';
import {
  getArticleByArticleId,
  getArticleBySectionId
} from '@/service/article';
import { addComment, getAllComment } from '@/service/comment';
import { CommentApi } from '@/components/Comment/type';
import useStore from '@/store';
import { observer } from 'mobx-react-lite';
import { addSectionLine, getAllSectionLine } from '@/service/sectionLine';

const { TextArea } = Input;

interface Item {
  key: number;
  label: string;
  children?: Item[];
}
interface CommentContextType {
  onSubmit: (
    parentId: number | null,
    comment: string,
    replyUserId: number | null
  ) => void;
  avatar: string;
}
export const CommentContext = createContext<CommentContextType>(
  {} as CommentContextType
);
function Section() {
  const { UserStore } = useStore();
  const params = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [article, setArticle] = useState('');
  const [commentData, setCommentData] = useState<CommentApi[]>([]);

  const [noteTop, setNoteTop] = useState(0);
  const data = useRef<any>({
    active: '',
    highlighter: null,
    range: null
  });
  const [style, setStyle] = useState({
    top: '0',
    left: '0'
  });
  // 评论模态框
  const [isModalOpen, setIsModalOpen] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);
  // 评论列表
  const [list, setList] = useState<any[]>([]);
  // 评论内容
  const [value, setValue] = useState('');
  // 评论按钮是否显示
  const [btnActive, setBtnActive] = useState(false);
  // 是否在划线(和评论按钮的显示有关)
  const [lining, setLining] = useState(false);
  const [curLineId, setCurLineId] = useState('');

  const [isShowNote, setIsShowNote] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    params.id && fetchSectionData();
    params.id && fetchArticleBySectionId(params.sectionId);
    !params.id && fetchArticleByArticleId(params.sectionId);
    fetchComment();
    fetchSectionLine();
  }, []);
  const fetchSectionData = async () => {
    if (!params.id) return;
    const { data } = await getAllSection(params.id!);
    setItems(data);
  };
  const fetchArticleBySectionId = async (id: any) => {
    const { data, code } = await getArticleBySectionId(id);
    if (code == 0) {
      setArticle(data.content);
    } else {
      setArticle('');
    }
  };
  const fetchArticleByArticleId = async (id: any) => {
    const { data, code } = await getArticleByArticleId(id);
    if (code == 0) {
      setArticle(data.content);
    } else {
      setArticle('');
    }
  };

  const fetchComment = async () => {
    if (!params.sectionId) return;
    const { data } = await getAllComment(params.sectionId);
    setCommentData(data);
  };
  const fetchSectionLine = async () => {
    if (!params.sectionId) return;
    const { data } = await getAllSectionLine(Number(params.sectionId));
    const d = data.map((v: any) => {
      v.range = JSON.parse(v.range);
      return v;
    });
    setList(d);
  };

  const submitComment = async (
    parentId: number | null,
    comment: string,
    replyUserId: any
  ) => {
    if (!params.sectionId) return;
    const { code } = await addComment(
      params.sectionId,
      parentId,
      comment,
      replyUserId
    );
    if (code !== 0) {
      message.error('评论失败');
      return;
    }
    message.success('评论成功');
    fetchComment();
  };

  useUpdateEffect(() => {
    const container = document.querySelector('#preview') as HTMLDivElement;
    Vditor.preview(container, article, {
      mode: 'light',
      after: () => {
        const container = document.querySelector('#preview') as HTMLDivElement;
        const highlighter = new CanvasHighlighter(container);
        data.current.highlighter = highlighter;
        highlighter.renderRanges(list.map((i) => i.range));
        container.addEventListener('mouseup', () => {
          // 获取当前划词选中的 range 对象
          data.current.range = highlighter.getSelectionRange();
          if (data.current.range) {
            // 获取划词区域最后一个节点位置
            const end = data.current.highlighter.getSelectionPosition()?.end;
            if (!end) return;
            // 设置高亮按钮位置
            setStyle({
              top: end.y - 35 + 'px',
              left: end.x + 4 + 'px'
            });
            setBtnActive(true);
            setLining(true);
          }
        });
        document.addEventListener('click', func);
      }
    });
    function func(event: MouseEvent) {
      // 通过传入点击位置获取 range id
      const id = data.current.highlighter.geRangeIdByPointer(
        event.clientX,
        event.clientY
      );
      // 隐藏上一个激活的 range
      let _range = data.current.highlighter.getRange(data.current.active);
      if (_range) {
        _range.config.rect.visible = false;
        data.current.highlighter.updateRange(_range);
      }
      data.current.active = '';
      // 激活新点击的 range
      if (id) {
        data.current.active = id;
        const _range = data.current.highlighter.getRange(id);
        if (!_range) return;
        _range.config.rect.visible = true;
        data.current.highlighter.updateRange(_range);
        setIsShowNote(true);
        setCurLineId(_range.id);
        setNoteTop(event.clientY + 30);
      }
    }
    return () => {
      document.removeEventListener('click', func);
    };
  }, [article, list]);

  const onMenuClick: MenuProps['onClick'] = async (e) => {
    fetchArticleBySectionId(e.key);
    navigate(`/project/${params.id}/section/${e.key}`);
  };

  useClickOutside(btnRef, (e: MouseEvent) => {
    if (!lining && btnActive) setBtnActive(false);
    setLining(!lining);
  });

  const handleOk = async () => {
    const d = {
      id: data.current.range.id,
      range: data.current.range,
      text: value
    };
    list.push(d);
    setList([...list]);
    // 自定义隐藏矩形，只显示下划线
    data.current.range.config.rect.visible = false;
    // 高亮选中区域
    data.current.highlighter.addRange(data.current.range);
    setIsModalOpen(false);
    setValue('');

    const { code } = await addSectionLine(
      params.sectionId!,
      d.id,
      JSON.stringify(d.range),
      d.text
    );
    if (code !== 0) {
      message.error('划线失败');
      return;
    }
    message.success('划线成功');
  };

  const handleCancel = () => {
    setValue('');
    setIsModalOpen(false);
  };

  const cb = () => {
    if (isShowNote) setIsShowNote(false);
  };
  const prepareComment = () => {
    setIsModalOpen(true);
    setBtnActive(false);
  };

  const commentInfo = useMemo<CommentContextType>(() => {
    return {
      onSubmit: submitComment,
      avatar: UserStore.user.avatar
    };
  }, [submitComment]);

  return (
    <div className={styles['section-page']}>
      {params.id && (
        <div className={styles['section-menu']}>
          <Menu
            onClick={onMenuClick}
            style={{ width: 256 }}
            defaultSelectedKeys={[params.sectionId!]}
            mode="inline"
            items={items}
          />
        </div>
      )}
      <div className={styles['section-wrapper']} ref={sectionRef}>
        <div className={styles['section']}>
          <div id="preview"></div>
          <div className={styles['comment-nav']}>
            <span className={styles['comment-title']}>评论</span>
            <span className={styles['comment-num']}>{commentData.length}</span>
          </div>
          <div style={{ width: '668px' }} className={styles['comment-wrapper']}>
            <CommentContext.Provider value={commentInfo}>
              <CommentInput
                avatar={UserStore.user.avatar}
                replyUserId={null}
              ></CommentInput>
              <CommentBox
                data={commentData}
                className={styles['comment']}
              ></CommentBox>
            </CommentContext.Provider>
          </div>
        </div>
        {isShowNote ? (
          <Note
            cb={cb}
            comment={list.find((v) => v.id === curLineId)}
            style={{ top: noteTop + 'px' }}
          ></Note>
        ) : null}
        <FloatButton.Group shape="circle" style={{ right: 64 }}>
          <FloatButton.BackTop target={() => sectionRef.current!} />
        </FloatButton.Group>
      </div>
      <Button
        ref={btnRef}
        size="small"
        onClick={prepareComment}
        style={{
          position: 'fixed',
          fontSize: '12px',
          display: btnActive ? 'inline-block' : 'none',
          ...style
        }}
      >
        评论
      </Button>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        mask={false}
        okText="评论"
        cancelText="取消"
        closable={false}
      >
        <TextArea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="请添加评论..."
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </Modal>
    </div>
  );
}

export default observer(Section);
