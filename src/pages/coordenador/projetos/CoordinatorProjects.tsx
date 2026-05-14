import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  Filter,
  FolderKanban,
  GraduationCap,
  Notebook,
  Plus,
  Search,
  Send,
  Users,
  XCircle,
} from "lucide-react"

type ProjectStatus =
  | "Rascunho"
  | "Enviado"
  | "Em avaliação"
  | "Aprovado"
  | "Necessita ajustes"
  | "Reprovado"

type WorkPlanStatus =
  | "Pendente"
  | "Aprovado"
  | "Em avaliação"
  | "Necessita ajustes"
  | "Reprovado"

type Project = {
  id: number
  title: string
  edital: string
  area: string
  ano: string
  unidade: string
  status: ProjectStatus
  updatedAt: string
  workPlans: {
    total: number
    approved: number
    pending: number
  }
  students: {
    indicated: number
    vacancies: number
  }
}

const projects: Project[] = [
  {
    id: 1,
    title: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
    edital: "PIBIC 2026",
    area: "Ciência da Computação",
    ano: "2026",
    unidade: "CI",
    status: "Aprovado",
    updatedAt: "10/05/2026",
    workPlans: {
      total: 3,
      approved: 3,
      pending: 0,
    },
    students: {
      indicated: 2,
      vacancies: 3,
    },
  },
  {
    id: 2,
    title: "Análise de Dados Educacionais para Monitoramento de Indicadores Acadêmicos",
    edital: "PIBITI 2026",
    area: "Ciência de Dados",
    ano: "2026",
    unidade: "CI",
    status: "Em avaliação",
    updatedAt: "07/05/2026",
    workPlans: {
      total: 2,
      approved: 1,
      pending: 1,
    },
    students: {
      indicated: 0,
      vacancies: 2,
    },
  },
  {
    id: 3,
    title: "Modelos Inteligentes para Apoio à Gestão de Projetos de Pesquisa",
    edital: "PIBIC 2025",
    area: "Inteligência Artificial",
    ano: "2025",
    unidade: "CI",
    status: "Necessita ajustes",
    updatedAt: "28/04/2026",
    workPlans: {
      total: 4,
      approved: 2,
      pending: 2,
    },
    students: {
      indicated: 1,
      vacancies: 4,
    },
  },
  {
    id: 4,
    title: "Sistema Web para Acompanhamento de Relatórios de Iniciação Científica",
    edital: "PIVIC 2026",
    area: "Engenharia de Software",
    ano: "2026",
    unidade: "CT",
    status: "Rascunho",
    updatedAt: "22/04/2026",
    workPlans: {
      total: 1,
      approved: 0,
      pending: 1,
    },
    students: {
      indicated: 0,
      vacancies: 1,
    },
  },
  {
    id: 5,
    title: "Reconhecimento de Padrões em Sinais Multimodais Aplicados à Acessibilidade",
    edital: "PIBITI 2025",
    area: "Processamento de Sinais",
    ano: "2025",
    unidade: "CI",
    status: "Enviado",
    updatedAt: "18/04/2026",
    workPlans: {
      total: 2,
      approved: 0,
      pending: 2,
    },
    students: {
      indicated: 0,
      vacancies: 2,
    },
  },
]

const statusOptions: Array<ProjectStatus | "Todos"> = [
  "Todos",
  "Rascunho",
  "Enviado",
  "Em avaliação",
  "Aprovado",
  "Necessita ajustes",
  "Reprovado",
]

const editalOptions = ["Todos", "PIBIC 2026", "PIBITI 2026", "PIVIC 2026", "PIBIC 2025", "PIBITI 2025"]

const yearOptions = ["Todos", "2026", "2025"]

const areaOptions = [
  "Todos",
  "Ciência da Computação",
  "Ciência de Dados",
  "Inteligência Artificial",
  "Engenharia de Software",
  "Processamento de Sinais",
]

