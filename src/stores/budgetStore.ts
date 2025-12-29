import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export interface BudgetEntry {
    id: number
    user_id: number
    kategori: string
    nama_item: string
    jumlah: number
    jenis: 'pemasukan' | 'pengeluaran'
    sumber_dana?: string,
    created_at: string
}

export interface BudgetSummary {
    total_pemasukan: number
    total_pengeluaran: number
    sisa_anggaran: number
    detail: Record<string, BudgetEntry[]>
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

    // UPDATE DI SINI: Tambahkan sumber_dana?: string ke definisi payload
    const addEntry = async (payload: {
        kategori: string;
        nama_item: string;
        jumlah: number;
        jenis: string;
        sumber_dana?: string
    }) => {
        try {
            await api.post('/api/budget', payload)
            // Refresh data setelah berhasil tambah (agar UI update otomatis)
            // Perhatikan: fetchBudget() tanpa argumen akan load bulan default (tergantung implementasi default backend/state view)
            // Jika ingin stay di bulan yang dipilih user, logic view harus handle ini,
            // tapi basic refresh di sini sudah cukup aman.
            await fetchBudget()
            return true
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Gagal menambah data')
        }
    }

    const deleteEntry = async (id: number) => {
        try {
            await api.delete(`/api/budget/${id}`)
            await fetchBudget()
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Gagal menghapus data')
        }
    }

    return { budgetData, isLoading, error, fetchBudget, addEntry, deleteEntry }
})