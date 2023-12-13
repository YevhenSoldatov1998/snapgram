import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {getCurrentUser} from "@/lib/appwrite/api.ts";
import {useNavigate} from "react-router-dom";
import {User} from "@/types";


export const INITIAL_USER = {
  id: '',
  name: '',
  username: '',
  email: '',
  imageUrl: '',
  bio: '',
}

export const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuth: false,
  reset: () => {
    return;
  },
  setUser: (user: User) => {
    console.log(user)
  },
  setIsAuth: (isAuth: boolean) => {
    console.log(isAuth)
  },
  checkAuth: async () => false as boolean,
}

const AuthContext = createContext(INITIAL_STATE)

const AuthProvider = ({children}: PropsWithChildren) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(INITIAL_USER)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAuth, setIsAuth] = useState(false)
  const checkAuth = async () => {
    try {
      const currentAccount = await getCurrentUser()
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio
        })
      }
      setIsAuth(true)
      return true

    } catch (e) {
      console.log(e)
      return false
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (localStorage.getItem('cookieFallback') === '[]'
      || localStorage.getItem('cookieFallback') === null
    ) {
      navigate('/sign-in')
    }
    checkAuth()
  }, [])

  const reset = () => {
    setIsAuth(false)
    setUser(INITIAL_USER)
    setIsLoading(false)
  }
  const value = {
    user,
    setUser,
    isLoading,
    isAuth,
    setIsAuth,
    checkAuth,
    reset
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider

export const useUserContext = () => useContext(AuthContext)