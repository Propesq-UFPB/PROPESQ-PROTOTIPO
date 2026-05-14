// Não estamos usando

import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  Mail,
  MailOpen,
  Search,
  Filter,
  UserRound,
  Clock3,
  BadgeCheck,
  FolderKanban,
  FileText,
  Presentation,
  Info,
  CheckCircle2,
} from "lucide-react"

type MessageCategory =
  | "EDITAL"
  | "PROJETO"
  | "RELATORIO"
  | "ENIC"
  | "SISTEMA"

type MessageStatus = "LIDA" | "NAO_LIDA"

type InboxMessage = {
  id: string
  assunto: string
  remetente: string
  categoria: MessageCategory
  status: MessageStatus
  data: string
  contexto: string
  resumo: string
}

const MESSAGES: InboxMessage[] = [
  {
    id: "msg_001",
    assunto: "Ajustes necessários no relatório parcial",
    remetente: "Prof. André Silva",
    categoria: "RELATORIO",
    status: "NAO_LIDA",
    data: "14/03/2026 09:25",
    contexto: "Relatório Parcial PIBIC 2026",
    resumo:
      "Revise a seção de atividades realizadas e detalhe melhor a diferença entre o plano previsto e o executado.",
  },
  {
    id: "msg_002",
    assunto: "Atualização sobre análise do trabalho ENIC",
    remetente: "Comissão ENIC 2026",
    categoria: "ENIC",
    status: "NAO_LIDA",
    data: "14/03/2026 08:55",
    contexto: "Submissão ENIC 2026",
    resumo:
      "Seu trabalho segue em análise. Caso haja necessidade de complementação, uma nova mensagem será enviada.",
  },
  {
    id: "msg_003",
    assunto: "Pendência documental identificada",
    remetente: "Equipe PROPESQ",
    categoria: "PROJETO",
    status: "LIDA",
    data: "13/03/2026 16:10",
    contexto: "Vínculo no projeto de IA",
    resumo:
      "Foi identificado um problema no comprovante bancário enviado. Atualize o documento para prosseguir com o vínculo.",
  },
  {
    id: "msg_004",
    assunto: "Resultado do edital disponível",
    remetente: "Sistema PROPESQ",
    categoria: "EDITAL",
    status: "LIDA",
    data: "13/03/2026 10:15",
    contexto: "Edital PIBIC 2026",
    resumo:
      "O resultado do edital já está disponível. Consulte sua situação no módulo de editais.",
  },
  {
    id: "msg_005",
    assunto: "Melhorias no módulo discente",
    remetente: "Sistema PROPESQ",
    categoria: "SISTEMA",
    status: "LIDA",
    data: "12/03/2026 18:20",
    contexto: "Atualização do sistema",
    resumo:
      "Novas melhorias foram aplicadas às páginas de perfil, relatórios e submissões acadêmicas.",
  },
  {
    id: "msg_006",
    assunto: "Correções para submissão ENIC rejeitada",
    remetente: "Profa. Lúcia Fernandes",
    categoria: "ENIC",
    status: "NAO_LIDA",
    data: "12/03/2026 11:10",
    contexto: "Submissão ENIC 2024",
    resumo:
      "Reestruture o resumo e revise a adequação ao formato do evento antes de uma nova tentativa futura.",
  },
]

type CategoryFilter = "TODOS" | MessageCategory
type StatusFilter = "TODOS" | MessageStatus

function getCategoryLabel(category: MessageCategory) {
  switch (category) {
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
      return category
  }
}

