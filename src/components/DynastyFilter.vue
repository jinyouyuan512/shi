<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  initialValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['change'])

const selectedDynasty = ref(props.initialValue)

const dynasties = [
  { label: '全部朝代', value: '' },
  { label: '先秦', value: '先秦' },
  { label: '两汉', value: '两汉' },
  { label: '魏晋', value: '魏晋' },
  { label: '南北朝', value: '南北朝' },
  { label: '隋代', value: '隋代' },
  { label: '唐代', value: '唐代' },
  { label: '五代', value: '五代' },
  { label: '宋代', value: '宋代' },
  { label: '金朝', value: '金朝' },
  { label: '元代', value: '元代' },
  { label: '明代', value: '明代' },
  { label: '清代', value: '清代' },
  { label: '近现代', value: '近现代' }
]

const handleChange = (value) => {
  selectedDynasty.value = value
  emit('change', value)
}
</script>

<template>
  <div class="dynasty-filter">
    <el-radio-group 
      v-model="selectedDynasty" 
      size="large"
      @change="handleChange"
    >
      <el-radio-button 
        v-for="dynasty in dynasties" 
        :key="dynasty.value" 
        :label="dynasty.value"
      >
        {{ dynasty.label }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<style scoped>
.dynasty-filter {
  margin: 20px 0;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 10px;
}

@media (max-width: 768px) {
  .dynasty-filter {
    padding: 0 10px;
  }
}
</style>