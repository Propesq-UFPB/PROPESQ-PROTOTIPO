import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  Search,
  Filter,
  History,
  Award,
  FolderKanban,
  CalendarDays,
  BadgeCheck,
  Eye,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react"

type ParticipationType =
  | "PESQUISA"
  | "EXTENSAO"
  | "ENIC"
  | "BOLSISTA"
  | "VOLUNTARIO"

type ParticipationStatus =
  | "CONCLUIDA"
  | "EM_ANDAMENTO"
  | "PENDENTE_REGISTRO"
  | "INDEFERIDA"

type ParticipationItem = {
  id: string
  titulo: string
  tipo: ParticipationType
  status: ParticipationStatus
  projetoId?: string
  projetoTitulo?: string
  certificadoId?: string
  referencia: string
  periodo: string
  cargaHoraria?: string
  resumo: string
  possuiCertificado: boolean
  possuiPendencia: boolean
  pendenciaTexto?: string
}

const PARTICIPATIONS: ParticipationItem[] = [
  {
    id: "part_001",
    titulo: "Participação em Projeto de Pesquisa PIBIC 2026",
    tipo: "PESQUISA",
    status: "EM_ANDAMENTO",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    referencia: "PIBIC 2026",
    periodo: "01/05/2026 a 31/12/2026",
    cargaHoraria: "20h semanais",
    resumo:
      "Atuação discente em projeto de pesquisa voltado ao desenvolvimento de plataforma acadêmica institucional.",
    possuiCertificado: false,
    possuiPendencia: false,
  },
  {
    id: "part_002",
    titulo: "Atuação como Bolsista de Iniciação Científica",
    tipo: "BOLSISTA",
    status: "CONCLUIDA",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    certificadoId: "cert_002",
    referencia: "PIBIC 2026",
    periodo: "01/05/2026 a 31/12/2026",
    cargaHoraria: "20h semanais",
    resumo:
      "Participação formal como bolsista em projeto de iniciação científica com certificado emitido.",
    possuiCertificado: true,
    possuiPendencia: false,
  },
  {
    id: "part_003",
    titulo: "Apresentação de Trabalho no ENIC 2025",
    tipo: "ENIC",
    status: "CONCLUIDA",
    projetoId: "proj_003",
    projetoTitulo: "Ambiente Web para Apoio à Submissão ENIC",
    certificadoId: "cert_003",
    referencia: "ENIC 2025",
    periodo: "20/08/2025",
    resumo:
      "Participação em evento acadêmico com apresentação de trabalho vinculado ao projeto.",
    possuiCertificado: true,
    possuiPendencia: false,
  },
  {
    id: "part_004",
    titulo: "Participação voluntária em projeto PIBITI 2026",
    tipo: "VOLUNTARIO",
    status: "PENDENTE_REGISTRO",
    projetoId: "proj_002",
    projetoTitulo: "IA Aplicada à Classificação de Produção Científica",
    referencia: "PIBITI 2026",
    periodo: "10/05/2026 a 30/11/2026",
    resumo:
      "Atuação voluntária vinculada ao projeto de IA, aguardando consolidação institucional do registro.",
    possuiCertificado: false,
    possuiPendencia: true,
    pendenciaTexto:
      "O histórico depende da conclusão e validação definitiva do vínculo acadêmico.",
  },
  {
    id: "part_005",
    titulo: "Participação em Projeto de Extensão PROBEX 2024",
    tipo: "EXTENSAO",
    status: "INDEFERIDA",
    projetoId: "proj_005",
    projetoTitulo: "Repositório Digital para Produção Discente",
    referencia: "PROBEX 2024",
    periodo: "10/08/2024 a 15/10/2024",
    resumo:
      "Registro de participação em projeto de extensão com inconsistência no encerramento do vínculo.",
    possuiCertificado: false,
    possuiPendencia: true,
    pendenciaTexto:
      "A participação precisa ser regularizada para futura certificação e consolidação no histórico.",
  },
]

type TypeFilter = "TODOS" | ParticipationType
type StatusFilter = "TODOS" | ParticipationStatus

function getTypeLabel(type: ParticipationType) {
  switch (type) {
    case "PESQUISA":
      return "Pesquisa"
    case "EXTENSAO":
      return "Extensão"
    case "ENIC":
      return "ENIC"
    case "BOLSISTA":
      return "Bolsista"
    case "VOLUNTARIO":
      return "Voluntário"
    default:
      return type
  }
}

