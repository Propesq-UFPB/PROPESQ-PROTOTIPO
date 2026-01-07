import React, { useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Bell,
  Home,
  FolderKanban,
  Files,
  Notebook,
  FileText,
  ShieldCheck,
  GraduationCap,
  LineChart,
  LogOut,
  Menu,
  X,
} from "lucide-react"

import LogoImg from "@/utils/img/logo_propesq.png"
import { useAuth } from "@/context/AuthContext"

/* ================= TIPOS ================= */

type Role = "DISCENTE" | "COORDENADOR" | "ADMINISTRADOR"
type Item = { to: string; label: string; icon: React.ReactNode }

/* ================= UTILS ================= */

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/"
  return pathname === to || pathname.startsWith(to + "/")
}

/* ================= COMPONENT ================= */

export default function AppHeader() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const role = (user?.role as Role) || "DISCENTE"

  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  /* ================= MENU POR PAPEL ================= */

  const menu: Item[] = [
    ...(role === "ADMINISTRADOR"
      ? [{ to: "/dashboard", label: "Início", icon: <Home size={16} /> }]
      : []),

    { to: "/projetos", label: "Projetos", icon: <FolderKanban size={16} /> },

    ...(role !== "ADMINISTRADOR"
      ? [{ to: "/meus-projetos", label: "Meus Projetos", icon: <Files size={16} /> }]
      : []),

    ...(role !== "ADMINISTRADOR"
      ? [{ to: "/planos", label: "Planos de Trabalho", icon: <Notebook size={16} /> }]
      : []),

    ...(role === "COORDENADOR"
      ? [
          { to: "/avaliacoes", label: "Avaliações", icon: <FileText size={16} /> },
          { to: "/relatorios", label: "Relatórios", icon: <Notebook size={16} /> },
        ]
      : []),

    ...(role === "DISCENTE"
      ? [
          { to: "/relatorios", label: "Relatórios", icon: <FileText size={16} /> },
          { to: "/certificados", label: "Certificados", icon: <ShieldCheck size={16} /> },
        ]
      : []),

    ...(role === "ADMINISTRADOR"
      ? [
          {
            to: "/painel-gerencial",
            label: "Painel Gerencial",
            icon: <LineChart size={16} />,
          },
          { to: "/acompanhamento", label: "Editais", icon: <Notebook size={16} /> },
        ]
      : []),
  ]

  /* ================= RENDER ================= */

  return (
    <header
      className={`
        sticky top-0 z-50 p-3
        bg-white
        border-b border-neutral-light
        transition-shadow
        ${scrolled ? "shadow-sm" : ""}
      `}
    >
      {/* ===== BAR ===== */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-3">
          <img src={LogoImg} alt="PROPESQ" className="h-8 w-auto select-none" />
        </NavLink>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center gap-6">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive: strict }) => {
                const active = isActive(location.pathname, item.to) || strict

                return `
                  relative flex items-center gap-2 text-sm font-medium
                  pb-2
                  transition-colors
                  ${active ? "text-primary" : "text-neutral hover:text-primary"}
                  after:content-['']
                  after:absolute after:left-0 after:right-0 after:-bottom-[1px]
                  after:h-[3px] after:rounded-full
                  after:bg-accent
                  after:transition-transform after:duration-300
                  ${active ? "after:scale-x-100" : "after:scale-x-0"}
                `
              }}
            >
              {item.icon}
              {item.label}
            </NavLink>

          ))}
        </nav>

        {/* AÇÕES */}
        <div className="flex items-center gap-3">
          <button
            className="hidden md:flex p-2 rounded-full hover:bg-neutral-light"
            aria-label="Notificações"
          >
            <Bell size={18} />
          </button>

          <button
            onClick={logout}
            className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>

          {/* BURGER */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-light"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* ===== MOBILE DRAWER ===== */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <aside className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl flex flex-col">
            {/* HEADER */}
            <div className="h-16 px-6 flex items-center justify-between border-b">
              <img src={LogoImg} alt="PROPESQ" className="h-7" />
              <button onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* LINKS */}
            <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {menu.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive: strict }) =>
                    `
                      flex items-center gap-3 text-sm font-medium
                      ${
                        isActive(location.pathname, item.to) || strict
                          ? "text-primary"
                          : "text-neutral"
                      }
                    `
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* FOOTER */}
            <div className="border-t px-6 py-4">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          </aside>
        </div>
      )}
    </header>
  )
}
