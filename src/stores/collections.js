import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'
import { supabase } from '../supabase'

export const useCollectionsStore = defineStore('collections', () => {
  const userStore = useUserStore()
  const collections = ref([])
  const comments = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 获取用户收藏列表
  async function fetchUserCollections() {
    if (!userStore.user) return { success: false, error: '用户未登录' }
    
    loading.value = true
    error.value = null
    try {
      const { data, error: queryError } = await supabase
        .from('collections')
        .select(`
          *,
          poem:poem_id (*)
        `)
        .eq('user_id', userStore.user.id)
      
      if (queryError) throw queryError
      collections.value = data
      
      return { success: true, data: collections.value }
    } catch (err) {
      error.value = err.message || '获取收藏列表失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 添加收藏
  async function addCollection(poemId) {
    if (!userStore.user) return { success: false, error: '用户未登录' }
    
    loading.value = true
    error.value = null
    try {
      const { data, error: insertError } = await supabase
        .from('collections')
        .insert({
          user_id: userStore.user.id,
          poem_id: poemId
        })
        .select()
      
      if (insertError) throw insertError
      
      if (data && data.length > 0) {
        collections.value.push(data[0])
      }
      
      return { success: true }
    } catch (err) {
      error.value = err.message || '添加收藏失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 移除收藏
  async function removeCollection(poemId) {
    if (!userStore.user) return { success: false, error: '用户未登录' }
    
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('collections')
        .delete()
        .eq('user_id', userStore.user.id)
        .eq('poem_id', poemId)
      
      if (deleteError) throw deleteError
      
      collections.value = collections.value.filter(c => c.poem_id !== poemId)
      return { success: true }
    } catch (err) {
      error.value = err.message || '移除收藏失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 检查是否已收藏
  async function checkIfCollected(poemId) {
    if (!userStore.user) return { isCollected: false }
    
    try {
      const { data, error: queryError } = await supabase
        .from('collections')
        .select('id')
        .eq('user_id', userStore.user.id)
        .eq('poem_id', poemId)
        .maybeSingle()
      
      if (queryError) throw queryError
      return { isCollected: !!data }
    } catch (err) {
      error.value = err.message
      return { isCollected: false }
    }
  }

  // 获取诗词评论
  async function fetchCommentsByPoem(poemId) {
    loading.value = true
    error.value = null
    try {
      const { data, error: queryError } = await supabase
        .from('comments')
        .select(`
          *,
          user:user_id (
            id,
            username
          )
        `)
        .eq('poem_id', poemId)
        .order('created_at', { ascending: false })
      
      if (queryError) throw queryError
      comments.value = data
      
      return { success: true, data: comments.value }
    } catch (err) {
      error.value = err.message || '获取评论失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 添加评论
  async function addComment(poemId, content) {
    if (!userStore.user) return { success: false, error: '用户未登录' }
    
    loading.value = true
    error.value = null
    try {
      const { data, error: insertError } = await supabase
        .from('comments')
        .insert({
          user_id: userStore.user.id,
          poem_id: poemId,
          content
        })
        .select(`
          *,
          user:user_id (
            id,
            username
          )
        `)
      
      if (insertError) throw insertError
      
      if (data && data.length > 0) {
        comments.value.unshift(data[0])
      }
      
      return { success: true }
    } catch (err) {
      error.value = err.message || '添加评论失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 获取用户评论历史
  async function fetchUserComments() {
    if (!userStore.user) return { success: false, error: '用户未登录' }
    
    loading.value = true
    error.value = null
    try {
      const { data, error: queryError } = await supabase
        .from('comments')
        .select(`
          *,
          poem:poem_id (
            id,
            title
          )
        `)
        .eq('user_id', userStore.user.id)
        .order('created_at', { ascending: false })
      
      if (queryError) throw queryError
      return { success: true, data }
    } catch (err) {
      error.value = err.message || '获取评论历史失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    collections,
    comments,
    loading,
    error,
    fetchUserCollections,
    addCollection,
    removeCollection,
    checkIfCollected,
    fetchCommentsByPoem,
    addComment,
    fetchUserComments
  }
})