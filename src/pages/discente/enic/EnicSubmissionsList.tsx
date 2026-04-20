import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  Search,
  Filter,
  FileText,
  CalendarDays,
  BadgeCheck,
  Clock3,
  Eye,
  Pencil,
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
  Presentation,
} from "lucide-react"

type EnicStatus =
  | "RASCUNHO"
  | "PENDENTE"
  | "SUBMETIDO"
  | "EM_ANALISE"
  | "APROVADO"
  | "REJEITADO"

type EnicSubmission = {
  id: string
  titulo: string
  projetoId: string
  projetoTitulo: string
  edital: string
  evento: string
  modalidade: string
  prazo: string
  status: EnicStatus
  atualizadoEm?: string
  possuiPendencia: boolean
  pendenciaTexto?: string
  resumo: string
}

const SUBMISSIONS: EnicSubmission[] = [
  {
    id: "enic_001",
    titulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    edital: "PIBIC 2026",
    evento: "ENIC 2026",
    modalidade: "Resumo expandido",
    prazo: "15/08/2026",
    status: "RASCUNHO",
    atualizadoEm: "14/03/2026",
    possuiPendencia: false,
    resumo:
      "Submissão em elaboração vinculada ao projeto de desenvolvimento de plataforma acadêmica institucional.",
  },
  {
    id: "enic_002",
    titulo: "IA Aplicada à Classificação de Produção Científica",
    projetoId: "proj_002",
    projetoTitulo: "IA Aplicada à Classificação de Produção Científica",
    edital: "PIBITI 2026",
    evento: "ENIC 2026",
    modalidade: "Resumo simples",
    prazo: "15/08/2026",
    status: "SUBMETIDO",
    atualizadoEm: "10/03/2026",
    possuiPendencia: false,
    resumo:
      "Trabalho submetido ao ENIC com foco em classificação de produção científica utilizando técnicas de IA.",
  },
  {
    id: "enic_003",
    titulo: "Painel Analítico para Indicadores de Iniciação Científica",
    projetoId: "proj_004",
    projetoTitulo: "Painel Analítico para Indicadores de Iniciação Científica",
    edital: "PIBIC 2025",
    evento: "ENIC 2025",
    modalidade: "Resumo expandido",
    prazo: "10/08/2025",
    status: "EM_ANALISE",
    atualizadoEm: "08/08/2025",
    possuiPendencia: false,
    resumo:
      "Submissão encaminhada ao evento e aguardando retorno da comissão avaliadora.",
  },
]

type StatusFilter = "TODOS" | EnicStatus

function getStatusLabel(status: EnicStatus) {
  switch (status) {
    case "RASCUNHO":
      return "Rascunho"
    case "PENDENTE":
      return "Pendente"
    case "SUBMETIDO":
      return "Submetido"
    case "EM_ANALISE":
      return "Em análise"
    case "APROVADO":
      return "Aprovado"
    case "REJEITADO":
      return "Rejeitado"
    default:
      return status
  }
}

