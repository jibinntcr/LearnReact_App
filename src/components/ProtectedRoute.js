import React from "react"
import { Navigate } from "react-router-dom"
import { useUserAuth } from "../context/UserAuthContext"

// toastify
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const ProtectedRoute = ({ children }) => {



    const { user } = useUserAuth()


    if (!user) {


        toast.error("Authentication required for accessing page")


        return (<Navigate to="/" />)
    }
    return children



}

export default ProtectedRoute