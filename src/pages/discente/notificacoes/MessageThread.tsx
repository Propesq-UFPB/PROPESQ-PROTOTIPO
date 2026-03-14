import React, { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import { Eye } from "lucide-react"
import {
  ArrowLeft,
  Mail,
  MailOpen,
  UserRound,
  Clock3,
  BadgeCheck,
  Send,
  FolderKanban,
  FileText,
  Presentation,
  Info,
} from "lucide-react"

type MessageCategory =
  | "EDITAL"
  | "PROJETO"
  | "RELATORIO"
  | "ENIC"
  | "SISTEMA"

type MessageStatus = "LIDA" | "NAO_LIDA"

type ThreadMessage = {
  id: string
  author: string
  role: "REMETENTE" | "DISCENTE" | "SISTEMA"
  date: string
  body: string
}

type MessageThreadData = {
  id: string
  subject: string
  sender: string
  category: MessageCategory
  status: MessageStatus
  contextLabel: string
  contextUrl: string
  priority: "ALTA" | "MEDIA" | "BAIXA"
  messages: ThreadMessage[]
}

const THREADS: MessageThreadData[] = [
  {
    id: "msg_001",
    subject: "Ajustes necessários no relatório parcial",
    sender: "Prof. André Silva",
    category: "RELATORIO",
    status: "NAO_LIDA",
    contextLabel: "Relatório Parcial PIBIC 2026",
    contextUrl: "/discente/relatorios/parcial/rel_001",
    priority: "ALTA",
    messages: [
      {
        id: "m1",
        author: "Prof. André Silva",
        role: "REMETENTE",
        date: "14/03/2026 09:25",
        body:
          "Mariana, revise a seção de atividades realizadas. É importante detalhar melhor o que foi efetivamente executado até agora e diferenciar isso do plano original.",
      },
      {
        id: "m2",
        author: "Prof. André Silva",
        role: "REMETENTE",
        date: "14/03/2026 09:27",
        body:
          "Também recomendo reforçar a parte de resultados preliminares, mesmo que ainda estejam em andamento.",
      },
    ],
  },
  {
    id: "msg_002",
    subject: "Atualização sobre análise do trabalho ENIC",
    sender: "Comissão ENIC 2026",
    category: "ENIC",
    status: "NAO_LIDA",
    contextLabel: "Submissão ENIC 2026",
    contextUrl: "/discente/enic/enic_002/status",
    priority: "MEDIA",
    messages: [
      {
        id: "m1",
        author: "Comissão ENIC 2026",
        role: "REMETENTE",
        date: "14/03/2026 08:55",
        body:
          "Informamos que sua submissão encontra-se em análise. Caso sejam identificadas necessidades de complementação, uma nova mensagem será encaminhada pelo sistema.",
      },
    ],
  },
  {
    id: "msg_003",
    subject: "Pendência documental identificada",
    sender: "Equipe PROPESQ",
    category: "PROJETO",
    status: "LIDA",
    contextLabel: "Vínculo no projeto de IA",
    contextUrl: "/discente/projetos/proj_002/vinculo",
    priority: "ALTA",
    messages: [
      {
        id: "m1",
        author: "Equipe PROPESQ",
        role: "REMETENTE",
        date: "13/03/2026 16:10",
        body:
          "Foi identificado um problema no comprovante bancário enviado. Atualize o documento para prosseguirmos com a validação do vínculo no projeto.",
      },
      {
        id: "m2",
        author: "Mariana Martins",
        role: "DISCENTE",
        date: "13/03/2026 17:02",
        body:
          "Entendido. Vou atualizar o comprovante bancário e reenviar o documento ainda hoje.",
      },
    ],
  },
  {
    id: "msg_005",
    subject: "Melhorias no módulo discente",
    sender: "Sistema PROPESQ",
    category: "SISTEMA",
    status: "LIDA",
    contextLabel: "Atualização do sistema",
    contextUrl: "/discente/notificacoes",
    priority: "BAIXA",
    messages: [
      {
        id: "m1",
        author: "Sistema PROPESQ",
        role: "SISTEMA",
        date: "12/03/2026 18:20",
        body:
          "Novas melhorias foram aplicadas às páginas de perfil, relatórios e submissões acadêmicas. Algumas interfaces foram reorganizadas para facilitar o acompanhamento do discente.",
      },
    ],
  },
]

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

function getPriorityClasses(priority: MessageThreadData["priority"]) {
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

function getPriorityLabel(priority: MessageThreadData["priority"]) {
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

function getBubbleClasses(role: ThreadMessage["role"]) {
  if (role === "DISCENTE") {
    return "bg-primary text-white border border-primary"
  }

  if (role === "SISTEMA") {
    return "bg-neutral/5 text-primary border border-neutral/20"
  }

  return "bg-white text-primary border border-neutral/20"
}

export default function MessageThread() {
  const { id } = useParams()

  const thread = useMemo(
    () => THREADS.find((item) => item.id === id) ?? THREADS[0],
    [id]
  )

  const canReply = thread.category !== "SISTEMA"

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>{thread.subject} • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to="/discente/mensagens"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para mensagens
            </Link>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getCategoryClasses(
                    thread.category
                  )}`}
                >
                  {getCategoryIcon(thread.category)}
                  {getCategoryLabel(thread.category)}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                    thread.priority
                  )}`}
                >
                  {getPriorityLabel(thread.priority)}
                </span>

                <span
                  className={`
                    inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold
                    ${thread.status === "NAO_LIDA"
                      ? "border-warning/30 bg-warning/10 text-warning"
                      : "border-success/30 bg-success/10 text-success"}
                  `}
                >
                  {thread.status === "NAO_LIDA" ? (
                    <Mail size={14} />
                  ) : (
                    <MailOpen size={14} />
                  )}
                  {thread.status === "NAO_LIDA" ? "Não lida" : "Lida"}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">
                {thread.subject}
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                Visualize abaixo as mensagens relacionadas a este contexto e acompanhe a comunicação registrada no sistema.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[220px]">
              <Link
                to={thread.contextUrl}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl bg-primary px-4 py-3
                  text-sm font-semibold text-white
                  hover:opacity-90 transition
                "
              >

                <Eye size={16} />
                Abrir contexto
              </Link>

              {canReply && (
                <button
                  type="button"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <Send size={16} />
                  Responder
                </button>
              )}
            </div>
          </div>
        </header>

        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <UserRound size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Remetente principal</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {thread.sender}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <BadgeCheck size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Contexto</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {thread.contextLabel}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <Clock3 size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Última mensagem</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {thread.messages[thread.messages.length - 1]?.date || "-"}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* THREAD */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Conversa
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-5">
                {thread.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "DISCENTE" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="max-w-3xl w-full">
                      <div className="mb-2 flex items-center gap-2 text-xs text-neutral">
                        <span className="font-semibold text-primary">
                          {message.author}
                        </span>
                        <span>•</span>
                        <span>{message.date}</span>
                      </div>

                      <div
                        className={`rounded-2xl px-4 py-4 text-sm leading-6 ${getBubbleClasses(
                          message.role
                        )}`}
                      >
                        {message.body}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Informações da conversa
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-neutral">Assunto</div>
                  <div className="mt-1 font-medium text-primary">
                    {thread.subject}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Categoria</div>
                  <div className="mt-1 font-medium text-primary">
                    {getCategoryLabel(thread.category)}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Prioridade</div>
                  <div className="mt-1 font-medium text-primary">
                    {getPriorityLabel(thread.priority)}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Situação</div>
                  <div className="mt-1 font-medium text-primary">
                    {thread.status === "NAO_LIDA" ? "Não lida" : "Lida"}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Mensagens na conversa</div>
                  <div className="mt-1 font-medium text-primary">
                    {thread.messages.length}
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Ações rápidas
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="flex flex-col gap-3">
                <Link
                  to={thread.contextUrl}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90 transition
                  "
                >
                  <Eye size={16} />
                  Abrir contexto
                </Link>

                {canReply && (
                  <button
                    type="button"
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-xl border border-primary
                      px-4 py-3 text-sm font-medium text-primary
                      hover:bg-primary/5 transition
                    "
                  >
                    <Send size={16} />
                    Responder
                  </button>
                )}

                <Link
                  to="/discente/mensagens"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-neutral/30
                    px-4 py-3 text-sm font-medium text-neutral
                    hover:bg-neutral/5 transition
                  "
                >
                  <ArrowLeft size={16} />
                  Voltar à caixa
                </Link>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Observações
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3 text-sm text-neutral">
                <li className="leading-6">
                  Utilize esta conversa para acompanhar comunicações formais relacionadas ao seu contexto acadêmico.
                </li>
                <li className="leading-6">
                  Sempre verifique o contexto vinculado para entender a mensagem em sua totalidade.
                </li>
                <li className="leading-6">
                  Mensagens do sistema podem ter caráter apenas informativo e não exigir resposta.
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}