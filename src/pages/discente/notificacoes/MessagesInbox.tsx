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
  Eye,
  AlertTriangle,
  Info,
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
  prioridade: "ALTA" | "MEDIA" | "BAIXA"
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
    prioridade: "ALTA",
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
    prioridade: "MEDIA",
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
    prioridade: "ALTA",
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
    prioridade: "MEDIA",
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
    prioridade: "BAIXA",
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
    prioridade: "ALTA",
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

function getPriorityClasses(priority: InboxMessage["prioridade"]) {
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

function getPriorityLabel(priority: InboxMessage["prioridade"]) {
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
      alta: messages.filter((item) => item.prioridade === "ALTA").length,
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

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
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
              <div className="text-base font-bold text-danger">{stats.alta}</div>
              <div className="text-sm font-medium text-danger">Alta prioridade</div>
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

          <Card
            title=""
            className="bg-white border-2 border-primary rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-primary">{stats.relatorios}</div>
              <div className="text-sm font-medium text-primary">De relatórios</div>
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
                  Buscar mensagem
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
                    placeholder="Assunto, remetente, contexto..."
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
                  Categoria
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value as CategoryFilter)
                  }
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary
                  "
                >
                  <option value="TODOS">Todas</option>
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
                Minhas mensagens
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            {filteredMessages.length === 0 ? (
              <div className="rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-8 text-center">
                <div className="text-base font-semibold text-primary">
                  Nenhuma mensagem encontrada
                </div>
                <p className="mt-1 text-sm text-neutral">
                  Ajuste os filtros para visualizar outros resultados.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredMessages.map((item) => (
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
                              {item.assunto}
                            </h3>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getCategoryClasses(
                                item.categoria
                              )}`}
                            >
                              {getCategoryIcon(item.categoria)}
                              {getCategoryLabel(item.categoria)}
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
                                <Mail size={14} />
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
                                <Mail size={14} />
                              ) : (
                                <MailOpen size={14} />
                              )}
                              {item.status === "NAO_LIDA" ? "Não lida" : "Lida"}
                            </span>
                          </div>

                          <p className="text-sm text-neutral leading-6">
                            {item.resumo}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[210px]">
                          <Link
                            to={`/discente/mensagens/${item.id}`}
                            className="
                              inline-flex items-center justify-center gap-2
                              rounded-xl bg-primary px-4 py-3
                              text-sm font-semibold text-white
                              hover:opacity-90 transition
                            "
                          >
                            <Eye size={16} />
                            Abrir conversa
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="rounded-xl border border-neutral/20 bg-white px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <UserRound size={15} />
                            Remetente
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.remetente}
                          </div>
                        </div>

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
                            {item.contexto}
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