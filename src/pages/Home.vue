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
					<el-input v-model="searchInput" style="width: 240px" placeholder="Find your item" :prefix-icon="Search"
					class="mr-3 "
					/>
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
					<el-table :data="filteredTableData" style="width: 100%; height: calc(100vh - 144px)"
					>
						<el-table-column fixed prop="date" label="Activation date" width="150" sortable />
						<el-table-column label="User Name" width="180">
							<template #default="scope">
								<el-popover effect="light" trigger="hover" placement="top" >
									<template #default>
										<div>Name: {{ scope.row.name }}</div>
										<div>Address: {{ scope.row.address }}</div>
									</template>
									<template #reference>
										<el-tag >{{ scope.row.name }}</el-tag>
									</template>
								</el-popover>
							</template>
						</el-table-column>
						<el-table-column prop="state" label="State" sortable  >
							<template #default="scope">
								<TagState :initialState="scope.row.state" @change="handleStateChange(scope.row, $event)" />
							</template>	
						</el-table-column>
						<el-table-column label="Remaining Days">
							<template #default="scope">
								<!-- <div  class="flex items-center justify-center"> -->
									{{ calculateDays(scope.row.date, scope.row.expireDate) > 0 ? calculateDays(scope.row.date, scope.row.expireDate) : 0 }}
								<!-- </div> -->
							</template>
						</el-table-column>
						<el-table-column prop="expireDate" label="Expire Date" sortable />
						<el-table-column fixed="right" label="Operations"  align="right">
							<template #default="scope">
								
									<el-button size="small" @click="handleEdit(scope.row)" style="width: 70px">
										编辑
									</el-button>
									<DiaLog 
									ref="editDialog"
									title="编辑"
									@confirm="handleEditConfirm"
									@cancel="handleEditCancel"
									@delete="handleEditDelete"
									>
										<span class="font-bold block mb-3">选择时间区间: </span>
										<div class="flex justify-center items-center mb-3">
											<el-date-picker
											v-model="dateRange"
											type="datetimerange"
											range-separator="到"
											start-placeholder="Start date"
											end-placeholder="End date"
											:default-value="[new Date(), new Date()]"
											:popper-append-to-body="true"
											/>
										</div>
										<span class="block font-bold mb-2">编辑备注:</span>
										<div>
											<el-input
											type="textarea"
											rows="3"
											placeholder="Please input your remarks"
											v-model="selectedRow.note"
											/>
										</div>
									</DiaLog>
							</template>

						</el-table-column>

					</el-table>
				</div>
				<div class=" min-h-[64px] relative overflow-visible" style="z-index: auto;">
					<el-button class="mt-4" style="width: 100%" @click="onAddItem">
						添加新用户
					</el-button>
				</div>
			</el-main>
		</el-container>
	</div>
	
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
const selectedRow = ref(null);
const router = useRouter()
const tableData = reactive([
	{
		date: '2016-05-03',
		name: 'Tom1',
		state: '已激活',
		expireDate: '2016-05-01',
		tag: 'Home',
		note: 'This is a note'
	},
	{
		date: '2016-05-02',
		name: 'Tom2',
		state: '已过期',
		expireDate: '2017-05-02',
		tag: 'Office',
		note: 'This is a note'
	},
	{
		date: '2016-05-04',
		name: 'Tom3',
		state: '未激活',
		expireDate: '2017-05-03',
		tag: 'Home',
		note: 'This is a note'
	}
])
const dateRange = ref([]);


const filteredTableData = computed(() => {
  if (!searchInput.value) return tableData; // 如果没有搜索关键字，返回全部数据
  return tableData.filter((item) => 
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchInput.value.toLowerCase())
    )
  );
});


const handleEditConfirm = () => {
	console.log('handleEditConfirm')
	selectedRow.value.date = dayjs(dateRange.value[0]).format('YYYY-MM-DD')
	selectedRow.value.expireDate = dayjs(dateRange.value[1]).format('YYYY-MM-DD')
	editDialog.value.closeDialog()
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
	selectedRow.value = row; 
	dateRange.value = [new Date(row.date), new Date(row.expireDate)];
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
					router.push({ path: '/'})

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
	now.setDate(now.getDate() + 1)
	tableData.push({
		date: dayjs(now).format('YYYY-MM-DD'),
		name: now.getTime(),
		state: '已激活',
		expireDate: dayjs(now).format('YYYY-MM-DD'),
		tag: 'Home',
		note: 'This is a note'
	})
	console.log('tableData', tableData)
}
function calculateDays(date1, date2) {
  // 将日期字符串转换为 Date 对象
  const startDate = new Date(date1);
  const endDate = new Date(date2);

  // 获取两个日期的时间戳
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  // 计算时间差（毫秒），然后转换为天数
  const diffTime = endTime - startTime; // 使用绝对值防止负数
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

</script>


<style scoped>
</style>