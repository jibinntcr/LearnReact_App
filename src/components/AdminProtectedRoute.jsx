import React from 'react'
import { Navigate } from "react-router-dom"
import { useUserAuth } from "../context/UserAuthContext"

// toastify
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AdminProtectedRoute = ({ children }) => {

    const { user } = useUserAuth()
    const admin = (currentUser) => {
        if (user) {

            if (user.admin === true) { return currentUser }
            else return null

        } else return null

    }
    const isAdmin = admin(user)
    if (!isAdmin) {
        toast.error("you are not Admin please Login with admin user id ")
        return (<Navigate to="/" />)
    }
    return children
}

export default AdminProtectedRoute