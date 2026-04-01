import { useState } from 'react'
import Login from './components/Login'
import Donor from './components/Donor'
import Receiver from './components/Receiver'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')

  const handleLogin = (name, role) => {
    setUserName(name)
    setUserRole(role)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserName('')
    setUserRole('')
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-red-50">
      {isLoggedIn && (
        <header className="bg-red-600 text-white px-5 py-4 shadow-md">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className="m-0 text-xl sm:text-2xl font-bold tracking-wide flex items-center gap-2">🩸 LifeDrop</h1>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-base font-semibold">{userName}</span>
                <span className="bg-red-700 px-3 py-1 rounded-full text-xs font-semibold">{userRole}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 px-4 py-8 sm:px-5 sm:py-10 overflow-y-auto">
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : userRole === 'Donor' ? (
          <Donor userName={userName} onLogout={handleLogout} />
        ) : userRole === 'Receiver' ? (
          <Receiver userName={userName} onLogout={handleLogout} />
        ) : null}
      </main>
    </div>
  )
}

export default App
