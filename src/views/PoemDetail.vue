<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemsStore } from '../stores/poems'
import { useUserStore } from '../stores/user'
import { useCollectionsStore } from '../stores/collections'
import CommentForm from '../components/CommentForm.vue'
import CommentList from '../components/CommentList.vue'
import AiAssistant from '../components/AiAssistant.vue'

const route = useRoute()
const router = useRouter()
const poemsStore = usePoemsStore()
const userStore = useUserStore()
const collectionsStore = useCollectionsStore()

const poem = ref(null)
const loading = ref(false)
const activeTab = ref('translation')
const isCollected = ref(false)
const collectLoading = ref(false)
const commentListRef = ref(null)

const isLoggedIn = computed(() => !!userStore.user)

onMounted(async () => {
  const poemId = route.params.id
  if (!poemId) {
    router.push('/')
    return
  }
  
  await fetchPoemDetail(poemId)
  
  if (isLoggedIn.value) {
    await checkCollectionStatus(poemId)
  }
})

// 获取诗词详情
const fetchPoemDetail = async (poemId) => {
  loading.value = true
  try {
    const result = await poemsStore.fetchPoemById(poemId)
    if (result.success) {
      poem.value = result.data
    } else {
      ElMessage.error('获取诗词详情失败')
    }
  } finally {
    loading.value = false
  }
}

// 检查收藏状态
const checkCollectionStatus = async (poemId) => {
  const result = await collectionsStore.checkIfCollected(poemId)
  isCollected.value = result.isCollected
}

// 切换收藏状态
const toggleCollection = async () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  
  collectLoading.value = true
  try {
    if (isCollected.value) {
      const result = await collectionsStore.removeCollection(poem.value.id)
      if (result.success) {
        isCollected.value = false
        ElMessage.success('已取消收藏')
      } else {
        ElMessage.error(result.error || '取消收藏失败')
      }
    } else {
      const result = await collectionsStore.addCollection(poem.value.id)
      if (result.success) {
        isCollected.value = true
        ElMessage.success('收藏成功')
      } else {
        ElMessage.error(result.error || '收藏失败')
      }
    }
  } finally {
    collectLoading.value = false
  }
}

// 跳转到作者页面
const goToAuthor = () => {
  if (poem.value && poem.value.author) {
    router.push(`/author/${poem.value.author.id}`)
  }
}
</script>

<template>
  <div class="poem-detail-container">
    <el-skeleton :loading="loading" animated v-if="loading">
      <template #template>
        <div style="padding: 20px">
          <el-skeleton-item variant="h1" style="width: 50%" />
          <el-skeleton-item variant="text" style="margin-top: 16px; width: 80%" />
          <el-skeleton-item variant="text" style="margin-top: 16px; width: 80%" />
          <el-skeleton-item variant="text" style="margin-top: 16px; width: 80%" />
        </div>
      </template>
    </el-skeleton>
    
    <template v-else-if="poem">
      <div class="poem-header">
        <div class="poem-title">
          <h1>{{ poem.title }}</h1>
          <div class="poem-author" @click="goToAuthor">
            <el-tag size="small">{{ poem.author.dynasty }}</el-tag>
            <span>{{ poem.author.name }}</span>
          </div>
        </div>
        
        <div class="poem-actions">
          <el-button 
            :type="isCollected ? 'danger' : 'primary'"
            :loading="collectLoading"
            @click="toggleCollection"
            circle
          >
            <el-icon><Star /></el-icon>
          </el-button>
        </div>
      </div>
      
      <div class="poem-content">
        <p v-for="(line, index) in poem.content.split('\n')" :key="index">
          {{ line }}
        </p>
      </div>
      
      <div class="poem-details">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="译文" name="translation">
            <div class="tab-content">
              <p>{{ poem.translation }}</p>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="赏析" name="appreciation">
            <div class="tab-content">
              <p v-if="poem.appreciation && poem.appreciation.length > 0">
                {{ poem.appreciation[0].content }}
              </p>
              <p v-else>暂无赏析内容</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <div class="comments-section">
        <h2>评论区</h2>
        
        <CommentForm 
          :poem-id="poem.id" 
          @comment-added="commentListRef.refreshComments()"
        />
        
        <CommentList 
          ref="commentListRef"
          :poem-id="poem.id" 
        />
      </div>
    </template>
    
    <el-result
      v-else
      icon="error"
      title="未找到诗词"
      sub-title="您请求的诗词不存在或已被删除"
    >
      <template #extra>
        <el-button type="primary" @click="router.push('/')">返回首页</el-button>
      </template>
    </el-result>
    
    <!-- AI助手组件 -->
    <AiAssistant v-if="poem" :poem="poem" />
  </div>
</template>

<style scoped>
.poem-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.poem-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.poem-title h1 {
  font-size: 28px;
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.poem-author {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.poem-author:hover span {
  color: #409EFF;
}

.poem-content {
  font-size: 20px;
  line-height: 1.8;
  text-align: center;
  margin: 30px 0;
  white-space: pre-wrap;
}

.poem-details {
  margin: 30px 0;
}

.tab-content {
  padding: 20px 0;
  font-size: 16px;
  line-height: 1.8;
}

.comments-section {
  margin-top: 40px;
}

.comments-section h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .poem-header {
    flex-direction: column;
  }
  
  .poem-actions {
    margin-top: 20px;
  }
}
</style>