<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { marked } from 'marked'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const userMessage = ref('')
const messages = ref<Message[]>([])
const isLoading = ref(false)
const chatBottom = ref<HTMLElement | null>(null)

async function sendMessage() {
  if (!userMessage.value.trim()) return

  // User Nachricht hinzufügen
  messages.value.push({ role: 'user', content: userMessage.value })
  const currentMessage = userMessage.value
  userMessage.value = ''
  isLoading.value = true

  // Zum Ende scrollen
  await nextTick()
  chatBottom.value?.scrollIntoView({ behavior: 'smooth' })

  const res = await fetch('http://localhost:8000/index.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: currentMessage,
      history: messages.value,
    }),
  })

  const data = await res.json()
  messages.value.push({ role: 'assistant', content: data.reply })
  isLoading.value = false

  await nextTick()
  chatBottom.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col h-[85vh]">
      <!-- Header -->
      <div class="flex items-center gap-4 p-6 border-b border-gray-100">
        <div
          class="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white text-xl"
        >
          🤖
        </div>
        <div>
          <h1 class="font-bold text-gray-800 text-lg">AI Assistant</h1>
          <p class="text-green-500 text-sm font-medium">● Online</p>
        </div>
      </div>

      <!-- Chatverlauf -->
      <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        <!-- Willkommensnachricht -->
        <div v-if="messages.length === 0" class="flex items-start gap-3">
          <div
            class="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm flex-shrink-0"
          >
            🤖
          </div>
          <div class="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-sm">
            <p class="text-gray-700">Hallo! Ich bin dein AI Assistant. Wie kann ich dir helfen?</p>
          </div>
        </div>

        <!-- Nachrichten -->
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="msg.role === 'user' ? 'flex justify-end' : 'flex items-start gap-3'"
        >
          <!-- AI Avatar -->
          <div
            v-if="msg.role === 'assistant'"
            class="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm flex-shrink-0"
          >
            🤖
          </div>

          <!-- Nachricht Bubble -->
          <div
            v-if="msg.role === 'assistant'"
            v-html="marked(msg.content)"
            class="bg-gray-100 text-gray-700 rounded-2xl rounded-tl-none px-4 py-3 max-w-sm prose"
          ></div>

          <div v-else class="bg-black text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-sm">
            {{ msg.content }}
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex items-start gap-3">
          <div
            class="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm flex-shrink-0"
          >
            🤖
          </div>
          <div class="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
            <div class="flex gap-1">
              <span
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 0ms"
              ></span>
              <span
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 150ms"
              ></span>
              <span
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 300ms"
              ></span>
            </div>
          </div>
        </div>

        <div ref="chatBottom"></div>
      </div>

      <!-- Eingabe -->
      <div class="p-4 border-t border-gray-100">
        <div class="flex gap-2">
          <input
            v-model="userMessage"
            @keyup.enter="sendMessage"
            placeholder="Schreib eine Nachricht..."
            class="flex-1 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black text-sm"
          />
          <button
            @click="sendMessage"
            :disabled="isLoading"
            class="bg-black text-white px-5 py-3 rounded-2xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
