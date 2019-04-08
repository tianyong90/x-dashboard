<template>
  <div class="">
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">GH-DASHBOARD</a>
    </nav>
    <div class="container-fluid content-container">
      <div class="row">
        <main role="main" class="col-md-12 px-4">
          <div class="row">
            <div class="card-deck col-12 mb-4">
              <div class="card shadow">
                <div class="card-body">
                  <span class="title">Total Stars</span>
                  <h3>{{ totalStars }}</h3>
                </div>
              </div>
              <div class="card shadow">
                <div class="card-body">
                  提交次数热力图
                </div>
              </div>
              <div class="card shadow">
                <div class="card-body">
                  {{ stats.data && stats.data.human_readable_total }}
                  <div class="chart" id="wakatime_chart" />
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-6">
              <div
                class="card"
                v-for="notification in notifications"
                :key="notification.id"
              >
                <div>{{ notification.subject.title }}</div>
              </div>
            </div>

            <div class="col-6">
              <div class="table-responsive">
                <table class="table table-striped table-sm table-repos">
                  <thead>
                    <tr>
                      <td>#</td>
                      <td>Name</td>
                      <td>Stars</td>
                      <td>Forks</td>
                      <td>Watchers</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(repo, index) in repos" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ repo.name }}</td>
                      <td>{{ repo.stargazers_count }}</td>
                      <td>{{ repo.forks_count }}</td>
                      <td>{{ repo.watchers_count }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
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

    this.axios.get('wakatime/stats').then(({ data }) => {
      this.stats = data

      console.log(this.stats)
    })
  },

  methods: {},
}
</script>

<style scoped lang="scss">
.content-container {
  margin-top: 50px;
}

.table-repos {
  display: block;
  overflow: scroll;
  width: 100%;
  height: 500px;
}
</style>
