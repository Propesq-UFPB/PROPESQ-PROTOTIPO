import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Eye,
  FileSignature,
  FileText,
  Filter,
  FolderKanban,
  GraduationCap,
  Notebook,
  Search,
  Timer,
  UserRound,
  XCircle,
} from "lucide-react"

type ReportType = "Parcial" | "Final"

type ReportStatus =
  | "Não submetido"
  | "Submetido"
  | "Em análise"
  | "Aprovado"
  | "Aprovado com ressalvas"
  | "Solicitar ajustes"
  | "Reprovado"

type Report = {
  id: number
  projectId: number
  planId: number
  projectTitle: string
  planTitle: string
  studentName: string
  studentRegistration: string
  studentCourse: string
  edital: string
  ano: string
  area: string
  type: ReportType
  status: ReportStatus
  submittedAt: string | null
  deadline: string
  reviewer: string | null
  reviewedAt: string | null
  title: string
  summary: string
  fileName: string | null
}

const reports: Report[] = [
  {
    id: 1,
    projectId: 1,
    planId: 1,
    projectTitle: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
    planTitle: "Prototipação de interfaces acessíveis para ambientes educacionais",
    studentName: "Ana Beatriz Santos",
    studentRegistration: "20230014567",
    studentCourse: "Ciência da Computação",
    edital: "PIBIC 2026",
    ano: "2026",
    area: "Interação Humano-Computador",
    type: "Parcial",
    status: "Submetido",
    submittedAt: "08/05/2026",
    deadline: "15/05/2026",
    reviewer: null,
    reviewedAt: null,
    title: "Relatório parcial sobre prototipação de interfaces acessíveis",
    summary:
      "O relatório apresenta as atividades iniciais de levantamento de requisitos, análise de acessibilidade e construção dos primeiros protótipos de interface.",
    fileName: "relatorio_parcial_ana_beatriz.pdf",
  },
  {
    id: 2,
    projectId: 1,
    planId: 1,
    projectTitle: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
    planTitle: "Prototipação de interfaces acessíveis para ambientes educacionais",
    studentName: "Ana Beatriz Santos",
    studentRegistration: "20230014567",
    studentCourse: "Ciência da Computação",
    edital: "PIBIC 2026",
    ano: "2026",
    area: "Interação Humano-Computador",
    type: "Final",
    status: "Não submetido",
    submittedAt: null,
    deadline: "30/07/2027",
    reviewer: null,
    reviewedAt: null,
    title: "Relatório final",
    summary:
      "Relatório final ainda não submetido pelo discente. A submissão ficará disponível no período definido pelo edital.",
    fileName: null,
  },
  {
    id: 3,
    projectId: 1,
    planId: 2,
    projectTitle: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
    planTitle: "Análise de dados de uso em ferramentas de acessibilidade",
    studentName: "João Victor Almeida",
    studentRegistration: "20220017890",
    studentCourse: "Ciência de Dados e Inteligência Artificial",
    edital: "PIBIC 2026",
    ano: "2026",
    area: "Ciência de Dados",
    type: "Parcial",
    status: "Em análise",
    submittedAt: "06/05/2026",
    deadline: "15/05/2026",
    reviewer: "Prof. Dr. Carlos Henrique Almeida",
    reviewedAt: null,
    title: "Relatório parcial de análise exploratória de dados de uso",
    summary:
      "O relatório descreve a organização inicial dos dados, indicadores preliminares e primeiras análises exploratórias sobre o uso da ferramenta.",
    fileName: "relatorio_parcial_joao_victor.pdf",
  },
  {
    id: 4,
    projectId: 2,
    planId: 3,
    projectTitle: "Análise de Dados Educacionais para Monitoramento de Indicadores Acadêmicos",
    planTitle: "Construção de painel analítico para acompanhamento acadêmico",
    studentName: "Mariana Costa Lima",
    studentRegistration: "20210011223",
    studentCourse: "Engenharia de Computação",
    edital: "PIBITI 2026",
    ano: "2026",
    area: "Ciência de Dados",
    type: "Parcial",
    status: "Solicitar ajustes",
    submittedAt: "03/05/2026",
    deadline: "12/05/2026",
    reviewer: "Profa. Dra. Marina Costa",
    reviewedAt: "09/05/2026",
    title: "Relatório parcial do painel analítico educacional",
    summary:
      "O relatório apresenta o levantamento de requisitos, modelagem inicial dos indicadores e primeiros protótipos do painel.",
    fileName: "relatorio_parcial_mariana_lima.pdf",
  },
  {
    id: 5,
    projectId: 3,
    planId: 4,
    projectTitle: "Modelos Inteligentes para Apoio à Gestão de Projetos de Pesquisa",
    planTitle: "Implementação de módulo inteligente para triagem de propostas",
    studentName: "Pedro Henrique Silva",
    studentRegistration: "20240015678",
    studentCourse: "Ciência da Computação",
    edital: "PIBIC 2025",
    ano: "2025",
    area: "Inteligência Artificial",
    type: "Final",
    status: "Aprovado com ressalvas",
    submittedAt: "18/04/2026",
    deadline: "30/04/2026",
    reviewer: "Prof. Dr. Renato Lima",
    reviewedAt: "22/04/2026",
    title: "Relatório final sobre módulo inteligente de triagem",
    summary:
      "O relatório final consolida as atividades de implementação, testes e documentação do módulo inteligente aplicado à triagem de propostas.",
    fileName: "relatorio_final_pedro_silva.pdf",
  },
  {
    id: 6,
    projectId: 4,
    planId: 5,
    projectTitle: "Reconhecimento de Padrões em Sinais Multimodais Aplicados à Acessibilidade",
    planTitle: "Extração e análise de características em sinais multimodais",
    studentName: "Larissa Ferreira Gomes",
    studentRegistration: "20220019876",
    studentCourse: "Ciência da Computação",
    edital: "PIBITI 2025",
    ano: "2025",
    area: "Processamento de Sinais",
    type: "Final",
    status: "Aprovado",
    submittedAt: "15/04/2026",
    deadline: "30/04/2026",
    reviewer: "Prof. Dr. Carlos Henrique Almeida",
    reviewedAt: "20/04/2026",
    title: "Relatório final de análise de sinais multimodais",
    summary:
      "O relatório final apresenta a consolidação das técnicas aplicadas, resultados obtidos e discussão sobre os padrões observados nos sinais analisados.",
    fileName: "relatorio_final_larissa_gomes.pdf",
  },
]

