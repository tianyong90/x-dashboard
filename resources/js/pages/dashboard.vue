<template>
  <div class="main-container">
    <el-row :gutter="12">
      <el-col :spab="8">
        <el-card shadow="always">
          <span class="title">Total Stars</span>
          <h3>{{ totalStars }}</h3>
        </el-card>
      </el-col>

      <el-col :spab="8">
        <el-card shadow="always">
          提交次数热力图
        </el-card>
      </el-col>

      <el-col :spab="8">
        <el-card shadow="always">
          {{ stats.data && stats.data.human_readable_total }}
          <div class="chart" id="wakatime_chart" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <ul>
          <li v-for="notification in notifications" :key="notification.id">
            <div>{{ notification.subject.title }}</div>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <el-table :data="repos"
                  stripe
                  border
                  height="300"
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

    octokit.activity.listNotifications().then(({ data }) => {
      this.notifications = data
    })

    // TODO
    // octokit.repos.getCommitActivityStats()
    //   .then(res => {
    //     console.log(res)
    // })

    // 初始化 wakatime 曲线图

    // TODO:
    // this.axios.get('wakatime/stats').then(({ data }) => {
    //   this.stats = data
    //
    //   console.log(this.stats)
    // })
  },

  methods: {},
}
</script>

<style scoped lang="scss"></style>
