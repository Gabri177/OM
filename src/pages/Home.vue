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
									<span class="block font-bold mb-2">编辑备注:</span>
									<div>
										<el-input type="textarea" rows="3" placeholder="Please input your remarks"
											v-model="selectedRow.note" />
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
					<el-radio v-model="newUser.state" label="已过期">已过期</el-radio>
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

const now = new Date()
const searchInput = ref('')
const editDialog = ref(null)
const addDialog = ref(null)
const selectedRow = ref(null);
const router = useRouter()
const dateRef = ref(new Date())

const newUser = reactive({
	activeDate: '',
	name: '',
	state: '未激活',
	expireDate: '',
	note: '',
	password: '',
	confirmPassword: ''
})



const tableData = reactive([
	{
		id: 1,
		activeDate: '2016-05-03',
		name: 'Tom1',
		state: '已激活',
		expireDate: '2016-05-01',
		note: 'This is a note',
		password: '123',
		remainingDays: 0
	},
	{
		id: 2,
		activeDate: '2016-05-02',
		name: 'Tom2',
		state: '已过期',
		expireDate: '2017-05-02',
		note: 'This is a note',
		password: '123',
		remainingDays: 0
	},
	{
		id: 3,
		activeDate: '2016-05-04',
		name: 'Tom3',
		state: '未激活',
		expireDate: '2017-05-03',
		note: 'This is a note',
		password: '123',
		remainingDays: 0
	}
]);

function initializeRemainingDays() {

	//应该有一个getData方法 从后端获取数据
	tableData.forEach((row) => {
		row.remainingDays = calculateDays(row.expireDate)
	});
}

initializeRemainingDays();

const filteredTableData = computed(() => {
	// 如果没有搜索关键字，返回全部数据
	if (!searchInput.value) return tableData;
	return tableData.filter((item) =>
		Object.values(item).some(value =>
			value.toString().toLowerCase().includes(searchInput.value.toLowerCase())
		)
	);
});

const handleAddConfirm = () => {

	if (!formValidate()) return
	newUser.date = dayjs(Date()).format('YYYY-MM-DD')
	newUser.expireDate = dayjs(dateRef.value).format('YYYY-MM-DD')
	tableData.push({
		activeDate: newUser.date,
		name: newUser.name,
		state: newUser.state,
		expireDate: newUser.expireDate,
		note: newUser.note,
		remainingDays: calculateDays(newUser.expireDate)
	})
	addDialog.value.closeDialog()

	initializeRemainingDays();
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
	console.log('handleEditConfirm')
	selectedRow.value.expireDate = dayjs(dateRef.value).format('YYYY-MM-DD')
	selectedRow.value.password = newUser.password
	editDialog.value.closeDialog()
	toast('成功', '编辑成功')
	initializeRemainingDays();
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

const handleStateChange = (row, state) => {
	row.state = state
	console.log('newtableData', tableData)
}

const handleEdit = (row) => {
	newUser.password = ''
	newUser.confirmPassword = ''
	selectedRow.value = row;
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
							router.push({ path: '/' })

						})
						.catch((error) => {
							console.log('error', error)
							toast('错误', '退出登录失败', 'error')
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