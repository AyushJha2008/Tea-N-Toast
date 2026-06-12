import React from 'react'

const ProtectedRoute = ({children}) => {

  const authUser = useAuthStore(
    (state) => state.authUser
  );
  if (!authUser) {
    return <Navigate to="/login" />;
  }
  return (
    <div>ProtectedRoute</div>
  )
}

export default ProtectedRoute