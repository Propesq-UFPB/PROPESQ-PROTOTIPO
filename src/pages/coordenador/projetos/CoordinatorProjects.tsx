import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Ban,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Edit3,
  Eye,
  FileText,
  Filter,
  FolderKanban,
  Plus,
  Search,
  Star,
  XCircle,
} from "lucide-react"

type ProjectType = "Interno" | "Externo"

type ProjectStatus =
  | "Em elaboração"
  | "Submetido"
  | "Aprovado"
  | "Reprovado"

type Project = {
  id: number
  title: string
  type: ProjectType
  status: ProjectStatus
  projectScore: number | null
  submittedAt: string | null
  editableUntil: string
  isWithinEditDeadline: boolean
}

const projects: Project[] = [
  {
    id: 1,
    title: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
    type: "Interno",
    status: "Aprovado",
    projectScore: 9.4,
    submittedAt: "10/05/2026",
    editableUntil: "15/05/2026",
    isWithinEditDeadline: false,
  },
  {
    id: 2,
    title: "Análise de Dados Educacionais para Monitoramento de Indicadores Acadêmicos",
    type: "Interno",
    status: "Submetido",
    projectScore: 8.7,
    submittedAt: "07/05/2026",
    editableUntil: "30/05/2026",
    isWithinEditDeadline: true,
  },
  {
    id: 3,
    title: "Modelos Inteligentes para Apoio à Gestão de Projetos de Pesquisa",
    type: "Interno",
    status: "Reprovado",
    projectScore: 5.8,
    submittedAt: "28/04/2026",
    editableUntil: "03/05/2026",
    isWithinEditDeadline: false,
  },
  {
    id: 4,
    title: "Sistema Web para Acompanhamento de Relatórios de Iniciação Científica",
    type: "Interno",
    status: "Em elaboração",
    projectScore: null,
    submittedAt: null,
    editableUntil: "30/05/2026",
    isWithinEditDeadline: true,
  },
  {
    id: 5,
    title: "Reconhecimento de Padrões em Sinais Multimodais Aplicados à Acessibilidade",
    type: "Interno",
    status: "Submetido",
    projectScore: 7.9,
    submittedAt: "18/04/2026",
    editableUntil: "30/05/2026",
    isWithinEditDeadline: true,
  },
]

const typeOptions: Array<ProjectType | "Todos"> = ["Todos", "Interno", "Externo"]

const statusOptions: Array<ProjectStatus | "Todos"> = [
  "Todos",
  "Em elaboração",
  "Submetido",
  "Aprovado",
  "Reprovado",
]

function getStatusClass(status: ProjectStatus) {
  switch (status) {
    case "Aprovado":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Submetido":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "Reprovado":
      return "border-red-200 bg-red-50 text-red-700"
    case "Em elaboração":
    default:
      return "border-amber-200 bg-amber-50 text-amber-700"
  }
}

function getStatusIcon(status: ProjectStatus) {
  switch (status) {
    case "Aprovado":
      return <CheckCircle2 size={14} />
    case "Submetido":
      return <ClipboardList size={14} />
    case "Reprovado":
      return <XCircle size={14} />
    case "Em elaboração":
    default:
      return <FileText size={14} />
  }
}

function getTypeClass(type: ProjectType) {
  switch (type) {
    case "Externo":
      return "border-violet-200 bg-violet-50 text-violet-700"
    case "Interno":
    default:
      return "border-primary/20 bg-primary/5 text-primary"
  }
}

