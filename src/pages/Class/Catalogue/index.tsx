import React, { memo, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { Collapse, Tag, Badge, Timeline, message } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { getCatalogue } from '@/service/project';

const { Panel } = Collapse;

interface catalogue {
  title: string;
  sectionId: string;
  children: catelogueItem[];
}
interface catelogueItem {
  sectionId: string;
  type: 'txt' | 'video' | 'test';
  testId: number;
  articleId: number;
  videoId: number;
  title: string;
  subTitle: string[];
  create_time: string;
  isSee: number;
}

function Catalogue() {
  const params = useParams();
  const [data, setData] = useState<catalogue[]>();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!params.id) {
      message.error('格式不正确');
      return;
    }
    const { data: d } = await getCatalogue(params.id);
    setData(d);
  };

  const getUrl = (section: catelogueItem) => {
    if (section.type === 'txt') {
      return `/project/${params.id}/section/${section.sectionId}`;
    } else if (section.type === 'test') {
      return `/test/${section.testId}`;
    } else if (section.type === 'video') {
      return `/video/${section.videoId}`;
    }
  };

  return (
    <div className={styles['catelogue-wrapper']}>
      <div className={styles['catelogue']}>
        <Collapse bordered={false}>
          {data?.map((item) => (
            <Panel header={item.title} key={item.sectionId}>
              <div>
                {item.children?.map((section, i) => (
                  <a href={getUrl(section)} key={i}>
                    <div className={styles['item']}>
                      <div className={styles['item-title']}>
                        {section.title}
                        {!section.isSee && <Badge dot></Badge>}
                      </div>
                      <div className={styles['item-tag']}>
                        {section.type === 'txt' &&
                          section.subTitle?.map((s, i) => (
                            <Tag className={styles['item-tag-color']} key={i}>
                              {s}
                            </Tag>
                          ))}
                        {(section.type === 'video' ||
                          section.type === 'test') && (
                          <Tag color="error">{section.type}</Tag>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
}

export default memo(Catalogue);
