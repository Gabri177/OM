import { useCookies } from "@vueuse/integrations/useCookies.mjs"
import * as constants from "~/constants"

const cookie = useCookies()

export function getToken() {
	return cookie.get(constants.COOKIE_SET.token_name)
}

export function setToken(token, expirationDateStr) {

	const expirationDate = new Date(expirationDateStr)
	cookie.set(constants.COOKIE_SET.token_expires_name, expirationDateStr)
	cookie.set(constants.COOKIE_SET.token_name, token, { expires: expirationDate })
}

export function removeToken() {
	cookie.remove(constants.COOKIE_SET.token_name)
	cookie.remove(constants.COOKIE_SET.token_expires_name)
}


export function isTokenExpired() {

	const current_token = cookie.get(constants.COOKIE_SET.token_name)
	const expires = cookie.get(constants.COOKIE_SET.token_expires_name)
	
	if (!current_token){
		return false
	} else {
		if (!expires)
			return true
		else
			return new Date() > new Date(expires)
	}
		
}