function getStatusClasses(status: EnicStatus) {
  switch (status) {
    case "RASCUNHO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "PENDENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "SUBMETIDO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EM_ANALISE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "APROVADO":
      return "border-success/30 bg-success/10 text-success"
    case "REJEITADO":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getPrimaryActionLabel(item: EnicSubmission) {
  if (
    item.status === "RASCUNHO" ||
    item.status === "PENDENTE" ||
    item.status === "REJEITADO"
  ) {
    return "Editar submissão"
  }

  return "Visualizar"
}

function getPrimaryAction(item: EnicSubmission) {
  if (
    item.status === "RASCUNHO" ||
    item.status === "PENDENTE" ||
    item.status === "REJEITADO"
  ) {
    return `/discente/enic/${item.id}/editar`
  }

  return `/discente/enic/${item.id}`
}

export default function EnicSubmissionsList() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODOS")

  const stats = useMemo(() => {
    return {
      total: SUBMISSIONS.length,
      rascunhos: SUBMISSIONS.filter((item) => item.status === "RASCUNHO").length,
      submetidos: SUBMISSIONS.filter((item) => item.status === "SUBMETIDO").length,
      emAnalise: SUBMISSIONS.filter((item) => item.status === "EM_ANALISE").length,
      aprovados: SUBMISSIONS.filter((item) => item.status === "APROVADO").length,
    }
  }, [])

  const filteredSubmissions = useMemo(() => {
    const term = search.trim().toLowerCase()

    return SUBMISSIONS.filter((item) => {
      const matchesSearch =
        !term ||
        item.titulo.toLowerCase().includes(term) ||
        item.projetoTitulo.toLowerCase().includes(term) ||
        item.edital.toLowerCase().includes(term) ||
        item.evento.toLowerCase().includes(term) ||
        item.resumo.toLowerCase().includes(term)

      const matchesStatus =
        statusFilter === "TODOS" || item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Submissões ENIC • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Submissões ENIC
            </h1>
            <p className="mt-1 text-base text-neutral">
              Gerencie seus trabalhos submetidos ao ENIC e acompanhe o andamento das análises.
            </p>
          </div>
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
            className="bg-white border-2 border-neutral rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-neutral">{stats.rascunhos}</div>
              <div className="text-sm font-medium text-neutral">Rascunhos</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-primary rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-primary">{stats.submetidos}</div>
              <div className="text-sm font-medium text-primary">Submetidos</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-warning rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-warning">{stats.emAnalise}</div>
              <div className="text-sm font-medium text-warning">Em análise</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-success rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-success">{stats.aprovados}</div>
              <div className="text-sm font-medium text-success">Aprovados</div>
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
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Buscar submissão
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
                    placeholder="Título, projeto, edital, evento..."
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
                  Status
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
                  <option value="TODOS">Todos</option>
                  <option value="RASCUNHO">Rascunho</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="SUBMETIDO">Submetido</option>
                  <option value="EM_ANALISE">Em análise</option>
                  <option value="APROVADO">Aprovado</option>
                  <option value="REJEITADO">Rejeitado</option>
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
                Trabalhos vinculados ao ENIC
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            {filteredSubmissions.length === 0 ? (
              <div className="rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-8 text-center">
                <div className="text-base font-semibold text-primary">
                  Nenhuma submissão encontrada
                </div>
                <p className="mt-1 text-sm text-neutral">
                  Ajuste os filtros para visualizar outros resultados.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredSubmissions.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-neutral/20 p-5"
                  >
                    <div className="flex flex-col gap-4">
                      {/* TOPO */}
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-primary">
                              {item.titulo}
                            </h3>

                            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                              <Presentation size={14} />
                              {item.modalidade}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                item.status
                              )}`}
                            >
                              {item.status === "APROVADO" ? (
                                <CheckCircle2 size={14} />
                              ) : item.status === "EM_ANALISE" ||
                                item.status === "PENDENTE" ||
                                item.status === "SUBMETIDO" ? (
                                <Clock3 size={14} />
                              ) : item.status === "REJEITADO" ? (
                                <AlertTriangle size={14} />
                              ) : (
                                <FileText size={14} />
                              )}
                              {getStatusLabel(item.status)}
                            </span>
                          </div>

                          <p className="text-sm text-neutral leading-6">
                            {item.resumo}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[210px]">
                          <Link
                            to={getPrimaryAction(item)}
                            className="
                              inline-flex items-center justify-center gap-2
                              rounded-xl bg-primary px-4 py-3
                              text-sm font-semibold text-white
                              hover:opacity-90 transition
                            "
                          >
                            <Pencil size={16} />
                            {getPrimaryActionLabel(item)}
                          </Link>

                          <Link
                            to={`/discente/enic/${item.id}`}
                            className="
                              inline-flex items-center justify-center gap-2
                              rounded-xl border border-primary
                              px-4 py-3 text-sm font-medium text-primary
                              hover:bg-primary/5 transition
                            "
                          >
                            <Eye size={16} />
                            Detalhes
                          </Link>
                        </div>
                      </div>

                      {/* META */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <FolderKanban size={15} />
                            Projeto
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.projetoTitulo}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <CalendarDays size={15} />
                            Prazo
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.prazo}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <BadgeCheck size={15} />
                            Evento
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.evento}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <Clock3 size={15} />
                            Última atualização
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.atualizadoEm || "-"}
                          </div>
                        </div>
                      </div>

                      {/* PENDÊNCIA */}
                      {item.possuiPendencia && item.pendenciaTexto && (
                        <div className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3 text-sm text-neutral">
                          <div className="flex items-start gap-2">
                            <AlertTriangle
                              size={16}
                              className="mt-0.5 text-warning shrink-0"
                            />
                            <div>
                              <span className="font-semibold text-warning">
                                Pendência identificada:
                              </span>{" "}
                              {item.pendenciaTexto}
                            </div>
                          </div>
                        </div>
                      )}
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