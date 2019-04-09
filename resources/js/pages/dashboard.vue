<template>
  <div class="main-container">
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card shadow="always">
          <span class="title">Total Stars</span>
          <h3>{{ totalStars }}</h3>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="always">
          提交次数热力图
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="always">
          {{ stats.data && stats.data.human_readable_total }}
          <div class="chart" id="wakatime_chart" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12" style="margin-top: 20px;">
      <el-col :span="16">
        <ul>
          <li v-for="notification in notifications" :key="notification.id">
            <div>{{ notification.subject.title }}</div>
          </li>
        </ul>
      </el-col>
      <el-col :span="8">
        <el-table :data="repos"
                  stripe
                  border
                  height="500"
                  style="width: 100%"
        >
          <el-table-column prop="name" label="Name" width="120" />
          <el-table-column prop="stargazers_count" label="Stars" width="120" />
          <el-table-column prop="forks_count" label="Forks" width="120" />
          <el-table-column prop="watchers_count" label="Watchers" width="120" />
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash'
import Octokit from '@octokit/rest'
import G2 from '@antv/g2'

export default {
  data () {
    return {
      repos: [],
      notifications: [],
      stats: {},
    }
  },

  computed: {
    totalStars () {
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

    // octokit.activity.listNotifications().then(({ data }) => {
    //   this.notifications = data
    // })

    // WAKATIME 7 天分析数据
    this.axios.get('wakatime/stats').then(({ data }) => {
      this.stats = data
    })

    // WAKATIME 最近 7 天统计
    this.axios.get('wakatime/summaries').then(({ data }) => {
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
</style>
