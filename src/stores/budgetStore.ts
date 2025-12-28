import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

// Sesuaikan interface dengan struct Go Backend
export interface BudgetEntry {
    id: number
    user_id: number
    kategori: string
    nama_item: string
    jumlah: number
    jenis: 'pemasukan' | 'pengeluaran'
    created_at: string
}

export interface BudgetSummary {
    total_pemasukan: number
    total_pengeluaran: number
    sisa_anggaran: number
    detail: Record<string, BudgetEntry[]> // Record karena backend kirim Map[string]
}

export const useBudgetStore = defineStore('budget', () => {
    const budgetData = ref<BudgetSummary | null>(null)
    const isLoading = ref(false)
    const error = ref('')
    const fetchBudget = async (month?: number, year?: number) => {
        isLoading.value = true
        try {
            let url = '/api/budget'
            if (month && year) {
                url += `?month=${month}&year=${year}`
            }
            const { data } = await api.get(url)
            if (data.success) {
                budgetData.value = data.data
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Gagal memuat data'
        } finally {
            isLoading.value = false
        }
    }

    const addEntry = async (payload: { kategori: string; nama_item: string; jumlah: number; jenis: string }) => {
        try {
            await api.post('/api/budget', payload)
            await fetchBudget()
            return true
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Gagal menambah data')
        }
    }

    const deleteEntry = async (id: number) => {
        try {
            await api.delete(`/api/budget/${id}`)
            // Refresh data setelah berhasil hapus
            await fetchBudget()
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Gagal menghapus data')
        }
    }

    return { budgetData, isLoading, error, fetchBudget, addEntry, deleteEntry }
})