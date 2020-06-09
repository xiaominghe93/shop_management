<template>
  <el-container class="home-comtainer">
    <el-header>
      <div class="header-img">
        <img src="../assets/logoShop.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="collapse? '64px' : '200px'">
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="collapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <div @click="isCollapse" class="isCollapse">| | |</div>
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id + ''">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 动态绑定菜单的id,然后再绑定iconObj中id对应的icon图标类名 -->
              <i :class="fontClass[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + childItem.path"
              v-for="childItem in item.children"
              :key="childItem.id"
              @click="saveState('/' + childItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{childItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [
        // 菜单列表数据
        {
          id: 125,
          authName: '用户管理',
          path: 'users',
          children: [
            {
              id: 110,
              authName: '用户列表',
              path: 'users',
              children: [],
              order: null
            }
          ],
          order: 1
        },
        {
          id: 103,
          authName: '权限管理',
          path: 'rights',
          children: [
            {
              id: 111,
              authName: '角色列表',
              path: 'roles',
              children: [],
              order: null
            },
            {
              id: 112,
              authName: '权限列表',
              path: 'rights',
              children: [],
              order: null
            }
          ],
          order: 2
        },
        {
          id: 101,
          authName: '商品管理',
          path: 'goods',
          children: [
            {
              id: 104,
              authName: '商品列表',
              path: 'goods',
              children: [],
              order: 1
            },
            {
              id: 115,
              authName: '分类参数',
              path: 'params',
              children: [],
              order: 2
            },
            {
              id: 121,
              authName: '商品分类',
              path: 'goods_sort',
              children: [],
              order: 3
            }
          ],
          order: 3
        },
        {
          id: 102,
          authName: '订单管理',
          path: 'orders',
          children: [
            {
              id: 107,
              authName: '订单列表',
              path: 'orders',
              children: [],
              order: null
            }
          ],
          order: 4
        },
        {
          id: 145,
          authName: '数据统计',
          path: 'report',
          children: [
            {
              id: 146,
              authName: '数据报表',
              path: 'report',
              children: [],
              order: null
            }
          ],
          order: 5
        }
      ],
      fontClass: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 折叠属性
      collapse: false,
      // 子菜单激活状态的path
      activePath: ''
    }
  },
  created() {
    // 页面创建时获取子菜单激活状态的path
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      console.log(123)
      // 一般情况点击退出 先清楚token然后返回到登录页
      this.$router.push('/login')
    },
    // 点击控制菜单栏的折叠
    isCollapse() {
      this.collapse = !this.collapse
    },
    // 点击跳转到对应的页面 将该子菜单的path 存储起来
    saveState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-comtainer {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  img {
    margin-right: 20px;
  }
  .header-img {
    display: flex;
    align-items: center;
  }
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.el-menu {
  border: none;
}

.isCollapse {
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  background-color: #4a5064;
}

.iconfont {
  margin-right: 15px;
}
</style>
