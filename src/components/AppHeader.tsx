import React, { useEffect, useMemo, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Home,
  FolderKanban,
  LineChart,
  ShieldCheck,
  GraduationCap,
  FileText,
  Notebook,
  Bell,
  LogOut,
  Menu,
  X,
  Settings,
  Users,
  ClipboardList,
  Building2,
  BookUser,
  BadgeCheck,
  FileSignature,
  Pencil,
  Megaphone,
  Workflow,
  Eye,
  Plus,
  Award,
} from "lucide-react"

import LogoImg from "@/utils/img/logo_propesq.png"
import { useAuth } from "@/context/AuthContext"

/* ================= TIPOS ================= */

type Role = "DISCENTE" | "COORDENADOR" | "ADMINISTRADOR"
type NavItem = { to: string; label: string; icon?: React.ReactNode; end?: boolean }

/**
 * Active matcher com aliases (pra manter submenu estável)
 * - Projetos: primário é /projetos, mas subrotas ADM vivem em /adm/projetos/*
 */
function isActive(pathname: string, to: string, end?: boolean) {
  if (to === "/") return pathname === "/"

  if (to === "/projetos") {
    if (end) return pathname === "/projetos"
    if (pathname === "/projetos") return true
    if (pathname.startsWith("/projetos/")) return true
    if (pathname.startsWith("/adm/projetos")) return true
    return false
  }

  if (end) return pathname === to
  return pathname === to || pathname.startsWith(to + "/")
}

/** evita matches errados quando há prefixos parecidos */
function pickActivePrimary(pathname: string, primary: NavItem[], fallback: string) {
  const sorted = [...primary].sort((a, b) => b.to.length - a.to.length)
  const found = sorted.find((p) => isActive(pathname, p.to, p.end))
  return found?.to ?? fallback
}

/* TEMA POR PÁGINA */

type ThemeTokens = {
  page: string
  pageSoft: string
  sidebarBg: string
  sidebarFg: string
  appBg: string
}

