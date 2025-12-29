<template>
  <div class="min-h-screen pb-24 bg-gray-50 dark:bg-gray-900/50 max-w-md mx-auto">
    <div
      class="px-5 pt-6 pb-2 bg-white dark:bg-gray-900 sticky top-0 z-20 shadow-sm border-b border-gray-100 dark:border-gray-800 transition-all duration-300">

      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold text-gray-800 dark:text-white">
            Dompet Rindah
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Overview keuangan bulan ini
          </p>
        </div>
        <button @click="handleLogout"
          class="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-colors"
          title="Keluar">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      <div class="flex gap-3 mb-4">
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input v-model="searchQuery" type="text" placeholder="Cari transaksi..."
            class="w-full pl-9 pr-4 py-2 text-xs font-medium bg-gray-100 border-none rounded-xl dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 placeholder-gray-400" />
        </div>
        <select v-model="selectedYear" @change="applyFilter"
          class="py-2 pl-3 pr-8 text-xs font-medium border-none bg-gray-100 rounded-xl dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 cursor-pointer">
          <option :value="0">Semua Thn</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>

      <div class="flex gap-2 overflow-x-auto no-scrollbar pb-2" ref="monthContainer">
        <button @click="selectedMonth = 0; applyFilter()"
          class="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
          :class="selectedMonth === 0 ? 'bg-brand-500 text-white shadow-brand-sm' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'">
          Semua
        </button>
        <button v-for="(m, index) in months" :key="index" @click="selectedMonth = index + 1; applyFilter()"
          class="month-btn whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors border border-transparent"
          :class="selectedMonth === (index + 1) ? 'bg-brand-500 text-white shadow-brand-sm' : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'">
          {{ m }}
        </button>
      </div>
    </div>

    <div class="p-5 space-y-6">
      <div v-if="budgetStore.isLoading && !budgetStore.budgetData" class="py-10 text-center">
        <div class="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3">
        </div>
        <p class="text-sm text-gray-500">Sinkronisasi data...</p>
      </div>

      <div v-else-if="budgetStore.budgetData" class="space-y-6">

        <div v-if="!searchQuery"
          class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600 to-pink-400 text-white shadow-xl shadow-brand-500/20 p-6 transition-all duration-500">
          <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
          <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>

          <div class="relative z-10">
            <p class="text-brand-100 text-xs font-medium mb-1">Total Sisa Saldo</p>
            <h2 class="text-3xl font-bold tracking-tight mb-6">
              {{ formatRupiah(budgetStore.budgetData.sisa_anggaran) }}
            </h2>

            <div class="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
              <div>
                <div class="flex items-center gap-1.5 text-brand-100 mb-1">
                  <div class="p-1 bg-emerald-500/20 rounded-full">
                    <svg class="w-3 h-3 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <span class="text-xs">Pemasukan</span>
                </div>
                <p class="font-semibold text-sm">{{ formatRupiah(budgetStore.budgetData.total_pemasukan) }}</p>
              </div>
              <div>
                <div class="flex items-center gap-1.5 text-brand-100 mb-1">
                  <div class="p-1 bg-rose-500/20 rounded-full">
                    <svg class="w-3 h-3 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </div>
                  <span class="text-xs">Pengeluaran</span>
                </div>
                <p class="font-semibold text-sm">{{ formatRupiah(budgetStore.budgetData.total_pengeluaran) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="categorySummary.length > 0 && !searchQuery" class="animate-fade-in-up">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">
            Ringkasan Kategori
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="cat in categorySummary" :key="cat.name"
              class="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
              <div class="flex items-start justify-between mb-2">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 truncate w-2/3" :title="cat.name">{{
                  cat.name }}</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded-md font-bold"
                  :class="cat.type === 'pemasukan' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
                  {{ cat.count }}x
                </span>
              </div>
              <p class="font-bold text-sm"
                :class="cat.type === 'pemasukan' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-white'">
                {{ formatRupiahShort(cat.total) }}
              </p>
            </div>
          </div>
        </div>

        <div v-for="(items, category) in filteredBudgetDetails" :key="category" class="animate-fade-in-up">
          <h3
            class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1 flex items-center justify-between">
            {{ category }}
            <span v-if="searchQuery" class="bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full text-[10px]">{{
              items.length }} ditemukan</span>
          </h3>

          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
            <div v-for="item in items" :key="item.id"
              class="flex items-center justify-between p-4 active:bg-gray-50 dark:active:bg-gray-700/50 transition group">

              <div class="flex items-center gap-3.5">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  :class="item.jenis === 'pemasukan'
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'">
                  <svg v-if="item.jenis === 'pemasukan'" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>

                <div class="overflow-hidden">
                  <p class="font-semibold text-sm text-gray-800 dark:text-white truncate"
                    v-html="highlightText(item.nama_item)"></p>
                  <div class="flex items-center gap-2">
                    <p class="text-xs text-gray-400">{{ formatDateTime(item.created_at) }}</p>
                    <span v-if="item.sumber_dana"
                      class="text-[10px] bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-500">{{
                        item.sumber_dana }}</span>
                  </div>
                </div>
              </div>

              <div class="text-right pl-2 shrink-0">
                <p class="font-bold text-sm"
                  :class="item.jenis === 'pemasukan' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">
                  {{ item.jenis === 'pemasukan' ? '+' : '-' }} {{ formatRupiahShort(item.jumlah) }}
                </p>
                <button @click="handleDelete(item.id)" class="text-xs text-blue-500">
                  Hapus
                </button>
              </div>

            </div>
          </div>
        </div>

        <div v-if="Object.keys(filteredBudgetDetails).length === 0"
          class="flex flex-col items-center justify-center py-12 text-center">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" v-if="searchQuery" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" v-else />
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            {{ searchQuery ? `Tidak ada transaksi untuk "${searchQuery}"` : 'Belum ada transaksi bulan ini.' }}
          </p>
        </div>
      </div>
    </div>

    <button @click="openModal"
      class="fixed bottom-6 right-6 w-14 h-14 bg-brand-600 text-white rounded-full shadow-lg shadow-brand-600/40 flex items-center justify-center hover:bg-brand-700 hover:scale-105 active:scale-95 transition-all z-30">
      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

      <div
        class="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl transform transition-transform duration-300 ease-out border-t border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div class="mx-auto mt-3 h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700 sm:hidden"></div>

        <div class="px-6 pt-4 pb-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white">Tambah Transaksi</h3>
            <button @click="closeModal"
              class="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitForm" class="space-y-4">
            <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex">
              <label class="flex-1 cursor-pointer">
                <input v-model="form.jenis" type="radio" value="pengeluaran" class="sr-only" />
                <div class="py-2.5 text-sm font-medium text-center rounded-lg transition-all"
                  :class="form.jenis === 'pengeluaran' ? 'bg-white dark:bg-gray-700 text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                  Pengeluaran
                </div>
              </label>
              <label class="flex-1 cursor-pointer">
                <input v-model="form.jenis" type="radio" value="pemasukan" class="sr-only" />
                <div class="py-2.5 text-sm font-medium text-center rounded-lg transition-all"
                  :class="form.jenis === 'pemasukan' ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                  Pemasukan
                </div>
              </label>
            </div>

            <div>
              <label class="block mb-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Nominal (Rp)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                <input :value="displayJumlah" @input="handleNominalInput" type="text" inputmode="numeric"
                  placeholder="0" required
                  class="w-full pl-12 pr-4 py-3 text-xl font-bold bg-gray-50 border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-brand-500 focus:border-brand-500" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-400">
                Sumber Dana
              </label>

              <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button v-for="src in uniqueSources" :key="src" type="button" @click="form.sumber_dana = src"
                  class="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                  :class="form.sumber_dana === src
                    ? 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'">
                  {{ src }}
                </button>
              </div>

              <div class="relative">
                <input v-model="form.sumber_dana" type="text" list="source-suggestions"
                  placeholder="Cth: Tunai, BCA, GoPay..." required
                  class="w-full px-4 py-3 text-sm border-gray-200 bg-gray-50 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-brand-500 focus:border-brand-500" />
                <datalist id="source-suggestions">
                  <option v-for="src in uniqueSources" :key="src" :value="src"></option>
                </datalist>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-400">
                Kategori
              </label>

              <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button v-for="cat in uniqueCategories" :key="cat" type="button" @click="form.kategori = cat"
                  class="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                  :class="form.kategori === cat
                    ? 'bg-brand-500 border-brand-500 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'">
                  {{ cat }}
                </button>
              </div>

              <div class="relative">
                <input v-model="form.kategori" type="text" list="category-suggestions"
                  placeholder="Pilih atau ketik kategori baru..." required
                  class="w-full px-4 py-3 text-sm border-gray-200 bg-gray-50 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-brand-500 focus:border-brand-500" />
                <datalist id="category-suggestions">
                  <option v-for="cat in uniqueCategories" :key="cat" :value="cat"></option>
                </datalist>
              </div>
            </div>

            <div>
              <label class="block mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-400">Keterangan Item</label>
              <input v-model="form.nama_item" type="text" placeholder="Cth: Nasi Goreng Spesial" required
                class="w-full px-4 py-3 text-sm border-gray-200 bg-gray-50 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-brand-500 focus:border-brand-500" />
            </div>

            <button type="submit" :disabled="isSubmitting"
              class="w-full py-3.5 text-base font-bold text-white rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-[0.98] transition-all disabled:opacity-50 mt-2 shadow-lg shadow-brand-500/30">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi' }}
            </button>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useBudgetStore } from '@/stores/budgetStore'
