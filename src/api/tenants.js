import axios from '~/axios'

export function addTenant(data) {
	console.log('data, '	, data)
	return axios.post('/tenants/add', data)
}

// export function banTenant(cid) {
// 	return axios.post(`/tenants/disable?cid=${cid}`)
// }

export function getTenants() {
	return axios.get('/tenants/index?PageSize=1000')
}

// export function expandTenant(data){
// 	return axios.post('/tenants/changeexpire', data)
// }

export function updateTenant(data){
	return axios.post('/tenants/update', data)
}