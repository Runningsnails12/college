import React, { memo, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import Vditor from 'vditor';
import { Button, Input, message, Skeleton, Switch } from 'antd';
import { getFileToken } from '@/service/file';
import { getArticle, addArticle, updateArticle } from '@/service/article';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterval } from 'ahooks';
import dayjs from 'dayjs';

function Edit() {
  const params = useParams();
  const navigate = useNavigate();
  const [vd, setVd] = useState<Vditor>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [articleId, setArticleId] = useState<number | null>(null);
  const [lastSaveTime, setLastSaveTime] = useState('');

  async function fetchData() {
    try {
      if (params.sectionId) {
        const { data } = await getArticle(params.sectionId);
        setTitle(data.title);
        setArticleId(Number(params.sectionId));
        setLastSaveTime(data.lastModifyTime);
        vd?.setValue(data.content);
      } else {
        const { code, data } = await addArticle();
        setArticleId(data);
        if (code != 0) {
          message.error('获取文章失败');
        }
      }
    } catch {
      // navigate('/');
      return;
    }
  }
  useEffect(() => {
    fetchData();
  }, [vd]);

  useEffect(() => {
    const vditor = new Vditor('vditor', {
      // height: 360,
      cache: {
        enable: false
      },
      outline: {
        enable: true,
        position: 'right'
      },
      counter: {
        enable: true
      },
      // resize: {
      //   enable: true
      // },
      preview: {
        hljs: {
          lineNumber: true,
          style: 'vs'
        }
      },
      after: () => {
        // setLoading(false);
        // vditor.setValue(`$$
        // \\frac{1}{
        //   \\Bigl(\\sqrt{\\phi \\sqrt{5}}-\\phi\\Bigr) e^{
        //   \\frac25 \\pi}} = 1+\\frac{e^{-2\\pi}} {1+\\frac{e^{-4\\pi}} {
        //     1+\\frac{e^{-6\\pi}}
        //     {1+\\frac{e^{-8\\pi}}{1+\\cdots}}
        //   }
        // }
        // $$`);
        setVd(vditor);
      },
      upload: {
        accept: 'image/*',
        multiple: false,
        filename(name) {
          return name
            .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '')
            .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '')
            .replace('/\\s/g', '');
        },

        handler: async (files) => {
          const { data: token } = await getFileToken();
          const formdata = new FormData();
          const f = files[0];
          //@ts-expect-error
          const newFileName = f.name + (crypto.randomUUID() ?? Date.now());
          formdata.append('token', token as unknown as string);
          formdata.append('key', newFileName);
          formdata.append('file', f);
          const res = await fetch('http://up-z2.qiniup.com', {
            method: 'POST',
            body: formdata
          });
          const json: any = await res.json();
          if (json.error) {
            message.error('上传失败');
            return;
          }
          const name = newFileName;
          const path = json.key;
          let succFileText = '';
          if (vditor && vditor.vditor.currentMode === 'wysiwyg') {
            succFileText += `\n <img alt=${name} src="${path}">`;
          } else {
            succFileText += `  \n![${name}](${path})`;
          }
          document.execCommand('insertHTML', false, succFileText);

          return json.key;
        }
      }
    });
  }, []);

  useInterval(async () => {
    if (!inputRef.current || !vd || !articleId) return;
    const title = inputRef.current.value;
    const content = vd.html2md(vd.getHTML());
    const { code } = await updateArticle({
      articleId: articleId,
      title,
      content
    });
    if (code != 0) {
      message.error('更新失败');
      return;
    }
    setLastSaveTime(new Date().toISOString());
  }, 10000);

  const submit = async () => {
    if (!inputRef.current || !vd) return;
    const title = inputRef.current.value;
    const content = vd.html2md(vd.getHTML());

    const { code } = await updateArticle({
      articleId: articleId,
      title,
      content,
      isPublic,
      isFinish: true
    });
    if (code === 0) {
      message.success('提交成功');
    } else {
      message.error('提交失败');
    }
  };
  const onChange = (checked: boolean) => {
    setIsPublic(checked);
  };
  return (
    <div className={styles['edit']}>
      <header className={styles['header']}>
        <input
          ref={inputRef}
          className={styles['input']}
          type="text"
          placeholder="输入文章标题..."
          maxLength={20}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <span style={{ flexShrink: '0' }}>
          最后保存时间:{dayjs(lastSaveTime).format('MM-DD HH:mm:ss')}
        </span>
        <Button type="primary" onClick={submit}>
          发布
        </Button>
        <span style={{ flexShrink: '0' }}>开放浏览</span>
        <Switch
          checked={isPublic}
          onChange={onChange}
          checkedChildren="开启"
          unCheckedChildren="关闭"
          defaultChecked
        />
      </header>
      <div id="vditor" className={styles['vditor']}></div>
    </div>
  );
}

export default memo(Edit);
