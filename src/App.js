import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom'
import Home from './components/Home/Home'
import Auth from './components/Auth/Auth'
import Loader from './components/Loader/Loader'
import Account from './components/Account/Account'
import { auth, fetchUserFromDatabase } from './firebase'
import { useEffect, useState } from 'react'
function App() {
  const [isAuthenticate, setAuthenticate] = useState(false)
  const [userInfo, setUserInfo] = useState({})

  const [isInfoLoaded, setIsInfoLoaded] = useState(false)
  const fetchUserInfo = async (uid) => {
    const userInfo = await fetchUserFromDatabase(uid)
    setUserInfo(userInfo)
    setIsInfoLoaded(true)
  }

  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => {
      if (!user) {
        setIsInfoLoaded(true)
        setAuthenticate(false)
        return
      }

      setAuthenticate(true)
      fetchUserInfo(user.uid)
    })

    return () => listener()
  }, [])
  return (
    <div className='App'>
      <Router>
        {isInfoLoaded ? (
          <Routes>
            {!isAuthenticate && (
              <>
                <Route path='/login' element={<Auth />} />
                <Route path='/signup' element={<Auth signup />} />
              </>
            )}
            <Route
              path='/account'
              element={<Account userInfo={userInfo} auth={isAuthenticate} />}
            />
            <Route path='/' element={<Home auth={isAuthenticate} />} />
            <Route path='/*' element={<Navigate to='/' />} />
          </Routes>
        ) : (
          <div className='loader'>
            <Loader />
          </div>
        )}
      </Router>
    </div>
  )
}

export default App