const editalOptions = ["Todos", "PIBIC 2026", "PIBITI 2026", "PIBIC 2025", "PIBITI 2025"]

const typeOptions: Array<ReportType | "Todos"> = [
  "Todos",
  "Parcial",
  "Final",
]

const statusOptions: Array<ReportStatus | "Todos"> = [
  "Todos",
  "Não submetido",
  "Submetido",
  "Em análise",
  "Aprovado",
  "Aprovado com ressalvas",
  "Solicitar ajustes",
  "Reprovado",
]

const yearOptions = ["Todos", "2026", "2025"]

function getStatusClass(status: ReportStatus) {
  switch (status) {
    case "Aprovado":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Aprovado com ressalvas":
      return "border-teal-200 bg-teal-50 text-teal-700"
    case "Solicitar ajustes":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Em análise":
      return "border-violet-200 bg-violet-50 text-violet-700"
    case "Submetido":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "Reprovado":
      return "border-red-200 bg-red-50 text-red-700"
    case "Não submetido":
    default:
      return "border-neutral/20 bg-neutral/10 text-neutral"
  }
}

function getStatusIcon(status: ReportStatus) {
  switch (status) {
    case "Aprovado":
      return <CheckCircle2 size={14} />
    case "Aprovado com ressalvas":
      return <ClipboardCheck size={14} />
    case "Solicitar ajustes":
      return <AlertCircle size={14} />
    case "Em análise":
      return <ClipboardList size={14} />
    case "Submetido":
      return <FileText size={14} />
    case "Reprovado":
      return <XCircle size={14} />
    case "Não submetido":
    default:
      return <Timer size={14} />
  }
}

