<template>
	<Teleport to="body">
		<el-dialog v-model="centerDialogVisible" :title="title" :width="width" align-center>
			<slot></slot>
			<template #footer>
				<div class="flex justify-between items-center">
					<div><el-button type="warning" @click="handleDelete">删除用户</el-button></div>
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
		default: 500
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