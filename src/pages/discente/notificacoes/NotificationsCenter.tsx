import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  Bell,
  Search,
  Filter,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Info,
  MailOpen,
  Eye,
  FolderKanban,
  FileText,
  Presentation,
  BadgeCheck,
} from "lucide-react"

type NotificationType =
  | "EDITAL"
  | "PROJETO"
  | "RELATORIO"
  | "ENIC"
  | "SISTEMA"

type NotificationPriority = "ALTA" | "MEDIA" | "BAIXA"
type NotificationStatus = "LIDA" | "NAO_LIDA"

type StudentNotification = {
  id: string
  titulo: string
  mensagem: string
  tipo: NotificationType
  prioridade: NotificationPriority
  status: NotificationStatus
  data: string
  contextoLabel: string
  contextoUrl: string
}

const NOTIFICATIONS: StudentNotification[] = [
  {
    id: "notif_001",
    titulo: "Prazo de relatório parcial se aproxima",
    mensagem:
      "O relatório parcial do projeto Plataforma Digital para Gestão de Pesquisa Acadêmica deve ser enviado até 30/06/2026.",
    tipo: "RELATORIO",
    prioridade: "ALTA",
    status: "NAO_LIDA",
    data: "14/03/2026 09:10",
    contextoLabel: "Abrir relatório",
    contextoUrl: "/discente/relatorios/parcial/rel_001",
  },
  {
    id: "notif_002",
    titulo: "Sua submissão ENIC está em análise",
    mensagem:
      "A submissão 'IA Aplicada à Classificação de Produção Científica' está em análise pela comissão do evento.",
    tipo: "ENIC",
    prioridade: "MEDIA",
    status: "NAO_LIDA",
    data: "14/03/2026 08:40",
    contextoLabel: "Ver submissão ENIC",
    contextoUrl: "/discente/enic/enic_002/status",
  },
  {
    id: "notif_003",
    titulo: "Pendência documental no vínculo",
    mensagem:
      "Foi identificada pendência documental no vínculo do projeto IA Aplicada à Classificação de Produção Científica.",
    tipo: "PROJETO",
    prioridade: "ALTA",
    status: "NAO_LIDA",
    data: "13/03/2026 16:20",
    contextoLabel: "Ver vínculo",
    contextoUrl: "/discente/projetos/proj_002/vinculo",
  },
  {
    id: "notif_004",
    titulo: "Resultado do edital disponível",
    mensagem:
      "O resultado do Edital PIBIC 2026 já está disponível para consulta no sistema.",
    tipo: "EDITAL",
    prioridade: "MEDIA",
    status: "LIDA",
    data: "13/03/2026 10:05",
    contextoLabel: "Ver resultado",
    contextoUrl: "/discente/inscricoes/inscricao_001/resultado",
  },
  {
    id: "notif_005",
    titulo: "Atualização do sistema PROPESQ",
    mensagem:
      "Novas melhorias foram aplicadas ao módulo discente, incluindo ajustes em perfil, relatórios e submissões.",
    tipo: "SISTEMA",
    prioridade: "BAIXA",
    status: "LIDA",
    data: "12/03/2026 18:00",
    contextoLabel: "Ver notificações",
    contextoUrl: "/discente/notificacoes",
  },
  {
    id: "notif_006",
    titulo: "Relatório final devolvido para ajustes",
    mensagem:
      "O relatório final PIBIC 2025 foi devolvido e precisa de complementações antes de nova submissão.",
    tipo: "RELATORIO",
    prioridade: "ALTA",
    status: "NAO_LIDA",
    data: "12/03/2026 11:30",
    contextoLabel: "Editar relatório",
    contextoUrl: "/discente/relatorios/final/rel_005",
  },
]

type TypeFilter = "TODOS" | NotificationType
type StatusFilter = "TODOS" | NotificationStatus

