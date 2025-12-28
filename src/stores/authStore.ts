// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || '')
    const user = ref(null)
    const router = useRouter()

    const login = async (credentials: any) => {
        try {
            const response = await api.post('/auth/login', credentials)
            const responseData = response.data
            if (responseData.success) {
                token.value = responseData.data.token
                localStorage.setItem('token', token.value)

                return true
            } else {
                throw new Error(responseData.message)
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || 'Login failed'
            throw new Error(msg)
        }
    }

    const logout = () => {
        token.value = ''
        user.value = null
        localStorage.removeItem('token')
        router.push('/signin')
    }

    return { token, user, login, logout }
})