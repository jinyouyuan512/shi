<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import SearchBar from './SearchBar.vue'

const router = useRouter()
const userStore = useUserStore()

const searchQuery = ref('')
const searchType = ref('title')
const activeIndex = ref('1')

const isLoggedIn = computed(() => !!userStore.user)

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  
  router.push({
    path: '/',
    query: {
      q: searchQuery.value,
      type: searchType.value
    }
  })
}

// 处理搜索组件提交
const handleSearchSubmit = (searchData) => {
  searchQuery.value = searchData.query
  searchType.value = searchData.type
  handleSearch()
}

const handleSelect = (key) => {
  switch (key) {
    case '1':
      router.push('/')
      break
    case '2':
      router.push('/login')
      break
    case '3':
      router.push('/register')
      break
    case '4':
      router.push('/profile')
      break
    case '5':
      logout()
      break
  }
}

const logout = async () => {
  await userStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="header-container">
    <div class="header-content">
      <div class="logo" @click="router.push('/')">
        <h1>墨韵诗社</h1>
      </div>
      
      <div class="search-box">
        <search-bar
          :initial-query="searchQuery"
          :initial-type="searchType"
          @search="handleSearchSubmit"
        />
      </div>
      
      <div class="nav-menu">
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          @select="handleSelect"
          background-color="transparent"
          text-color="#333"
          active-text-color="#409EFF"
        >
          <el-menu-item index="1">首页</el-menu-item>
          <template v-if="!isLoggedIn">
            <el-menu-item index="2">登录</el-menu-item>
            <el-menu-item index="3">注册</el-menu-item>
          </template>
          <template v-else>
            <el-menu-item index="4">个人中心</el-menu-item>
            <el-menu-item index="5">退出</el-menu-item>
          </template>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  width: 100%;
  height: 60px;
}

.header-content {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo {
  cursor: pointer;
}

.logo h1 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
  font-weight: bold;
}

.search-box {
  flex: 1;
  max-width: 500px;
  margin: 0 20px;
}

.search-input {
  width: 100%;
}

.nav-menu {
  display: flex;
  align-items: center;
}

.el-menu {
  border-bottom: none;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 10px;
  }
  
  .search-box {
    margin: 10px 0;
    max-width: 100%;
  }
  
  .header-container {
    height: auto;
  }
}
</style>