import { createApp } from 'vue'
import App from '~/App.vue'
import '~/index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { router } from '~/router'

const app = createApp(App)

app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

app.use(ElementPlus)

import '~/permission.js'

app.mount('#app')
