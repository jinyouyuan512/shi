<script setup>
import { ref, defineProps, onMounted } from 'vue'
import { useCollectionsStore } from '../stores/collections'

const props = defineProps({
  poemId: {
    type: [Number, String],
    required: true
  }
})

const collectionsStore = useCollectionsStore()

const comments = ref([])
const loading = ref(false)

onMounted(async () => {
  await fetchComments()
})

const fetchComments = async () => {
  loading.value = true
  try {
    const result = await collectionsStore.fetchCommentsByPoem(props.poemId)
    if (result.success) {
      comments.value = result.data
    }
  } finally {
    loading.value = false
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

// 刷新评论列表
const refreshComments = async () => {
  await fetchComments()
}

defineExpose({
  refreshComments
})
</script>

<template>
  <div class="comments-list">
    <h3>评论列表</h3>
    
    <el-skeleton :loading="loading" animated :count="3" v-if="loading">
      <template #template>
        <div style="padding: 20px; margin-bottom: 20px; background: #fff;">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <el-skeleton-item variant="circle" style="width: 40px; height: 40px;" />
            <div style="margin-left: 10px;">
              <el-skeleton-item variant="text" style="width: 100px;" />
              <el-skeleton-item variant="text" style="width: 80px;" />
            </div>
          </div>
          <el-skeleton-item variant="text" style="width: 100%;" />
        </div>
      </template>
    </el-skeleton>
    
    <template v-else>
      <el-empty description="暂无评论" v-if="comments.length === 0" />
      
      <el-card v-for="comment in comments" :key="comment.id" class="comment-card">
        <div class="comment-header">
          <div class="comment-user">
            <el-avatar :size="40">{{ comment.user.email.charAt(0).toUpperCase() }}</el-avatar>
            <div class="user-info">
              <span class="username">{{ comment.user.email }}</span>
              <span class="comment-time">{{ formatDate(comment.created_at) }}</span>
            </div>
          </div>
        </div>
        
        <div class="comment-content">
          {{ comment.content }}
        </div>
      </el-card>
    </template>
  </div>
</template>

<style scoped>
.comments-list {
  margin-top: 20px;
}

.comments-list h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  color: var(--text-primary);
}

.comment-card {
  margin-bottom: 20px;
}

.comment-header {
  margin-bottom: 10px;
}

.comment-user {
  display: flex;
  align-items: center;
}

.user-info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-content {
  font-size: 14px;
  line-height: 1.6;
}
</style>