function getTypeClasses(type: ParticipationType) {
  switch (type) {
    case "PESQUISA":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EXTENSAO":
      return "border-success/30 bg-success/10 text-success"
    case "ENIC":
      return "border-warning/30 bg-warning/10 text-warning"
    case "BOLSISTA":
      return "border-primary/30 bg-primary/10 text-primary"
    case "VOLUNTARIO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getStatusLabel(status: ParticipationStatus) {
  switch (status) {
    case "CONCLUIDA":
      return "Concluída"
    case "EM_ANDAMENTO":
      return "Em andamento"
    case "PENDENTE_REGISTRO":
      return "Pendente de registro"
    case "INDEFERIDA":
      return "Indeferida"
    default:
      return status
  }
}

function getStatusClasses(status: ParticipationStatus) {
  switch (status) {
    case "CONCLUIDA":
      return "border-success/30 bg-success/10 text-success"
    case "EM_ANDAMENTO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "PENDENTE_REGISTRO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "INDEFERIDA":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

export default function ParticipationHistory() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("TODOS")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODOS")

  const stats = useMemo(() => {
    return {
      total: PARTICIPATIONS.length,
      concluidas: PARTICIPATIONS.filter((item) => item.status === "CONCLUIDA").length,
      andamento: PARTICIPATIONS.filter((item) => item.status === "EM_ANDAMENTO").length,
      comCertificado: PARTICIPATIONS.filter((item) => item.possuiCertificado).length,
      pendencias: PARTICIPATIONS.filter((item) => item.possuiPendencia).length,
    }
  }, [])

  const filteredParticipations = useMemo(() => {
    const term = search.trim().toLowerCase()
    const [year, setYear] = useState<string>("todos")

    return PARTICIPATIONS.filter((item) => {
      const matchesSearch =
        !term ||
        item.titulo.toLowerCase().includes(term) ||
        item.referencia.toLowerCase().includes(term) ||
        item.projetoTitulo?.toLowerCase().includes(term) ||
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
        <title>Histórico de Participações • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-bold text-primary">
            Histórico de Participações
          </h1>
          <p className="mt-1 text-base text-neutral">
            Consulte seu histórico acadêmico de participações em projetos, eventos e atividades vinculadas à PROPESQ.
          </p>
        </header>

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
                  Buscar participação
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
                    placeholder="Título, referência, projeto..."
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
                  <option value="PESQUISA">Pesquisa</option>
                  <option value="EXTENSAO">Extensão</option>
                  <option value="ENIC">ENIC</option>
                  <option value="BOLSISTA">Bolsista</option>
                  <option value="VOLUNTARIO">Voluntário</option>
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
                  <option value="CONCLUIDA">Concluída</option>
                  <option value="EM_ANDAMENTO">Em andamento</option>
                  <option value="PENDENTE_REGISTRO">Pendente de registro</option>
                  <option value="INDEFERIDA">Indeferida</option>
                </select>
              </div>
            </div>
          </Card>
        </section>

        {/* LISTA */}
        <section>
          <Card title={undefined} className="bg-white border border-neutral/30 rounded-2xl p-8">
            {filteredParticipations.length === 0 ? (
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
                {filteredParticipations.map((item) => (
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
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getTypeClasses(
                                item.tipo
                              )}`}
                            >
                              <History size={14} />
                              {getTypeLabel(item.tipo)}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                item.status
                              )}`}
                            >
                              {item.status === "CONCLUIDA" ? (
                                <CheckCircle2 size={14} />
                              ) : item.status === "INDEFERIDA" ? (
                                <AlertTriangle size={14} />
                              ) : (
                                <Clock3 size={14} />
                              )}
                              {getStatusLabel(item.status)}
                            </span>

                            {item.possuiCertificado && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                                <Award size={14} />
                                Certificado disponível
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-neutral leading-6">
                            {item.resumo}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[220px]">
                          {item.projetoId && (
                            <Link
                              to={`/discente/projetos/${item.projetoId}`}
                              className="
                                inline-flex items-center justify-center gap-2
                                rounded-xl border border-primary
                                px-4 py-3 text-sm font-medium text-primary
                                hover:bg-primary/5 transition
                              "
                            >
                              <Eye size={16} />
                              Ver projeto
                            </Link>
                          )}

                          {item.certificadoId && (
                            <Link
                              to={`/discente/certificados/${item.certificadoId}`}
                              className="
                                inline-flex items-center justify-center gap-2
                                rounded-xl bg-primary px-4 py-3
                                text-sm font-semibold text-white
                                hover:opacity-90 transition
                              "
                            >
                              <Award size={16} />
                              Ver certificado
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* META */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <FolderKanban size={15} />
                            Projeto / atividade
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.projetoTitulo || "-"}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <BadgeCheck size={15} />
                            Referência
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.referencia}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <CalendarDays size={15} />
                            Período
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.periodo}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <FileText size={15} />
                            Carga horária
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.cargaHoraria || "-"}
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