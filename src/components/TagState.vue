<template>
	<div style="position: relative;">
	  <!-- 当前状态的 Tag -->
	  <el-tag
		:type="tagType"
		@click="showOptions"
		style="cursor: pointer;"
	  >
		{{ currentStatus }}
	  </el-tag>
  
	  <!-- 弹出的卡片 -->
	  <Teleport to="body">
		<div
		  v-if="showCard"
		  ref="cardRef"
		  class="status-card"
		  :style="{ top: `${cardPosition.y}px`, left: `${cardPosition.x}px` }"
		  @click.stop
		>
		  <el-tag
			v-for="(item, index) in remainingStatuses"
			:key="index"
			:type="item.type"
			class="card-option"
			@click="changeStatus(item)"
		  >
			{{ item.label }}
		  </el-tag>
		</div>
	  </Teleport>
	</div>
  </template>
  
  <script setup>
	import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";
	import { popOut } from '~/composables/util'

  
  // 接收父组件的初始状态
  const props = defineProps({
	initialState: {
	  type: String,
	  required: true, // 确保父组件必须传递
	},
  });
  
  // 状态列表
  //{ label: "已过期", color: "red", type: "danger" },
  const statuses = [
	{ label: "已激活", color: "green", type: "success" },
	{ label: "未激活", color: "blue", type: "info" }
  ];
  
  // 当前状态
	const currentStatus = computed(() => props.initialState);
	const tagType = computed(() => {
	return statuses.find((status) => status.label === props.initialState)?.type || "info";
	});

  
  // 卡片控制
  const showCard = ref(false);
  const cardPosition = reactive({ x: 0, y: 0 });
  const cardRef = ref(null); // 用于检测点击是否发生在卡片内部
  
  // 剩余状态选项
  const remainingStatuses = computed(() => {
	return statuses.filter((status) => status.label !== currentStatus.value);
  });
  
  // 显示卡片
  const showOptions = (event) => {
	event.stopPropagation();
	cardPosition.x = event.clientX;
	cardPosition.y = event.clientY;
	showCard.value = true;
  };
  
  // 切换状态
  const changeStatus = (status) => {
	popOut('提示', '你确定要切换状态吗？', '确认', '取消')
	.then(() => {
		emit("change", {before: currentStatus.value , after: status.label});
		currentStatus.value = status.label;
		tagType.value = status.type;
		showCard.value = false;
	})
	.catch(() => {
		showCard.value = false;
	})
  };
  
  // 点击外部关闭卡片
  const handleClickOutside = (event) => {
	if (cardRef.value && !cardRef.value.contains(event.target)) {
	  showCard.value = false;
	}
  };

  const emit = defineEmits(["change"]);
  
  // 监听初始状态变化（可选，如果父组件动态更新初始状态）
  watch(
  () => props.initialState,
  (newVal) => {
    currentStatus.value = newVal;
    tagType.value = statuses.find((status) => status.label === newVal)?.type || "info";
  },
  { immediate: true } // 确保初始化时也会触发
);

  
  // 生命周期钩子
  onMounted(() => {
	window.addEventListener("click", handleClickOutside);
  });
  
  onUnmounted(() => {
	window.removeEventListener("click", handleClickOutside);
  });
  </script>
  
  
  <style scoped>
  .status-card {
	position: fixed;
	background: white;
	border: 1px solid #ddd;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	border-radius: 4px;
	padding: 10px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	z-index: 1000;
  }
  
  .card-option {
	cursor: pointer;
	text-align: center;
  }
  </style>
  