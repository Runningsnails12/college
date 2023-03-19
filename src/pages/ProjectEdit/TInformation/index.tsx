import React, {
  ChangeEvent,
  memo,
  useEffect,
  useState,
  MouseEvent
} from 'react';
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
  UploadProps
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { RangePickerProps } from 'antd/es/date-picker';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { getFileToken } from '@/service/file';
import {
  addClassImformation,
  deleteFileByFileName,
  getClassImformation
} from '@/service/upload';

interface File {
  uploadId: number;
  rawName: string;
  fileName: string;
  url: string;
  createTime: string;
}

function TInformation() {
  const params = useParams();
  const navigate = useNavigate();
  const classId = params.id;
  const [fileList, setFileList] = useState<any[]>([]);
  const [OSS, setOSS] = useState('');
  const [file, setFile] = useState<File[]>([]);

  useEffect(() => {
    fetchOSS();
    fetchData();
  }, []);

  const fetchOSS = async () => {
    const { data: token } = await getFileToken();
    setOSS(token);
  };

  const fetchData = async () => {
    const { data } = await getClassImformation(classId);
    setFile(data);
  };

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
            addClassImformation({
              classId: Number(classId),
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

  const deleteFile = async (uploadId: number, fileName: string) => {
    // const res = await fetch(
    //   'http://up-z2.qiniup.com/delete/' +
    //     window
    //       .btoa(unescape(encodeURIComponent('runningsnilas:' + fileName)))
    //       .replaceAll('+', '-')
    //       .replaceAll('/', '_'),
    //   {
    //     method: 'POST'
    //   }
    // );

    const { code } = await deleteFileByFileName(uploadId);
    if (code != 0) {
      message.error('删除失败');
      return;
    }
    fetchData();
  };

  const seeFile = (e: MouseEvent, url: string) => {
    if (/[doc|docx|ppt|pptx|xls]/.test(url)) {
      window.open('https://view.officeapps.live.com/op/view.aspx?src=' + url);
    }
  };

  return (
    <div className={styles['information-page']}>
      <div className={styles['upload']}>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>点击上传</Button>
        </Upload>
      </div>
      <div>
        {file?.map((v, i) => (
          <div className={styles['list']} key={i}>
            <a href={v.url} onClick={(e) => seeFile(e, v.url)}>
              {v.rawName}
            </a>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '10px' }}>
                {dayjs(v.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </div>
              <div>
                <Button onClick={() => deleteFile(v.uploadId, v.fileName)}>
                  删除
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(TInformation);
