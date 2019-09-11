import React, { Component } from 'react'
import { Layout, Row, Col, Spin } from 'antd'
import { sumBy } from 'lodash'
import axios from 'axios'
import numeral from 'numeral'
import G2 from '@antv/g2'

const { Content } = Layout

interface IState {
  totalTime: string
  dailyTimeSeconds: number
  todayTimeSeconds: number
  projects: object[]
  isLoadingSummaries: boolean
  isLoadingStats: boolean
}

export default class App extends Component<IState> {
  state: IState

  constructor (props) {
    super(props)

    this.state = {
      totalTime: '0',
      dailyTimeSeconds: 0,
      todayTimeSeconds: 0,
      projects: [],
      isLoadingSummaries: false,
      isLoadingStats: false,
    }
  }

  componentDidMount (): void {
    this.setState({ isLoadingSummaries: true })
    // WAKATIME 最近 7 天按天
    axios.get('wakatime/summaries').then(({ data }) => {
      this.setState({ isLoadingSummaries: false })
      const totalSeconds = sumBy(data.data, 'grand_total.total_seconds')

      this.setState({
        totalTime: numeral(totalSeconds).format('00:00:00'),
        dailyTimeSeconds: totalSeconds / 7,
        todayTimeSeconds: data.data[6].grand_total.total_seconds,
      })

      // TODO: types
      const sourceData = data.data.map((item: any) => {
        return {
          date: item.range.date,
          totalSeconds: item.grand_total.total_seconds,
          totalTimeText: item.grand_total.text,
        }
      })

      const chart = new G2.Chart({
        container: 'wakatime_chart',
        forceFit: true,
        height: 220,
        padding: [20, 50, 40, 50],
      })

      chart.source(sourceData)
      chart.axis('totalSeconds', false)

      chart.tooltip({
        showTitle: true,
        useHtml: true,
        itemTpl: '<li data-index={index}>{time}</li>',
      })

      chart
        .interval()
        .position('date*totalSeconds')
        .tooltip('date*totalSeconds*totalTimeText', (date: string, totalSeconds: string, totalTimeText: string) => {
          return {
            date: date,
            time: totalTimeText,
          }
        })

      chart.guide().line({
        top: true,
        start: ['min', this.state.dailyTimeSeconds],
        end: ['max', this.state.dailyTimeSeconds],
        lineStyle: {
          stroke: '#8e8e8e',
          lineWidth: 1,
          lineDash: [4, 3],
        },
      })

      chart.render()

      const todayPercent = Math.min(Math.round((this.state.todayTimeSeconds / this.state.dailyTimeSeconds) * 100), 100)

      const goalsData = [
        {
          value: todayPercent,
        },
      ]
      const goalsChart = new G2.Chart({
        container: 'wakatime_goals',
        forceFit: true,
        height: 220,
        padding: [20, 50, 40, 50],
      })
      goalsChart.source(goalsData)

      goalsChart.coord('polar', {
        startAngle: -Math.PI,
        endAngle: 0,
        radius: 0.8,
      })
      goalsChart.scale('value', {
        min: 0,
        max: 100,
      })

      goalsChart.axis('1', false)
      goalsChart.axis('value', false)
      goalsChart.legend(false)
      goalsChart.tooltip(false)
      goalsChart
        .point()
        .position('value*1')
        .opacity(0)

      // 绘制仪表盘背景
      goalsChart.guide().arc({
        top: false,
        start: [0, 0.965],
        end: [100, 0.965],
        style: {
          // 底灰色
          stroke: '#CBCBCB',
          lineWidth: 18,
        },
      })

      // 绘制指标
      goalsChart.guide().arc({
        start: [0, 0.965],
        end: [todayPercent, 0.965],
        style: {
          stroke: todayPercent < 60 ? '#ff8e24' : '#1890FF',
          lineWidth: 20,
        },
      })

      const dailyTimeText = numeral(this.state.dailyTimeSeconds).format('00:00:00')

      // 绘制指标数字
      goalsChart.guide().html({
        position: ['50%', '95%'],
        html: `<div style="text-align: center;">
<p style="font-size: 16px;color: #545454;margin: 0;">
${goalsData[0].value} %</p>
<p>Daily Average ${dailyTimeText}</p>
</div>`,
      })

      goalsChart.render()
    })

    this.setState({ isLoadingStats: true })
    axios.get('wakatime/stats').then(({ data }) => {
      this.setState({ isLoadingStats: false })

      const { editors, languages, projects } = data.data

      this.setState({ projects })

      const languagesChart = new G2.Chart({
        container: 'languages',
        forceFit: true,
        height: 220,
        padding: [20, 50, 40, 50],
      })
      languagesChart.source(languages)

      languagesChart.coord('theta')

      languagesChart.tooltip({
        showTitle: false,
      })
      languagesChart.intervalStack().position('percent').color('name').tooltip('name*percent', function (item, percent) {
        percent = percent * 100 + '%'
        return {
          name: item,
          value: percent,
        }
      }).style({
        lineWidth: 1,
        stroke: '#fff',
      })

      languagesChart.render()

      const editorsChart = new G2.Chart({
        container: 'editors',
        forceFit: true,
        height: 220,
        padding: [20, 50, 40, 50],
      })
      editorsChart.source(editors)

      editorsChart.coord('theta')

      editorsChart.tooltip({
        showTitle: false,
      })
      editorsChart.intervalStack().position('percent').color('name').tooltip('name*percent', function (item, percent) {
        percent = percent * 100 + '%'
        return {
          name: item,
          value: percent,
        }
      }).style({
        lineWidth: 1,
        stroke: '#fff',
      })

      editorsChart.render()
    })
  }

  renderChartSpin () {
    return <div className="flex bg-white justify-center items-center h-48"><Spin /></div>
  }

  public render () {
    return (
      <>
        <Content className="mt-4 mx-4">
          <Row gutter={16}>
            <Col span={12}>
              <div className="bg-white shadow mb-4">
                {
                  this.state.isLoadingSummaries ? this.renderChartSpin() : <div id="wakatime_chart" />
                }
              </div>
            </Col>
            <Col span={12}>
              <div className="bg-white shadow mb-4">
                {
                  this.state.isLoadingSummaries ? this.renderChartSpin() : <div id="wakatime_goals" />
                }
              </div>
            </Col>
            <Col span={12}>
              <div className="bg-white shadow mb-4">
                {
                  this.state.isLoadingStats ? this.renderChartSpin() : <div id="languages" />
                }
              </div>
            </Col>
            <Col span={12}>
              <div className="bg-white shadow mb-4">
                {
                  this.state.isLoadingStats ? this.renderChartSpin() : <div id="editors" />
                }
              </div>
            </Col>
          </Row>
        </Content>

        <Content className="mt-4 mx-4">
          <Row gutter={32}>
            {
              this.state.projects.map((project, index) => (
                <Col span={8} key={index}>
                  <div className="bg-white shadow text-center py-4 mb-4">
                    <h1 className="text-lg font-medium">{ project.name }</h1>
                    <span>{ project.digital }</span>
                  </div>
                </Col>
              ))
            }
          </Row>
        </Content>
      </>
    )
  }
}