import Swal from 'sweetalert2'

const budgetStore = useBudgetStore()
const router = useRouter()
const isModalOpen = ref(false)
const isSubmitting = ref(false)

const monthContainer = ref<HTMLElement | null>(null)
const searchQuery = ref('')

// State Form
const form = reactive({
  kategori: '',
  sumber_dana: '', // Added
  nama_item: '',
  jumlah: null as number | null,
  jenis: 'pengeluaran'
})

// === LOGIC SUMBER DANA DINAMIS (NEW) ===
const defaultSources = ['Tunai', 'ShopeePay']
const uniqueSources = computed(() => {
  const data = budgetStore.budgetData?.detail || {}

  // Ambil semua item dari semua kategori, lalu ambil field sumber_dana
  const allItems = Object.values(data).flat() as any[]
  const existingSources = allItems
    .map(item => item.sumber_dana)
    .filter(val => val) // filter null/empty

  const combined = [...defaultSources, ...existingSources]
  return [...new Set(combined)].sort()
})

// === LOGIC REKAPAN KATEGORI (NEW) ===
const categorySummary = computed(() => {
  const data = budgetStore.budgetData?.detail || {}
  const result = []

  // Loop setiap kategori di data
  for (const [categoryName, items] of Object.entries(data)) {
    const itemList = items as any[]
    if (itemList.length === 0) continue

    // Hitung total
    let total = 0
    let type = 'pengeluaran' // default bias visual

    // Cek mayoritas jenis (meskipun biasanya kategori spesifik per jenis)
    // dan hitung total absolute
    itemList.forEach(item => {
      total += Number(item.jumlah)
      type = item.jenis // ambil jenis dari item terakhir (asumsi konsisten per kategori)
    })

    result.push({
      name: categoryName,
      total: total,
      count: itemList.length,
      type: type
    })
  }

  // Sort berdasarkan total terbesar
  return result.sort((a, b) => b.total - a.total)
})

