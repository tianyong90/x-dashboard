<template>
  <div ref="chart" id="calendar" />
</template>

<script lang="ts">
import Vue from 'vue'
import G2, { Shape, Util } from '@antv/g2'
import axios from 'axios'

export default Vue.extend({
  name: 'github-calendar',

  mounted () {
    Shape.registerShape('polygon', 'boundary-polygon', {
      draw: function draw (cfg, container) {
        if (!Util.isEmpty(cfg.points)) {
          let attrs = {
            stroke: '#fff',
            lineWidth: 1,
            fill: cfg.color,
            fillOpacity: cfg.opacity,
          }
          let points = cfg.points
          let path = [
            ['M', points[0].x, points[0].y],
            ['L', points[1].x, points[1].y],
            ['L', points[2].x, points[2].y],
            ['L', points[3].x, points[3].y],
            ['Z'],
          ]

          attrs.path = this.parsePath(path)
          let polygon = container.addShape('path', {
            attrs: attrs,
          })

          container.sort()
          return polygon
        }
      },
    })

    axios.get('github/calendar').then(({ data }) => {
      // console.log(data)
      let calendarChart = new G2.Chart({
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
            const item = _.find(data, o => {
              // eslint-disable-next-line
              return o.week == val
            })

            const ret = Number.parseInt(item.date.split('-')[1])

            // eslint-disable-next-line
            if (val == 0) {
              return ret
            }

            const prevItem = _.find(data, o => {
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
        title: 'date',
      })
      calendarChart.coord().reflect('y')
      calendarChart
        .polygon()
        .position('week*day*date')
        .color('fill', (fill: string) => {
          return fill
        })
        .shape('boundary-polygon')
      calendarChart.render()
    })
  },

  methods: {},
})
</script>

<style scoped lang="scss"></style>