function getCategoryClasses(category: MessageCategory) {
  switch (category) {
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

function getCategoryIcon(category: MessageCategory) {
  switch (category) {
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
      return <Mail size={14} />
  }
}

function getStatusLabel(status: MessageStatus) {
  switch (status) {
    case "LIDA":
      return "Lida"
    case "NAO_LIDA":
      return "Não lida"
    default:
      return status
  }
}

function getStatusClasses(status: MessageStatus) {
  switch (status) {
    case "LIDA":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "NAO_LIDA":
      return "border-primary/30 bg-primary/10 text-primary"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <Card
      title=""
      className="rounded-2xl border border-neutral/20 bg-white p-5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <div>
          <div className="text-sm text-neutral">{label}</div>
          <div className="mt-1 text-2xl font-bold text-primary">{value}</div>
        </div>
      </div>
    </Card>
  )
}

export default function MessagesInbox() {
  const [messages, setMessages] = useState<InboxMessage[]>(MESSAGES)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("TODOS")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODOS")

  const stats = useMemo(() => {
    return {
      total: messages.length,
      naoLidas: messages.filter((item) => item.status === "NAO_LIDA").length,
      enic: messages.filter((item) => item.categoria === "ENIC").length,
      relatorios: messages.filter((item) => item.categoria === "RELATORIO").length,
    }
  }, [messages])

  const filteredMessages = useMemo(() => {
    const term = search.trim().toLowerCase()

    return messages.filter((item) => {
      const matchesSearch =
        !term ||
        item.assunto.toLowerCase().includes(term) ||
        item.remetente.toLowerCase().includes(term) ||
        item.contexto.toLowerCase().includes(term) ||
        item.resumo.toLowerCase().includes(term)

      const matchesCategory =
        categoryFilter === "TODOS" || item.categoria === categoryFilter

      const matchesStatus =
        statusFilter === "TODOS" || item.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [messages, search, categoryFilter, statusFilter])

  function markAsRead(id: string) {
    setMessages((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "LIDA" } : item
      )
    )
  }

  function markAllAsRead() {
    setMessages((prev) =>
      prev.map((item) => ({ ...item, status: "LIDA" }))
    )
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Mensagens • PROPESQ</title>
      </Helmet>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Caixa de Mensagens
            </h1>
            <p className="mt-1 text-base text-neutral">
              Consulte comunicações enviadas por orientadores, equipe institucional e sistema.
            </p>
          </div>

          <button
            type="button"
            onClick={markAllAsRead}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl border border-primary
              px-4 py-3 text-sm font-medium text-primary
              transition hover:bg-primary/5
            "
          >
            <CheckCircle2 size={16} />
            Marcar todas como lidas
          </button>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Mail size={18} />}
            label="Total de mensagens"
            value={stats.total}
          />
          <StatCard
            icon={<MailOpen size={18} />}
            label="Não lidas"
            value={stats.naoLidas}
          />
          <StatCard
            icon={<Presentation size={18} />}
            label="Mensagens sobre ENIC"
            value={stats.enic}
          />
          <StatCard
            icon={<FileText size={18} />}
            label="Mensagens sobre relatórios"
            value={stats.relatorios}
          />
        </section>

        <Card
          title={
            <h2 className="text-sm font-semibold text-primary">
              Filtros
            </h2>
          }
          className="rounded-2xl border border-neutral/20 bg-white p-6"
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(220px,0.7fr)_minmax(220px,0.7fr)]">
            <div>
              <label className="mb-2 block text-sm font-medium text-primary">
                Buscar
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por assunto, remetente, contexto ou conteúdo..."
                  className="w-full rounded-xl border border-neutral/20 bg-white py-3 pl-10 pr-4 text-sm text-primary outline-none transition focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-primary">
                Categoria
              </label>
              <div className="relative">
                <Filter
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value as CategoryFilter)
                  }
                  className="w-full rounded-xl border border-neutral/20 bg-white py-3 pl-10 pr-4 text-sm text-primary outline-none transition focus:border-primary"
                >
                  <option value="TODOS">Todas</option>
                  <option value="EDITAL">Edital</option>
                  <option value="PROJETO">Projeto</option>
                  <option value="RELATORIO">Relatório</option>
                  <option value="ENIC">ENIC</option>
                  <option value="SISTEMA">Sistema</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-primary">
                Status
              </label>
              <div className="relative">
                <Filter
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral"
                />
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as StatusFilter)
                  }
                  className="w-full rounded-xl border border-neutral/20 bg-white py-3 pl-10 pr-4 text-sm text-primary outline-none transition focus:border-primary"
                >
                  <option value="TODOS">Todos</option>
                  <option value="NAO_LIDA">Não lida</option>
                  <option value="LIDA">Lida</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <section className="space-y-4">
          {filteredMessages.length === 0 ? (
            <Card
              title=""
              className="rounded-2xl border border-neutral/20 bg-white p-8"
            >
              <div className="text-center">
                <h3 className="text-base font-semibold text-primary">
                  Nenhuma mensagem encontrada
                </h3>
                <p className="mt-2 text-sm text-neutral">
                  Tente ajustar os filtros ou utilizar outro termo de busca.
                </p>
              </div>
            </Card>
          ) : (
            filteredMessages.map((message) => (
              <Card
                key={message.id}
                title=""
                className={`rounded-2xl border p-6 transition ${
                  message.status === "NAO_LIDA"
                    ? "border-primary/20 bg-primary/5"
                    : "border-neutral/20 bg-white"
                }`}
              >
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getCategoryClasses(
                            message.categoria
                          )}`}
                        >
                          {getCategoryIcon(message.categoria)}
                          {getCategoryLabel(message.categoria)}
                        </span>

                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            message.status
                          )}`}
                        >
                          {getStatusLabel(message.status)}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-primary">
                          {message.assunto}
                        </h3>
                        <p className="mt-1 text-sm text-neutral">
                          {message.resumo}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {message.status === "NAO_LIDA" && (
                        <button
                          type="button"
                          onClick={() => markAsRead(message.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/5"
                        >
                          <MailOpen size={16} />
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <UserRound size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                            Remetente
                          </div>
                          <div className="mt-1 text-sm font-semibold text-primary">
                            {message.remetente}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Clock3 size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                            Data
                          </div>
                          <div className="mt-1 text-sm font-semibold text-primary">
                            {message.data}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          {getCategoryIcon(message.categoria)}
                        </div>
                        <div>
                          <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                            Contexto
                          </div>
                          <div className="mt-1 text-sm font-semibold text-primary">
                            {message.contexto}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral/20 bg-white p-5">
                    <h4 className="text-sm font-semibold text-primary">
                      Conteúdo da mensagem
                    </h4>
                    <p className="mt-3 text-sm leading-7 text-neutral">
                      {message.resumo}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/discente/notificacoes"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/30 px-4 py-3 text-sm font-medium text-neutral transition hover:bg-neutral/5"
                    >
                      <Mail size={16} />
                      Ver notificações
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          )}
        </section>
      </div>
    </div>
  )
}