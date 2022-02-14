import { UnAuthenticatedError } from "../errors/index.js"

const checkPermissions = (requestUser, resourceUserId) => {
	//if (requestUser.role === 'admin') return
	if (requestUser.userId === resourceUserId.toString()) return
	throw new UnAuthenticatedError('Не авторизован для выполнения данного действия')
}

export default checkPermissions