export default function CoordinatorProjects() {
  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState<ProjectType | "Todos">("Todos")
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | "Todos">("Todos")

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesSearch =
        !normalizedSearch ||
        project.title.toLowerCase().includes(normalizedSearch) ||
        project.type.toLowerCase().includes(normalizedSearch) ||
        project.status.toLowerCase().includes(normalizedSearch)

      const matchesType = selectedType === "Todos" || project.type === selectedType
      const matchesStatus = selectedStatus === "Todos" || project.status === selectedStatus

      return matchesSearch && matchesType && matchesStatus
    })
  }, [search, selectedType, selectedStatus])

  const summary = useMemo(() => {
    const totalProjects = projects.length
    const submittedProjects = projects.filter((project) => project.status === "Submetido").length
    const approvedProjects = projects.filter((project) => project.status === "Aprovado").length
    const draftProjects = projects.filter((project) => project.status === "Em elaboração").length

    return {
      totalProjects,
      submittedProjects,
      approvedProjects,
      draftProjects,
    }
  }, [])

  function clearFilters() {
    setSearch("")
    setSelectedType("Todos")
    setSelectedStatus("Todos")
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {/* HEADER DA PÁGINA */}
        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <FolderKanban size={14} />
              Coordenação de projetos
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary">
              Projetos cadastrados
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
              Acompanhe os projetos cadastrados, consulte avaliações, edite propostas dentro do prazo e cancele
              submissões quando necessário.
            </p>
          </div>

          <Link
            to="/coordenador/projetos/novo"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            <Plus size={16} />
            Novo projeto
          </Link>
        </section>

        {/* INDICADORES */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Total de projetos
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
              Projetos internos e externos cadastrados
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Em elaboração
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.draftProjects}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <FileText size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              Projetos ainda não submetidos
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Submetidos
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.submittedProjects}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <ClipboardList size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              Projetos aguardando avaliação
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Aprovados
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.approvedProjects}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              Projetos com parecer favorável
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
                Filtre os projetos por tipo, status ou palavra-chave.
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              Limpar filtros
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
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
                  placeholder="Título, tipo ou status..."
                  className="w-full rounded-xl border border-neutral/30 bg-white py-2.5 pl-10 pr-3 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">
                Tipo
              </label>

              <select
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value as ProjectType | "Todos")}
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
                Status
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
          </div>

          <div className="mt-4 rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3 text-sm text-neutral">
            <strong className="font-semibold text-primary">
              {filteredProjects.length}
            </strong>{" "}
            projeto(s) encontrado(s) conforme os filtros aplicados.
          </div>
        </section>

        {/* TABELA */}
        <section className="rounded-2xl border border-neutral/30 bg-white">
          <div className="border-b border-neutral/20 p-6">
            <h2 className="text-base font-semibold text-primary">
              Lista de projetos
            </h2>

            <p className="mt-1 text-sm text-neutral">
              Visualize dados gerais, nota do projeto, data de submissão e ações disponíveis por linha.
            </p>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px] border-collapse">
                <thead>
                  <tr className="border-b border-neutral/20 bg-neutral/5 text-left">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Título
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Tipo
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Status
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Nota do projeto(NP)
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Data de submissão
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Prazo de edição
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
                        <p className="max-w-md font-semibold leading-5 text-primary">
                          {project.title}
                        </p>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getTypeClass(
                            project.type
                          )}`}
                        >
                          {project.type}
                        </span>
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
                        {project.projectScore !== null ? (
                          <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                            <Star size={15} />
                            {project.projectScore.toFixed(1)}
                          </div>
                        ) : (
                          <span className="text-sm text-neutral">
                            Ainda não avaliado
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5 align-top">
                        {project.submittedAt ? (
                          <div className="inline-flex items-center gap-2 text-sm text-neutral">
                            <CalendarDays size={15} />
                            {project.submittedAt}
                          </div>
                        ) : (
                          <span className="text-sm text-neutral">
                            Não submetido
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-primary">
                            Até {project.editableUntil}
                          </p>

                          <p
                            className={`text-xs ${
                              project.isWithinEditDeadline
                                ? "text-emerald-700"
                                : "text-neutral"
                            }`}
                          >
                            {project.isWithinEditDeadline
                              ? "Dentro do prazo"
                              : "Prazo encerrado"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Link
                            to={`/coordenador/projetos/${project.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                          >
                            <Eye size={15} />
                            Visualizar
                          </Link>

                          {project.isWithinEditDeadline ? (
                            <Link
                              to={`/coordenador/projetos/${project.id}/editar`}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-medium text-primary transition hover:border-primary/30 hover:bg-primary/10"
                            >
                              <Edit3 size={15} />
                              Editar
                            </Link>
                          ) : (
                            <button
                              type="button"
                              disabled
                              title="Edição indisponível: prazo encerrado"
                              className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-neutral/5 px-3 py-2 text-sm font-medium text-neutral/60"
                            >
                              <Edit3 size={15} />
                              Editar
                            </button>
                          )}

                          <Link
                            to={`/coordenador/avaliacoes?projeto=${project.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                          >
                            <ClipboardList size={15} />
                            Ver avaliações
                          </Link>

                          <button
                            type="button"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                          >
                            <Ban size={15} />
                            Cancelar
                          </button>
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