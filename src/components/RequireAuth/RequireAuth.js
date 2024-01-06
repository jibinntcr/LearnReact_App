import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const RequireAuth = ({ role = "user" }) => {
	const { admin_flag, userEmail } = useSelector(state => state.login)
	const { pathname } = useLocation()

	let authRole = false
	if (role === "admin") authRole = true

	return (
		userEmail && ["true", "1"].includes(admin_flag) === authRole ?
			<Outlet />
			: userEmail ? <Navigate to="404" replace />
				: <Navigate to="login" state={{ from: pathname }} replace />
	)
}

export default RequireAuth