import { router} from "~/router"
import { getToken } from "~/composables/auth"
import { toast } from "~/composables/util"

//前置首位
router.beforeEach(async (to, from, next) => {
	
	const token = getToken()
	console.log('permission.js token: ', token)

	//如果没有token并且不是登录页面
	if (!token && to.path != '/') {

		toast('警告', '请先登录', 'error')
		return next({path: '/'})
	} 
	
	//防止重复登录
	if (token && to.path == '/') {
		toast('警告', '您已经登录', 'warning')
		return next({ path: '/home' })
	}

	// 设置页面标题
	let title = 'PandaStore'
	document.title = title

	next()
})
