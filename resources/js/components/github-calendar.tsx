import React, { Component } from 'react'
import { find } from 'lodash'
import G2, { Shape, Util } from '@antv/g2'
import { Spin } from 'antd'
import axios from 'axios'

export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: false,
    }
  }

  componentDidMount () {
    Shape.registerShape('polygon', 'boundary-polygon', {
      draw: function draw (cfg, container) {
        if (!Util.isEmpty(cfg.points)) {
          const attrs = {
            stroke: '#fff',
            lineWidth: 1,
            fill: cfg.color,
            fillOpacity: cfg.opacity,
          }
          const points = cfg.points
          const path = [
            ['M', points[0].x, points[0].y],
            ['L', points[1].x, points[1].y],
            ['L', points[2].x, points[2].y],
            ['L', points[3].x, points[3].y],
            ['Z'],
          ]

          attrs.path = this.parsePath(path)
          const polygon = container.addShape('path', {
            attrs: attrs,
          })

          container.sort()
          return polygon
        }
      },
    })

    this.setState({ isLoading: true })
    axios.get('github/calendar').then(({ data }) => {
      this.setState({ isLoading: false })

      // console.log(data)
      const calendarChart = new G2.Chart({
        container: 'calendar',
        forceFit: true,
        height: 150,
        padding: [0, 0, 30, 20],
      })
      calendarChart.source(data, {
        day: {
          type: 'cat',
          values: ['日', '一', '二', '三', '四', '五', '六'],
        },
        week: {
          type: 'cat',
        },
        count: {
          sync: true,
        },
      })

      calendarChart.axis('week', {
        position: 'top',
        tickLine: null,
        line: null,
        label: {
          offset: 12,
          textStyle: {
            fontSize: 12,
            fill: '#666',
            textBaseline: 'top',
          },
          formatter: function formatter (val) {
            const item = find(data, o => {
              // eslint-disable-next-line
              return o.week == val
            })

            const ret = Number.parseInt(item.date.split('-')[1])

            // eslint-disable-next-line
            if (val == 0) {
              return ret
            }

            const prevItem = find(data, o => {
              // eslint-disable-next-line
              return o.week == val - 1
            })

            // 避免重复月份标注
            if (ret === Number.parseInt(prevItem.date.split('-')[1])) {
              return ''
            }

            return ret
          },
        },
      })
      calendarChart.axis('day', {
        grid: null,
      })
      calendarChart.legend(false)
      calendarChart.tooltip({
        showTitle: false,
        useHtml: true,
        itemTpl: '<li date-index={index}>{count} contribution on {date}</li>',
      })
      calendarChart.coord().reflect('y')
      calendarChart
      .polygon()
      .position('week*day*date')
      .color('fill', (fill: string) => {
        return fill
      })
      .shape('boundary-polygon')
      .tooltip('date*count*day', (date, count, day) => {
        return {
          date,
          count,
        }
      })
      calendarChart.render()
    })
  }

  renderChartSpin () {
    return <div className="flex bg-white justify-center items-center h-48"><Spin /></div>
  }

  public render () {
    return <>
      {
        this.state.isLoading ? this.renderChartSpin() : <div id="calendar" />
      }
    </>
  }
}
