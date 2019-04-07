<template>
  <div class="sidebar-wrapper">
    <el-menu
      :default-active="$route.path"
      :router="true"
      :unique-opened="true"
      class="sidebar-container"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <template v-for="(item, index) in MenuConfig">
        <el-menu-item v-if="!item.subItems" :index="item.route" :key="index">
          <i class="sidebar-icon" :class="item.icon" />{{ item.title }}
        </el-menu-item>
        <el-submenu v-else :index="index.toString()" :key="index">
          <template slot="title">
            <i class="sidebar-icon" :class="item.icon" />{{ item.title }}
          </template>
          <el-menu-item
            :index="subItem.route"
            v-for="subItem in item.subItems"
            :key="subItem.index"
            v-text="subItem.title"
          />
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import 'simple-line-icons/css/simple-line-icons.css'

const MenuConfig = [
  {
    title: '控制面板',
    icon: 'icon-home',
    route: '/',
  },
  {
    title: '用户列表',
    icon: 'icon-user',
    route: '/users',
  },
  // {
  //   title: '反馈与投诉',
  //   icon: 'icon-earphones',
  //   subItems: [
  //     {
  //       title: '用户反馈',
  //       route: '/feedback'
  //     },
  //     {
  //       title: '用户投诉',
  //       route: '/complaint'
  //     }
  //   ]
  // },
  // {
  //   title: '角色和权限',
  //   icon: 'icon-shield',
  //   subItems: [
  //     {
  //       title: '角色列表',
  //       route: '/role'
  //     },
  //     {
  //       title: '权限列表',
  //       route: '/permission'
  //     }
  //   ]
  // }
]

export default {
  data () {
    return {
      MenuConfig,
    }
  },

  methods: {
    selected (index, indexPath) {},
  },
}
</script>

<style scoped lang="scss">

</style>
