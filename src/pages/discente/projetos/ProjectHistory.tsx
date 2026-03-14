import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  Search,
  History,
  Filter,
  FolderKanban,
  BadgeCheck,
  CalendarDays,
  UserRound,
  Eye,
  Link2,
  CheckCircle2,
  Clock3,
} from "lucide-react"

type HistoryStatus =
  | "ATIVO"
  | "FINALIZADO"
  | "ENCERRADO"
  | "DESVINCULADO"
  | "EM_ACOMPANHAMENTO"

type ParticipationType = "BOLSISTA" | "VOLUNTARIO"

type StudentHistoryItem = {
  id: string
  titulo: string
  area: string
  orientador: string
  unidade: string
  edital: string
  participacao: ParticipationType
  status: HistoryStatus
  periodoAcademico: string
  inicio: string
  fim: string
  resumo: string
}

const HISTORY_ITEMS: StudentHistoryItem[] = [
  {
    id: "proj_001",
    titulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    area: "Sistemas de Informação",
    orientador: "Prof. André Silva",
    unidade: "Centro de Informática",
    edital: "PIBIC 2026",
    participacao: "BOLSISTA",
    status: "ATIVO",
    periodoAcademico: "2026.1",
    inicio: "01/05/2026",
    fim: "31/12/2026",
    resumo:
      "Projeto voltado ao desenvolvimento de uma plataforma digital para gestão de pesquisa, inscrições, relatórios e acompanhamento institucional.",
  },
  {
    id: "proj_002",
    titulo: "IA Aplicada à Classificação de Produção Científica",
    area: "Inteligência Artificial",
    orientador: "Profa. Helena Costa",
    unidade: "Centro de Informática",
    edital: "PIBITI 2026",
    participacao: "VOLUNTARIO",
    status: "EM_ACOMPANHAMENTO",
    periodoAcademico: "2026.1",
    inicio: "10/05/2026",
    fim: "30/11/2026",
    resumo:
      "Projeto com foco em classificação e análise de produção científica usando modelos de inteligência artificial.",
  },
  {
    id: "proj_003",
    titulo: "Ambiente Web para Apoio à Submissão ENIC",
    area: "Engenharia de Software",
    orientador: "Prof. Marcos Oliveira",
    unidade: "Centro de Informática",
    edital: "PROBEX 2025",
    participacao: "VOLUNTARIO",
    status: "FINALIZADO",
    periodoAcademico: "2025.2",
    inicio: "01/08/2025",
    fim: "20/12/2025",
    resumo:
      "Projeto voltado à organização do fluxo de submissão de trabalhos e acompanhamento do ENIC.",
  },
  {
    id: "proj_004",
    titulo: "Painel Analítico para Indicadores de Iniciação Científica",
    area: "Ciência de Dados",
    orientador: "Prof. Ricardo Lima",
    unidade: "CCEN",
    edital: "PIBIC 2025",
    participacao: "BOLSISTA",
    status: "ENCERRADO",
    periodoAcademico: "2025.1",
    inicio: "01/03/2025",
    fim: "30/11/2025",
    resumo:
      "Projeto para construção de indicadores e dashboards de acompanhamento acadêmico e científico.",
  },
  {
    id: "proj_005",
    titulo: "Repositório Digital para Produção Discente",
    area: "Biblioteconomia Digital",
    orientador: "Profa. Lúcia Fernandes",
    unidade: "CCSA",
    edital: "PROBEX 2024",
    participacao: "VOLUNTARIO",
    status: "DESVINCULADO",
    periodoAcademico: "2024.2",
    inicio: "10/08/2024",
    fim: "15/10/2024",
    resumo:
      "Projeto institucional voltado à organização de acervos e produção discente em repositório digital.",
  },
]

type StatusFilter = "TODOS" | HistoryStatus
type ParticipationFilter = "TODOS" | ParticipationType

function getStatusLabel(status: HistoryStatus) {
  switch (status) {
    case "ATIVO":
      return "Ativo"
    case "FINALIZADO":
      return "Finalizado"
    case "ENCERRADO":
      return "Encerrado"
    case "DESVINCULADO":
      return "Desvinculado"
    case "EM_ACOMPANHAMENTO":
      return "Em acompanhamento"
    default:
      return status
  }
}

