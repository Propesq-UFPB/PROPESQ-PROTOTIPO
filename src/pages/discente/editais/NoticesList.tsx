import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  Search,
  FileText,
  CalendarDays,
  BadgeCheck,
  Filter,
  Eye,
  Send,
  Clock3,
} from "lucide-react"

type NoticeStatus = "ABERTO" | "EM_ANALISE" | "ENCERRADO" | "RESULTADO_PUBLICADO"
type NoticeType = "PIBIC" | "PIBITI" | "PROBEX" | "MONITORIA" | "OUTRO"

type Notice = {
  id: string
  titulo: string
  tipo: NoticeType
  status: NoticeStatus
  periodo: string
  inscricaoAte: string
  unidade: string
  descricao: string
  possuiInscricao: boolean
  minhaSituacao?: "NAO_INSCRITO" | "INSCRITO" | "EM_ANALISE" | "CLASSIFICADO" | "INDEFERIDO"
}

const NOTICES: Notice[] = [
  {
    id: "edital_001",
    titulo: "Edital PIBIC 2026",
    tipo: "PIBIC",
    status: "ABERTO",
    periodo: "01/03/2026 a 15/04/2026",
    inscricaoAte: "15/04/2026",
    unidade: "PROPESQ / UFPB",
    descricao:
      "Seleção de discentes para participação em programas de iniciação científica com bolsas e vagas voluntárias.",
    possuiInscricao: true,
    minhaSituacao: "NAO_INSCRITO",
  },
  {
    id: "edital_002",
    titulo: "Edital PIBITI 2026",
    tipo: "PIBITI",
    status: "EM_ANALISE",
    periodo: "10/02/2026 a 20/03/2026",
    inscricaoAte: "20/03/2026",
    unidade: "PROPESQ / UFPB",
    descricao:
      "Seleção de discentes para projetos com foco em inovação tecnológica e desenvolvimento aplicado.",
    possuiInscricao: true,
    minhaSituacao: "EM_ANALISE",
  },
  {
    id: "edital_003",
    titulo: "Edital PROBEX 2026",
    tipo: "PROBEX",
    status: "RESULTADO_PUBLICADO",
    periodo: "05/01/2026 a 28/02/2026",
    inscricaoAte: "28/02/2026",
    unidade: "PRAC / UFPB",
    descricao:
      "Programa de extensão universitária com oportunidades para atuação discente em projetos extensionistas.",
    possuiInscricao: true,
    minhaSituacao: "CLASSIFICADO",
  },
  {
    id: "edital_004",
    titulo: "Edital de Monitoria 2026.1",
    tipo: "MONITORIA",
    status: "ENCERRADO",
    periodo: "02/01/2026 a 31/01/2026",
    inscricaoAte: "31/01/2026",
    unidade: "PRG / UFPB",
    descricao:
      "Processo seletivo para monitoria acadêmica com vagas em diferentes componentes curriculares.",
    possuiInscricao: false,
  },
  {
    id: "edital_005",
    titulo: "Chamada Interna de Apoio à Pesquisa Discente",
    tipo: "OUTRO",
    status: "ABERTO",
    periodo: "12/03/2026 a 25/04/2026",
    inscricaoAte: "25/04/2026",
    unidade: "Centro de Informática",
    descricao:
      "Chamada interna para apoio a iniciativas estudantis vinculadas a projetos de pesquisa e inovação.",
    possuiInscricao: true,
    minhaSituacao: "NAO_INSCRITO",
  },
]

type StatusFilter = "TODOS" | NoticeStatus
type TypeFilter = "TODOS" | NoticeType

function getStatusLabel(status: NoticeStatus) {
  switch (status) {
    case "ABERTO":
      return "Aberto"
    case "EM_ANALISE":
      return "Em análise"
    case "ENCERRADO":
      return "Encerrado"
    case "RESULTADO_PUBLICADO":
      return "Resultado publicado"
    default:
      return status
  }
}

