import { Navigate } from "react-router-dom";

const ProtectedRoute = ( { children }) => {
    const isAdmin = localStorage.getItem('isAdmin')

    if (!isAdmin){
        return <Navigate to="/" replace />
    }
    return children
}

export default ProtectedRoute