import { useCookies } from "@vueuse/integrations/useCookies.mjs"
import * as constants from "~/constants"

const cookie = useCookies()

export function getToken() {
	return cookie.get(constants.COOKIE_SET.token_name)
}

export function setToken(token) {
	cookie.set(constants.COOKIE_SET.token_name, token)
}

export function removeToken() {
	cookie.remove(constants.COOKIE_SET.token_name)
}
