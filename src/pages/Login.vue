<template>
	<div class="flex min-h-screen bg-gray-50 items-center justify-center">
		<div
		class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 rounded-xl shadow-xl bg-white/30 backdrop-blur-md border border-white/20"
		style="max-width: 500px; max-height: 500px; margin: 0 auto;"
		>
			<div class="sm:mx-auto sm:w-full sm:max-w-sm">
				<img class="mx-auto h-12 w-auto" src="../images/manager.png" alt="SuperAdmin" />
				<h2 class="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">超级管理员登录</h2>
			</div>

			<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form class="space-y-6" @submit.prevent="handleLogin">
					<div>
						<label for="username" class="block text-base font-medium text-gray-900">账号</label>
						<div class="mt-2">
							<input
								type="text"
								id="username"
								v-model="username"
								@blur="validateField('username')"
								:class="['block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400', errors.username ? 'outline-red-500' : 'outline-gray-300']"
								placeholder="请输入账号"
							/>
							<p
								class="mt-1 text-xs text-red-500 transition-opacity duration-1000 ease-in-out"
								:class="{ 'opacity-100': errors.username, 'opacity-0': !errors.username }"
							>
								{{ errors.username }}
							</p>
						</div>
					</div>

					<div>
						<label for="password" class="block text-base font-medium text-gray-900">密码</label>
						<div class="mt-2">
							<input
								type="password"
								id="password"
								v-model="password"
								@blur="validateField('password')"
								:class="['block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400', errors.password ? 'outline-red-500' : 'outline-gray-300']"
								placeholder="请输入密码"
							/>
							<p
								class="mt-1 text-xs text-red-500 transition-opacity duration-1000 ease-in-out"
								:class="{ 'opacity-100': errors.password, 'opacity-0': !errors.password }"
							>
								{{ errors.password }}
							</p>
						</div>
					</div>

					<div>
						<el-button
							v-loading="loading"
							@click="handleLogin"
							class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-indigo-700"
						>
							登录
						</el-button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '~/api/auth';
import { toast } from '~/composables/util';
import { setToken } from '~/composables/auth';

const username = ref('');
const password = ref('');
const errors = ref({});
const router = useRouter();
const loading = ref(false);

const validateField = (field) => {
	if (field === 'username') {
		if (!username.value) {
			errors.value.username = '请输入账号';
		} else {
			errors.value.username = ''; // 清空错误
		}
	}
	if (field === 'password') {
		if (!password.value) {
			errors.value.password = '请输入密码';
		} else {
			errors.value.password = ''; // 清空错误
		}
	}
};

const handleLogin = () => {
	// 全局验证
	validateField('username');
	validateField('password');

	// 检查是否有错误
	if (!errors.value.username && !errors.value.password) {

		loading.value = true;
		login({
			username: username.value,
			password: password.value
		})
		.then((res) => {
			console.log('登录成功');
			console.log('login token: ', res.token);
			setToken(res.token, res.expires)
			toast('成功', '登录成功');
			router.push('/home');
		})
		.catch((err) => {
			toast('错误', '登录失败', 'error');
			console.log('登录失败');
		})
		.finally(() => {
			loading.value = false;
		});
		
	} else {
		console.log('表单验证失败');
	}
};
</script>
