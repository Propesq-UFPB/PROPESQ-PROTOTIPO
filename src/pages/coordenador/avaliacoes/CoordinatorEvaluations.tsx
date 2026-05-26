import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
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
  Search,
  Timer,
  XCircle,
} from "lucide-react"

type EvaluationStatus =
  | "Pendente"
  | "Em avaliação"
  | "Aprovado"
  | "Aprovado com ajustes"
  | "Reprovado"

type EvaluationProject = {
  id: number
  projectId: number
  projectTitle: string
  workPlanTitle: string
  edital: string
  area: string
  ano: string
  submittedAt: string
  deadline: string
  status: EvaluationStatus
  score: number | null
  reviewer: string | null
  priority: "Normal" | "Alta"
}

const initialEvaluations: EvaluationProject[] = [
  {
    id: 1,
    projectId: 1,
    projectTitle: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
    workPlanTitle: "Prototipação de interfaces acessíveis para ambientes educacionais",
    edital: "PIBIC 2026",
    area: "Ciência da Computação",
    ano: "2026",
    submittedAt: "03/05/2026",
    deadline: "15/05/2026",
    status: "Pendente",
    score: null,
    reviewer: null,
    priority: "Normal",
  },
  {
    id: 2,
    projectId: 2,
    projectTitle: "Análise de Dados Educacionais para Monitoramento de Indicadores Acadêmicos",
    workPlanTitle: "Construção de painel de indicadores acadêmicos",
    edital: "PIBITI 2026",
    area: "Ciência de Dados",
    ano: "2026",
    submittedAt: "07/05/2026",
    deadline: "18/05/2026",
    status: "Em avaliação",
    score: null,
    reviewer: "Coordenação de Pesquisa",
    priority: "Alta",
  },
  {
    id: 3,
    projectId: 3,
    projectTitle: "Modelos Computacionais para Apoio à Pesquisa Aplicada",
    workPlanTitle: "Levantamento, tratamento e análise de dados experimentais",
    edital: "PIBIC 2026",
    area: "Engenharia de Software",
    ano: "2026",
    submittedAt: "09/05/2026",
    deadline: "20/05/2026",
    status: "Aprovado com ajustes",
    score: 8.1,
    reviewer: "Coordenação de Pesquisa",
    priority: "Normal",
  },
  {
    id: 4,
    projectId: 4,
    projectTitle: "Automação de Processos Acadêmicos com Inteligência Artificial",
    workPlanTitle: "Desenvolvimento de módulo de recomendação para fluxo acadêmico",
    edital: "PIBITI 2026",
    area: "Inteligência Artificial",
    ano: "2026",
    submittedAt: "10/05/2026",
    deadline: "22/05/2026",
    status: "Aprovado",
    score: 9.2,
    reviewer: "Coordenação de Pesquisa",
    priority: "Normal",
  },
]

const editalOptions = [
  "Todos",
  "PIBIC 2026",
  "PIBITI 2026",
  "PIVIC 2026",
  "PIBIC 2025",
  "PIBITI 2025",
]

const statusOptions: Array<EvaluationStatus | "Todos"> = [
  "Todos",
  "Pendente",
  "Em avaliação",
  "Aprovado",
  "Aprovado com ajustes",
  "Reprovado",
]

const yearOptions = ["Todos", "2026", "2025"]

function getStatusClass(status: EvaluationStatus) {
  switch (status) {
    case "Aprovado":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Aprovado com ajustes":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Em avaliação":
      return "border-violet-200 bg-violet-50 text-violet-700"
    case "Pendente":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "Reprovado":
      return "border-red-200 bg-red-50 text-red-700"
    default:
      return "border-neutral/20 bg-neutral/10 text-neutral"
  }
}

function getStatusIcon(status: EvaluationStatus) {
  switch (status) {
    case "Aprovado":
      return <CheckCircle2 size={14} />
    case "Aprovado com ajustes":
      return <AlertCircle size={14} />
    case "Em avaliação":
      return <ClipboardList size={14} />
    case "Pendente":
      return <Timer size={14} />
    case "Reprovado":
      return <XCircle size={14} />
    default:
      return <ClipboardList size={14} />
  }
}

