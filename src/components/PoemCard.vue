<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  poem: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()

const goToPoemDetail = () => {
  router.push(`/poem/${props.poem.id}`)
}

const goToAuthor = (event) => {
  event.stopPropagation()
  router.push(`/author/${props.poem.author.id}`)
}
</script>

<template>
  <el-card class="poem-card" @click="goToPoemDetail">
    <template #header>
      <div class="poem-header">
        <h3>{{ poem.title }}</h3>
        <div class="poem-author" @click="goToAuthor">
          <el-tag size="small">{{ poem.author.dynasty }}</el-tag>
          <span>{{ poem.author.name }}</span>
        </div>
      </div>
    </template>
    
    <div class="poem-content">
      <p v-for="(line, index) in poem.content.split('\n')" :key="index">
        {{ line }}
      </p>
    </div>
  </el-card>
</template>

<style scoped>
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
  color: var(--text-primary);
}

.poem-author {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.poem-author:hover span {
  color: var(--secondary-color);
}

.poem-content {
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-wrap;
  font-family: "楷体", "KaiTi", serif;
}

@media (max-width: 768px) {
  .poem-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>