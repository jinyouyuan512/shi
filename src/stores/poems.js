import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const usePoemsStore = defineStore('poems', () => {
  const poems = ref([])
  const currentPoem = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 获取诗词列表
  async function fetchPoems(filters = {}) {
    loading.value = true
    error.value = null
    try {
      let query = supabase.from('poems').select(`
        *,
        author:author_id (
          id,
          name,
          dynasty
        )
      `)
      
      if (filters.title) {
        query = query.ilike('title', `%${filters.title}%`)
      }
      
      if (filters.author) {
        query = query.ilike('author.name', `%${filters.author}%`)
      }
      
      if (filters.content) {
        query = query.ilike('content', `%${filters.content}%`)
      }
      
      if (filters.dynasty) {
        query = query.eq('dynasty', filters.dynasty)
      }
      
      const { data, error: queryError } = await query
      
      if (queryError) throw queryError
      poems.value = data
      
      return { success: true, data: poems.value }
    } catch (err) {
      error.value = err.message || '获取诗词列表失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 获取单首诗词详情
  async function fetchPoemById(id) {
    loading.value = true
    error.value = null
    try {
      const { data, error: queryError } = await supabase
        .from('poems')
        .select(`
          *,
          author:author_id (*),
          appreciation (*)
        `)
        .eq('id', id)
        .single()
      
      if (queryError) throw queryError
      currentPoem.value = data
      
      return { success: true, data: currentPoem.value }
    } catch (err) {
      error.value = err.message || '获取诗词详情失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 获取作者相关诗词
  async function fetchPoemsByAuthor(authorId) {
    loading.value = true
    error.value = null
    try {
      const { data, error: queryError } = await supabase
        .from('poems')
        .select(`
          *,
          author:author_id (*)
        `)
        .eq('author_id', authorId)
      
      if (queryError) throw queryError
      return { success: true, data }
    } catch (err) {
      error.value = err.message || '获取作者诗词失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    poems,
    currentPoem,
    loading,
    error,
    fetchPoems,
    fetchPoemById,
    fetchPoemsByAuthor
  }
})