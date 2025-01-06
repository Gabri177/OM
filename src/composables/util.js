import { ElNotification, ElMessageBox } from "element-plus";

export function toast(title, message, type = "success", dangerouslyUseHTMLString = false) {
  ElNotification({
	title,
	message,
	type,
	duration: 2000,
	dangerouslyUseHTMLString: dangerouslyUseHTMLString
  });
}

export function popOut(title = "", content = "default content", confirm = "OK", cancel = "Cancel", type = "warning") {

	return ElMessageBox.confirm(
		content,
		title,
		{
		  confirmButtonText: confirm,
		  cancelButtonText: cancel,
		  type,
		}
	)
	
}

