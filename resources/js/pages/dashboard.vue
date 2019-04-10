<template>
  <div class="main-container">
    <el-row :gutter="12">
      <el-col :span="5">
        <el-card shadow="always">
          <span class="title">Total Stars</span>
          <h3>{{ totalStars }}</h3>
        </el-card>
      </el-col>

      <el-col :span="13">
        <el-card shadow="always">
          <div class="chart" id="calendar" />
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="always">
          {{ totalTime }}
          <div class="chart" id="wakatime_chart" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12" style="margin-top: 20px;">
      <el-col :span="9">
        <div class="notifications-panel">
          <ul>
            <li v-for="notification in notifications" :key="notification.id">
              <div>{{ notification.subject.title }}</div>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="notifications-panel">
          <ul>
            <li v-for="notification in notifications" :key="notification.id">
              <div>{{ notification.subject.title }}</div>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="6">
        <el-table :data="repos"
                  stripe
                  border
                  height="500"
                  style="width: 100%"
        >
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="stargazers_count" label="Stars" width="90" />
          <el-table-column prop="forks_count" label="Forks" width="90" />
          <el-table-column prop="watchers_count" label="Watchers" width="90" />
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import Octokit from '@octokit/rest'
import G2, { Shape, Util } from '@antv/g2'
import axios from 'axios'
import numeral from 'numeral'

export default {
  data () {
    return {
      repos: [],
      notifications: [],
      totalTime: '',
    }
  },

  computed: {
    // 总 star 数
    totalStars (): number {
      return _.sumBy(this.repos, 'stargazers_count')
    },
  },

  mounted () {
    const octokit = new Octokit({
      // log: console,
      auth: process.env.MIX_GITHUB_OAUTH_TOKEN,
    })

    octokit.repos
      .listForUser({
        username: 'tianyong90',
        type: 'owner',
      })
      .then(({ data }) => {
        this.repos = _.orderBy(
          data,
          ['stargazers_count', 'forks_count'],
          'desc'
        )
      })

    octokit.activity.listNotifications().then(({ data }) => {
      this.notifications = data
    })

    this.axios
      .get('https://github.com/timeline', {
        headers: {
          Accept: 'applicatgion/atom+xml',
        },
      })
      .then(res => {
        console.log(res)
      })

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
        .color('count', '#BAE7FF-#1890FF-#0050B3')
        .shape('boundary-polygon')
      calendarChart.render()
    })

    // WAKATIME 最近 7 天统计
    this.axios.get('wakatime/summaries').then(({ data }) => {
      let totalSeconds = _.sumBy(data.data, 'grand_total.total_seconds')

      this.totalTime = numeral(totalSeconds).format('00:00:00')

      const sourceData = data.data.map(item => {
        return {
          date: item.range.date,
          totalSeconds: item.grand_total.total_seconds,
          totalTimeText: item.grand_total.text,
        }
      })

      const chart = new G2.Chart({
        container: 'wakatime_chart',
        forceFit: true,
        height: 120,
        padding: [0, 25, 0, 25],
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
        .tooltip(
          'date*totalSeconds*totalTimeText',
          (date, totalSeconds, totalTimeText) => {
            return {
              date: date,
              time: totalTimeText,
            }
          }
        )
      chart.render()
    })
  },

  methods: {},
}
</script>

<style scoped lang="scss">
.el-card {
  height: 180px;
}

.chart {
  display: block;
  width: 100%;
}

.notifications-panel {
  display: block;
  background-color: #fff;
  padding: 1rem;

  ul {
    list-style: none;
    display: block;
    padding: 0;
    margin: 0;
  }
}
</style>
