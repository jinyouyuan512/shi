<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useUserStore } from './stores/user'
import AppHeader from './components/AppHeader.vue'

const userStore = useUserStore()

onMounted(async () => {
  // 页面加载时检查用户登录状态
  await userStore.checkAuth()
})
</script>

<template>
  <el-container class="app-container">
    <el-header>
      <AppHeader />
    </el-header>
    <el-main>
      <RouterView />
    </el-main>
    <el-footer>
      <div class="footer-content">
        <p>© {{ new Date().getFullYear() }} 诗词赏析网 | 墨韵诗社</p>
      </div>
    </el-footer>
  </el-container>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: "思源宋体", "SimSun", "宋体", serif;
}

#app {
  height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-main {
  flex: 1;
  padding: 20px;
  background-color: #f9f6f2;
}

.el-header {
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.el-footer {
  background-color: #2c3e50;
  color: #fff;
  text-align: center;
  padding: 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
