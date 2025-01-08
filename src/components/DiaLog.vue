<template>
	<Teleport to="body">
		<el-dialog v-model="centerDialogVisible" :title="title" :width="width" style="max-height: 500px; overflow-y: auto; overflow-x: hidden; " align-center>
			<slot></slot>
			<template #footer>
				<div class="flex justify-between items-center">
					<div><el-button type="warning" @click="handleDelete" v-show="isVisibleDelete">删除用户</el-button></div>
					<div class="dialog-footer">
						<el-button @click="handleCancel">取消</el-button>
						<el-button type="primary" @click="handleConfirm" :loading="loading">
							确认
						</el-button>
					</div>
				</div>
			</template>
		</el-dialog>
	</Teleport>
</template>
<script setup>
import { ref } from 'vue'

const loading = ref(false)

const handleDelete = () => {
	emit('delete')
}

const centerDialogVisible = ref(false)

const openDialog = () => {
	centerDialogVisible.value = true
}

const closeDialog = () => {
	centerDialogVisible.value = false
}

const handleCancel = () => {
	emit('cancel')
}

const handleConfirm = () => {
	emit('confirm')
}

const showLoading = () => {
	loading.value = true
}

const hideLoading = () => {
	loading.value = false
}

defineProps({
	title: {
		type: String,
		default: 'Warning'
	},
	width: {
		type: Number,
		default: 490
	},
	isVisibleDelete: {
		type: Boolean,
		default: true
	}
})

const emit = defineEmits(['cancel', 'confirm', 'delete'])

defineExpose({
	openDialog,
	closeDialog,
	showLoading,
	hideLoading
})



</script>


<style>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 4px; /* 滚动条宽度 */
  background-color: #f1f1f1; /* 滚动条背景色 */
}

::-webkit-scrollbar-thumb {
  background-color: #888; /* 滑块颜色 */
  border-radius: 4px; /* 滑块圆角 */
}
::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* 鼠标悬停时滑块颜色 */
}
</style>
