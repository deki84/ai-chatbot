<script setup lang="ts">
import { ref } from 'vue'

// Reaktive Variablen — wie useState in React
const userMessage = ref('')
const response = ref('')
const isLoading = ref(false)

// Nachricht ans PHP Backend schicken
async function sendMessage() {
  if (!userMessage.value) return

  isLoading.value = true
  response.value = ''

  const res = await fetch('http://localhost:8000/index.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage.value }),
  })

  const data = await res.json()
  response.value = data.reply
  isLoading.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
      <h1 class="text-2xl font-bold mb-6 text-gray-800">AI Chatbot</h1>

      <!-- Antwort anzeigen -->
      <div v-if="response" class="bg-gray-50 rounded-xl p-4 mb-4 text-gray-700">
        {{ response }}
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-gray-400 mb-4">Claude denkt nach...</div>

      <!-- Eingabe -->
      <div class="flex gap-2">
        <input
          v-model="userMessage"
          @keyup.enter="sendMessage"
          placeholder="Schreib eine Nachricht..."
          class="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          @click="sendMessage"
          :disabled="isLoading"
          class="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 disabled:opacity-50"
        >
          Senden
        </button>
      </div>
    </div>
  </div>
</template>
