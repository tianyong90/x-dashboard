<template>
  <div class="main-container main-with-padding">
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card shadow="always">
          用户总数 {{ stats.totalAddressedUserCount }} /
          {{ stats.totalUserCount }}
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">
          今日新增 {{ stats.todayAddressedUserCount }} /
          {{ stats.todayUserCount }}
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">
          留言数 {{ messagesCount }}
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <div class="echarts" id="pie-charts" />
      </el-col>
      <el-col :span="12" />
    </el-row>
  </div>
</template>

<script>
// import Echarts from 'echarts'

export default {
  data () {
    return {
      stats: {},
      messagesCount: 0,
    }
  },

  mounted () {
    this.getStats()
    this.getMessagesCount()
    // this.getUsersIncrement()
  },

  methods: {
    getStats () {
      this.axios
        .get('stats')
        .then(response => {
          this.stats = response.data

          const onlyResigtered = this.stats.totalUserCount - this.stats.totalVerifiedUserCount
          const onlyVerified = this.stats.totalVerifiedUserCount - this.stats.totalAddressedUserCount
          const onlyAddressedUserCount = this.stats.totalAddressedUserCount

          // let myChart = Echarts.init(document.getElementById('pie-charts'))
          //
          // const option = {
          //   title: {
          //     text: '各阶段用户比例',
          //     x: 'center',
          //   },
          //   tooltip: {
          //     trigger: 'item',
          //     formatter: '{b} : ({d}%)',
          //   },
          //   legend: {
          //     bottom: 0,
          //   },
          //   series: [
          //     {
          //       name: 'Amount',
          //       type: 'pie',
          //       center: ['50%', '50%'],
          //       label: {
          //         show: true,
          //       },
          //       data: [
          //         {
          //           name: '仅注册',
          //           value: onlyResigtered,
          //         },
          //         {
          //           name: '已验证邮箱',
          //           value: onlyVerified,
          //         },
          //         {
          //           name: '已设置钱包',
          //           value: onlyAddressedUserCount,
          //         },
          //       ],
          //       itemStyle: {
          //         emphasis: {
          //           shadowBlur: 10,
          //           shadowOffsetX: 0,
          //           shadowColor: 'rgba(0, 0, 0, 0.5)',
          //         },
          //       },
          //     },
          //   ],
          // }
          //
          // myChart.setOption(option)
        })
        .catch(() => {
          this.roleUsersLoading = false
        })
    },

    getMessagesCount () {
      this.axios
        .get('stats/messages-count')
        .then(response => {
          this.messagesCount = response.data.messatesCount
        })
        .catch(() => {
          this.roleUsersLoading = false
        })
    },
  },
}
</script>

<style scoped lang="scss">
.main-container {
  display: block;
  padding: 20px;
}

.echarts {
  display: block;
  margin-top: 20px;
  overflow: hidden;
  background: #fff;
  width: 100%;
  height: 500px;
}
</style>
