import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 登录方法
  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (authError) throw authError
      user.value = data.user
      
      return { success: true }
    } catch (err) {
      error.value = err.message || '登录失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 注册方法
  async function register(email, password) {
    loading.value = true
    error.value = null
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (authError) throw authError
      user.value = data.user
      
      // 创建用户资料
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: email.split('@')[0]
          })
        
        if (profileError) throw profileError
      }
      
      return { success: true }
    } catch (err) {
      error.value = err.message || '注册失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 登出方法
  async function logout() {
    try {
      const { error: authError } = await supabase.auth.signOut()
      if (authError) throw authError
      
      user.value = null
      return { success: true }
    } catch (err) {
      error.value = err.message || '登出失败'
      return { success: false, error: error.value }
    }
  }

  // 检查当前登录状态
  async function checkAuth() {
    try {
      const { data } = await supabase.auth.getSession()
      user.value = data.session?.user || null
      return { isLoggedIn: !!user.value }
    } catch (err) {
      error.value = err.message
      user.value = null
      return { isLoggedIn: false }
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth
  }
})