function themeFromPath(pathname: string): ThemeTokens {
  const base: ThemeTokens = {
    page: "#2563EB",
    pageSoft: "#DBEAFE",
    sidebarBg: "#0B1220",
    sidebarFg: "#E5E7EB",
    appBg: "#F3F4F6",
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard")) {
    return { ...base, page: "#2563EB", pageSoft: "#DBEAFE" }
  }
  if (pathname === "/projetos" || pathname.startsWith("/projetos") || pathname.startsWith("/adm/projetos")) {
    return { ...base, page: "#059669", pageSoft: "#D1FAE5" }
  }
  if (pathname.startsWith("/adm/avaliacao") || pathname.startsWith("/avaliacoes")) {
    return { ...base, page: "#7C3AED", pageSoft: "#EDE9FE" }
  }
  if (pathname.startsWith("/adm/monitoring")) {
    return { ...base, page: "#D97706", pageSoft: "#FFEDD5" }
  }
  if (pathname.startsWith("/adm/calls")) {
    return { ...base, page: "#DB2777", pageSoft: "#FCE7F3" }
  }
  if (pathname.startsWith("/adm/settings")) {
    return { ...base, page: "#334155", pageSoft: "#E2E8F0" }
  }

  return base
}

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

  useEffect(() => {
    const t = themeFromPath(location.pathname)

    const root = document.documentElement
    root.style.setProperty("--page", t.page)
    root.style.setProperty("--page-soft", t.pageSoft)
    root.style.setProperty("--sidebar-bg", t.sidebarBg)
    root.style.setProperty("--sidebar-fg", t.sidebarFg)
    root.style.setProperty("--app-bg", t.appBg)

    document.body.style.backgroundColor = "var(--app-bg)"
  }, [location.pathname])

  /* ================= MENU (ADMIN) ================= */

  const adminPrimary: NavItem[] = [
    { to: "/dashboard", label: "Dashboard", icon: <Home size={16} /> },
    { to: "/projetos", label: "Projetos", icon: <FolderKanban size={16} /> },
    { to: "/adm/avaliacao", label: "Avaliação", icon: <FileSignature size={16} /> },
    { to: "/adm/monitoring", label: "Acompanhamento", icon: <BadgeCheck size={16} /> },
    { to: "/adm/calls", label: "Editais", icon: <LineChart size={16} /> },
    { to: "/adm/settings", label: "Configurações", icon: <Settings size={16} /> },
  ]

  const adminSecondaryByPrimary: Record<string, NavItem[]> = {
    "/dashboard": [
      { to: "/dashboard", label: "Overview", icon: <Home size={16} />, end: true },
      { to: "/projetos", label: "Projetos", icon: <FolderKanban size={16} /> },
    ],

    "/projetos": [
      { to: "/projetos", label: "Visão Geral", icon: <Eye size={16} />, end: true },
      { to: "/adm/projetos/novo", label: "Cadastrar", icon: <Plus size={16} /> },
      { to: "/adm/projetos/status", label: "Alterar Situação", icon: <Workflow size={16} /> },
      { to: "/adm/projetos/comunicacao", label: "Comunicação", icon: <Megaphone size={16} /> },
    ],

    "/adm/avaliacao": [
      { to: "/adm/avaliacao", label: "Overview", icon: <FileSignature size={16} />, end: true },
      { to: "/adm/avaliacao/classificacao", label: "Classificação", icon: <GraduationCap size={16} /> },
      { to: "/adm/avaliacao/pontuacao", label: "Pontuação & IPI", icon: <LineChart size={16} /> },
      { to: "/adm/avaliacao/avaliadores", label: "Avaliadores", icon: <Users size={16} /> },
    ],

    "/adm/monitoring": [
      { to: "/adm/monitoring", label: "Overview", icon: <BadgeCheck size={16} />, end: true },
      { to: "/adm/monitoring/replacements", label: "Substituições", icon: <Users size={16} /> },
      { to: "/adm/monitoring/report-validation", label: "Validação Relatórios", icon: <FileText size={16} /> },
      { to: "/adm/monitoring/AdmCertificates", label: "Certificados", icon: <Award size={16} /> },
    ],

    "/adm/calls": [
      { to: "/adm/calls", label: "Overview", icon: <FolderKanban size={16} />, end: true },
      { to: "/adm/calls/CreateCall", label: "Criar Edital", icon: <Notebook size={16} /> },
      { to: "/adm/calls/Manage", label: "Alterar/Remover", icon: <Pencil size={16} /> },
      { to: "/adm/calls/CallSchedule", label: "Cronograma", icon: <ClipboardList size={16} /> },
      { to: "/adm/calls/CallWorkflow", label: "Workflow", icon: <LineChart size={16} /> },
      { to: "/adm/calls/quotas", label: "Cotas", icon: <ShieldCheck size={16} /> },
    ],

    "/adm/settings": [
      { to: "/adm/settings", label: "Overview", icon: <Settings size={16} />, end: true },
      { to: "/adm/settings/scholarships", label: "Bolsas", icon: <ShieldCheck size={16} /> },
      { to: "/adm/settings/academic-units", label: "Unidades", icon: <Building2 size={16} /> },
      { to: "/adm/settings/roles", label: "Funções", icon: <BookUser size={16} /> },
      { to: "/adm/settings/user-types", label: "Usuários", icon: <Users size={16} /> },
      { to: "/adm/settings/parameters", label: "Parâmetros", icon: <Settings size={16} /> },
    ],
  }

  const adminActivePrimary = useMemo(() => {
    return pickActivePrimary(location.pathname, adminPrimary, "/dashboard")
  }, [location.pathname])

  const adminSecondary = adminSecondaryByPrimary[adminActivePrimary] ?? []

  /*MENU (NÃO-ADMIN)*/

  const nonAdminMenu: NavItem[] = [
    { to: "/projetos", label: "Projetos", icon: <FolderKanban size={16} /> },
    ...(role !== "ADMINISTRADOR"
      ? [{ to: "/meus-projetos", label: "Meus Projetos", icon: <FolderKanban size={16} /> }]
      : []),
    ...(role !== "ADMINISTRADOR" ? [{ to: "/planos", label: "Planos de Trabalho", icon: <Notebook size={16} /> }] : []),
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
  ]

  const primaryMenu = role === "ADMINISTRADOR" ? adminPrimary : nonAdminMenu

  /* ================= CLASSES ================= */

  const desktopLinkClass = (active: boolean) => `
    relative inline-flex items-center gap-2 text-sm font-medium
    pb-2
    transition-colors
    ${active ? "text-[color:var(--page)]" : "text-neutral hover:text-[color:var(--page)]"}
    after:content-['']
    after:absolute after:left-0 after:bottom-0
    after:h-[3px] after:w-full after:rounded-full
    after:bg-[color:var(--page)]
    after:transform after:origin-center
    after:transition-transform after:duration-300
    ${active ? "after:scale-x-100" : "after:scale-x-0"}
  `

  const subSegmentClass = (active: boolean) => `
    relative inline-flex items-center gap-2
    px-5 py-2.5
    text-xs font-semibold
    rounded-full
    transition-all
    ${
      active
        ? "bg-[color:var(--page)] text-white shadow-sm"
        : "text-neutral hover:text-[color:var(--page)] hover:bg-[color:var(--page-soft)]"
    }
    focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--page)]/40
  `

  /* ================= RENDER ================= */

  return (
    <header
      className={`
        sticky top-0 z-50
        px-3
        border-b border-neutral-light
        transition-shadow
        ${scrolled ? "shadow-sm" : ""}
        bg-white/75 backdrop-blur
      `}
      style={{
        boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,.06), 0 8px 24px rgba(15,23,42,.06)" : undefined,
      }}
    >
      <div className="h-[3px] w-full" style={{ background: "var(--page)" }} />

      <div className="max-w-7xl mx-auto px-6 h-16 grid grid-cols-[auto,1fr,auto] items-center gap-6">
        <NavLink to="/" className="flex items-center gap-3">
          <img src={LogoImg} alt="PROPESQ" className="h-8 w-auto select-none" />
        </NavLink>

        <nav className="hidden md:flex items-center justify-center gap-6">
          {primaryMenu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive: rrActive }) => {
                const active = isActive(location.pathname, item.to, item.end) || rrActive
                return desktopLinkClass(active)
              }}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 justify-end">
          <button
            className="hidden md:flex p-2 rounded-full hover:bg-[color:var(--page-soft)]"
            aria-label="Notificações"
          >
            <Bell size={18} />
          </button>

          <button
            onClick={logout}
            className="
              hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium
              rounded-lg transition-colors
              border
              text-[color:var(--page)] border-[color:var(--page)]
              hover:bg-[color:var(--page)] hover:text-white
            "
          >
            <LogOut size={16} />
            Sair
          </button>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-[color:var(--page-soft)]"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {role === "ADMINISTRADOR" && adminSecondary.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-2 pb-2">
          <div className="hidden md:flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full bg-white border border-neutral-light shadow-lg p-1">
              {adminSecondary.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive: rrActive }) => {
                    const active = isActive(location.pathname, item.to, item.end) || rrActive
                    return subSegmentClass(active)
                  }}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
          <aside
            className="absolute left-0 top-0 h-full w-80 shadow-xl flex flex-col"
            style={{
              background: "var(--sidebar-bg)",
              color: "var(--sidebar-fg)",
            }}
          >
            <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
              <img src={LogoImg} alt="PROPESQ" className="h-7 opacity-95" />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
                className="opacity-90 hover:opacity-100"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="space-y-3">
                {primaryMenu.map((item) => {
                  const active = isActive(location.pathname, item.to, item.end)
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={`
                        flex items-center gap-3 text-sm font-semibold rounded-lg px-3 py-2
                        transition-colors
                        ${active ? "text-white" : "text-[color:var(--sidebar-fg)]/90 hover:text-white"}
                      `}
                      style={
                        active
                          ? ({ background: "color-mix(in srgb, var(--page) 35%, transparent)" } as any)
                          : { background: "transparent" }
                      }
                    >
                      <span className={active ? "text-white" : "text-white/80"}>{item.icon}</span>
                      {item.label}
                    </NavLink>
                  )
                })}
              </div>

              {role === "ADMINISTRADOR" && adminSecondary.length > 0 && (
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-white/70">Seções</p>

                  {adminSecondary.map((item) => {
                    const active = isActive(location.pathname, item.to, item.end)
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={`
                          flex items-center gap-3 text-sm font-semibold rounded-lg px-3 py-2
                          transition-colors
                          ${active ? "text-white" : "text-white/85 hover:text-white"}
                        `}
                        style={
                          active
                            ? ({ background: "color-mix(in srgb, var(--page) 35%, transparent)" } as any)
                            : { background: "transparent" }
                        }
                      >
                        <span className={active ? "text-white" : "text-white/80"}>{item.icon}</span>
                        {item.label}
                      </NavLink>
                    )
                  })}
                </div>
              )}
            </nav>

            <div className="border-t border-white/10 px-6 py-4">
              <button
                onClick={logout}
                className="
                  w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold
                  rounded-lg transition-colors
                  border border-white/20 text-white
                  hover:border-white/40
                "
                style={{ background: "color-mix(in srgb, var(--page) 22%, transparent)" as any }}
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
