import { createContext, useContext, useState, useCallback } from 'react'
import { localStorageGet, localStorageSet } from '../utils/helpers'
import { hashPassword } from '../utils/crypto'

const AuthContext = createContext(null)

const USERS_KEY = 'nasa-users'
const SESSION_KEY = 'nasa-session'

export const AuthProvider = ({ children }) => {
  // session: { id, name, email }
  const [user, setUser] = useState(() => localStorageGet(SESSION_KEY, null))

  // ── helpers ──────────────────────────────────────────────────────────────
  const getUsers = () => localStorageGet(USERS_KEY, [])

  const saveUsers = users => localStorageSet(USERS_KEY, users)

  // ── register ─────────────────────────────────────────────────────────────
  const register = useCallback(async ({ name, email, password }) => {
    const users = getUsers()

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Este correo ya está registrado.')
    }

    const hashed = await hashPassword(password)
    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      createdAt: new Date().toISOString(),
    }

    saveUsers([...users, newUser])

    const session = { id: newUser.id, name: newUser.name, email: newUser.email }
    localStorageSet(SESSION_KEY, session)
    setUser(session)
  }, [])

  // ── login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    const users = getUsers()
    const found = users.find(u => u.email === email.toLowerCase().trim())

    if (!found) {
      throw new Error('Correo o contraseña incorrectos.')
    }

    const hashed = await hashPassword(password)
    if (hashed !== found.password) {
      throw new Error('Correo o contraseña incorrectos.')
    }

    const session = { id: found.id, name: found.name, email: found.email }
    localStorageSet(SESSION_KEY, session)
    setUser(session)
  }, [])

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