function getStatusClasses(status: HistoryStatus) {
  switch (status) {
    case "ATIVO":
      return "border-success/30 bg-success/10 text-success"
    case "EM_ACOMPANHAMENTO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "FINALIZADO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "ENCERRADO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "DESVINCULADO":
      return "border-danger/30 bg-danger/10 text-danger"
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

export default function ProjectHistory() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODOS")
  const [participationFilter, setParticipationFilter] =
    useState<ParticipationFilter>("TODOS")

  const stats = useMemo(() => {
    return {
      total: HISTORY_ITEMS.length,
      ativos: HISTORY_ITEMS.filter((item) => item.status === "ATIVO").length,
      finalizados: HISTORY_ITEMS.filter((item) => item.status === "FINALIZADO").length,
      encerrados: HISTORY_ITEMS.filter((item) => item.status === "ENCERRADO").length,
      bolsista: HISTORY_ITEMS.filter((item) => item.participacao === "BOLSISTA").length,
    }
  }, [])

  const filteredHistory = useMemo(() => {
    const term = search.trim().toLowerCase()

    return HISTORY_ITEMS.filter((item) => {
      const matchesSearch =
        !term ||
        item.titulo.toLowerCase().includes(term) ||
        item.area.toLowerCase().includes(term) ||
        item.orientador.toLowerCase().includes(term) ||
        item.unidade.toLowerCase().includes(term) ||
        item.edital.toLowerCase().includes(term)

      const matchesStatus =
        statusFilter === "TODOS" || item.status === statusFilter

      const matchesParticipation =
        participationFilter === "TODOS" || item.participacao === participationFilter

      return matchesSearch && matchesStatus && matchesParticipation
    })
  }, [search, statusFilter, participationFilter])

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Histórico de Participações • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-bold text-primary">
            Histórico de Participações
          </h1>
          <p className="mt-1 text-base text-neutral">
            Consulte seus projetos atuais e anteriores, acompanhando sua trajetória acadêmica e institucional.
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
              <div className="text-sm font-medium text-success">Ativos</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-primary rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-primary">{stats.finalizados}</div>
              <div className="text-sm font-medium text-primary">Finalizados</div>
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

          <Card
            title=""
            className="bg-white border-2 border-warning rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-warning">{stats.bolsista}</div>
              <div className="text-sm font-medium text-warning">Como bolsista</div>
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
                  Buscar no histórico
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
                  <option value="TODOS">Todos</option>
                  <option value="ATIVO">Ativo</option>
                  <option value="EM_ACOMPANHAMENTO">Em acompanhamento</option>
                  <option value="FINALIZADO">Finalizado</option>
                  <option value="ENCERRADO">Encerrado</option>
                  <option value="DESVINCULADO">Desvinculado</option>
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
                Registros do histórico do discente
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            {filteredHistory.length === 0 ? (
              <div className="rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-8 text-center">
                <div className="text-base font-semibold text-primary">
                  Nenhum registro encontrado
                </div>
                <p className="mt-1 text-sm text-neutral">
                  Ajuste os filtros para visualizar outros resultados.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredHistory.map((item) => (
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

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                item.status
                              )}`}
                            >
                              {item.status === "ATIVO" ? (
                                <CheckCircle2 size={14} />
                              ) : (
                                <Clock3 size={14} />
                              )}
                              {getStatusLabel(item.status)}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getParticipationClasses(
                                item.participacao
                              )}`}
                            >
                              <BadgeCheck size={14} />
                              {item.participacao === "BOLSISTA"
                                ? "Bolsista"
                                : "Voluntário"}
                            </span>
                          </div>

                          <p className="text-sm text-neutral leading-6">
                            {item.resumo}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[190px]">
                          <Link
                            to={`/discente/projetos/${item.id}`}
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
                            to={`/discente/projetos/${item.id}/vinculo`}
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
                            {item.orientador}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <FolderKanban size={15} />
                            Área
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.area}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <CalendarDays size={15} />
                            Período
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.inicio} até {item.fim}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <History size={15} />
                            Edital
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.edital}
                          </div>
                        </div>
                      </div>

                      {/* RODAPÉ */}
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/discente/projetos/${item.id}`}
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
                          to={`/discente/projetos/${item.id}/vinculo`}
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