// === LOGIC KATEGORI DINAMIS ===
const defaultCategories = ['Makan', 'Transport', 'Belanja', 'Tagihan', 'Gaji', 'Hiburan', 'Kesehatan']
const uniqueCategories = computed(() => {
  const data = budgetStore.budgetData?.detail || {}
  const existingKeys = Object.keys(data)
  const combined = [...defaultCategories, ...existingKeys]
  return [...new Set(combined)].sort()
})

// === LOGIC INPUT RUPIAH ===
const displayJumlah = ref('')
const handleNominalInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '')
  if (value) {
    form.jumlah = parseInt(value)
    displayJumlah.value = new Intl.NumberFormat('id-ID').format(parseInt(value))
  } else {
    form.jumlah = null
    displayJumlah.value = ''
  }
}

// === LOGIKA DEFAULT WAKTU ===
const currentDate = new Date()
const selectedMonth = ref(currentDate.getMonth() + 1)
const selectedYear = ref(currentDate.getFullYear())

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i)

// Toast Configuration
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

// Computed Search
const filteredBudgetDetails = computed(() => {
  const data = budgetStore.budgetData?.detail || {}
  if (!searchQuery.value) return data

  const query = searchQuery.value.toLowerCase()
  const result: Record<string, any[]> = {}

  for (const [category, items] of Object.entries(data)) {
    const filteredItems = (items as any[]).filter(item =>
      item.nama_item.toLowerCase().includes(query) ||
      item.kategori.toLowerCase().includes(query) ||
      (item.sumber_dana && item.sumber_dana.toLowerCase().includes(query)) // Search support source
    )
    if (filteredItems.length > 0) {
      result[category] = filteredItems
    }
  }
  return result
})

