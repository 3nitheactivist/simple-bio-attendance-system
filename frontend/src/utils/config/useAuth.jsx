import { useContext } from 'react';
import { AuthContext } from './AuthProvider'; // Adjust path as needed

function useAuth() {
  return useContext(AuthContext);
}

export default useAuth;