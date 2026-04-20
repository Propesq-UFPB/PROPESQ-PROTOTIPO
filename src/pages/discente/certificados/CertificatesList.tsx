import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  Search,
  Filter,
  Award,
  BadgeCheck,
  CalendarDays,
  Eye,
  Download,
  FolderKanban,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"

type CertificateType =
  | "PARTICIPACAO"
  | "BOLSISTA"
  | "VOLUNTARIO"
  | "ENIC"
  | "RELATORIO"

type CertificateStatus =
  | "DISPONIVEL"
  | "EM_PROCESSAMENTO"
  | "PENDENTE"
  | "INDEFERIDO"

type StudentCertificate = {
  id: string
  titulo: string
  tipo: CertificateType
  status: CertificateStatus
  projetoId?: string
  projetoTitulo?: string
  referencia: string
  periodo: string
  emitidoEm?: string
  resumo: string
  possuiPendencia: boolean
  pendenciaTexto?: string
}

const CERTIFICATES: StudentCertificate[] = [
  {
    id: "cert_001",
    titulo: "Certificado de Participação em Projeto de Pesquisa",
    tipo: "PARTICIPACAO",
    status: "DISPONIVEL",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    referencia: "PIBIC 2026",
    periodo: "01/05/2026 a 31/12/2026",
    emitidoEm: "10/01/2027",
    resumo:
      "Certificado referente à participação discente no projeto de pesquisa vinculado ao edital PIBIC 2026.",
    possuiPendencia: false,
  },
  {
    id: "cert_002",
    titulo: "Certificado de Bolsista de Iniciação Científica",
    tipo: "BOLSISTA",
    status: "DISPONIVEL",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    referencia: "PIBIC 2026",
    periodo: "01/05/2026 a 31/12/2026",
    emitidoEm: "10/01/2027",
    resumo:
      "Certificado emitido para discente bolsista de iniciação científica.",
    possuiPendencia: false,
  },
  {
    id: "cert_003",
    titulo: "Certificado de Apresentação no ENIC 2025",
    tipo: "ENIC",
    status: "DISPONIVEL",
    projetoId: "proj_003",
    projetoTitulo: "Ambiente Web para Apoio à Submissão ENIC",
    referencia: "ENIC 2025",
    periodo: "20/08/2025",
    emitidoEm: "30/08/2025",
    resumo:
      "Certificado de apresentação de trabalho acadêmico no ENIC 2025.",
    possuiPendencia: false,
  },
  {
    id: "cert_004",
    titulo: "Certificado de Participação Voluntária",
    tipo: "VOLUNTARIO",
    status: "EM_PROCESSAMENTO",
    projetoId: "proj_002",
    projetoTitulo: "IA Aplicada à Classificação de Produção Científica",
    referencia: "PIBITI 2026",
    periodo: "10/05/2026 a 30/11/2026",
    resumo:
      "Certificado em processamento referente à atuação voluntária do discente no projeto.",
    possuiPendencia: false,
  },
  {
    id: "cert_005",
    titulo: "Certificado vinculado à entrega de relatório final",
    tipo: "RELATORIO",
    status: "PENDENTE",
    projetoId: "proj_004",
    projetoTitulo: "Painel Analítico para Indicadores de Iniciação Científica",
    referencia: "PIBIC 2025",
    periodo: "2025.1",
    resumo:
      "Certificado condicionado à regularização do relatório final e conclusão do processo.",
    possuiPendencia: true,
    pendenciaTexto:
      "A emissão depende da aprovação definitiva do relatório final.",
  },
  {
    id: "cert_006",
    titulo: "Certificado de Participação em Projeto de Extensão",
    tipo: "PARTICIPACAO",
    status: "INDEFERIDO",
    projetoId: "proj_005",
    projetoTitulo: "Repositório Digital para Produção Discente",
    referencia: "PROBEX 2024",
    periodo: "10/08/2024 a 15/10/2024",
    resumo:
      "Solicitação de certificado não aprovada por inconsistência no encerramento do vínculo.",
    possuiPendencia: true,
    pendenciaTexto:
      "É necessário regularizar a situação do vínculo para reavaliar a emissão.",
  },
]

