import React from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  FileText,
  Building2,
  BadgeCheck,
  Send,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"

type NoticeStatus = "ABERTO" | "EM_ANALISE" | "ENCERRADO" | "RESULTADO_PUBLICADO"
type NoticeType = "PIBIC" | "PIBITI" | "PROBEX" | "MONITORIA" | "OUTRO"
type StudentSituation =
  | "NAO_INSCRITO"
  | "INSCRITO"
  | "EM_ANALISE"
  | "CLASSIFICADO"
  | "INDEFERIDO"

type NoticeDetails = {
  id: string
  titulo: string
  tipo: NoticeType
  status: NoticeStatus
  unidade: string
  periodo: string
  inscricaoAte: string
  publicacao: string
  resultado?: string
  descricao: string
  objetivo: string
  publicoAlvo: string
  possuiInscricao: boolean
  minhaSituacao?: StudentSituation
  requisitos: string[]
  documentos: string[]
  etapas: { titulo: string; data: string }[]
  observacoes: string[]
}

const NOTICES: NoticeDetails[] = [
  {
    id: "edital_001",
    titulo: "Edital PIBIC 2026",
    tipo: "PIBIC",
    status: "ABERTO",
    unidade: "PROPESQ / UFPB",
    periodo: "01/03/2026 a 15/04/2026",
    inscricaoAte: "15/04/2026",
    publicacao: "01/03/2026",
    resultado: "30/04/2026",
    descricao:
      "Seleção de discentes para atuação em projetos de iniciação científica com vagas remuneradas e voluntárias.",
    objetivo:
      "Promover a inserção de estudantes de graduação em atividades de pesquisa científica, tecnológica e de inovação.",
    publicoAlvo:
      "Discentes regularmente matriculados em cursos de graduação da UFPB.",
    possuiInscricao: true,
    minhaSituacao: "NAO_INSCRITO",
    requisitos: [
      "Estar regularmente matriculado em curso de graduação.",
      "Possuir desempenho acadêmico compatível com as exigências do programa.",
      "Ter disponibilidade para cumprir o plano de atividades.",
      "Não possuir pendências documentais no sistema.",
    ],
    documentos: [
      "Comprovante de matrícula atualizado.",
      "Documento de identificação.",
      "CPF.",
      "Comprovante bancário.",
      "Histórico escolar, quando exigido.",
    ],
    etapas: [
      { titulo: "Publicação do edital", data: "01/03/2026" },
      { titulo: "Período de inscrição", data: "01/03/2026 a 15/04/2026" },
      { titulo: "Análise das inscrições", data: "16/04/2026 a 25/04/2026" },
      { titulo: "Divulgação do resultado", data: "30/04/2026" },
    ],
    observacoes: [
      "A inscrição só será validada com a documentação obrigatória completa.",
      "O discente deve acompanhar notificações e mensagens no sistema.",
      "A aprovação final depende da homologação institucional.",
    ],
  },
  {
    id: "edital_002",
    titulo: "Edital PIBITI 2026",
    tipo: "PIBITI",
    status: "EM_ANALISE",
    unidade: "PROPESQ / UFPB",
    periodo: "10/02/2026 a 20/03/2026",
    inscricaoAte: "20/03/2026",
    publicacao: "10/02/2026",
    resultado: "10/04/2026",
    descricao:
      "Seleção de estudantes para projetos com foco em desenvolvimento tecnológico, inovação e soluções aplicadas.",
    objetivo:
      "Estimular a participação discente em iniciativas de base tecnológica e inovação.",
    publicoAlvo:
      "Discentes vinculados a projetos com aderência ao programa PIBITI.",
    possuiInscricao: true,
    minhaSituacao: "EM_ANALISE",
    requisitos: [
      "Estar regularmente matriculado.",
      "Atender aos critérios do orientador e do edital.",
      "Apresentar documentação obrigatória.",
    ],
    documentos: [
      "CPF.",
      "RG.",
      "Comprovante de matrícula.",
      "Comprovante bancário.",
    ],
    etapas: [
      { titulo: "Publicação do edital", data: "10/02/2026" },
      { titulo: "Período de inscrição", data: "10/02/2026 a 20/03/2026" },
      { titulo: "Análise das inscrições", data: "21/03/2026 a 05/04/2026" },
      { titulo: "Divulgação do resultado", data: "10/04/2026" },
    ],
    observacoes: [
      "As inscrições estão encerradas e em fase de análise.",
      "O acompanhamento do resultado deve ser feito pelo sistema.",
    ],
  },
]

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

