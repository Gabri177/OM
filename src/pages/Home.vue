<template>
	<div class="common-layout">
		<el-container>
			<el-header class="bg-gray-900 fixed w-full text-white flex justify-between items-center min-h-[64px]">
				<div class="text-2xl ml-4 flex items-center justify-center">
					<el-icon class="mx-2">
						<Management />
					</el-icon>
					<span>Super Admin</span>
				</div>
				<div class="flex items-center justify-center">
					<el-input v-model="searchInput" style="width: 240px" placeholder="Find your item"
						:prefix-icon="Search" class="mr-3 " />
					<el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
						class="mr-4 cursor-pointer" style="height: 30px; width: 30px;" @click="handleAvatarClick" />
					<el-dropdown @command="handleCommand" class="mt-1">
						<span class="el-dropdown-link text-lime-50 text-2xl">
							<el-icon>
								<Operation />
							</el-icon>
						</span>
						<template #dropdown>
							<el-dropdown-menu @command="handleCommand">
								<el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
								<el-dropdown-item command="logout">退出登录</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
			</el-header>
			<el-main class="fixed top-[64px] w-full max-h-[calc(100% - 64px)]]">
				<div>
					<el-table :data="filteredTableData" style="width: 100%; height: calc(100vh - 144px)">
						<el-table-column fixed prop="activeDate" label="Activation date" width="150" sortable />
						<el-table-column label="User Name" width="180">
							<template #default="scope">
								<el-popover effect="light" trigger="hover" placement="top">
									<template #default>
										<div>Name: {{ scope.row.name }}</div>
										<div>Password: {{ scope.row.password }}</div>
									</template>
									<template #reference>
										<el-tag>{{ scope.row.name }}</el-tag>
									</template>
								</el-popover>
							</template>
						</el-table-column>
						<el-table-column prop="state" label="State" sortable>
							<template #default="scope">
								<TagState :initialState="scope.row.state"
									@change="handleStateChange(scope.row, $event)" />
							</template>
						</el-table-column>
						<el-table-column prop="remainingDays" label="Remaining Days" sortable>
						</el-table-column>
						<el-table-column prop="expireDate" label="Expire Date" sortable />
						<el-table-column fixed="right" label="Operations" align="right">
							<template #default="scope">

								<el-button size="small" @click="handleEdit(scope.row)" style="width: 70px">
									编辑
								</el-button>
								<DiaLog ref="editDialog" title="编辑" @confirm="handleEditConfirm"
									@cancel="handleEditCancel" @delete="handleEditDelete">
									<span class="font-bold block mb-3">选择到期时间: </span>
									<div class="flex items-center mb-3">
										<el-date-picker v-model="dateRef" type="date" placeholder="请选择到期时间"
											size="default" />
									</div>
									<div class="flex" style="border: solid 1px #ebeef5; padding: 10px; margin: 10px 0;">
										<div class="w-full">
											<span class="subTitle">新密码:</span>
											<div>
												<el-input v-model="newUser.password" type="password" show-password />
											</div>
											<span class="subTitle">确认密码:</span>
											<div>
												<el-input v-model="newUser.confirmPassword" type="password"
													show-password />
											</div>
										</div>
									</div>
									
								</DiaLog>
							</template>

						</el-table-column>

					</el-table>
				</div>
				<div class=" min-h-[64px] relative overflow-visible" style="z-index: auto;">
					<el-button class="mt-4" style="width: 100%" @click="onAddItem" color="#2d4765" :dark="false">
						添加新用户
					</el-button>
				</div>
			</el-main>
		</el-container>
	</div>
	<DiaLog ref="addDialog" title="添加用户" @confirm="handleAddConfirm" @cancel="handleAddCancel" :isVisibleDelete="false">

		<div>
			<span class="subTitle">用户名:</span>
			<div>
				<el-input v-model="newUser.name" />
			</div>
		</div>
		<div>
			<span class="subTitle">选择到期时间: </span>
			<div class="flex items-center mb-3">
				<el-date-picker v-model="dateRef" type="date" placeholder="请选择到期时间" size="default" />
			</div>
		</div>
		<div>
			<span class="subTitle">选择激活状态:</span>
			<div class="flex mx-2">
				<div class="flex items-center">
					<el-radio v-model="newUser.state" label="未激活">未激活</el-radio>
					<el-radio v-model="newUser.state" label="已激活">已激活</el-radio>
					<!-- <el-radio v-model="newUser.state" label="已过期">已过期</el-radio> -->
				</div>
			</div>
		</div>
		<div class="flex" style="border: solid 1px #ebeef5; padding: 10px; margin: 10px 0;">
			<div class="w-full">
				<span class="subTitle">用户密码:</span>
				<div>
					<el-input v-model="newUser.password" type="password" show-password />
				</div>
				<span class="subTitle">确认密码:</span>
				<div>
					<el-input v-model="newUser.confirmPassword" type="password" show-password />
				</div>
			</div>
		</div>
		<div>
			<span class="subTitle">编辑备注:</span>
			<div>
				<el-input type="textarea" rows="3" placeholder="在这里输入对用户的备注信息" v-model="newUser.note" />
			</div>
		</div>


	</DiaLog>
