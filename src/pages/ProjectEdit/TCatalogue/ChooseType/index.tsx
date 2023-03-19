import React, {
  ChangeEvent,
  memo,
  useEffect,
  useState,
  CSSProperties
} from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Button, Select, Upload, message } from 'antd';
import styles from './index.module.scss';
import { getAllArticle } from '@/service/article';
import { getAlllTest } from '@/service/test';
import type { Item } from '../';
import type { UploadProps } from 'antd';
import { getFileToken } from '@/service/file';
import { addVideo } from '@/service/video';

interface ChooseTypeProps {
  item: Item;
  type: 'video' | 'txt' | 'test';
  onChange: (v: number) => void;
  style?: CSSProperties;
}
interface p {
  label: string;
  value: number;
}
function ChooseType(props: ChooseTypeProps) {
  const { item, type, style, onChange } = props;
  const { Dragger } = Upload;

  const [articleData, setArticleData] = useState<p[]>([]);
  const [testData, setTestData] = useState<p[]>([]);
  const [OSS, setOSS] = useState('');
  const [fileList, setFileList] = useState<any[]>([]);
  const [p, setP] = useState<string | null>(null);

  useEffect(() => {
    fetchOSS();
    fetchAllArticle();
    fetchAllTest();
  }, []);

  const fetchOSS = async () => {
    const { data: token } = await getFileToken();
    setOSS(token);
  };

  const fetchAllArticle = async () => {
    const { data } = await getAllArticle();
    setArticleData(data);
  };
  const fetchAllTest = async () => {
    const { data } = await getAlllTest();
    setTestData(data);
  };
  const uploadProps: UploadProps = {
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
      const newFileName = (crypto.randomUUID() ?? Date.now()) + '@' + filename;
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
            addVideo({
              p,
              rawName: filename,
              fileName: newFileName,
              url: json.key
            }).then(({ code, data }) => {
              if (code !== 0) {
                message.error('上传失败');
                return;
              }
              setP(data);
              onChange(data);
            });
          }
        });
    }
  };
  let t = (
    <Dragger {...uploadProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽文件上传</p>
    </Dragger>
  );
  const a = {
    txt: '文章',
    test: '测试'
  };
  if (type === 'txt' || type === 'test') {
    t = (
      <div>
        <Button
          style={{ marginRight: '15px' }}
          onClick={() => {
            window.open(type === 'txt' ? '/section/new' : '/test/new');
          }}
        >
          点击创建{a[type]}
        </Button>
        <Select
          style={{
            width: '200px'
          }}
          showSearch
          placeholder={'请选择一篇' + a[type]}
          optionFilterProp="children"
          onChange={(v) => onChange(v)}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          value={type === 'txt' ? item.articleId : item.testId}
          options={type === 'txt' ? articleData : testData}
        />
        <Button
          onClick={() => {
            type === 'txt' ? fetchAllArticle() : fetchAllTest();
          }}
        >
          点击刷新
        </Button>
      </div>
    );
  }
  return (
    <div style={{ marginLeft: '140px', padding: '15px 0', ...style }}>{t}</div>
  );
}
export default memo(ChooseType);
