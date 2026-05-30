import { Navigate } from "react-router-dom";

const ProtectedRoute = ( { Children }) => {
    const isAdmin = localStorage.getItem('isAdmin')

    if (!isAdmin){
        return <Navigate to="/" replace />
    }
    return Children
}

export default ProtectedRoute