</template>

<script setup>

import { ref, reactive, computed } from 'vue'
import dayjs from 'dayjs'
import { Search } from '@element-plus/icons-vue'
import TagState from '~/components/TagState.vue'
import DiaLog from '~/components/DiaLog.vue'
import { ElButton } from 'element-plus'
import { toast, popOut } from '~/composables/util'
import { logout } from '~/api/auth'
import { useRouter } from 'vue-router'
import { addTenant, updateTenant, getTenants } from '~/api/tenants'
import { removeToken } from '~/composables/auth'


const now = new Date()
const searchInput = ref('')
const editDialog = ref(null)
const addDialog = ref(null)
const selectedRow = ref(null);
const router = useRouter()
const dateRef = ref(new Date())
const tableData = reactive([])

const newUser = reactive({
	activeDate: '',
	name: '',
	state: '未激活',
	expireDate: '',
	password: '',
	confirmPassword: ''
})


const getData = () => {
	getTenants()
		.then((res) => {
			const datas = res.datas
			tableData.splice(0, tableData.length)
			for (const data of datas) {
				tableData.push({
					activeDate: dayjs(data.create).format('YYYY-MM-DD'),
					name: data.userName,
					state: data.isEnable ? '已激活' : '未激活',
					expireDate: dayjs(data.expire).format('YYYY-MM-DD'),
					password: data.password,
					remainingDays: data.daysOfExpire,
					id: data.tenantId,
					customerAccountCount: data.customerAccountCount
				})
			}
			console.log('tableData', tableData)
		})
		.catch((error) => {
			toast('错误', '获取数据失败, 请重新刷新页面', 'error')
		})
}

getData()


const filteredTableData = computed(() => {
	// 如果没有搜索关键字，返回全部数据
	if (!searchInput.value) return tableData;

	return tableData.filter((item) =>
		Object.values(item).some(value =>
			(value !== null && value !== undefined) && 
			value.toString().toLowerCase().includes(searchInput.value.toLowerCase())
		)
	);
});


const handleAddConfirm = () => {

	if (!formValidate()) return
	const daysOfExpire = calculateDays(dayjs(dateRef.value).format('YYYY-MM-DD'))
	// 应该添加填写email的input框
	const email = 'abcd@gmail.com'
	const isEnable = newUser.state === '已激活' ? true : false

	addTenant({
		username: newUser.name,
		password: newUser.password,
		daysOfExpire: daysOfExpire,
		email: email,
		isenable: isEnable
	})
	.then(() => {
		toast('成功', '添加成功')
		getData()
	})
	.catch((error) => {
		console.log('error', error)
		toast('错误', '添加失败', 'error')
	})
	addDialog.value.closeDialog()

	// initializeRemainingDays();
}

const handleAddCancel = () => {
	console.log('handleAddCancel')
	addDialog.value.closeDialog()
}




const handleEditConfirm = () => {

	if (!newUser.password && newUser.confirmPassword || newUser.password && !newUser.confirmPassword) {
		toast('错误', '密码不能为空', 'error')
		return
	}
	if (newUser.password && newUser.confirmPassword && newUser.password != newUser.confirmPassword) {
		toast('错误', '两次输入的密码不一致', 'error')
		return
	}
	// console.log('row: ', row)
	// console.log('handleEditConfirm')
	// console.log('rowId: ', row.id)
	// console.log('newExpie: ', dayjs(dateRef.value).format('YYYY-MM-DD'))
	
	updateTenant({
		TenantId: selectedRow.value.id,
		IsEnable: selectedRow.value.state === '已激活' ? true : false,
		Password: newUser.password == '' ? selectedRow.value.password : newUser.password,
		Expire: dayjs(dateRef.value).format('YYYY-MM-DD')
	})
	.then(() => {
		toast('成功', '修改成功')
		getData()
		editDialog.value.closeDialog()
		toast('成功', '编辑成功')
	
	})
	.catch((error) => {
		console.log('error', error)
		getData()
		toast('错误', '修改失败', 'error')
		editDialog.value.closeDialog()
		

	})
	//修改密码的api?? 
	selectedRow.value.password = newUser.password

}