function getStudentSituationLabel(situacao?: StudentSituation) {
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

function getStudentSituationClasses(situacao?: StudentSituation) {
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

export default function NoticeView() {
  const { id } = useParams()

  const notice = NOTICES.find((item) => item.id === id) ?? NOTICES[0]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>{notice.titulo} • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to="/discente/editais"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para editais
            </Link>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
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

              <h1 className="text-2xl font-bold text-primary">
                {notice.titulo}
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                {notice.descricao}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[220px]">
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
                  Realizar inscrição
                </Link>
              )}

              <Link
                to="/discente/editais"
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl border border-primary
                  px-4 py-3 text-sm font-medium text-primary
                  hover:bg-primary/5 transition
                "
              >
                <FileText size={16} />
                Voltar à lista
              </Link>
            </div>
          </div>
        </header>

        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <CalendarDays className="text-primary" size={20} />
              <div>
                <div className="text-sm text-neutral">Período</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {notice.periodo}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <Clock3 className="text-primary" size={20} />
              <div>
                <div className="text-sm text-neutral">Inscrição até</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {notice.inscricaoAte}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <Building2 className="text-primary" size={20} />
              <div>
                <div className="text-sm text-neutral">Unidade</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {notice.unidade}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <BadgeCheck className="text-primary" size={20} />
              <div>
                <div className="text-sm text-neutral">Minha situação</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {getStudentSituationLabel(notice.minhaSituacao)}
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
                  Informações gerais
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-5 text-sm">
                <div>
                  <div className="text-neutral">Objetivo</div>
                  <p className="mt-1 text-primary leading-6">
                    {notice.objetivo}
                  </p>
                </div>

                <div>
                  <div className="text-neutral">Público-alvo</div>
                  <p className="mt-1 text-primary leading-6">
                    {notice.publicoAlvo}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-neutral">Data de publicação</div>
                    <div className="mt-1 font-medium text-primary">
                      {notice.publicacao}
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral">Previsão de resultado</div>
                    <div className="mt-1 font-medium text-primary">
                      {notice.resultado || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Requisitos para participação
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3">
                {notice.requisitos.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-primary"
                  >
                    <CheckCircle2 size={16} className="mt-0.5 text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Documentos exigidos
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3">
                {notice.documentos.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-primary"
                  >
                    <FileText size={16} className="mt-0.5 text-primary" />
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
                  Cronograma
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-4">
                {notice.etapas.map((etapa, index) => (
                  <li
                    key={index}
                    className="border-b border-neutral/20 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="text-sm font-medium text-primary">
                      {etapa.titulo}
                    </div>
                    <div className="mt-1 text-sm text-neutral">
                      {etapa.data}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Minha situação no edital
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStudentSituationClasses(
                    notice.minhaSituacao
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getStudentSituationLabel(notice.minhaSituacao)}
                </span>

                <p className="text-neutral leading-6">
                  {notice.minhaSituacao === "NAO_INSCRITO" &&
                    "Você ainda não realizou inscrição neste edital."}

                  {notice.minhaSituacao === "INSCRITO" &&
                    "Sua inscrição foi registrada no sistema e aguarda análise."}

                  {notice.minhaSituacao === "EM_ANALISE" &&
                    "Sua inscrição está em fase de análise pela equipe responsável."}

                  {notice.minhaSituacao === "CLASSIFICADO" &&
                    "Você foi classificado neste processo seletivo."}

                  {notice.minhaSituacao === "INDEFERIDO" &&
                    "Sua inscrição foi indeferida. Consulte os detalhes e observações do processo."}
                </p>

                {notice.possuiInscricao && notice.status === "ABERTO" && (
                  <Link
                    to={`/discente/editais/${notice.id}/inscricao`}
                    className="
                      inline-flex w-full items-center justify-center gap-2
                      rounded-xl bg-primary px-4 py-3
                      text-sm font-semibold text-white
                      hover:opacity-90 transition
                    "
                  >
                    <Send size={16} />
                    Ir para inscrição
                  </Link>
                )}
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Observações importantes
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3">
                {notice.observacoes.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-neutral"
                  >
                    <AlertTriangle size={16} className="mt-0.5 text-warning" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
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
                <Link
                  to="/discente/editais"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <ClipboardList size={16} />
                  Ver outros editais
                </Link>

                {notice.status === "RESULTADO_PUBLICADO" && (
                  <Link
                    to={`/discente/inscricoes/${notice.id}/resultado`}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-xl bg-primary px-4 py-3
                      text-sm font-semibold text-white
                      hover:opacity-90 transition
                    "
                  >
                    <BadgeCheck size={16} />
                    Ver resultado
                  </Link>
                )}
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}