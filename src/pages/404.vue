<template>
	<div class="flex justify-center items-center min-h-screen bg-gray-100">
	  <div class="p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
		<el-result
		  icon="warning"
		  title="页面未找到"
		  sub-title="你找的页面丢失了"
		>
		  <template #extra>
			<el-button type="primary" @click="$router.push('/')">返回</el-button>
		  </template>
		</el-result>
	  </div>
	</div>
  </template>
  