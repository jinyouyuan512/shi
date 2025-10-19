<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useCollectionsStore } from '../stores/collections'
import { usePoemsStore } from '../stores/poems'

const router = useRouter()
const userStore = useUserStore()
const collectionsStore = useCollectionsStore()
const poemsStore = usePoemsStore()

const activeTab = ref('collections')
const collections = ref([])
const comments = ref([])
const loading = ref(false)

const user = computed(() => userStore.user)
const isLoggedIn = computed(() => !!userStore.user)

onMounted(async () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  
  await fetchUserData()
})

// 获取用户数据
const fetchUserData = async () => {
  loading.value = true
  try {
    if (activeTab.value === 'collections') {
      await fetchUserCollections()
    } else {
      await fetchUserComments()
    }
  } finally {
    loading.value = false
  }
}

// 获取用户收藏
const fetchUserCollections = async () => {
  const result = await collectionsStore.fetchUserCollections()
  if (result.success) {
    collections.value = result.data
    
    // 获取收藏的诗词详情
    for (const collection of collections.value) {
      const poemResult = await poemsStore.fetchPoemById(collection.poem_id)
      if (poemResult.success) {
        collection.poem = poemResult.data
      }
    }
  }
}

// 获取用户评论
const fetchUserComments = async () => {
  const result = await collectionsStore.fetchUserComments()
  if (result.success) {
    comments.value = result.data
    
    // 获取评论的诗词标题
    for (const comment of comments.value) {
      const poemResult = await poemsStore.fetchPoemById(comment.poem_id)
      if (poemResult.success) {
        comment.poem = poemResult.data
      }
    }
  }
}

// 切换标签页
const handleTabChange = () => {
  fetchUserData()
}

// 跳转到诗词详情页
const goToPoemDetail = (poemId) => {
  router.push(`/poem/${poemId}`)
}

// 取消收藏
const removeCollection = async (poemId) => {
  const result = await collectionsStore.removeCollection(poemId)
  if (result.success) {
    ElMessage.success('已取消收藏')
    collections.value = collections.value.filter(c => c.poem_id !== poemId)
  } else {
    ElMessage.error(result.error || '取消收藏失败')
  }
}

// 格式化时间
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="profile-container">
    <template v-if="isLoggedIn">
      <div class="profile-header">
        <el-avatar :size="80">{{ user.email.charAt(0).toUpperCase() }}</el-avatar>
        <h2>{{ user.email }}</h2>
      </div>
      
      <div class="profile-content">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="我的收藏" name="collections">
            <el-skeleton :loading="loading" animated :count="3" v-if="loading">
              <template #template>
                <div style="padding: 20px; margin-bottom: 20px; background: #fff;">
                  <el-skeleton-item variant="h3" style="width: 50%" />
                  <el-skeleton-item variant="text" style="margin-top: 10px; width: 100%" />
                </div>
              </template>
            </el-skeleton>
            
            <template v-else>
              <el-empty description="暂无收藏" v-if="collections.length === 0" />
              
              <el-card 
                v-for="collection in collections" 
                :key="collection.id" 
                class="collection-card"
              >
                <div class="collection-header">
                  <h3 @click="goToPoemDetail(collection.poem_id)">
                    {{ collection.poem?.title || '未知诗词' }}
                  </h3>
                  <el-button 
                    type="danger" 
                    size="small" 
                    @click.stop="removeCollection(collection.poem_id)"
                    icon="Delete"
                    circle
                  />
                </div>
                
                <div class="collection-content" @click="goToPoemDetail(collection.poem_id)">
                  <p v-if="collection.poem">
                    {{ collection.poem.content.split('\n')[0] }}...
                  </p>
                  <p v-else>加载中...</p>
                </div>
              </el-card>
            </template>
          </el-tab-pane>
          
          <el-tab-pane label="我的评论" name="comments">
            <el-skeleton :loading="loading" animated :count="3" v-if="loading">
              <template #template>
                <div style="padding: 20px; margin-bottom: 20px; background: #fff;">
                  <el-skeleton-item variant="h3" style="width: 50%" />
                  <el-skeleton-item variant="text" style="margin-top: 10px; width: 100%" />
                  <el-skeleton-item variant="text" style="margin-top: 10px; width: 100%" />
                </div>
              </template>
            </el-skeleton>
            
            <template v-else>
              <el-empty description="暂无评论" v-if="comments.length === 0" />
              
              <el-card 
                v-for="comment in comments" 
                :key="comment.id" 
                class="comment-card"
                @click="goToPoemDetail(comment.poem_id)"
              >
                <div class="comment-header">
                  <h3>{{ comment.poem?.title || '未知诗词' }}</h3>
                  <span class="comment-time">{{ formatDate(comment.created_at) }}</span>
                </div>
                
                <div class="comment-content">
                  <p>{{ comment.content }}</p>
                </div>
              </el-card>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
    
    <el-result
      v-else
      icon="warning"
      title="未登录"
      sub-title="请先登录后再访问个人中心"
    >
      <template #extra>
        <el-button type="primary" @click="router.push('/login')">去登录</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.profile-header h2 {
  margin-top: 15px;
  color: #2c3e50;
}

.profile-content {
  margin-top: 20px;
}

.collection-card, .comment-card {
  margin-bottom: 20px;
  cursor: pointer;
}

.collection-header, .comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.collection-header h3, .comment-header h3 {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.collection-header h3:hover, .comment-header h3:hover {
  color: #409EFF;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.collection-content, .comment-content {
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .collection-header, .comment-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .comment-time {
    margin-top: 5px;
  }
}
</style>