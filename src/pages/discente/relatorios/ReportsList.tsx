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
} from "lucide-react"

type ReportType = "PARCIAL" | "FINAL" | "ENIC"
type ReportStatus =
  | "PENDENTE"
  | "EM_PREENCHIMENTO"
  | "ENVIADO"
  | "EM_ANALISE"
  | "APROVADO"
  | "REJEITADO"
  | "ATRASADO"

type StudentReport = {
  id: string
  titulo: string
  tipo: ReportType
  projetoId: string
  projetoTitulo: string
  edital: string
  periodo: string
  prazo: string
  status: ReportStatus
  atualizadoEm?: string
  possuiPendencia: boolean
  pendenciaTexto?: string
  resumo: string
}

const REPORTS: StudentReport[] = [
  {
    id: "rel_001",
    titulo: "Relatório Parcial PIBIC 2026",
    tipo: "PARCIAL",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    edital: "PIBIC 2026",
    periodo: "2026.1",
    prazo: "30/06/2026",
    status: "PENDENTE",
    possuiPendencia: false,
    resumo:
      "Relatório parcial referente ao acompanhamento das atividades desenvolvidas no primeiro ciclo do projeto.",
  },
  {
    id: "rel_002",
    titulo: "Relatório Final PIBITI 2026",
    tipo: "FINAL",
    projetoId: "proj_002",
    projetoTitulo: "IA Aplicada à Classificação de Produção Científica",
    edital: "PIBITI 2026",
    periodo: "2026.1",
    prazo: "10/12/2026",
    status: "EM_PREENCHIMENTO",
    atualizadoEm: "14/03/2026",
    possuiPendencia: false,
    resumo:
      "Relatório final com consolidação das atividades, resultados e contribuições do discente ao projeto.",
  },
  {
    id: "rel_003",
    titulo: "Submissão ENIC 2026",
    tipo: "ENIC",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    edital: "PIBIC 2026",
    periodo: "2026.1",
    prazo: "15/08/2026",
    status: "EM_ANALISE",
    atualizadoEm: "12/03/2026",
    possuiPendencia: false,
    resumo:
      "Registro de submissão de trabalho vinculado ao evento acadêmico ENIC, associado ao projeto atual.",
  },
]

type TypeFilter = "TODOS" | ReportType
type StatusFilter = "TODOS" | ReportStatus

function getTypeLabel(type: ReportType) {
  switch (type) {
    case "PARCIAL":
      return "Parcial"
    case "FINAL":
      return "Final"
    case "ENIC":
      return "ENIC"
    default:
      return type
  }
}

