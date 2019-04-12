<template>
  <div class="main-container">
    <el-row :gutter="12">
      <el-col :span="12">
        <el-card shadow="always">
          <github-calendar />
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="always">
          <span class="title">Last 7 days {{ totalTime }}</span>
          <div class="chart" id="wakatime_chart" />
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="always">
          <span class="title">Toady {{ dialyTimeText }}</span>
          <div class="chart" id="wakatime_goals" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12" style="margin-top: 20px;">
      <el-col :span="12">
        <div class="notifications">
          <div
            v-for="(notificationGroup, groupName, index) in notifications"
            :key="index"
            class="notification-group-panel"
          >
            <div class="group-title">
              {{ groupName }}
            </div>
            <ul>
              <li
                v-for="notification in notificationGroup"
                :key="notification.id"
              >
                <span>{{ notification.subject.type }}</span>
                <span>{{ notification.subject.title }}</span>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="notifications-panel">
          <ul>
            <li v-for="notification in notifications" :key="notification.id">
              <div>hello world</div>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="Repositories" :visible.sync="dialogVisible">
      <el-table :data="repos"
                stripe
                border
                height="350"
                style="width: 100%"
      >
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="stargazers_count" label="Stars" width="90" />
        <el-table-column prop="forks_count" label="Forks" width="90" />
        <el-table-column prop="watchers_count" label="Watchers" width="90" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import Octokit from '@octokit/rest'
import numeral from 'numeral'
import G2 from '@antv/g2'
import Calendar from '../components/github-calendar.vue'

export default Vue.extend({
  components: {
    'github-calendar': Calendar,
  },

  data () {
    return {
      repos: [],
      notifications: {},
      totalTime: '',
      todayTimeSeconds: 0,
      dailyTimeSeconds: 0,
      dialyTimeText: '',
      dialogVisible: false,
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

    // TODO: wakatime goals
    // this.axios.get('wakatime/goals').then((res) => {
    //   console.log(res)
    // })

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
      this.notifications = _.groupBy(data, item => {
        return item.repository.full_name
      })
    })

    // WAKATIME 最近 7 天统计
    this.axios.get('wakatime/summaries').then(({ data }) => {
      let totalSeconds = _.sumBy(data.data, 'grand_total.total_seconds')

      this.totalTime = numeral(totalSeconds).format('00:00:00')

      this.dailyTimeSeconds = totalSeconds / 7

      this.dialyTimeText = numeral(this.dailyTimeSeconds).format('00:00:00')

      this.todayTimeSeconds = data.data[6].grand_total.total_seconds

      const dailyTimeText = numeral(this.todayTimeSeconds).format('00:00:00')

      const sourceData = data.data.map((item: object) => {
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

      var goalsData = [
        {
          value: 20,
        },
      ]
      var goalsChart = new G2.Chart({
        container: 'wakatime_goals',
        forceFit: true,
        height: 120,
        padding: [0, 0, 30, 0],
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
        end: [Math.min(100, goalsData[0].value), 0.965],
        style: {
          stroke: '#1890FF',
          lineWidth: 20,
        },
      })
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
  },

  methods: {},
})
</script>

<style scoped lang="scss">
.el-card {
  height: 180px;

  .title {
    text-align: center;
    display: block;
    font-size: 1rem;
  }
}

.chart {
  display: block;
  width: 100%;
}

.notifications {
  display: block;

  .notification-group-panel {
    display: block;
    overflow: hidden;
    background-color: #fff;
    margin-bottom: 1rem;
    border: 1px solid #ddd;

    .group-title {
      display: flex;
      background-color: #f3f3f3;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid #ddd;
    }

    ul,
    li {
      list-style: none;
      padding: 0;
    }

    li {
      display: flex;
      padding: 0.25rem 1rem;
    }
  }
}
</style>