type TypeFilter = "TODOS" | CertificateType
type StatusFilter = "TODOS" | CertificateStatus

function getTypeLabel(type: CertificateType) {
  switch (type) {
    case "PARTICIPACAO":
      return "Participação"
    case "BOLSISTA":
      return "Bolsista"
    case "VOLUNTARIO":
      return "Voluntário"
    case "ENIC":
      return "ENIC"
    case "RELATORIO":
      return "Relatório"
    default:
      return type
  }
}

function getTypeClasses(type: CertificateType) {
  switch (type) {
    case "PARTICIPACAO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "BOLSISTA":
      return "border-success/30 bg-success/10 text-success"
    case "VOLUNTARIO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "ENIC":
      return "border-warning/30 bg-warning/10 text-warning"
    case "RELATORIO":
      return "border-primary/30 bg-primary/10 text-primary"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getStatusLabel(status: CertificateStatus) {
  switch (status) {
    case "DISPONIVEL":
      return "Disponível"
    case "EM_PROCESSAMENTO":
      return "Em processamento"
    case "PENDENTE":
      return "Pendente"
    case "INDEFERIDO":
      return "Indeferido"
    default:
      return status
  }
}

function getStatusClasses(status: CertificateStatus) {
  switch (status) {
    case "DISPONIVEL":
      return "border-success/30 bg-success/10 text-success"
    case "EM_PROCESSAMENTO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "PENDENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "INDEFERIDO":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

export default function CertificatesList() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("TODOS")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODOS")

  const stats = useMemo(() => {
    return {
      total: CERTIFICATES.length,
      disponiveis: CERTIFICATES.filter((item) => item.status === "DISPONIVEL").length,
      processamento: CERTIFICATES.filter((item) => item.status === "EM_PROCESSAMENTO").length,
      pendentes: CERTIFICATES.filter((item) => item.status === "PENDENTE").length,
      indeferidos: CERTIFICATES.filter((item) => item.status === "INDEFERIDO").length,
    }
  }, [])

  const filteredCertificates = useMemo(() => {
    const term = search.trim().toLowerCase()

    return CERTIFICATES.filter((item) => {
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
        <title>Certificados • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-bold text-primary">
            Certificados
          </h1>
          <p className="mt-1 text-base text-neutral">
            Consulte certificados emitidos, documentos em processamento e pendências relacionadas à sua participação acadêmica.
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
                  Buscar certificado
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
                  <option value="PARTICIPACAO">Participação</option>
                  <option value="BOLSISTA">Bolsista</option>
                  <option value="VOLUNTARIO">Voluntário</option>
                  <option value="ENIC">ENIC</option>
                  <option value="RELATORIO">Relatório</option>
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
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="EM_PROCESSAMENTO">Em processamento</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="INDEFERIDO">Indeferido</option>
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
                Certificados do discente
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            {filteredCertificates.length === 0 ? (
              <div className="rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-8 text-center">
                <div className="text-base font-semibold text-primary">
                  Nenhum certificado encontrado
                </div>
                <p className="mt-1 text-sm text-neutral">
                  Ajuste os filtros para visualizar outros resultados.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredCertificates.map((item) => (
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
                              <Award size={14} />
                              {getTypeLabel(item.tipo)}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                item.status
                              )}`}
                            >
                              {item.status === "DISPONIVEL" ? (
                                <CheckCircle2 size={14} />
                              ) : item.status === "INDEFERIDO" ? (
                                <AlertTriangle size={14} />
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

                          <button
                            type="button"
                            disabled={item.status !== "DISPONIVEL"}
                            className="
                              inline-flex items-center justify-center gap-2
                              rounded-xl bg-primary px-4 py-3
                              text-sm font-semibold text-white
                              hover:opacity-90 transition
                              disabled:opacity-50
                            "
                          >
                            <Download size={16} />
                            Baixar
                          </button>
                        </div>
                      </div>

                      {/* META */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <FolderKanban size={15} />
                            Projeto / vínculo
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
                            <Clock3 size={15} />
                            Emitido em
                          </div>
                          <div className="mt-1 font-medium text-primary">
                            {item.emitidoEm || "-"}
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