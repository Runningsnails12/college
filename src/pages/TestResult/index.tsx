import { Button, Col, Progress, Row, Space, Statistic } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import * as echarts from 'echarts/core';
import {
  GridComponent,
  GridComponentOption,
  TooltipComponent
} from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

import type { testApi, userChooseRes } from '../TestDo';
import { convertToChinaNum } from '@/utils/util';
import { getStuTest, getTestInfo, getUserChoose } from '@/service/test';
import { useParams } from 'react-router-dom';
import Item from './Item';
import { useUpdateEffect } from 'ahooks';
import 'highlight.js/styles/github.css';

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | BarSeriesOption
>;
echarts.use([GridComponent, BarChart, CanvasRenderer, TooltipComponent]);

function getOptions(people: number[], peopleScore: number[]) {
  const option: EChartsOption = {
    xAxis: {
      type: 'category',
      name: '分',
      nameLocation: 'end',
      data: peopleScore
    },
    yAxis: {
      type: 'value',
      name: '人数',
      nameLocation: 'middle',
      nameGap: 30
    },
    series: [
      {
        name: '人数',
        data: people,
        type: 'bar',

        itemStyle: {
          color: 'rgb(86, 74, 190)'
        }
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params: any) {
        const tar = params[0];
        return (
          '分数段' + tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value
        );
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      top: '10%',
      bottom: '0',
      containLabel: true
    },
    axisPointer: {
      type: 'shadow'
    }
  };
  return option;
}

interface TestInfo {
  people: number[];
  peopleScore: number[];
  rank: number;
  score: number;
  testName: string;
  totalScore: number;
  peopleNum: number;
}

function TestResult() {
  const params = useParams();
  const [data, setData] = useState<testApi>({} as testApi);
  const chartRef = useRef<HTMLInputElement>(null);
  const echarRef = useRef<any>(null);
  const [userChooseRes, setUserChooseRes] = useState<userChooseRes[]>([]);
  const [testInfo, setTestInfo] = useState<TestInfo>({} as TestInfo);

  useEffect(() => {
    fetchTest();
    fetchTestInfo();
    fetchUserChoose();
  }, []);
  const fetchTest = async () => {
    if (!params.id) return;
    const { data } = await getStuTest(params.id);
    setData(data);
  };
  const fetchTestInfo = async () => {
    if (!params.id) return;
    const { data } = await getTestInfo(params.id);
    setTestInfo(data);
  };
  const fetchUserChoose = async () => {
    if (!params.id) return;
    const { data } = await getUserChoose(params.id);
    setUserChooseRes(data);
  };

  useEffect(() => {
    const c = echarts.init(chartRef.current as HTMLElement);
    echarRef.current = c;
  }, []);

  useUpdateEffect(() => {
    echarRef.current.setOption(
      getOptions(testInfo.people, testInfo.peopleScore)
    );
  }, [testInfo]);

  return (
    <div className={styles['test-result-page']}>
      <div className={styles['header']}>
        <div className={styles['chart-wrapper']}>
          <div className={styles['chart-header']}>
            <div className={styles['score']}>
              <div className={styles['score-title']}>总分</div>
              <div className={styles['score-content']}>
                <span className={styles['acquire']}>{testInfo.score}</span>/
                <span className={styles['total']}>{testInfo.totalScore}</span>
              </div>
            </div>
            <Progress
              type="circle"
              percent={Math.floor(testInfo.score / testInfo.totalScore) * 100}
            />
            <div className={styles['divider']}></div>
            <div className={styles['score']}>
              <div className={styles['score-title']}>排名</div>
              <div className={styles['score-content']}>
                <span className={styles['acquire']}>{testInfo.rank}</span>/
                <span className={styles['total']}>{testInfo.peopleNum}</span>
              </div>
            </div>
          </div>
          <div className={styles['chart-title']}>成绩分布</div>
          <div
            ref={chartRef}
            className={styles['chart']}
            style={{ height: '135px', width: '100%' }}
          ></div>
        </div>
        <div className={styles['info']}>
          <Row>
            <Col span={8}>
              <Statistic title="考试名称" value={testInfo.testName} />
            </Col>
            <Col span={8}>
              <Statistic title="参与人数" value={testInfo.peopleNum} />
            </Col>
            {/* <Col span={8}>
              <Statistic title="登录 IP 地址" value={'0.0.0.0'} />
            </Col> */}
          </Row>
          {/* <Row>
            <Col span={8}>
              <Statistic title="开始时间" value={'2022-1'} />
            </Col>
            <Col span={8}>
              <Statistic title="结束时间" value={'2023-1'} />
            </Col>
            <Col span={8}>
              <Statistic title="用时" value={'0 时 1 分 52 秒'} />
            </Col>
          </Row> */}
        </div>
      </div>
      <div className={styles['problem-wrapper']}>
        <div className={styles['wrapper-title']}>题目详情</div>
        <div className={styles['problem-content']}>
          {data.test?.map((p, i) => (
            <div className={styles['problem-part']} key={i}>
              <div className={styles['problem-part-title']}>
                {convertToChinaNum(i + 1)}、{p.type}
              </div>
              <div>
                {p.content?.map((v, i) => (
                  <div key={i} className={styles['item-res']}>
                    <Item
                      data={v}
                      index={i}
                      choose={
                        userChooseRes.find((r) => r.problemId === v.problemId)
                          ?.choose
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default memo(TestResult);