export default function CoordinatorEvaluations() {
  const [evaluations] = useState<EvaluationProject[]>(initialEvaluations)

  const [search, setSearch] = useState("")
  const [selectedEdital, setSelectedEdital] = useState("Todos")
  const [selectedStatus, setSelectedStatus] = useState<EvaluationStatus | "Todos">("Todos")
  const [selectedYear, setSelectedYear] = useState("Todos")

  const filteredEvaluations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return evaluations.filter((evaluation) => {
      const matchesSearch =
        !normalizedSearch ||
        evaluation.projectTitle.toLowerCase().includes(normalizedSearch) ||
        evaluation.workPlanTitle.toLowerCase().includes(normalizedSearch) ||
        evaluation.area.toLowerCase().includes(normalizedSearch) ||
        evaluation.edital.toLowerCase().includes(normalizedSearch)

      const matchesEdital =
        selectedEdital === "Todos" || evaluation.edital === selectedEdital

      const matchesStatus =
        selectedStatus === "Todos" || evaluation.status === selectedStatus

      const matchesYear =
        selectedYear === "Todos" || evaluation.ano === selectedYear

      return matchesSearch && matchesEdital && matchesStatus && matchesYear
    })
  }, [evaluations, search, selectedEdital, selectedStatus, selectedYear])

  const summary = useMemo(() => {
    const total = evaluations.length

    const pending = evaluations.filter(
      (evaluation) => evaluation.status === "Pendente"
    ).length

    const inProgress = evaluations.filter(
      (evaluation) => evaluation.status === "Em avaliação"
    ).length

    const concluded = evaluations.filter(
      (evaluation) =>
        evaluation.status === "Aprovado" ||
        evaluation.status === "Aprovado com ajustes" ||
        evaluation.status === "Reprovado"
    ).length

    const highPriority = evaluations.filter(
      (evaluation) => evaluation.priority === "Alta"
    ).length

    return {
      total,
      pending,
      inProgress,
      concluded,
      highPriority,
    }
  }, [evaluations])

  function clearFilters() {
    setSearch("")
    setSelectedEdital("Todos")
    setSelectedStatus("Todos")
    setSelectedYear("Todos")
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {/* HEADER */}
        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <FileSignature size={14} />
              Avaliações
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary">
              Avaliação de projetos
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
              Avalie propostas submetidas para análise.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Projetos filtrados
            </p>

            <p className="mt-2 text-2xl font-bold text-primary">
              {filteredEvaluations.length}
            </p>

            <p className="mt-1 text-xs text-neutral">
              de {evaluations.length} projeto(s) registrados
            </p>
          </div>
        </section>

        {/* INDICADORES */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Total para análise
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.total}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ClipboardList size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              projeto(s)
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Pendentes
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.pending}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Timer size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              Aguardando emissão de parecer
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Em avaliação
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.inProgress}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <FileSignature size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              Com análise iniciada
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Concluídas
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.concluded}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <ClipboardCheck size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              projeto(s)
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
                Localize projetos por título, plano de trabalho, edital, situação, ano ou área.
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
                Buscar projeto
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
                  placeholder="Título do projeto, plano, área ou edital..."
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
                Situação
              </label>

              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(event.target.value as EvaluationStatus | "Todos")
                }
                className="w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

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
          </div>

          <div className="mt-4 rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3 text-sm text-neutral">
            <strong className="font-semibold text-primary">
              {filteredEvaluations.length}
            </strong>{" "}
            projeto(s) encontrado(s) conforme os filtros aplicados.
          </div>
        </section>

        {/* LISTAGEM */}
        <section className="rounded-2xl border border-neutral/30 bg-white">
          <div className="border-b border-neutral/20 p-6">
            <h2 className="text-base font-semibold text-primary">
              Fila de projetos para avaliação
            </h2>

            <p className="mt-1 text-sm text-neutral">
              Clique em avaliar para abrir a página de análise do projeto e emissão de parecer.
            </p>
          </div>

          {filteredEvaluations.length > 0 ? (
            <div className="divide-y divide-neutral/10">
              {filteredEvaluations.map((evaluation) => (
                <article
                  key={evaluation.id}
                  className="p-5 transition hover:bg-neutral/5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold leading-6 text-primary">
                        {evaluation.projectTitle}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-neutral">
                        Plano de trabalho vinculado: {evaluation.workPlanTitle}
                      </p>

                      <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-neutral md:grid-cols-2 xl:grid-cols-4">
                        <span className="inline-flex items-center gap-1.5">
                          <GraduationCap size={14} />
                          {evaluation.area}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          Submetido em: {evaluation.submittedAt}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          Prazo: {evaluation.deadline}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <FileText size={14} />
                          {evaluation.edital} • {evaluation.ano}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                      <Link
                        to={`/coordenador/avaliacoes/${evaluation.id}`}
                        className={
                          evaluation.status === "Pendente" ||
                          evaluation.status === "Em avaliação"
                            ? "inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
                            : "inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30"
                        }
                      >
                        <FileSignature size={15} />
                        {evaluation.status === "Pendente" ||
                        evaluation.status === "Em avaliação"
                          ? "Avaliar"
                          : "Ver parecer"}
                      </Link>

                      <Link
                        to={`/coordenador/avaliacoes/${evaluation.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                      >
                        <Eye size={15} />
                        Visualizar
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral/10 text-neutral">
                <Search size={24} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-primary">
                Nenhum projeto encontrado
              </h3>

              <p className="mt-1 max-w-md text-sm leading-6 text-neutral">
                Não encontramos projetos com os filtros selecionados. Tente limpar os filtros ou alterar os critérios.
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