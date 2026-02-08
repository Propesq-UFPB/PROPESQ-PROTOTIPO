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

function isActive(pathname: string, to: string, end?: boolean) {
  if (to === "/") return pathname === "/"
  if (end) return pathname === to
  return pathname === to || pathname.startsWith(to + "/")
}

/** evita matches errados quando há prefixos parecidos */
function pickActivePrimary(pathname: string, primary: NavItem[], fallback: string) {
  const sorted = [...primary].sort((a, b) => b.to.length - a.to.length)
  const found = sorted.find((p) => isActive(pathname, p.to, p.end))
  return found?.to ?? fallback
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

  /* ================= MENU (ADMIN) ================= */

  // Linha 1 (primário) — módulos principais
  const adminPrimary: NavItem[] = [
    { to: "/dashboard", label: "Dashboard", icon: <Home size={16} /> },
    { to: "/projetos", label: "Projetos", icon: <FolderKanban size={16} /> },
    { to: "/adm/avaliacao", label: "Avaliação", icon: <FileSignature size={16} /> },
    { to: "/adm/monitoring", label: "Acompanhamento", icon: <BadgeCheck size={16} /> },
    { to: "/adm/calls", label: "Editais", icon: <LineChart size={16} /> },
    { to: "/adm/settings", label: "Configurações", icon: <Settings size={16} /> },
  ]

  // Linha 2 (subpáginas) — contextual ao primary ativo
  const adminSecondaryByPrimary: Record<string, NavItem[]> = {
    "/dashboard": [
      { to: "/dashboard", label: "Overview", icon: <Home size={16} />, end: true },
      { to: "/projetos", label: "Projetos", icon: <FolderKanban size={16} /> },
    ],

    // Projetos (subpáginas administrativas)
    // /projetos é a lista/hub (Projects.tsx)
    "/projetos": [
      { to: "/projetos", label: "Visão Geral", icon: <Eye size={16} />, end: true },

      // rotas ADM reais:
      { to: "/adm/projetos/novo", label: "Cadastrar", icon: <Plus size={16} /> },
      { to: "/adm/projetos/status", label: "Alterar Situação", icon: <Workflow size={16} /> },
      { to: "/adm/projetos/comunicacao", label: "Comunicação", icon: <Megaphone size={16} /> },
      // { to: "/adm/projetos/detalhes-projetos", label: "Detalhe (placeholder)", icon: <Eye size={16} /> },
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

  /* ================= MENU (NÃO-ADMIN) ================= */

  const nonAdminMenu: NavItem[] = [
    { to: "/projetos", label: "Projetos", icon: <FolderKanban size={16} /> },
    ...(role !== "ADMINISTRADOR" ? [{ to: "/meus-projetos", label: "Meus Projetos", icon: <FolderKanban size={16} /> }] : []),
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
    ${active ? "text-primary" : "text-neutral hover:text-primary"}
    after:content-['']
    after:absolute after:left-0 after:bottom-0
    after:h-[3px] after:w-full after:rounded-full
    after:bg-accent
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
    ${active ? "bg-primary text-white shadow-sm" : "text-neutral hover:text-primary hover:bg-neutral-light"}
    focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
  `

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
          <button className="hidden md:flex p-2 rounded-full hover:bg-neutral-light" aria-label="Notificações">
            <Bell size={18} />
          </button>

          <button
            onClick={logout}
            className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-light"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* SUBMENU DESKTOP (LINHA 2 - SÓ ADM) */}
      {role === "ADMINISTRADOR" && adminSecondary.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-2 pb-1">
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

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <aside className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl flex flex-col">
            <div className="h-16 px-6 flex items-center justify-between border-b">
              <img src={LogoImg} alt="PROPESQ" className="h-7" />
              <button onClick={() => setMobileOpen(false)} aria-label="Fechar menu">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="space-y-4">
                {primaryMenu.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive: rrActive }) =>
                      `
                        flex items-center gap-3 text-sm font-medium
                        ${isActive(location.pathname, item.to, item.end) || rrActive ? "text-primary" : "text-neutral"}
                      `
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {role === "ADMINISTRADOR" && adminSecondary.length > 0 && (
                <div className="pt-4 border-t space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-neutral">Seções</p>

                  {adminSecondary.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive: rrActive }) =>
                        `
                          flex items-center gap-3 text-sm font-medium
                          ${isActive(location.pathname, item.to, item.end) || rrActive ? "text-primary" : "text-neutral"}
                        `
                      }
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </nav>

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