function getStatusClasses(status: NoticeStatus) {
  switch (status) {
    case "ABERTO":
      return "border-success/30 bg-success/10 text-success"
    case "EM_ANALISE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "ENCERRADO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "RESULTADO_PUBLICADO":
      return "border-primary/30 bg-primary/10 text-primary"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getStudentSituationLabel(
  situacao?: Notice["minhaSituacao"]
) {
  switch (situacao) {
    case "NAO_INSCRITO":
      return "Não inscrito"
    case "INSCRITO":
      return "Inscrito"
    case "EM_ANALISE":
      return "Inscrição em análise"
    case "CLASSIFICADO":
      return "Classificado"
    case "INDEFERIDO":
      return "Indeferido"
    default:
      return "Sem inscrição"
  }
}

function getStudentSituationClasses(
  situacao?: Notice["minhaSituacao"]
) {
  switch (situacao) {
    case "INSCRITO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EM_ANALISE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "CLASSIFICADO":
      return "border-success/30 bg-success/10 text-success"
    case "INDEFERIDO":
      return "border-danger/30 bg-danger/10 text-danger"
    case "NAO_INSCRITO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

export default function NoticesList() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODOS")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("TODOS")

  const stats = useMemo(() => {
    return {
      total: NOTICES.length,
      abertos: NOTICES.filter((item) => item.status === "ABERTO").length,
      emAnalise: NOTICES.filter((item) => item.status === "EM_ANALISE").length,
      comResultado: NOTICES.filter((item) => item.status === "RESULTADO_PUBLICADO").length,
      minhasInscricoes: NOTICES.filter(
        (item) => item.minhaSituacao && item.minhaSituacao !== "NAO_INSCRITO"
      ).length,
    }
  }, [])

  const filteredNotices = useMemo(() => {
    const term = search.trim().toLowerCase()

    return NOTICES.filter((item) => {
      const matchesSearch =
        !term ||
        item.titulo.toLowerCase().includes(term) ||
        item.tipo.toLowerCase().includes(term) ||
        item.unidade.toLowerCase().includes(term) ||
        item.descricao.toLowerCase().includes(term)

      const matchesStatus =
        statusFilter === "TODOS" || item.status === statusFilter

      const matchesType =
        typeFilter === "TODOS" || item.tipo === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [search, statusFilter, typeFilter])

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Editais • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-bold text-primary">
            Editais
          </h1>
          <p className="mt-1 text-base text-neutral">
            Consulte oportunidades, acompanhe sua situação e acesse processos seletivos disponíveis.
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
              <div className="text-sm font-medium text-primary">Total de editais</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-success rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-success">{stats.abertos}</div>
              <div className="text-sm font-medium text-success">Abertos</div>
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
            className="bg-white border-2 border-primary rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-primary">{stats.comResultado}</div>
              <div className="text-sm font-medium text-primary">Com resultado</div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border-2 border-neutral rounded-3xl py-3 text-center"
          >
            <div className="space-y-1">
              <div className="text-base font-bold text-neutral">{stats.minhasInscricoes}</div>
              <div className="text-sm font-medium text-neutral">Minhas inscrições</div>
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
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Buscar edital
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
                    placeholder="Pesquisar por título, tipo, unidade ou descrição"
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
                  <option value="ABERTO">Aberto</option>
                  <option value="EM_ANALISE">Em análise</option>
                  <option value="RESULTADO_PUBLICADO">Resultado publicado</option>
                  <option value="ENCERRADO">Encerrado</option>
                </select>
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
                  <option value="PIBIC">PIBIC</option>
                  <option value="PIBITI">PIBITI</option>
                  <option value="PROBEX">PROBEX</option>
                  <option value="MONITORIA">Monitoria</option>
                  <option value="OUTRO">Outro</option>
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
                Lista de editais
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            {filteredNotices.length === 0 ? (
              <div className="rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-8 text-center">
                <div className="text-base font-semibold text-primary">
                  Nenhum edital encontrado
                </div>
                <p className="mt-1 text-sm text-neutral">
                  Tente ajustar os filtros ou o termo de busca.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredNotices.map((notice) => (
                  <article
                    key={notice.id}
                    className="rounded-2xl border border-neutral/20 p-5"
                  >
                    <div className="flex flex-col gap-4">
                      {/* TOPO */}
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-primary">
                              {notice.titulo}
                            </h3>

                            <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                              {notice.tipo}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                notice.status
                              )}`}
                            >
                              <Clock3 size={14} />
                              {getStatusLabel(notice.status)}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStudentSituationClasses(
                                notice.minhaSituacao
                              )}`}
                            >
                              <BadgeCheck size={14} />
                              {getStudentSituationLabel(notice.minhaSituacao)}
                            </span>
                          </div>

                          <p className="text-sm text-neutral leading-6">
                            {notice.descricao}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[190px]">
                          <Link
                            to={`/discente/editais/${notice.id}`}
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

                          {notice.possuiInscricao && notice.status === "ABERTO" && (
                            <Link
                              to={`/discente/editais/${notice.id}/inscricao`}
                              className="
                                inline-flex items-center justify-center gap-2
                                rounded-xl bg-primary px-4 py-3
                                text-sm font-semibold text-white
                                hover:opacity-90 transition
                              "
                            >
                              <Send size={16} />
                              Inscrever-se
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* META */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <CalendarDays size={15} />
                            Período
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {notice.periodo}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <Clock3 size={15} />
                            Inscrição até
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {notice.inscricaoAte}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <FileText size={15} />
                            Unidade
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {notice.unidade}
                          </div>
                        </div>
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