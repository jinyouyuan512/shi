<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  poem: {
    type: Object,
    default: null
  },
  isHomePage: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const question = ref('')
const answer = ref('')
const loading = ref(false)
const showAssistant = ref(false)

// 预设问题列表
const presetQuestions = computed(() => {
  if (props.isHomePage) {
    return [
      '推荐一些唐代经典诗词',
      '如何欣赏古诗词的意境？',
      '诗词中常见的意象有哪些？',
      '如何区分诗和词？',
      '中国古代有哪些著名的诗人？'
    ]
  } else if (props.poem) {
    return [
      `解析《${props.poem.title}》的意境`,
      `《${props.poem.title}》的写作背景是什么？`,
      `${props.poem.author.name}的生平简介`,
      `这首诗用了哪些修辞手法？`,
      `这首诗的韵律格式是什么？`
    ]
  } else {
    return [
      '推荐一些经典诗词',
      '如何欣赏古诗词？',
      '中国古代有哪些著名的诗人？'
    ]
  }
})

// 模拟AI回答
const generateAnswer = async (q) => {
  loading.value = true
  question.value = q
  
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (props.isHomePage) {
      // 主页模式的回答
      if (q.includes('推荐') && q.includes('唐代')) {
        answer.value = '唐代是中国诗歌的黄金时期，有许多经典作品值得推荐：\n\n1. 李白的《静夜思》、《望庐山瀑布》\n2. 杜甫的《春望》、《登高》\n3. 王维的《山居秋暝》、《鹿柴》\n4. 孟浩然的《春晓》\n5. 白居易的《长恨歌》\n\n这些作品各具特色，展现了唐诗的不同风格和艺术魅力。'
      } else if (q.includes('欣赏') && q.includes('意境')) {
        answer.value = '欣赏古诗词的意境需要从以下几个方面入手：\n\n1. 了解历史背景和作者生平\n2. 细读诗词内容，理解字面含义\n3. 感受诗中的情感和氛围\n4. 想象诗中描绘的场景\n5. 体会诗人表达的思想情感\n\n通过反复诵读和思考，逐渐领悟诗词的艺术魅力和深层含义。'
      } else if (q.includes('意象')) {
        answer.value = '中国古诗词中常见的意象包括：\n\n1. 自然景物：月亮、山水、花草、雪\n2. 动物：鸟、鹤、鱼、蝉\n3. 季节：春、夏、秋、冬\n4. 人文景观：楼台、亭阁、长城\n5. 日常物品：酒、琴、剑、扇\n\n这些意象往往承载着特定的文化内涵和情感象征，是诗人表达思想情感的重要载体。'
      } else if (q.includes('区分') && (q.includes('诗') || q.includes('词'))) {
        answer.value = '诗和词的主要区别：\n\n1. 体制不同：诗有古体诗和近体诗，词则有长短句\n2. 音律要求：诗讲究平仄，词则有固定的词牌格式\n3. 表现内容：诗多表现宏大主题，词则多抒发细腻情感\n4. 历史发展：诗的发展早于词，词在唐末宋初兴起\n\n简单来说，诗可以吟诵，词则需要配乐歌唱，这也是它们最初的区别。'
      } else if (q.includes('著名') && q.includes('诗人')) {
        answer.value = '中国古代著名诗人包括：\n\n1. 先秦：屈原、宋玉\n2. 汉代：司马相如、班固\n3. 魏晋：曹操、曹植、陶渊明\n4. 唐代：李白、杜甫、白居易、王维、李商隐\n5. 宋代：苏轼、李清照、辛弃疾、陆游\n6. 元明清：马致远、汤显祖、龚自珍\n\n这些诗人各有特色，为中国古典诗词留下了宝贵的文化遗产。'
      } else {
        answer.value = `关于"${q}"，这是一个很好的问题。中国古典诗词博大精深，有着悠久的历史和丰富的内涵。建议您可以从阅读一些经典作品入手，逐步了解诗词的基本知识和欣赏方法，感受其中的艺术魅力。`
      }
    } else if (props.poem) {
      // 诗词详情页模式的回答
      if (q.includes('意境')) {
        answer.value = `《${props.poem.title}》的意境十分优美。${props.poem.author.name}通过精炼的语言，营造了一种${props.poem.author.dynasty}特有的氛围。这首诗通过${props.poem.content.split('\n')[0]}等意象，展现了诗人内心的情感世界，读来令人回味无穷。`
      } else if (q.includes('背景')) {
        answer.value = `《${props.poem.title}》创作于${props.poem.author.dynasty}时期，当时${props.poem.author.name}可能正处于人生的重要阶段。这首诗反映了当时的社会环境和诗人的个人经历，是了解那个时代的重要文学作品。`
      } else if (q.includes('生平')) {
        answer.value = `${props.poem.author.name}是${props.poem.author.dynasty}著名诗人，一生创作了大量脍炙人口的诗词作品。他的诗歌风格鲜明，对后世产生了深远影响。《${props.poem.title}》是其代表作之一，充分展现了他的艺术才华。`
      } else if (q.includes('修辞')) {
        answer.value = `《${props.poem.title}》中运用了多种修辞手法，如比喻、拟人、对偶等。特别是"${props.poem.content.split('\n')[0]}"这一句，运用了绝妙的意象，使诗歌更加生动形象，增强了艺术感染力。`
      } else if (q.includes('韵律')) {
        answer.value = `《${props.poem.title}》采用了${props.poem.author.dynasty}常见的格律形式，属于近体诗中的${props.poem.content.split('\n').length === 4 ? '绝句' : '律诗'}。全诗平仄协调，韵脚工整，体现了${props.poem.author.name}精湛的诗歌技巧。`
      } else {
        answer.value = `关于"${q}"，这是一个很好的问题。《${props.poem.title}》作为${props.poem.author.name}的代表作之一，确实值得深入研究。建议您结合诗歌内容和历史背景，从多角度理解这首诗的艺术价值和文化意义。`
      }
    } else {
      // 默认回答
      answer.value = `关于"${q}"，这是一个很好的问题。中国古典诗词博大精深，有着悠久的历史和丰富的内涵。建议您可以从阅读一些经典作品入手，逐步了解诗词的基本知识和欣赏方法，感受其中的艺术魅力。`
    }
  } finally {
    loading.value = false
  }
}

