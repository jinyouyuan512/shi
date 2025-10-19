<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useCollectionsStore } from '../stores/collections'
import { useRouter } from 'vue-router'

const props = defineProps({
  poemId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['comment-added'])

const userStore = useUserStore()
const collectionsStore = useCollectionsStore()
const router = useRouter()

const commentContent = ref('')
const submitting = ref(false)

const isLoggedIn = computed(() => !!userStore.user)

const submitComment = async () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  
  if (!commentContent.value.trim()) {
    ElMessage.warning('评论内容不能为空')
    return
  }
  
  submitting.value = true
  try {
    const result = await collectionsStore.addComment(props.poemId, commentContent.value)
    if (result.success) {
      ElMessage.success('评论成功')
      commentContent.value = ''
      emit('comment-added')
    } else {
      ElMessage.error(result.error || '评论失败')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="comment-form-container">
    <div class="comment-form" v-if="isLoggedIn">
      <h3>发表评论</h3>
      <el-input
        v-model="commentContent"
        type="textarea"
        :rows="3"
        placeholder="写下你的评论..."
        :maxlength="500"
        show-word-limit
      />
      <div class="form-actions">
        <el-button 
          type="primary" 
          @click="submitComment" 
          :loading="submitting"
          :disabled="!commentContent.trim()"
        >
          发表评论
        </el-button>
      </div>
    </div>
    
    <div class="login-prompt" v-else>
      <p>登录后才能发表评论</p>
      <el-button type="primary" @click="router.push('/login')">
        去登录
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.comment-form-container {
  margin-bottom: 30px;
}

.comment-form h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  color: var(--text-primary);
}

.form-actions {
  margin-top: 15px;
  text-align: right;
}

.login-prompt {
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>