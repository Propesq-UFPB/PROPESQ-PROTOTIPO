import React, { createContext, useContext, useMemo, useState } from 'react'

export type Role = 'DISCENTE' | 'COORDENADOR' | 'ADMINISTRADOR';

type User = {
  [x: string]: any
  name: string
  email: string
  role: Role
}

type AuthContextType = {
  user: User | null
  login: (email: string, _password: string, role: Role) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, _password: string, role: Role) => {
    const name = email.split('@')[0]
    setUser({ name, email, role })
  }
  const logout = () => setUser(null)

  const value = useMemo(() => ({ user, login, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
