<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  initialQuery: {
    type: String,
    default: ''
  },
  initialType: {
    type: String,
    default: 'title'
  }
})

const emit = defineEmits(['search'])

const searchQuery = ref(props.initialQuery)
const searchType = ref(props.initialType)

const handleSearch = () => {
  emit('search', {
    query: searchQuery.value,
    type: searchType.value
  })
}
</script>

<template>
  <div class="search-container">
    <el-input
      v-model="searchQuery"
      placeholder="搜索诗词..."
      class="search-input"
      @keyup.enter="handleSearch"
    >
      <template #prepend>
        <el-select v-model="searchType" style="width: 100px">
          <el-option label="标题" value="title" />
          <el-option label="作者" value="author" />
          <el-option label="内容" value="content" />
        </el-select>
      </template>
      <template #append>
        <el-button @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<style scoped>
.search-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
}
</style>