const highlightText = (text: string) => {
  if (!searchQuery.value) return text
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<span class="bg-yellow-200 dark:bg-yellow-600/50 text-gray-900 dark:text-white font-bold px-0.5 rounded">$1</span>')
}

// Formatters
const formatDateTime = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
}

const formatRupiahShort = (number: number) => {
  return new Intl.NumberFormat('id-ID').format(number)
}

// Logic Fetch Data
const applyFilter = () => {
  budgetStore.fetchBudget(selectedMonth.value, selectedYear.value)
}

const openModal = () => {
  form.kategori = ''
  form.sumber_dana = ''
  form.nama_item = ''
  form.jumlah = null
  form.jenis = 'pengeluaran'
  displayJumlah.value = ''
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const submitForm = async () => {
  if (!form.jumlah) return
  isSubmitting.value = true
  try {
    await budgetStore.addEntry({
      kategori: form.kategori,
      sumber_dana: form.sumber_dana,
      nama_item: form.nama_item,
      jumlah: form.jumlah,
      jenis: form.jenis
    })

    applyFilter()
    closeModal()
    Toast.fire({ icon: 'success', title: 'Transaksi berhasil disimpan' })
  } catch (err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.message || 'Gagal menyimpan data',
      confirmButtonColor: '#d33',
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (id: number) => {
  const result = await Swal.fire({
    title: 'Hapus transaksi?',
    text: "Data yang dihapus tidak bisa dikembalikan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#9ca3af',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
    reverseButtons: true
  })

  if (result.isConfirmed) {
    try {
      await budgetStore.deleteEntry(id)
      applyFilter()
      Toast.fire({ icon: 'success', title: 'Data berhasil dihapus' })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Terjadi kesalahan saat menghapus data.' })
    }
  }
}

const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Keluar aplikasi?',
    text: "Anda harus login kembali untuk mengakses data.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#9ca3af',
    confirmButtonText: 'Keluar',
    cancelButtonText: 'Batal'
  })

  if (result.isConfirmed) {
    localStorage.removeItem('token')
    Toast.fire({ icon: 'success', title: 'Berhasil logout' })
    setTimeout(() => { router.push('/signin') }, 500)
  }
}

onMounted(async () => {
  applyFilter()
  await nextTick()
  if (monthContainer.value) {
    const activeButton = monthContainer.value.querySelector('.bg-brand-500')
    if (activeButton) {
      activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>