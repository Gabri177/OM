import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '~/pages/Login.vue'
import Home from '~/pages/Home.vue'
import NotFound from '~/pages/404.vue'

const routes = [
	{
		path: '/',
		name: 'Login',
		component: Login
	},
	{
		path: '/home',
		name: 'Home',
		component: Home
	}, {

		path: '/:pathMatch(.*)*', 
		name: 'NotFound', 
		component: NotFound,
		meta: {
			title: "404"
		}
	}
]


export const router = createRouter({

	history: createWebHashHistory(),
	routes
})