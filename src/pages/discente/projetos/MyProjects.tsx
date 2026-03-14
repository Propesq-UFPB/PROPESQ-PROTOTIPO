import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  Search,
  FolderKanban,
  BadgeCheck,
  Clock3,
  UserRound,
  CalendarDays,
  Eye,
  Link2,
  History,
  Filter,
  AlertTriangle,
} from "lucide-react"

type ProjectStatus =
  | "ATIVO"
  | "EM_ACOMPANHAMENTO"
  | "ENCERRADO"
  | "PENDENTE_HOMOLOGACAO"

type BondStatus =
  | "VINCULADO"
  | "AGUARDANDO_INICIO"
  | "PENDENTE_DOCUMENTACAO"
  | "FINALIZADO"

type ParticipationType = "BOLSISTA" | "VOLUNTARIO"

type StudentProject = {
  id: string
  titulo: string
  area: string
  orientador: string
  unidade: string
  edital: string
  statusProjeto: ProjectStatus
  statusVinculo: BondStatus
  participacao: ParticipationType
  periodo: string
  inicio: string
  fim: string
  possuiPendencia: boolean
  pendenciaTexto?: string
  resumo: string
}

const PROJECTS: StudentProject[] = [
  {
    id: "proj_001",
    titulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    area: "Sistemas de Informação",
    orientador: "Prof. André Silva",
    unidade: "Centro de Informática",
    edital: "PIBIC 2026",
    statusProjeto: "ATIVO",
    statusVinculo: "VINCULADO",
    participacao: "BOLSISTA",
    periodo: "2026.1",
    inicio: "01/05/2026",
    fim: "31/12/2026",
    possuiPendencia: false,
    resumo:
      "Projeto voltado ao desenvolvimento de uma plataforma digital para gestão de pesquisa, submissões e acompanhamento acadêmico.",
  },
  {
    id: "proj_002",
    titulo: "IA Aplicada à Classificação de Produção Científica",
    area: "Inteligência Artificial",
    orientador: "Profa. Helena Costa",
    unidade: "Centro de Informática",
    edital: "PIBITI 2026",
    statusProjeto: "EM_ACOMPANHAMENTO",
    statusVinculo: "PENDENTE_DOCUMENTACAO",
    participacao: "VOLUNTARIO",
    periodo: "2026.1",
    inicio: "10/05/2026",
    fim: "30/11/2026",
    possuiPendencia: true,
    pendenciaTexto: "Atualizar comprovante bancário e validar documentação complementar.",
    resumo:
      "Projeto com foco em modelos de IA para apoio à classificação e organização de dados científicos institucionais.",
  },
  {
    id: "proj_003",
    titulo: "Ambiente Web para Apoio à Submissão ENIC",
    area: "Engenharia de Software",
    orientador: "Prof. Marcos Oliveira",
    unidade: "Centro de Informática",
    edital: "PROBEX 2025",
    statusProjeto: "ENCERRADO",
    statusVinculo: "FINALIZADO",
    participacao: "VOLUNTARIO",
    periodo: "2025.2",
    inicio: "01/08/2025",
    fim: "20/12/2025",
    possuiPendencia: false,
    resumo:
      "Projeto voltado à organização do fluxo de submissão de trabalhos acadêmicos e acompanhamento institucional do ENIC.",
  },
  {
    id: "proj_004",
    titulo: "Painel Analítico para Indicadores de Iniciação Científica",
    area: "Ciência de Dados",
    orientador: "Prof. Ricardo Lima",
    unidade: "CCEN",
    edital: "PIBIC 2026",
    statusProjeto: "PENDENTE_HOMOLOGACAO",
    statusVinculo: "AGUARDANDO_INICIO",
    participacao: "BOLSISTA",
    periodo: "2026.1",
    inicio: "15/05/2026",
    fim: "15/12/2026",
    possuiPendencia: false,
    resumo:
      "Projeto para criação de dashboards e indicadores de monitoramento de bolsas, editais e relatórios acadêmicos.",
  },
]

type StatusFilter = "TODOS" | ProjectStatus
type BondFilter = "TODOS" | BondStatus
type ParticipationFilter = "TODOS" | ParticipationType

