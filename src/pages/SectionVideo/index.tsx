import React, { memo, useEffect, useState, MouseEvent } from 'react';
import styles from './index.module.scss';
import Player from 'nplayer';
import Danmaku from '@nplayer/danmaku';
import { useSearchParams, useParams } from 'react-router-dom';
import CommentBox from '@/components/Comment/CommentBox';

import datas from '@/pages/Section/data.json';
import CommentInput from '@/components/Comment/CommentInput';
import { getVideo } from '@/service/video';
import { useUpdateEffect } from 'ahooks';

interface video {
  videoId: string;
  rawName: string;
  fileName: string;
  duration: string;
  url: string;
}

function SectionVideo() {
  const params = useParams();
  const [data, setData] = useState<video[]>([]);

  const [search, setSearch] = useSearchParams();
  const [p, setP] = useState(search.get('p') ?? '1');

  useEffect(() => {
    fetchVideo();
  }, []);
  useUpdateEffect(() => {
    const danmakuOptions = {
      items: [{ time: 1, text: '弹幕～' }]
    };

    const player = new Player({
      src: data[Number(p) - 1].url,
      //@ts-expect-error
      plugins: [new Danmaku(danmakuOptions)]
    });

    player.mount('#video');
    return () => {
      player.dispose();
    };
  }, [p, data]);

  const fetchVideo = async () => {
    if (!params.id) return;
    const { data } = await getVideo(params.id);
    setData(data);
  };

  const changeVideo = (e: MouseEvent, i: number) => {
    e.preventDefault();
    setSearch('p=' + i);
    setP(i + '');
  };
  return (
    <div className={styles['video-page']}>
      <div className={styles['video-container']}>
        <div className={styles['left-container']}>
          <div className={styles['header']}>
            <div className={styles['video-title']}>
              {data[Number(p) - 1]?.rawName}
            </div>
            <div className={styles['video-info']}>
              <span className={styles['info-item']}>
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB0PSIxNjQyNTg4MTEzODk5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjY4MjciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PC9kZWZzPjxwYXRoIGQ9Ik0xNjcuMDI0IDUxMmEzNDQuOTc2IDM0NC45NzYgMCAxIDEgNjg5Ljk1MiAwIDM0NC45NzYgMzQ0Ljk3NiAwIDAgMS02OTAgMHpNNTEyIDEwNi45NzZhNDA1LjAyNCA0MDUuMDI0IDAgMSAwIDAgODEwLjA0OCA0MDUuMDI0IDQwNS4wMjQgMCAwIDAgMC04MTB6IG0zMCAyMzUuMDA4YTMwIDMwIDAgMSAwLTYwIDBWNTEyYzAgNy45NjggMy4xNjggMTUuNiA4Ljc4NCAyMS4yMTZsMTIwIDEyMGEzMCAzMCAwIDEgMCA0Mi40MzItNDIuNDMyTDU0MiA0OTkuNTJWMzQxLjk4NHoiIGZpbGw9IiM5NDk5QTAiIHAtaWQ9IjY4MjgiPjwvcGF0aD48L3N2Zz4="
                  alt=""
                />
                <span className={styles['info-text']}>2021-04-13 23:32:47</span>
              </span>
            </div>
          </div>
          <div id="video"></div>
          <div className={styles['comment-nav']}>
            <span className={styles['comment-title']}>评论</span>
            <span className={styles['comment-num']}>{datas.length}</span>
          </div>
          <div style={{ width: '668px' }} className={styles['comment-wrapper']}>
            <CommentInput
              avatar={
                'https://static.juzicon.com/user/avatar-3cb86a0c-08e7-4305-9ac6-34e0cf4937cc-180320123405-BCV6.jpg?x-oss-process=image/resize,m_fill,w_100,h_100'
              }
            ></CommentInput>
            <CommentBox data={datas} className={styles['comment']}></CommentBox>
          </div>
        </div>
        <div className={styles['right-container']}>
          <div className={styles['multi-page']}>
            <div className={styles['head-con']}>
              <h3>视频选集</h3>
              <span className={styles['cur-page']}>
                ({p}/{data.length})
              </span>
            </div>
            <div className={styles['cur-list']}>
              <ul className={styles['list-box']}>
                {data?.map((item, i) => (
                  <li
                    key={item.videoId}
                    className={p === String(i + 1) ? styles['on'] : ''}
                  >
                    <a
                      href={`/section/123/video?p=${i + 1}`}
                      onClick={(e) => changeVideo(e, i + 1)}
                    >
                      <div className={styles['clickitem']}>
                        <div className={styles['link-content']}>
                          <img
                            src="//s1.hdslb.com/bfs/static/jinkela/video/asserts/playing.gif"
                            style={{
                              display: p === String(i + 1) ? 'block' : 'none'
                            }}
                          />
                          <span className={styles['page-num']}>P{i + 1}</span>
                          <span className={styles['part']}>{item.rawName}</span>
                        </div>
                        <div className={styles['duration']}>
                          {item.duration}
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default memo(SectionVideo);