const handleEditCancel = () => {
	console.log('handleEditCancel')
	editDialog.value.closeDialog()
}

const handleEditDelete = () => {
	popOut('警告', '确定删除该用户吗？', "确认", "取消")
		.then(() => {
			setTimeout(() => {
				tableData.find((item, index) => {
					if (item === selectedRow.value) {
						tableData.splice(index, 1)
						editDialog.value.closeDialog()
					}
				})
			}, 500);
			toast('成功', '删除成功')

			initializeRemainingDays();
		})
		.catch((error) => {
			console.log('cancel error', error)
		})
}

const handleStateChange = (row, data) => {
	const {before, after} = data
	const isEnable = after == '已激活' ? true : false

	updateTenant({
		tenantId: row.id,
		isEnable: isEnable,
		Password: row.password,
		Expire: row.expireDate
	})
	.then(() => {
		toast('成功', '状态修改成功')
		getData()
	})
	.catch((error) => {
		toast('错误', '状态修改失败', 'error')
		getData()
	})

	console.log('newtableData', tableData)
}

const handleEdit = (row) => {
	newUser.password = ''
	newUser.confirmPassword = ''
	selectedRow.value = row;
	console.log('selectedRow', selectedRow.value)
	dateRef.value = new Date(row.expireDate)
	editDialog.value.openDialog()
}

const handleAvatarClick = () => {
	console.log('handleAvatarClick')
}

const handleCommand = (command) => {

	switch (command) {
		case 'changePassword':
			console.log('changePassword')
			break
		case 'logout':
			popOut('警告', '确定退出登录吗？', "确认", "取消")
				.then(() => {
					logout()
						.then(() => {
							toast('成功', '退出登录成功')
							removeToken()
							router.push({ path: '/' })

						})
						.catch((error) => {
							console.log('error', error)
							removeToken()
							router.push({ path: '/' })
							toast('成功', '退出登录成功.')

							//toast('错误', '退出登录失败', 'error')
						})
				})
				.catch((error) => {
					console.log('cancel error', error)
				})
			break
		default:
			break
	}
}

const handleClick = () => {
	console.log('click')
}

const onAddItem = () => {
	// now.setDate(now.getDate() + 1)
	// tableData.push({
	// 	date: dayjs(now).format('YYYY-MM-DD'),
	// 	name: now.getTime(),
	// 	state: '已激活',
	// 	expireDate: dayjs(now).format('YYYY-MM-DD'),
	// 	tag: 'Home',
	// 	note: 'This is a note'
	// })
	newUser.name = ''
	newUser.state = '未激活'
	newUser.note = ''
	newUser.password = ''
	newUser.confirmPassword = ''
	dateRef.value = new Date()
	addDialog.value.openDialog()
	console.log('tableData', tableData)


}
function calculateDays(date) {
	const startDate = new Date();
	const endDate = new Date(date);

	const startTime = startDate.getTime();
	const endTime = endDate.getTime();

	const diffTime = endTime - startTime;
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	return diffDays;
}

function formValidate() {
	if (!newUser.name) {
		toast('错误', '用户名不能为空', 'error')
		return false
	}
	if (dateRef.value === null) {
		toast('错误', '时间区间不能为空', 'error')
		return false
	}
	if (!newUser.password) {
		toast('错误', '密码不能为空', 'error')
		return false
	}
	if (newUser.password != newUser.confirmPassword) {
		toast('错误', '两次输入的密码不一致', 'error')
		return false
	}
	const isDuplicate = tableData.some((item) => {
		if (item.name === newUser.name) {
			toast('错误', '用户名已存在', 'error');
			return true; // 停止遍历
		}
	});
	if (isDuplicate) {
		return false;
	}
	return true
}

</script>


<style scoped>
.subTitle {
	@apply font-bold block mb-2;
}
</style>