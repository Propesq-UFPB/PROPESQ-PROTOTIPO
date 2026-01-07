// src/pages/Settings.tsx - sem usar pq os dados vão vir do contexto de autenticação

import React, { useRef, useState } from 'react'
import Card from '@/components/Card'
import { useAuth } from '@/context/AuthContext'
//import { Helmet } from 'react-helmet'

export default function Settings() {
  const { user } = useAuth()
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl as any)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatarUrl(url)
  }

  return (
    <div className="page-settings">
      {/* Cabeçalho de perfil */}
      <Card title="Conta">
        <div className="settings-header">
          <div className="avatar-wrap" onClick={() => fileRef.current?.click()} role="button" tabIndex={0}>
            <img
              src={avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(user?.name || 'U')}
              alt="Avatar do usuário"
              className="avatar"
            />
            <div className="avatar-edit">Alterar</div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>
          </div>

          <div className="profile-meta">
            <div className="name-row">
              <h2 className="display-name">{user?.name || 'Usuário'}</h2>
              {user?.role && <span className="role-badge">{String(user.role)}</span>}
            </div>
            <div className="muted">{user?.email}</div>
            <div className="muted">Último acesso: {user?.lastLogin ? new Date(user.lastLogin as any).toLocaleString() : '—'}</div>
          </div>

          <div className="quick-actions">
            <button className="btn btn-primary">Salvar alterações</button>
          </div>
        </div>

        <div className="divider" />

        {/* Form principal */}
        <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
          {/* Dados pessoais */}
          <h3 className="section-title">Dados pessoais</h3>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="nome" className="label">Nome</label>
              <input id="nome" className="input" defaultValue={user?.name} />
            </div>
            <div className="field">
              <label htmlFor="email" className="label">E-mail</label>
              <input id="email" className="input" defaultValue={user?.email} />
            </div>
            <div className="field">
              <label htmlFor="phone" className="label">Telefone</label>
              <input id="phone" className="input" placeholder="(83) 9 9999-9999" />
            </div>
            <div className="field">
              <label className="label">Vinculação</label>
              <input className="input" defaultValue={user?.department || '—'} />
            </div>
          </div>

          {/* Preferências */}
          <h3 className="section-title">Preferências</h3>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="theme" className="label">Tema</label>
              <select id="theme" className="input">
                <option value="system">Sistema</option>
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="lang" className="label">Idioma</label>
              <select id="lang" className="input">
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="field field--full">
              <div className="pref-row">
                <input id="notifEmail" type="checkbox" className="switch" defaultChecked />
                <label htmlFor="notifEmail" className="pref-label">Receber notificações por e-mail</label>
              </div>
              <div className="pref-row">
                <input id="notifApp" type="checkbox" className="switch" defaultChecked />
                <label htmlFor="notifApp" className="pref-label">Notificações no aplicativo</label>
              </div>
            </div>
          </div>

          {/* Segurança */}
          <h3 className="section-title">Segurança</h3>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="pwdCurrent" className="label">Senha atual</label>
              <input id="pwdCurrent" type="password" className="input" placeholder="••••••••" />
            </div>
            <div className="field">
              <label htmlFor="pwdNew" className="label">Nova senha</label>
              <input id="pwdNew" type="password" className="input" placeholder="Mínimo 8 caracteres" />
            </div>
            <div className="field">
              <label htmlFor="pwdConfirm" className="label">Confirmar nova senha</label>
              <input id="pwdConfirm" type="password" className="input" placeholder="Repita a senha" />
            </div>
            <div className="field">
              <label className="label">2FA</label>
              <div className="pref-row">
                <input id="twofa" type="checkbox" className="switch" />
                <label htmlFor="twofa" className="pref-label">Ativar verificação em 2 etapas</label>
              </div>
            </div>
          </div>

          {/* Ações fixas no fim */}
          <div className="actions sticky-actions">
            <button className="btn btn-descart" type="button">Descartar</button>
            <button className="btn btn-primary" type="submit">Salvar alterações</button>
          </div>
        </form>
      </Card>
    </div>
  )
}