// 切换助手显示状态
const toggleAssistant = () => {
  showAssistant.value = !showAssistant.value
  if (!showAssistant.value) {
    emit('close')
  }
}

// 点击预设问题
const askPresetQuestion = (q) => {
  generateAnswer(q)
}

// 提交自定义问题
const submitQuestion = () => {
  if (question.value.trim()) {
    generateAnswer(question.value)
  }
}
</script>

<template>
  <div class="ai-assistant-container">
    <el-button 
      type="primary" 
      class="toggle-button"
      @click="toggleAssistant"
      circle
    >
      <el-icon v-if="!showAssistant"><ChatDotRound /></el-icon>
      <el-icon v-else><Close /></el-icon>
    </el-button>
    
    <div class="assistant-panel" v-if="showAssistant">
      <div class="assistant-header">
        <h3>诗词智能助手</h3>
        <el-button 
          type="text" 
          @click="toggleAssistant"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      
      <div class="assistant-content">
        <div class="preset-questions">
          <p class="section-title">你可能想问：</p>
          <div class="question-tags">
            <el-tag
              v-for="(q, index) in presetQuestions"
              :key="index"
              @click="askPresetQuestion(q)"
              class="question-tag"
              effect="plain"
            >
              {{ q }}
            </el-tag>
          </div>
        </div>
        
        <div class="question-input">
          <el-input
            v-model="question"
            placeholder="输入你的问题..."
            :disabled="loading"
            @keyup.enter="submitQuestion"
          >
            <template #append>
              <el-button @click="submitQuestion" :loading="loading">
                提问
              </el-button>
            </template>
          </el-input>
        </div>
        
        <div class="answer-area" v-if="answer">
          <div class="question-display">
            <el-tag type="info" effect="plain">{{ question }}</el-tag>
          </div>
          <div class="answer-content">
            <el-skeleton :loading="loading" animated>
              <template #template>
                <div style="padding: 10px">
                  <el-skeleton-item variant="p" style="width: 100%" />
                  <el-skeleton-item variant="p" style="width: 100%" />
                  <el-skeleton-item variant="p" style="width: 60%" />
                </div>
              </template>
              <template #default>
                <p style="white-space: pre-line">{{ answer }}</p>
              </template>
            </el-skeleton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-assistant-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.toggle-button {
  width: 50px;
  height: 50px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.assistant-panel {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 350px;
  max-height: 500px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.assistant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  background-color: var(--primary-color, #2c3e50);
  color: #fff;
}

.assistant-header h3 {
  margin: 0;
  font-size: 16px;
}

.assistant-content {
  padding: 15px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 400px;
}

.section-title {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
}

.question-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.question-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.question-tag:hover {
  background-color: #ecf5ff;
}

.question-input {
  margin-top: 10px;
}

.answer-area {
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.question-display {
  margin-bottom: 10px;
}

.answer-content {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
}

.answer-content p {
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .assistant-panel {
    width: 300px;
    max-height: 400px;
    right: -10px;
  }
}
</style>