function getTypeClass(type: ReportType) {
  if (type === "Parcial") {
    return "border-sky-200 bg-sky-50 text-sky-700"
  }

  return "border-primary/20 bg-primary/5 text-primary"
}

export default function CoordinatorReports() {
  const [search, setSearch] = useState("")
  const [selectedEdital, setSelectedEdital] = useState("Todos")
  const [selectedType, setSelectedType] = useState<ReportType | "Todos">("Todos")
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | "Todos">("Todos")
  const [selectedYear, setSelectedYear] = useState("Todos")

  const filteredReports = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return reports.filter((report) => {
      const matchesSearch =
        !normalizedSearch ||
        report.title.toLowerCase().includes(normalizedSearch) ||
        report.projectTitle.toLowerCase().includes(normalizedSearch) ||
        report.planTitle.toLowerCase().includes(normalizedSearch) ||
        report.studentName.toLowerCase().includes(normalizedSearch) ||
        report.studentRegistration.toLowerCase().includes(normalizedSearch) ||
        report.studentCourse.toLowerCase().includes(normalizedSearch) ||
        report.area.toLowerCase().includes(normalizedSearch) ||
        report.edital.toLowerCase().includes(normalizedSearch)

      const matchesEdital = selectedEdital === "Todos" || report.edital === selectedEdital
      const matchesType = selectedType === "Todos" || report.type === selectedType
      const matchesStatus = selectedStatus === "Todos" || report.status === selectedStatus
      const matchesYear = selectedYear === "Todos" || report.ano === selectedYear

      return matchesSearch && matchesEdital && matchesType && matchesStatus && matchesYear
    })
  }, [search, selectedEdital, selectedType, selectedStatus, selectedYear])

  const summary = useMemo(() => {
    const submitted = reports.filter((report) => report.status !== "Não submetido").length

    const pendingReview = reports.filter(
      (report) => report.status === "Submetido" || report.status === "Em análise"
    ).length

    const approved = reports.filter(
      (report) =>
        report.status === "Aprovado" ||
        report.status === "Aprovado com ressalvas"
    ).length

    const adjustments = reports.filter(
      (report) => report.status === "Solicitar ajustes"
    ).length

    return {
      total: reports.length,
      submitted,
      pendingReview,
      approved,
      adjustments,
    }
  }, [])

  function clearFilters() {
    setSearch("")
    setSelectedEdital("Todos")
    setSelectedType("Todos")
    setSelectedStatus("Todos")
    setSelectedYear("Todos")
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {/* HEADER */}
        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <FileText size={14} />
              Relatórios dos discentes
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary">
              Relatórios vinculados aos planos de trabalho
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
              Acompanhe os relatórios parciais e finais submetidos pelos discentes vinculados aos seus planos de
              trabalho, registre pareceres e solicite ajustes quando necessário.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Relatórios filtrados
            </p>

            <p className="mt-2 text-2xl font-bold text-primary">
              {filteredReports.length}
            </p>

            <p className="mt-1 text-xs text-neutral">
              de {reports.length} relatório(s) vinculados
            </p>
          </div>
        </section>

        {/* INDICADORES */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Total vinculado
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.total}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileText size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              Relatórios parciais e finais
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Submetidos
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.submitted}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <ClipboardList size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              Enviados pelos discentes
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Pendentes de parecer
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.pendingReview}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <FileSignature size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              Submetidos ou em análise
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Concluídos
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.approved}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              {summary.adjustments} com ajustes solicitados
            </p>
          </div>
        </section>

        {/* FILTROS */}
        <section className="rounded-2xl border border-neutral/30 bg-white p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Filter size={16} />
                Busca e filtros
              </div>

              <p className="mt-1 text-xs text-neutral">
                Localize relatórios por discente, matrícula, projeto, plano, edital, tipo ou situação.
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              Limpar filtros
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-primary">
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
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Discente, matrícula, projeto, plano ou relatório..."
                  className="w-full rounded-xl border border-neutral/30 bg-white py-2.5 pl-10 pr-3 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">
                Edital
              </label>

              <select
                value={selectedEdital}
                onChange={(event) => setSelectedEdital(event.target.value)}
                className="w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {editalOptions.map((edital) => (
                  <option key={edital} value={edital}>
                    {edital}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">
                Tipo
              </label>

              <select
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value as ReportType | "Todos")}
                className="w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">
                Situação
              </label>

              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value as ReportStatus | "Todos")}
                className="w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">
                Ano
              </label>

              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                className="w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end lg:col-span-4">
              <div className="w-full rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3 text-sm text-neutral">
                <strong className="font-semibold text-primary">
                  {filteredReports.length}
                </strong>{" "}
                relatório(s) encontrado(s) conforme os filtros aplicados.
              </div>
            </div>
          </div>
        </section>

        {/* LISTAGEM */}
        <section className="rounded-2xl border border-neutral/30 bg-white">
          <div className="flex flex-col gap-3 border-b border-neutral/20 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-primary">
                Relatórios recebidos
              </h2>

              <p className="mt-1 text-sm text-neutral">
                Acompanhe os relatórios submetidos pelos discentes e registre o parecer do coordenador.
              </p>
            </div>

            <Link
              to="/coordenador/indicacoes"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              Ver indicações
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {filteredReports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="border-b border-neutral/20 bg-neutral/5 text-left">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Discente
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Projeto / Plano
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Edital
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Prazo / Envio
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Situação
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b border-neutral/10 transition last:border-b-0 hover:bg-neutral/5"
                    >
                      <td className="px-6 py-5 align-top">
                        <div className="max-w-[220px]">
                          <p className="text-sm font-semibold text-primary">
                            {report.studentName}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-neutral">
                            Matrícula {report.studentRegistration}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-neutral">
                            {report.studentCourse}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="max-w-sm">
                          <p className="text-sm font-semibold leading-5 text-primary">
                            {report.projectTitle}
                          </p>

                          <p className="mt-2 text-xs leading-5 text-neutral">
                            Plano: {report.planTitle}
                          </p>

                          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-neutral/20 bg-neutral/5 px-3 py-1 text-xs font-medium text-neutral">
                            <Notebook size={13} />
                            {report.area}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <p className="text-sm font-medium text-primary">
                          {report.edital}
                        </p>

                        <p className="mt-1 text-xs text-neutral">
                          Ano {report.ano}
                        </p>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="space-y-2 text-sm text-neutral">
                          <div className="inline-flex items-center gap-2">
                            <CalendarDays size={15} />
                            Prazo: {report.deadline}
                          </div>

                          <p className="text-xs">
                            {report.submittedAt
                              ? `Enviado em ${report.submittedAt}`
                              : "Ainda não submetido"}
                          </p>

                          {report.reviewedAt && (
                            <p className="text-xs">
                              Parecer em {report.reviewedAt}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                            report.status
                          )}`}
                        >
                          {getStatusIcon(report.status)}
                          {report.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/coordenador/projetos/${report.projectId}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                          >
                            <FolderKanban size={15} />
                            Projeto
                          </Link>

                          {report.status !== "Não submetido" ? (
                            <Link
                              to={`/coordenador/relatorios/${report.id}/parecer`}
                              className={
                                report.status === "Submetido" ||
                                report.status === "Em análise"
                                  ? "inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                                  : "inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-medium text-primary transition hover:border-primary/30 hover:bg-primary/10"
                              }
                            >
                              <FileSignature size={15} />
                              {report.status === "Submetido" ||
                              report.status === "Em análise"
                                ? "Emitir parecer"
                                : "Ver parecer"}
                            </Link>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-neutral/5 px-3 py-2 text-sm font-medium text-neutral/60"
                            >
                              <Timer size={15} />
                              Aguardando
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral/10 text-neutral">
                <Search size={24} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-primary">
                Nenhum relatório encontrado
              </h3>

              <p className="mt-1 max-w-md text-sm leading-6 text-neutral">
                Não encontramos relatórios com os filtros selecionados. Tente limpar os filtros ou alterar os critérios
                de busca.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center justify-center rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </section>

      </div>
    </main>
  )
}