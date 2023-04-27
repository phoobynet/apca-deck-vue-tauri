import { createApp } from 'vue'
import App from '@/App.vue'
import { router } from '@/routes/router'
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'
import 'virtual:uno.css'
import { options } from '@phoobynet/alpaca-services'
import { invoke } from '@tauri-apps/api'
import { assetRepository } from '@/lib/alpaca/assetRepository'
import { createPinia } from 'pinia'

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

async function init() {
  options.set({
    key: await invoke('get_environment_variable', { name: 'APCA_API_KEY_ID' }),
    secret: await invoke('get_environment_variable', {
      name: 'APCA_API_SECRET_KEY',
    }),
    paper: true,
  })

  options.patch({
    assetRepository,
  })
}

function start() {
  const pinia = createPinia()
  createApp(App).use(pinia).use(router).mount('#app')
}

init().then(start)
