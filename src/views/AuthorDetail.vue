<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemsStore } from '../stores/poems'
import PoemCard from '../components/PoemCard.vue'

const route = useRoute()
const router = useRouter()
const poemsStore = usePoemsStore()

const author = ref(null)
const authorPoems = ref([])
const loading = ref(false)

// 模拟作者数据 - 将来会从Supabase获取
const mockAuthors = [
  {
    id: 1,
    name: '李白',
    dynasty: '唐代',
    intro: '李白（701年-762年），字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。祖籍陇西成纪（今甘肃省天水市秦安县），出生于西域碎叶城（今吉尔吉斯斯坦托克马克附近）。李白存世诗文千余篇，有《李太白集》传世。762年病逝，享年61岁。',
    image: 'https://example.com/libai.jpg'
  },
  {
    id: 2,
    name: '王之涣',
    dynasty: '唐代',
    intro: '王之涣（688年-742年），字季凌，绛州龙门（今山西河津）人，唐代著名诗人。他的诗歌想象丰富，意境开阔，语言清新，多写边塞风光和战争生活，有《登鹳雀楼》《凉州词》等名篇。',
    image: 'https://example.com/wangzhihuan.jpg'
  },
  {
    id: 3,
    name: '孟浩然',
    dynasty: '唐代',
    intro: '孟浩然（689年-740年），名浩，字浩然，号孟山人，襄州襄阳（今湖北襄阳）人，唐代著名山水田园诗人。与王维合称"王孟"，有《孟浩然集》传世。',
    image: 'https://example.com/menghaoran.jpg'
  }
]

onMounted(async () => {
  const authorId = parseInt(route.params.id)
  if (!authorId) {
    router.push('/')
    return
  }
  
  await fetchAuthorDetail(authorId)
  await fetchAuthorPoems(authorId)
})

// 获取作者详情
const fetchAuthorDetail = async (authorId) => {
  loading.value = true
  try {
    // 将来添加supabase查询逻辑
    // const { data, error } = await supabase
    //   .from('authors')
    //   .select('*')
    //   .eq('id', authorId)
    //   .single()
    
    // if (error) throw error
    // author.value = data
    
    // 模拟获取作者详情
    const foundAuthor = mockAuthors.find(a => a.id === authorId)
    if (!foundAuthor) {
      throw new Error('未找到该作者')
    }
    
    author.value = foundAuthor
  } catch (err) {
    console.error('获取作者详情失败:', err)
    ElMessage.error('获取作者详情失败')
  } finally {
    loading.value = false
  }
}

// 获取作者相关诗词
const fetchAuthorPoems = async (authorId) => {
  try {
    const result = await poemsStore.fetchPoemsByAuthor(authorId)
    if (result.success) {
      authorPoems.value = result.data
    } else {
      ElMessage.error('获取作者诗词失败')
    }
  } catch (err) {
    console.error('获取作者诗词失败:', err)
  }
}

// 跳转到诗词详情页
const goToPoemDetail = (poemId) => {
  router.push(`/poem/${poemId}`)
}
</script>

<template>
  <div class="author-detail-container">
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
    
    <template v-else-if="author">
      <div class="author-header">
        <div class="author-avatar">
          <el-avatar :size="100" :src="author.image">
            {{ author.name.charAt(0) }}
          </el-avatar>
        </div>
        
        <div class="author-info">
          <h1>{{ author.name }}</h1>
          <el-tag size="large">{{ author.dynasty }}</el-tag>
        </div>
      </div>
      
      <div class="author-intro">
        <h2>作者简介</h2>
        <p>{{ author.intro }}</p>
      </div>
      
      <div class="author-poems">
        <h2>作者诗词</h2>
        
        <el-empty description="暂无诗词" v-if="authorPoems.length === 0" />
        
        <poem-card 
          v-for="poem in authorPoems" 
          :key="poem.id" 
          :poem="poem"
        />
      </div>
    </template>
    
    <el-result
      v-else
      icon="error"
      title="未找到作者"
      sub-title="您请求的作者不存在或已被删除"
    >
      <template #extra>
        <el-button type="primary" @click="router.push('/')">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.author-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.author-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.author-avatar {
  margin-right: 20px;
}

.author-info h1 {
  font-size: 28px;
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.author-intro {
  margin-bottom: 30px;
}

.author-intro h2 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #2c3e50;
}

.author-intro p {
  font-size: 16px;
  line-height: 1.8;
  text-align: justify;
}

.author-poems h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #2c3e50;
}

.poem-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.poem-card:hover {
  transform: translateY(-5px);
}

.poem-header h3 {
  margin: 0;
  font-size: 18px;
}

.poem-content {
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-wrap;
}

@media (max-width: 768px) {
  .author-header {
    flex-direction: column;
    text-align: center;
  }
  
  .author-avatar {
    margin-right: 0;
    margin-bottom: 20px;
  }
}
</style>