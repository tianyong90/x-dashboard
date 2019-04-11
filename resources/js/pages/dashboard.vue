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
          <github-calendar />
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
      <el-col :span="9">
        <div class="notifications-panel">
          <ul>
            <li v-for="notification in notifications" :key="notification.id">
              <div>hello world</div>
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
import Vue from 'vue'
import _ from 'lodash'
import Octokit from '@octokit/rest'
import numeral from 'numeral'
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
      this.notifications = _.groupBy(data, item => {
        return item.repository.full_name
      })
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
})
</script>

<style scoped lang="scss">
.el-card {
  height: 180px;
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
