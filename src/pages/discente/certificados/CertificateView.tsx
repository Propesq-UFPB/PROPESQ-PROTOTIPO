import React from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  CalendarDays,
  Clock3,
  Download,
  Eye,
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  UserRound,
  FileText,
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

type CertificateDetails = {
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
  discente: string
  matricula: string
  unidade: string
  cargaHoraria?: string
  descricaoDocumento: string
  observacoes: string[]
  possuiPendencia: boolean
  pendenciaTexto?: string
}

const CERTIFICATES: CertificateDetails[] = [
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
    discente: "Mariana Martins",
    matricula: "20230012345",
    unidade: "Centro de Informática",
    cargaHoraria: "20h semanais",
    descricaoDocumento:
      "Documento emitido para comprovar a participação formal do discente nas atividades acadêmicas e institucionais vinculadas ao projeto.",
    observacoes: [
      "O certificado está disponível para visualização e download.",
      "Guarde este documento para comprovação acadêmica e institucional.",
    ],
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
    discente: "Mariana Martins",
    matricula: "20230012345",
    unidade: "Centro de Informática",
    descricaoDocumento:
      "Documento emitido para comprovar a apresentação de trabalho no evento acadêmico ENIC.",
    observacoes: [
      "O certificado comprova a participação no evento e pode ser usado em atividades complementares.",
      "Verifique se os dados pessoais estão corretos antes de realizar o download.",
    ],
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
    discente: "Mariana Martins",
    matricula: "20230012345",
    unidade: "CCEN",
    descricaoDocumento:
      "Certificado condicionado ao encerramento regular do processo acadêmico e à aprovação definitiva do relatório final.",
    observacoes: [
      "A emissão ainda não foi concluída.",
      "É necessário acompanhar o status do relatório e do processo associado.",
    ],
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
    discente: "Mariana Martins",
    matricula: "20230012345",
    unidade: "CCSA",
    descricaoDocumento:
      "Solicitação de documento de comprovação de participação em projeto de extensão.",
    observacoes: [
      "A solicitação não foi deferida na análise atual.",
      "Regularize a situação do vínculo para reavaliação futura.",
    ],
    possuiPendencia: true,
    pendenciaTexto:
      "É necessário regularizar a situação do vínculo para reavaliar a emissão.",
  },
]

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

export default function CertificateView() {
  const { id } = useParams()

  const certificate =
    CERTIFICATES.find((item) => item.id === id) ?? CERTIFICATES[0]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>{certificate.titulo} • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to="/discente/certificados"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para certificados
            </Link>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getTypeClasses(
                    certificate.tipo
                  )}`}
                >
                  <Award size={14} />
                  {getTypeLabel(certificate.tipo)}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    certificate.status
                  )}`}
                >
                  {certificate.status === "DISPONIVEL" ? (
                    <CheckCircle2 size={14} />
                  ) : certificate.status === "INDEFERIDO" ? (
                    <AlertTriangle size={14} />
                  ) : (
                    <Clock3 size={14} />
                  )}
                  {getStatusLabel(certificate.status)}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">
                {certificate.titulo}
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                {certificate.resumo}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[220px]">
              <button
                type="button"
                disabled={certificate.status !== "DISPONIVEL"}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl bg-primary px-4 py-3
                  text-sm font-semibold text-white
                  hover:opacity-90 transition
                  disabled:opacity-50
                "
              >
                <Download size={16} />
                Baixar certificado
              </button>

              {certificate.projetoId && (
                <Link
                  to={`/discente/projetos/${certificate.projetoId}`}
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
            </div>
          </div>
        </header>

        {/* PENDÊNCIA */}
        {certificate.possuiPendencia && certificate.pendenciaTexto && (
          <div className="rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4 text-sm text-neutral">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" />
              <div>
                <span className="font-semibold text-warning">
                  Pendência identificada:
                </span>{" "}
                {certificate.pendenciaTexto}
              </div>
            </div>
          </div>
        )}

        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <UserRound size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Discente</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {certificate.discente}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <BadgeCheck size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Referência</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {certificate.referencia}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <CalendarDays size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Período</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {certificate.periodo}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <Clock3 size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Emitido em</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {certificate.emitidoEm || "-"}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* CONTEÚDO */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Informações do certificado
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div className="md:col-span-2">
                  <div className="text-neutral">Título</div>
                  <div className="mt-1 font-semibold text-primary">
                    {certificate.titulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Tipo</div>
                  <div className="mt-1 font-medium text-primary">
                    {getTypeLabel(certificate.tipo)}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Status</div>
                  <div className="mt-1 font-medium text-primary">
                    {getStatusLabel(certificate.status)}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Unidade</div>
                  <div className="mt-1 font-medium text-primary">
                    {certificate.unidade}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Matrícula</div>
                  <div className="mt-1 font-medium text-primary">
                    {certificate.matricula}
                  </div>
                </div>

                {certificate.cargaHoraria && (
                  <div>
                    <div className="text-neutral">Carga horária</div>
                    <div className="mt-1 font-medium text-primary">
                      {certificate.cargaHoraria}
                    </div>
                  </div>
                )}

                {certificate.projetoTitulo && (
                  <div className="md:col-span-2">
                    <div className="text-neutral">Projeto vinculado</div>
                    <div className="mt-1 font-semibold text-primary">
                      {certificate.projetoTitulo}
                    </div>
                  </div>
                )}

                <div className="md:col-span-2">
                  <div className="text-neutral">Descrição do documento</div>
                  <p className="mt-1 text-primary leading-6">
                    {certificate.descricaoDocumento}
                  </p>
                </div>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Observações
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3">
                {certificate.observacoes.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-neutral"
                  >
                    {certificate.status === "DISPONIVEL" ? (
                      <CheckCircle2 size={16} className="mt-0.5 text-success" />
                    ) : (
                      <FileText size={16} className="mt-0.5 text-primary" />
                    )}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-5">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Resumo da situação
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    certificate.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getStatusLabel(certificate.status)}
                </span>

                <p className="text-neutral leading-6">
                  {certificate.status === "DISPONIVEL" &&
                    "O certificado está disponível para visualização e download."}

                  {certificate.status === "EM_PROCESSAMENTO" &&
                    "O documento está em preparação e poderá ser liberado posteriormente."}

                  {certificate.status === "PENDENTE" &&
                    "A emissão depende da regularização de etapas ou documentos vinculados ao processo."}

                  {certificate.status === "INDEFERIDO" &&
                    "A emissão do certificado não foi aprovada no estado atual do processo."}
                </p>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Ações rápidas
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  disabled={certificate.status !== "DISPONIVEL"}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90 transition
                    disabled:opacity-50
                  "
                >
                  <Download size={16} />
                  Baixar certificado
                </button>

                {certificate.projetoId && (
                  <Link
                    to={`/discente/projetos/${certificate.projetoId}`}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-xl border border-primary
                      px-4 py-3 text-sm font-medium text-primary
                      hover:bg-primary/5 transition
                    "
                  >
                    <FolderKanban size={16} />
                    Ver projeto
                  </Link>
                )}

                <Link
                  to="/discente/certificados"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-neutral/30
                    px-4 py-3 text-sm font-medium text-neutral
                    hover:bg-neutral/5 transition
                  "
                >
                  <ArrowLeft size={16} />
                  Voltar à lista
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}