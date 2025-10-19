<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemsStore } from '../stores/poems'
import PoemCard from '../components/PoemCard.vue'
import SearchBar from '../components/SearchBar.vue'
import DynastyFilter from '../components/DynastyFilter.vue'
import AiAssistant from '../components/AiAssistant.vue'

const route = useRoute()
const router = useRouter()
const poemsStore = usePoemsStore()

const poems = ref([])
const loading = ref(false)
const searchQuery = ref('')
const searchType = ref('title')
const selectedDynasty = ref('')

// 监听路由查询参数变化
watch(
  () => route.query,
  (query) => {
    if (query.q) {
      searchQuery.value = query.q
      searchType.value = query.type || 'title'
      searchPoems()
    }
  },
  { immediate: true }
)

// 处理朝代选择变化
const handleDynastyChange = (dynasty) => {
  selectedDynasty.value = dynasty
  searchPoems()
}

onMounted(async () => {
  if (!route.query.q) {
    await fetchRecommendedPoems()
  }
})

// 获取推荐诗词
const fetchRecommendedPoems = async () => {
  loading.value = true
  try {
    const result = await poemsStore.fetchPoems()
    if (result.success) {
      poems.value = result.data
    }
  } finally {
    loading.value = false
  }
}

// 搜索诗词
const searchPoems = async () => {
  if (!searchQuery.value && !selectedDynasty.value) {
    await fetchRecommendedPoems()
    return
  }
  
  loading.value = true
  try {
    const filters = {}
    
    if (searchQuery.value) {
      filters[searchType.value] = searchQuery.value
    }
    
    if (selectedDynasty.value) {
      filters.dynasty = selectedDynasty.value
    }
    
    const result = await poemsStore.fetchPoems(filters)
    if (result.success) {
      poems.value = result.data
    }
  } finally {
    loading.value = false
  }
}

// 跳转到诗词详情页
const goToPoemDetail = (poemId) => {
  router.push(`/poem/${poemId}`)
}

// 执行搜索
const handleSearch = () => {
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
</script>

<template>
  <div class="home-container">
    <div class="banner">
      <h1>墨韵诗社</h1>
      <p>品味千年诗词，感受文化魅力</p>
      
      <div class="search-container">
        <search-bar
          :initial-query="searchQuery"
          :initial-type="searchType"
          @search="handleSearchSubmit"
        />
      </div>
    </div>
    
    <div class="filter-container">
      <dynasty-filter
        :initial-value="selectedDynasty"
        @change="handleDynastyChange"
      />
    </div>
    
    <div class="poems-container">
      <h2>{{ route.query.q ? '搜索结果' : '推荐诗词' }}</h2>
      
      <el-skeleton :loading="loading" animated :count="3" v-if="loading">
        <template #template>
          <div style="padding: 20px; border-radius: 4px; margin-bottom: 20px; background: #fff;">
            <el-skeleton-item variant="h3" style="width: 50%" />
            <el-skeleton-item variant="text" style="margin-top: 10px; width: 100%" />
            <el-skeleton-item variant="text" style="margin-top: 10px; width: 100%" />
          </div>
        </template>
      </el-skeleton>
      
      <template v-else>
        <el-empty description="暂无诗词" v-if="poems.length === 0" />
        
        <poem-card 
          v-for="poem in poems" 
          :key="poem.id" 
          :poem="poem"
        />
      </template>
    </div>
  </div>
  
  <!-- AI助手组件 -->
  <AiAssistant :isHomePage="true" />
</template>

<style scoped>
.home-container {
  max-width: 1000px;
  margin: 0 auto;
}

.banner {
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.banner h1 {
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.banner p {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.filter-container {
  margin: 20px 0;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 10px;
}

.poems-container {
  margin-top: 30px;
}

.poems-container h2 {
  font-size: 24px;
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

.poem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.poem-header h3 {
  margin: 0;
  font-size: 18px;
}

.poem-author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.poem-content {
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-wrap;
}

@media (max-width: 768px) {
  .poem-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .filter-container {
    padding: 0 10px;
  }
}
</style>