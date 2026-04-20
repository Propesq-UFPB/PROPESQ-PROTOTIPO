import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  Search,
  Filter,
  ClipboardList,
  FolderKanban,
  UserRound,
  BadgeCheck,
  CalendarDays,
  Eye,
  CheckCircle2,
  Clock3,
  BookOpen,
} from "lucide-react"

type PlanStatus = "DISPONIVEL" | "EM_SELECAO" | "ENCERRADO"
type PlanArea =
  | "CIENCIA_DADOS"
  | "INTELIGENCIA_ARTIFICIAL"
  | "SISTEMAS_INFORMACAO"
  | "ENGENHARIA_SOFTWARE"
  | "EXTENSAO"

type AvailablePlan = {
  id: string
  titulo: string
  projetoId: string
  projetoTitulo: string
  orientador: string
  edital: string
  area: PlanArea
  status: PlanStatus
  periodo: string
  vigencia: string
  resumo: string
  palavrasChave: string[]
}

const PLANS: AvailablePlan[] = [
  {
    id: "plan_001",
    titulo: "Plano de Trabalho em Ciência de Dados Aplicada",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    orientador: "Prof. André Silva",
    edital: "PIBIC 2026",
    area: "CIENCIA_DADOS",
    status: "DISPONIVEL",
    periodo: "2026.1",
    vigencia: "01/05/2026 a 31/12/2026",
    resumo:
      "Plano voltado ao apoio na modelagem de dados, estruturação de indicadores e desenvolvimento de fluxos analíticos para a plataforma acadêmica.",
    palavrasChave: ["dados", "dashboards", "indicadores"],
  },
]

type StatusFilter = "TODOS" | PlanStatus
type AreaFilter = "TODOS" | PlanArea

function getStatusLabel(status: PlanStatus) {
  switch (status) {
    case "DISPONIVEL":
      return "Disponível"
    case "EM_SELECAO":
      return "Em seleção"
    case "ENCERRADO":
      return "Encerrado"
    default:
      return status
  }
}

function getStatusClasses(status: PlanStatus) {
  switch (status) {
    case "DISPONIVEL":
      return "border-success/30 bg-success/10 text-success"
    case "EM_SELECAO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "ENCERRADO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getAreaLabel(area: PlanArea) {
  switch (area) {
    case "CIENCIA_DADOS":
      return "Ciência de Dados"
    case "INTELIGENCIA_ARTIFICIAL":
      return "Inteligência Artificial"
    case "SISTEMAS_INFORMACAO":
      return "Sistemas de Informação"
    case "ENGENHARIA_SOFTWARE":
      return "Engenharia de Software"
    case "EXTENSAO":
      return "Extensão"
    default:
      return area
  }
}

function getAreaClasses(area: PlanArea) {
  switch (area) {
    case "CIENCIA_DADOS":
      return "border-primary/30 bg-primary/10 text-primary"
    case "INTELIGENCIA_ARTIFICIAL":
      return "border-success/30 bg-success/10 text-success"
    case "SISTEMAS_INFORMACAO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "ENGENHARIA_SOFTWARE":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EXTENSAO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

export default function AvailablePlans() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODOS")
  const [areaFilter, setAreaFilter] = useState<AreaFilter>("TODOS")

  const stats = useMemo(() => {
    return {
      total: PLANS.length,
      disponiveis: PLANS.filter((item) => item.status === "DISPONIVEL").length,
      emSelecao: PLANS.filter((item) => item.status === "EM_SELECAO").length,
      encerrados: PLANS.filter((item) => item.status === "ENCERRADO").length,
      areas: new Set(PLANS.map((item) => item.area)).size,
    }
  }, [])

  const filteredPlans = useMemo(() => {
    const term = search.trim().toLowerCase()

    return PLANS.filter((item) => {
      const matchesSearch =
        !term ||
        item.titulo.toLowerCase().includes(term) ||
        item.projetoTitulo.toLowerCase().includes(term) ||
        item.orientador.toLowerCase().includes(term) ||
        item.edital.toLowerCase().includes(term) ||
        item.resumo.toLowerCase().includes(term)

      const matchesStatus =
        statusFilter === "TODOS" || item.status === statusFilter

      const matchesArea =
        areaFilter === "TODOS" || item.area === areaFilter

      return matchesSearch && matchesStatus && matchesArea
    })
  }, [search, statusFilter, areaFilter])

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Planos Disponíveis • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-bold text-primary">
            Planos de Trabalho Disponíveis
          </h1>
          <p className="mt-1 text-base text-neutral">
            Consulte planos disponíveis para seleção e acompanhe oportunidades vinculadas a projetos e editais.
          </p>
        </header>

        {/* INDICADORES */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <Card
            title=""
            className="bg-white border-2 border-primary rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-primary">{stats.total}</div>
              <div className="text-sm font-medium text-primary">Total de planos</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-success rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-success">{stats.disponiveis}</div>
              <div className="text-sm font-medium text-success">Disponíveis</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-warning rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-warning">{stats.emSelecao}</div>
              <div className="text-sm font-medium text-warning">Em seleção</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-neutral rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-neutral">{stats.areas}</div>
              <div className="text-sm font-medium text-neutral">Áreas</div>
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
                  Buscar plano
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
                    placeholder="Título, projeto, orientador..."
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
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="EM_SELECAO">Em seleção</option>
                  <option value="ENCERRADO">Encerrado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Área
                </label>
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value as AreaFilter)}
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary
                  "
                >
                  <option value="TODOS">Todas</option>
                  <option value="CIENCIA_DADOS">Ciência de Dados</option>
                  <option value="INTELIGENCIA_ARTIFICIAL">Inteligência Artificial</option>
                  <option value="SISTEMAS_INFORMACAO">Sistemas de Informação</option>
                  <option value="ENGENHARIA_SOFTWARE">Engenharia de Software</option>
                  <option value="EXTENSAO">Extensão</option>
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
                Planos disponíveis para consulta
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            {filteredPlans.length === 0 ? (
              <div className="rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-8 text-center">
                <div className="text-base font-semibold text-primary">
                  Nenhum plano encontrado
                </div>
                <p className="mt-1 text-sm text-neutral">
                  Ajuste os filtros para visualizar outros resultados.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredPlans.map((item) => (
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
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getAreaClasses(
                                item.area
                              )}`}
                            >
                              <BookOpen size={14} />
                              {getAreaLabel(item.area)}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                item.status
                              )}`}
                            >
                              {item.status === "DISPONIVEL" ? (
                                <CheckCircle2 size={14} />
                              ) : (
                                <Clock3 size={14} />
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
                            to={`/discente/planos/${item.id}`}
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
                            <UserRound size={15} />
                            Orientador(a)
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.orientador}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <BadgeCheck size={15} />
                            Edital
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.edital}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <CalendarDays size={15} />
                            Vigência
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.vigencia}
                          </div>
                        </div>
                      </div>

                      {/* TAGS */}
                      <div className="flex flex-wrap gap-2">
                        {item.palavrasChave.map((keyword) => (
                          <span
                            key={keyword}
                            className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                          >
                            {keyword}
                          </span>
                        ))}
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