function getTypeClasses(type: ReportType) {
  switch (type) {
    case "PARCIAL":
      return "border-primary/30 bg-primary/10 text-primary"
    case "FINAL":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "ENIC":
      return "border-success/30 bg-success/10 text-success"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getStatusLabel(status: ReportStatus) {
  switch (status) {
    case "PENDENTE":
      return "Pendente"
    case "EM_PREENCHIMENTO":
      return "Em preenchimento"
    case "ENVIADO":
      return "Enviado"
    case "EM_ANALISE":
      return "Em análise"
    case "APROVADO":
      return "Aprovado"
    case "REJEITADO":
      return "Rejeitado"
    case "ATRASADO":
      return "Atrasado"
    default:
      return status
  }
}

function getStatusClasses(status: ReportStatus) {
  switch (status) {
    case "PENDENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "EM_PREENCHIMENTO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "ENVIADO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EM_ANALISE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "APROVADO":
      return "border-success/30 bg-success/10 text-success"
    case "REJEITADO":
      return "border-danger/30 bg-danger/10 text-danger"
    case "ATRASADO":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getPrimaryAction(report: StudentReport) {
  if (report.tipo === "PARCIAL") {
    return `/discente/relatorios/parcial/${report.id}`
  }

  if (report.tipo === "FINAL") {
    return `/discente/relatorios/final/${report.id}`
  }

  return `/discente/enic/${report.id}`
}

function getPrimaryActionLabel(report: StudentReport) {
  if (
    report.status === "PENDENTE" ||
    report.status === "EM_PREENCHIMENTO" ||
    report.status === "REJEITADO" ||
    report.status === "ATRASADO"
  ) {
    return "Preencher"
  }

  return "Visualizar"
}

export default function ReportsList() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("TODOS")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODOS")

  const stats = useMemo(() => {
    return {
      total: REPORTS.length,
      pendentes: REPORTS.filter((item) => item.status === "PENDENTE").length,
      emAnalise: REPORTS.filter((item) => item.status === "EM_ANALISE").length,
      aprovados: REPORTS.filter((item) => item.status === "APROVADO").length,
      pendencias: REPORTS.filter((item) => item.possuiPendencia).length,
    }
  }, [])

  const filteredReports = useMemo(() => {
    const term = search.trim().toLowerCase()

    return REPORTS.filter((item) => {
      const matchesSearch =
        !term ||
        item.titulo.toLowerCase().includes(term) ||
        item.projetoTitulo.toLowerCase().includes(term) ||
        item.edital.toLowerCase().includes(term) ||
        item.resumo.toLowerCase().includes(term)

      const matchesType =
        typeFilter === "TODOS" || item.tipo === typeFilter

      const matchesStatus =
        statusFilter === "TODOS" || item.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [search, typeFilter, statusFilter])

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Relatórios • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-bold text-primary">
            Relatórios
          </h1>
          <p className="mt-1 text-base text-neutral">
            Acompanhe seus relatórios parciais, finais e registros vinculados ao ENIC.
          </p>
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
              <div className="text-base font-bold text-warning">{stats.pendentes}</div>
              <div className="text-sm font-medium text-warning">Pendentes</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-primary rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-primary">{stats.emAnalise}</div>
              <div className="text-sm font-medium text-primary">Em análise</div>
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

          <Card
            title=""
            className="bg-white border-2 border-danger rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-danger">{stats.pendencias}</div>
              <div className="text-sm font-medium text-danger">Com pendência</div>
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
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Buscar relatório
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
                    placeholder="Título, projeto, edital..."
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
                  <option value="PARCIAL">Parcial</option>
                  <option value="FINAL">Final</option>
                  <option value="ENIC">ENIC</option>
                </select>
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
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM_PREENCHIMENTO">Em preenchimento</option>
                  <option value="ENVIADO">Enviado</option>
                  <option value="EM_ANALISE">Em análise</option>
                  <option value="APROVADO">Aprovado</option>
                  <option value="REJEITADO">Rejeitado</option>
                  <option value="ATRASADO">Atrasado</option>
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
                Relatórios do discente
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            {filteredReports.length === 0 ? (
              <div className="rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-8 text-center">
                <div className="text-base font-semibold text-primary">
                  Nenhum relatório encontrado
                </div>
                <p className="mt-1 text-sm text-neutral">
                  Ajuste os filtros para visualizar outros resultados.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredReports.map((report) => (
                  <article
                    key={report.id}
                    className="rounded-2xl border border-neutral/20 p-5"
                  >
                    <div className="flex flex-col gap-4">
                      {/* TOPO */}
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-primary">
                              {report.titulo}
                            </h3>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getTypeClasses(
                                report.tipo
                              )}`}
                            >
                              <FileText size={14} />
                              {getTypeLabel(report.tipo)}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                report.status
                              )}`}
                            >
                              {report.status === "APROVADO" ? (
                                <CheckCircle2 size={14} />
                              ) : report.status === "PENDENTE" ||
                                report.status === "EM_PREENCHIMENTO" ||
                                report.status === "EM_ANALISE" ? (
                                <Clock3 size={14} />
                              ) : (
                                <BadgeCheck size={14} />
                              )}
                              {getStatusLabel(report.status)}
                            </span>
                          </div>

                          <p className="text-sm text-neutral leading-6">
                            {report.resumo}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[190px]">
                          <Link
                            to={getPrimaryAction(report)}
                            className="
                              inline-flex items-center justify-center gap-2
                              rounded-xl bg-primary px-4 py-3
                              text-sm font-semibold text-white
                              hover:opacity-90 transition
                            "
                          >
                            <Pencil size={16} />
                            {getPrimaryActionLabel(report)}
                          </Link>

                          <Link
                            to={`/discente/relatorios/${report.id}`}
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
                            {report.projetoTitulo}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <CalendarDays size={15} />
                            Prazo
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {report.prazo}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <BadgeCheck size={15} />
                            Edital
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {report.edital}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <Clock3 size={15} />
                            Última atualização
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {report.atualizadoEm || "-"}
                          </div>
                        </div>
                      </div>

                      {/* PENDÊNCIA */}
                      {report.possuiPendencia && report.pendenciaTexto && (
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
                              {report.pendenciaTexto}
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