function getTypeLabel(type: NotificationType) {
  switch (type) {
    case "EDITAL":
      return "Edital"
    case "PROJETO":
      return "Projeto"
    case "RELATORIO":
      return "Relatório"
    case "ENIC":
      return "ENIC"
    case "SISTEMA":
      return "Sistema"
    default:
      return type
  }
}

function getTypeClasses(type: NotificationType) {
  switch (type) {
    case "EDITAL":
      return "border-primary/30 bg-primary/10 text-primary"
    case "PROJETO":
      return "border-success/30 bg-success/10 text-success"
    case "RELATORIO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "ENIC":
      return "border-primary/30 bg-primary/10 text-primary"
    case "SISTEMA":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getPriorityClasses(priority: NotificationPriority) {
  switch (priority) {
    case "ALTA":
      return "border-danger/30 bg-danger/10 text-danger"
    case "MEDIA":
      return "border-warning/30 bg-warning/10 text-warning"
    case "BAIXA":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getPriorityLabel(priority: NotificationPriority) {
  switch (priority) {
    case "ALTA":
      return "Alta prioridade"
    case "MEDIA":
      return "Média prioridade"
    case "BAIXA":
      return "Baixa prioridade"
    default:
      return priority
  }
}

function getTypeIcon(type: NotificationType) {
  switch (type) {
    case "EDITAL":
      return <BadgeCheck size={14} />
    case "PROJETO":
      return <FolderKanban size={14} />
    case "RELATORIO":
      return <FileText size={14} />
    case "ENIC":
      return <Presentation size={14} />
    case "SISTEMA":
      return <Info size={14} />
    default:
      return <Bell size={14} />
  }
}

export default function NotificationsCenter() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("TODOS")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODOS")
  const [notifications, setNotifications] =
    useState<StudentNotification[]>(NOTIFICATIONS)

  const stats = useMemo(() => {
    return {
      total: notifications.length,
      naoLidas: notifications.filter((item) => item.status === "NAO_LIDA").length,
      altas: notifications.filter((item) => item.prioridade === "ALTA").length,
      relatorios: notifications.filter((item) => item.tipo === "RELATORIO").length,
      enic: notifications.filter((item) => item.tipo === "ENIC").length,
    }
  }, [notifications])

  const filteredNotifications = useMemo(() => {
    const term = search.trim().toLowerCase()

    return notifications.filter((item) => {
      const matchesSearch =
        !term ||
        item.titulo.toLowerCase().includes(term) ||
        item.mensagem.toLowerCase().includes(term) ||
        item.tipo.toLowerCase().includes(term)

      const matchesType =
        typeFilter === "TODOS" || item.tipo === typeFilter

      const matchesStatus =
        statusFilter === "TODOS" || item.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [notifications, search, typeFilter, statusFilter])

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "LIDA" } : item
      )
    )
  }

  function markAllAsRead() {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, status: "LIDA" }))
    )
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Notificações • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Central de Notificações
            </h1>
            <p className="mt-1 text-base text-neutral">
              Acompanhe alertas, avisos e atualizações relacionadas aos seus editais, projetos, relatórios e submissões.
            </p>
          </div>

          <button
            type="button"
            onClick={markAllAsRead}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl border border-primary
              px-4 py-3 text-sm font-medium text-primary
              hover:bg-primary/5 transition
            "
          >
            <MailOpen size={16} />
            Marcar todas como lidas
          </button>
        </header>

        {/* INDICADORES */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          <Card
            title=""
            className="bg-white border-2 border-primary rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-primary">{stats.total}</div>
              <div className="text-sm font-medium text-primary">Total</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-warning rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-warning">{stats.naoLidas}</div>
              <div className="text-sm font-medium text-warning">Não lidas</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-danger rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-danger">{stats.altas}</div>
              <div className="text-sm font-medium text-danger">Alta prioridade</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-primary rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-primary">{stats.relatorios}</div>
              <div className="text-sm font-medium text-primary">De relatórios</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-success rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-success">{stats.enic}</div>
              <div className="text-sm font-medium text-success">Do ENIC</div>
            </div>
          </Card>
        </section>

        {/* FILTROS */}
        <section>
          <Card
            title={
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Filter size={16} />
                Busca e filtros
              </div>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Buscar notificação
                </label>

                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Título, mensagem, tipo..."
                    className="
                      w-full rounded-xl border border-neutral/30 bg-white
                      pl-10 pr-4 py-3 text-sm text-primary outline-none
                      focus:border-primary
                    "
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Tipo
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary
                  "
                >
                  <option value="TODOS">Todos</option>
                  <option value="EDITAL">Edital</option>
                  <option value="PROJETO">Projeto</option>
                  <option value="RELATORIO">Relatório</option>
                  <option value="ENIC">ENIC</option>
                  <option value="SISTEMA">Sistema</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Situação
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary
                  "
                >
                  <option value="TODOS">Todas</option>
                  <option value="NAO_LIDA">Não lidas</option>
                  <option value="LIDA">Lidas</option>
                </select>
              </div>
            </div>
          </Card>
        </section>

        {/* LISTA */}
        <section>
          <Card
            title={
              <h2 className="text-sm font-semibold text-primary">
                Minhas notificações
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            {filteredNotifications.length === 0 ? (
              <div className="rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-8 text-center">
                <div className="text-base font-semibold text-primary">
                  Nenhuma notificação encontrada
                </div>
                <p className="mt-1 text-sm text-neutral">
                  Ajuste os filtros para visualizar outros resultados.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredNotifications.map((item) => (
                  <article
                    key={item.id}
                    className={`
                      rounded-2xl border p-5
                      ${item.status === "NAO_LIDA"
                        ? "border-primary/20 bg-primary/5"
                        : "border-neutral/20 bg-white"}
                    `}
                  >
                    <div className="flex flex-col gap-4">
                      {/* TOPO */}
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-primary">
                              {item.titulo}
                            </h3>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getTypeClasses(
                                item.tipo
                              )}`}
                            >
                              {getTypeIcon(item.tipo)}
                              {getTypeLabel(item.tipo)}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                                item.prioridade
                              )}`}
                            >
                              {item.prioridade === "ALTA" ? (
                                <AlertTriangle size={14} />
                              ) : item.prioridade === "MEDIA" ? (
                                <Clock3 size={14} />
                              ) : (
                                <Info size={14} />
                              )}
                              {getPriorityLabel(item.prioridade)}
                            </span>

                            <span
                              className={`
                                inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold
                                ${item.status === "NAO_LIDA"
                                  ? "border-warning/30 bg-warning/10 text-warning"
                                  : "border-success/30 bg-success/10 text-success"}
                              `}
                            >
                              {item.status === "NAO_LIDA" ? (
                                <Bell size={14} />
                              ) : (
                                <MailOpen size={14} />
                              )}
                              {item.status === "NAO_LIDA" ? "Não lida" : "Lida"}
                            </span>
                          </div>

                          <p className="text-sm text-neutral leading-6">
                            {item.mensagem}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[210px]">
                          <Link
                            to={item.contextoUrl}
                            className="
                              inline-flex items-center justify-center gap-2
                              rounded-xl bg-primary px-4 py-3
                              text-sm font-semibold text-white
                              hover:opacity-90 transition
                            "
                          >
                            <Eye size={16} />
                            {item.contextoLabel}
                          </Link>

                          {item.status === "NAO_LIDA" && (
                            <button
                              type="button"
                              onClick={() => markAsRead(item.id)}
                              className="
                                inline-flex items-center justify-center gap-2
                                rounded-xl border border-primary
                                px-4 py-3 text-sm font-medium text-primary
                                hover:bg-primary/5 transition
                              "
                            >
                              <MailOpen size={16} />
                              Marcar como lida
                            </button>
                          )}
                        </div>
                      </div>

                      {/* META */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="rounded-xl border border-neutral/20 bg-white px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <Clock3 size={15} />
                            Data
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.data}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-white px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <BadgeCheck size={15} />
                            Contexto
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.contextoLabel}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  )
}