function getStatusClass(status: ProjectStatus) {
  switch (status) {
    case "Aprovado":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Em avaliação":
      return "border-violet-200 bg-violet-50 text-violet-700"
    case "Enviado":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "Necessita ajustes":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Reprovado":
      return "border-red-200 bg-red-50 text-red-700"
    case "Rascunho":
    default:
      return "border-neutral/20 bg-neutral/10 text-neutral"
  }
}

function getStatusIcon(status: ProjectStatus) {
  switch (status) {
    case "Aprovado":
      return <CheckCircle2 size={14} />
    case "Reprovado":
      return <XCircle size={14} />
    case "Em avaliação":
      return <ClipboardList size={14} />
    case "Enviado":
      return <Send size={14} />
    case "Necessita ajustes":
      return <FileText size={14} />
    case "Rascunho":
    default:
      return <Notebook size={14} />
  }
}

export default function CoordinatorProjects() {
  const [search, setSearch] = useState("")
  const [selectedEdital, setSelectedEdital] = useState("Todos")
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | "Todos">("Todos")
  const [selectedYear, setSelectedYear] = useState("Todos")
  const [selectedArea, setSelectedArea] = useState("Todos")

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesSearch =
        !normalizedSearch ||
        project.title.toLowerCase().includes(normalizedSearch) ||
        project.edital.toLowerCase().includes(normalizedSearch) ||
        project.area.toLowerCase().includes(normalizedSearch) ||
        project.unidade.toLowerCase().includes(normalizedSearch)

      const matchesEdital = selectedEdital === "Todos" || project.edital === selectedEdital
      const matchesStatus = selectedStatus === "Todos" || project.status === selectedStatus
      const matchesYear = selectedYear === "Todos" || project.ano === selectedYear
      const matchesArea = selectedArea === "Todos" || project.area === selectedArea

      return matchesSearch && matchesEdital && matchesStatus && matchesYear && matchesArea
    })
  }, [search, selectedEdital, selectedStatus, selectedYear, selectedArea])

  const summary = useMemo(() => {
    const totalProjects = projects.length
    const approvedProjects = projects.filter((project) => project.status === "Aprovado").length
    const pendingEvaluation = projects.filter(
      (project) => project.status === "Enviado" || project.status === "Em avaliação"
    ).length
    const totalWorkPlans = projects.reduce((acc, project) => acc + project.workPlans.total, 0)
    const approvedWorkPlans = projects.reduce((acc, project) => acc + project.workPlans.approved, 0)
    const totalVacancies = projects.reduce((acc, project) => acc + project.students.vacancies, 0)
    const indicatedStudents = projects.reduce((acc, project) => acc + project.students.indicated, 0)

    return {
      totalProjects,
      approvedProjects,
      pendingEvaluation,
      totalWorkPlans,
      approvedWorkPlans,
      totalVacancies,
      indicatedStudents,
    }
  }, [])

  function clearFilters() {
    setSearch("")
    setSelectedEdital("Todos")
    setSelectedStatus("Todos")
    setSelectedYear("Todos")
    setSelectedArea("Todos")
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {/* HEADER DA PÁGINA */}
        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <FolderKanban size={14} />
              Coordenação de projetos
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary">
              Projetos e planos de trabalho
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
              Gerencie os projetos cadastrados, acompanhe a situação dos planos de trabalho e envie propostas para
              avaliação conforme o edital selecionado.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to="/coordenador/projetos/novo"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              <Plus size={16} />
              Novo projeto
            </Link>

            <Link
              to="/coordenador/projetos/novo?tipo=plano"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              <Notebook size={16} />
              Novo plano
            </Link>
          </div>
        </section>

        {/* INDICADORES */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Projetos cadastrados
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.totalProjects}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FolderKanban size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              {summary.approvedProjects} projeto(s) aprovado(s)
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Planos de trabalho
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.totalWorkPlans}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <Notebook size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              {summary.approvedWorkPlans} plano(s) aprovado(s)
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Em tramitação
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.pendingEvaluation}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <ClipboardList size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              Projetos enviados ou em avaliação
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Indicações
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.indicatedStudents}/{summary.totalVacancies}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Users size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              Discentes indicados em planos aprovados
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
                Filtre projetos por edital, situação, ano, área ou palavra-chave.
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
                  placeholder="Título, edital, área ou unidade..."
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
                onChange={(event) => setSelectedStatus(event.target.value as ProjectStatus | "Todos")}
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

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-primary">
                Área do projeto
              </label>

              <select
                value={selectedArea}
                onChange={(event) => setSelectedArea(event.target.value)}
                className="w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {areaOptions.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end lg:col-span-3">
              <div className="w-full rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3 text-sm text-neutral">
                <strong className="font-semibold text-primary">
                  {filteredProjects.length}
                </strong>{" "}
                projeto(s) encontrado(s) conforme os filtros aplicados.
              </div>
            </div>
          </div>
        </section>

        {/* LISTAGEM */}
        <section className="rounded-2xl border border-neutral/30 bg-white">
          <div className="flex flex-col gap-3 border-b border-neutral/20 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-primary">
                Projetos cadastrados
              </h2>
              <p className="mt-1 text-sm text-neutral">
                Acompanhe o andamento dos projetos e seus respectivos planos de trabalho.
              </p>
            </div>

            <Link
              to="/coordenador/avaliacoes"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              Ver avaliações
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="border-b border-neutral/20 bg-neutral/5 text-left">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Projeto
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Edital
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Planos
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Indicações
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Situação
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Atualização
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b border-neutral/10 transition last:border-b-0 hover:bg-neutral/5"
                    >
                      <td className="px-6 py-5 align-top">
                        <div className="max-w-md">
                          <p className="font-semibold leading-5 text-primary">
                            {project.title}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral">
                            <span className="inline-flex items-center gap-1">
                              <GraduationCap size={13} />
                              {project.area}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-neutral/40" />
                            <span>{project.unidade}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <p className="text-sm font-medium text-primary">
                          {project.edital}
                        </p>
                        <p className="mt-1 text-xs text-neutral">
                          Ano {project.ano}
                        </p>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-primary">
                            {project.workPlans.approved}/{project.workPlans.total} aprovados
                          </p>
                          <p className="text-xs text-neutral">
                            {project.workPlans.pending} pendente(s) ou em ajuste
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-primary">
                            {project.students.indicated}/{project.students.vacancies} discentes
                          </p>
                          <p className="text-xs text-neutral">
                            vinculados aos planos aprovados
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                            project.status
                          )}`}
                        >
                          {getStatusIcon(project.status)}
                          {project.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="inline-flex items-center gap-2 text-sm text-neutral">
                          <CalendarDays size={15} />
                          {project.updatedAt}
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/coordenador/projetos/${project.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                          >
                            <Eye size={15} />
                            Visualizar
                          </Link>

                          <Link
                            to={`/coordenador/projetos/${project.id}?acao=planos`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                          >
                            <Notebook size={15} />
                            Planos
                          </Link>

                          {project.status === "Rascunho" || project.status === "Necessita ajustes" ? (
                            <Link
                              to={`/coordenador/projetos/${project.id}?acao=enviar`}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                            >
                              <Send size={15} />
                              Enviar
                            </Link>
                          ) : (
                            <Link
                              to={`/coordenador/indicacoes?projeto=${project.id}`}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-medium text-primary transition hover:border-primary/30 hover:bg-primary/10"
                            >
                              <Users size={15} />
                              Indicar
                            </Link>
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
                Nenhum projeto encontrado
              </h3>

              <p className="mt-1 max-w-md text-sm leading-6 text-neutral">
                Não encontramos projetos com os filtros selecionados. Tente limpar os filtros ou cadastrar um novo
                projeto.
              </p>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                >
                  Limpar filtros
                </button>

                <Link
                  to="/coordenador/projetos/novo"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                  <Plus size={16} />
                  Cadastrar projeto
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}