function getProjectStatusLabel(status: ProjectStatus) {
  switch (status) {
    case "ATIVO":
      return "Ativo"
    case "EM_ACOMPANHAMENTO":
      return "Em acompanhamento"
    case "ENCERRADO":
      return "Encerrado"
    case "PENDENTE_HOMOLOGACAO":
      return "Pendente de homologação"
    default:
      return status
  }
}

function getProjectStatusClasses(status: ProjectStatus) {
  switch (status) {
    case "ATIVO":
      return "border-success/30 bg-success/10 text-success"
    case "EM_ACOMPANHAMENTO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "ENCERRADO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "PENDENTE_HOMOLOGACAO":
      return "border-primary/30 bg-primary/10 text-primary"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getBondStatusLabel(status: BondStatus) {
  switch (status) {
    case "VINCULADO":
      return "Vinculado"
    case "AGUARDANDO_INICIO":
      return "Aguardando início"
    case "PENDENTE_DOCUMENTACAO":
      return "Pendente de documentação"
    case "FINALIZADO":
      return "Finalizado"
    default:
      return status
  }
}

function getBondStatusClasses(status: BondStatus) {
  switch (status) {
    case "VINCULADO":
      return "border-success/30 bg-success/10 text-success"
    case "AGUARDANDO_INICIO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "PENDENTE_DOCUMENTACAO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "FINALIZADO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getParticipationClasses(type: ParticipationType) {
  if (type === "BOLSISTA") {
    return "border-primary/30 bg-primary/10 text-primary"
  }

  return "border-neutral/30 bg-neutral/10 text-neutral"
}

export default function MyProjects() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODOS")
  const [bondFilter, setBondFilter] = useState<BondFilter>("TODOS")
  const [participationFilter, setParticipationFilter] =
    useState<ParticipationFilter>("TODOS")

  const stats = useMemo(() => {
    return {
      total: PROJECTS.length,
      ativos: PROJECTS.filter((item) => item.statusProjeto === "ATIVO").length,
      vinculados: PROJECTS.filter((item) => item.statusVinculo === "VINCULADO").length,
      pendencias: PROJECTS.filter((item) => item.possuiPendencia).length,
      encerrados: PROJECTS.filter((item) => item.statusProjeto === "ENCERRADO").length,
    }
  }, [])

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase()

    return PROJECTS.filter((item) => {
      const matchesSearch =
        !term ||
        item.titulo.toLowerCase().includes(term) ||
        item.area.toLowerCase().includes(term) ||
        item.orientador.toLowerCase().includes(term) ||
        item.unidade.toLowerCase().includes(term) ||
        item.edital.toLowerCase().includes(term)

      const matchesStatus =
        statusFilter === "TODOS" || item.statusProjeto === statusFilter

      const matchesBond =
        bondFilter === "TODOS" || item.statusVinculo === bondFilter

      const matchesParticipation =
        participationFilter === "TODOS" || item.participacao === participationFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesBond &&
        matchesParticipation
      )
    })
  }, [search, statusFilter, bondFilter, participationFilter])

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Meus Projetos • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-bold text-primary">
            Meus Projetos
          </h1>
          <p className="mt-1 text-base text-neutral">
            Acompanhe seus vínculos, sua participação e a situação dos projetos em que você atua.
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
            className="bg-white border-2 border-success rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-success">{stats.ativos}</div>
              <div className="text-sm font-medium text-success">Projetos ativos</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-primary rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-primary">{stats.vinculados}</div>
              <div className="text-sm font-medium text-primary">Vínculos ativos</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-warning rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-warning">{stats.pendencias}</div>
              <div className="text-sm font-medium text-warning">Pendências</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-neutral rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-neutral">{stats.encerrados}</div>
              <div className="text-sm font-medium text-neutral">Encerrados</div>
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-primary mb-1.5">
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
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Título, orientador, área..."
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
                  Status do projeto
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
                  <option value="ATIVO">Ativo</option>
                  <option value="EM_ACOMPANHAMENTO">Em acompanhamento</option>
                  <option value="PENDENTE_HOMOLOGACAO">Pendente de homologação</option>
                  <option value="ENCERRADO">Encerrado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Status do vínculo
                </label>
                <select
                  value={bondFilter}
                  onChange={(e) => setBondFilter(e.target.value as BondFilter)}
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary
                  "
                >
                  <option value="TODOS">Todos</option>
                  <option value="VINCULADO">Vinculado</option>
                  <option value="AGUARDANDO_INICIO">Aguardando início</option>
                  <option value="PENDENTE_DOCUMENTACAO">Pendente de documentação</option>
                  <option value="FINALIZADO">Finalizado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Participação
                </label>
                <select
                  value={participationFilter}
                  onChange={(e) =>
                    setParticipationFilter(e.target.value as ParticipationFilter)
                  }
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary
                  "
                >
                  <option value="TODOS">Todos</option>
                  <option value="BOLSISTA">Bolsista</option>
                  <option value="VOLUNTARIO">Voluntário</option>
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
                Projetos vinculados ao discente
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            {filteredProjects.length === 0 ? (
              <div className="rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-8 text-center">
                <div className="text-base font-semibold text-primary">
                  Nenhum projeto encontrado
                </div>
                <p className="mt-1 text-sm text-neutral">
                  Ajuste os filtros para visualizar outros resultados.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredProjects.map((project) => (
                  <article
                    key={project.id}
                    className="rounded-2xl border border-neutral/20 p-5"
                  >
                    <div className="flex flex-col gap-4">
                      {/* TOPO */}
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-primary">
                              {project.titulo}
                            </h3>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getProjectStatusClasses(
                                project.statusProjeto
                              )}`}
                            >
                              <FolderKanban size={14} />
                              {getProjectStatusLabel(project.statusProjeto)}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getBondStatusClasses(
                                project.statusVinculo
                              )}`}
                            >
                              <BadgeCheck size={14} />
                              {getBondStatusLabel(project.statusVinculo)}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getParticipationClasses(
                                project.participacao
                              )}`}
                            >
                              <BadgeCheck size={14} />
                              {project.participacao === "BOLSISTA"
                                ? "Bolsista"
                                : "Voluntário"}
                            </span>
                          </div>

                          <p className="text-sm text-neutral leading-6">
                            {project.resumo}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[190px]">
                          <Link
                            to={`/discente/projetos/${project.id}`}
                            className="
                              inline-flex items-center justify-center gap-2
                              rounded-xl border border-primary
                              px-4 py-3 text-sm font-medium text-primary
                              hover:bg-primary/5 transition
                            "
                          >
                            <Eye size={16} />
                            Visualizar
                          </Link>

                          <Link
                            to={`/discente/projetos/${project.id}/vinculo`}
                            className="
                              inline-flex items-center justify-center gap-2
                              rounded-xl bg-primary px-4 py-3
                              text-sm font-semibold text-white
                              hover:opacity-90 transition
                            "
                          >
                            <Link2 size={16} />
                            Ver vínculo
                          </Link>
                        </div>
                      </div>

                      {/* META */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <UserRound size={15} />
                            Orientador(a)
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {project.orientador}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <FolderKanban size={15} />
                            Área
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {project.area}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <CalendarDays size={15} />
                            Período
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {project.inicio} até {project.fim}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <Clock3 size={15} />
                            Edital
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {project.edital}
                          </div>
                        </div>
                      </div>

                      {/* PENDÊNCIA */}
                      {project.possuiPendencia && project.pendenciaTexto && (
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
                              {project.pendenciaTexto}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* RODAPÉ DE AÇÕES */}
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/discente/projetos/${project.id}`}
                          className="
                            inline-flex items-center gap-2
                            rounded-xl border border-primary
                            px-4 py-2 text-sm font-medium text-primary
                            hover:bg-primary/5 transition
                          "
                        >
                          <Eye size={15} />
                          Detalhes
                        </Link>

                        <Link
                          to={`/discente/projetos/${project.id}/vinculo`}
                          className="
                            inline-flex items-center gap-2
                            rounded-xl border border-primary
                            px-4 py-2 text-sm font-medium text-primary
                            hover:bg-primary/5 transition
                          "
                        >
                          <Link2 size={15} />
                          Situação do vínculo
                        </Link>

                        <Link
                          to="/discente/historico"
                          className="
                            inline-flex items-center gap-2
                            rounded-xl border border-neutral/30
                            px-4 py-2 text-sm font-medium text-neutral
                            hover:bg-neutral/5 transition
                          "
                        >
                          <History size={15} />
                          Histórico
                        </Link>
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