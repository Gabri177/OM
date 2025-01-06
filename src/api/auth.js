import axios from '~/axios'

export function login(data) {
	return axios.post('/admin/login', data)
}

export function logout() {
	return axios.post('/admin/logout')
}