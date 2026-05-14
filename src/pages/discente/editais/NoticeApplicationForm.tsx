// não estou usando essa pagina

import React, { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  Send,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  BadgeCheck,
  CalendarDays,
  Clock3,
  Printer,
  UserCheck,
  Trophy,
  Medal,
  Circle,
  Upload,
  FileCheck2,
} from "lucide-react"

type NoticeStatus = "ABERTO" | "EM_ANALISE" | "ENCERRADO" | "RESULTADO_PUBLICADO"
type NoticeType = "PIBIC" | "PIBITI" | "PROBEX" | "MONITORIA" | "OUTRO"

type TimelineStepStatus = "DONE" | "CURRENT" | "PENDING" | "FAILED"

type FinalResultStatus =
  | "CLASSIFICADO_BOLSISTA"
  | "CLASSIFICADO_VOLUNTARIO"
  | "SUPLENTE"
  | "NAO_CLASSIFICADO"
  | "INDEFERIDO"

type NoticeSummary = {
  id: string
  titulo: string
  tipo: NoticeType
  status: NoticeStatus
  unidade: string
  inscricaoAte: string
  orientacao: string
  documentosObrigatorios: string[]
}

type TimelineStep = {
  titulo: string
  data: string
  status: TimelineStepStatus
  descricao?: string
}

type ApplicationRecord = {
  protocolo: string
  dataEnvio: string
  horaEnvio: string
  discente: string
  matricula: string
  cpf: string
  email: string
  modalidade: string
  planoTitulo: string
  orientador: string
  justificativa: string
  experienciaPrevia: string
  historicoArquivo: string
  cargaHoraria: string
  observacao?: string
  timeline: TimelineStep[]
}

type ResultData = {
  dataResultado: string
  classificacao?: number
  pontuacao?: string
  resultadoFinal: FinalResultStatus
  parecer: string
  proximosPassos: string[]
}

type FormData = {
  planoId: string
  modalidade: string
  justificativa: string
  experienciaPrevia: string
  historicoAluno: string
  disponibilidadeCargaHoraria: string
  aceiteTermos: boolean
  aceiteDisponibilidade: boolean
  aceiteDocumentos: boolean
}

type FormErrors = Partial<Record<keyof FormData, string>>

const NOTICES: NoticeSummary[] = [
  {
    id: "edital_001",
    titulo: "Edital PIBIC 2026",
    tipo: "PIBIC",
    status: "ABERTO",
    unidade: "PROPESQ / UFPB",
    inscricaoAte: "15/04/2026",
    orientacao:
      "Revise seus dados cadastrais, documentos e vínculo acadêmico antes de finalizar a inscrição.",
    documentosObrigatorios: [
      "Comprovante de matrícula atualizado",
      "Documento de identificação",
      "CPF",
      "Comprovante bancário",
      "Histórico escolar",
    ],
  },
  {
    id: "edital_002",
    titulo: "Edital PIBITI 2026",
    tipo: "PIBITI",
    status: "EM_ANALISE",
    unidade: "PROPESQ / UFPB",
    inscricaoAte: "20/03/2026",
    orientacao:
      "As inscrições foram encerradas e o processo está em fase de análise.",
    documentosObrigatorios: [
      "Comprovante de matrícula atualizado",
      "Documento de identificação",
      "CPF",
      "Comprovante bancário",
      "Histórico escolar",
    ],
  },
  {
    id: "edital_003",
    titulo: "Edital PROBEX 2026",
    tipo: "PROBEX",
    status: "RESULTADO_PUBLICADO",
    unidade: "PRAC / UFPB",
    inscricaoAte: "28/02/2026",
    orientacao:
      "O processo seletivo foi concluído e o resultado final já está disponível.",
    documentosObrigatorios: [
      "Comprovante de matrícula atualizado",
      "Documento de identificação",
      "CPF",
      "Histórico escolar",
    ],
  },
]

const AVAILABLE_PLANS = [
  {
    id: "plano_001",
    titulo: "Plano de Trabalho em Ciência de Dados Aplicada",
    professor: "Prof. André Silva",
    area: "Ciência de Dados",
  },
  {
    id: "plano_002",
    titulo: "Plano de Trabalho em Inteligência Artificial para Educação",
    professor: "Profa. Helena Costa",
    area: "Inteligência Artificial",
  },
  {
    id: "plano_003",
    titulo: "Plano de Trabalho em Sistemas Digitais para Gestão Acadêmica",
    professor: "Prof. Marcos Oliveira",
    area: "Sistemas de Informação",
  },
]

const APPLICATIONS_BY_NOTICE_ID: Record<string, ApplicationRecord | undefined> = {
  edital_002: {
    protocolo: "PROP-2026-000184",
    dataEnvio: "14/03/2026",
    horaEnvio: "09:42",
    discente: "Ana Beatriz Lima",
    matricula: "20230012345",
    cpf: "123.456.789-00",
    email: "ana.lima@academico.ufpb.br",
    modalidade: "Bolsista",
    planoTitulo: "Plano de Trabalho em Inteligência Artificial para Educação",
    orientador: "Profa. Helena Costa",
    justificativa:
      "Tenho interesse em atuar na área de IA aplicada à educação e aprofundar meus conhecimentos em pesquisa, desenvolvimento e análise de dados.",
    experienciaPrevia:
      "Participei de projetos acadêmicos com Python, análise de dados, modelagem preditiva e construção de dashboards.",
    historicoArquivo: "historico_ana_beatriz_2026.pdf",
    cargaHoraria: "20 horas semanais",
    observacao:
      "Documentação validada. Inscrição encaminhada para avaliação do orientador.",
    timeline: [
      {
        titulo: "Inscrição enviada",
        data: "14/03/2026 • 09:42",
        status: "DONE",
        descricao: "Sua candidatura foi registrada com sucesso no sistema.",
      },
      {
        titulo: "Triagem documental",
        data: "15/03/2026",
        status: "DONE",
        descricao: "Os documentos obrigatórios foram conferidos.",
      },
      {
        titulo: "Análise da inscrição",
        data: "18/03/2026",
        status: "CURRENT",
        descricao: "A candidatura está em avaliação pela coordenação.",
      },
      {
        titulo: "Resultado final",
        data: "Aguardando publicação",
        status: "PENDING",
        descricao: "O resultado será exibido nesta mesma página.",
      },
    ],
  },
  edital_003: {
    protocolo: "PROP-2026-000097",
    dataEnvio: "20/02/2026",
    horaEnvio: "14:18",
    discente: "Ana Beatriz Lima",
    matricula: "20230012345",
    cpf: "123.456.789-00",
    email: "ana.lima@academico.ufpb.br",
    modalidade: "Voluntário",
    planoTitulo: "Plano de Trabalho em Ciência de Dados Aplicada",
    orientador: "Prof. André Silva",
    justificativa:
      "Desejo participar do projeto para consolidar minha formação e ampliar minha experiência em pesquisa aplicada e produção científica.",
    experienciaPrevia:
      "Experiência com Python, SQL, visualização de dados, iniciação em aprendizado de máquina e participação em projetos acadêmicos.",
    historicoArquivo: "historico_ana_beatriz_2026.pdf",
    cargaHoraria: "12 horas semanais",
    observacao:
      "Inscrição homologada e concluída dentro do prazo do edital.",
    timeline: [
      {
        titulo: "Inscrição enviada",
        data: "20/02/2026 • 14:18",
        status: "DONE",
        descricao: "Candidatura registrada com sucesso.",
      },
      {
        titulo: "Triagem documental",
        data: "21/02/2026",
        status: "DONE",
        descricao: "Documentação obrigatória validada.",
      },
      {
        titulo: "Análise da inscrição",
        data: "26/02/2026",
        status: "DONE",
        descricao: "Inscrição analisada pela coordenação.",
      },
      {
        titulo: "Resultado final publicado",
        data: "10/03/2026",
        status: "DONE",
        descricao: "Resultado disponível abaixo nesta página.",
      },
    ],
  },
}

const RESULTS_BY_NOTICE_ID: Record<string, ResultData | undefined> = {
  edital_003: {
    dataResultado: "10/03/2026",
    classificacao: 3,
    pontuacao: "89,5",
    resultadoFinal: "CLASSIFICADO_VOLUNTARIO",
    parecer:
      "A candidatura apresentou aderência ao plano de trabalho, bom desempenho acadêmico e perfil compatível com as atividades propostas. A classificação ocorreu na modalidade voluntária, conforme disponibilidade do edital.",
    proximosPassos: [
      "Aguardar contato da coordenação ou do orientador para início das atividades.",
      "Acompanhar comunicados institucionais relacionados ao programa.",
      "Manter documentação acadêmica e cadastral atualizada no sistema.",
    ],
  },
}

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

function getTimelineIcon(stepStatus: TimelineStepStatus) {
  switch (stepStatus) {
    case "DONE":
      return <CheckCircle2 size={16} className="text-success" />
    case "CURRENT":
      return <Clock3 size={16} className="text-warning" />
    case "FAILED":
      return <AlertTriangle size={16} className="text-danger" />
    default:
      return <Circle size={14} className="text-neutral" />
  }
}

function getTimelineCardClasses(stepStatus: TimelineStepStatus) {
  switch (stepStatus) {
    case "DONE":
      return "border-success/20 bg-success/5"
    case "CURRENT":
      return "border-warning/20 bg-warning/5"
    case "FAILED":
      return "border-danger/20 bg-danger/5"
    default:
      return "border-neutral/20 bg-neutral/5"
  }
}

function getResultLabel(status: FinalResultStatus) {
  switch (status) {
    case "CLASSIFICADO_BOLSISTA":
      return "Classificado como bolsista"
    case "CLASSIFICADO_VOLUNTARIO":
      return "Classificado como voluntário"
    case "SUPLENTE":
      return "Suplente"
    case "NAO_CLASSIFICADO":
      return "Não classificado"
    case "INDEFERIDO":
      return "Indeferido"
    default:
      return status
  }
}

function getResultClasses(status: FinalResultStatus) {
  switch (status) {
    case "CLASSIFICADO_BOLSISTA":
      return "border-success/30 bg-success/10 text-success"
    case "CLASSIFICADO_VOLUNTARIO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "SUPLENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "NAO_CLASSIFICADO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "INDEFERIDO":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getHighlightCardClasses(status: FinalResultStatus) {
  switch (status) {
    case "CLASSIFICADO_BOLSISTA":
      return "bg-white border border-success/30"
    case "CLASSIFICADO_VOLUNTARIO":
      return "bg-white border border-primary/30"
    case "SUPLENTE":
      return "bg-white border border-warning/30"
    case "INDEFERIDO":
      return "bg-white border border-danger/30"
    default:
      return "bg-white border border-neutral/30"
  }
}

function getResultMessage(status: FinalResultStatus) {
  switch (status) {
    case "CLASSIFICADO_BOLSISTA":
      return "Sua inscrição foi aprovada dentro das vagas de bolsa previstas no edital."
    case "CLASSIFICADO_VOLUNTARIO":
      return "Sua inscrição foi aprovada na modalidade voluntária."
    case "SUPLENTE":
      return "Sua inscrição ficou em lista de suplência e poderá ser convocada em caso de vacância."
    case "NAO_CLASSIFICADO":
      return "Sua inscrição não alcançou classificação suficiente dentro das vagas disponíveis."
    case "INDEFERIDO":
      return "Sua inscrição foi indeferida no resultado final do processo."
    default:
      return ""
  }
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.planoId.trim()) errors.planoId = "Selecione um plano de trabalho."
  if (!data.modalidade.trim()) errors.modalidade = "Selecione a modalidade."

  if (!data.justificativa.trim()) {
    errors.justificativa = "Informe a justificativa de interesse."
  } else if (data.justificativa.trim().length < 20) {
    errors.justificativa = "Escreva uma justificativa com mais detalhes."
  }

  if (!data.experienciaPrevia.trim()) {
    errors.experienciaPrevia = "Informe sua experiência prévia."
  } else if (data.experienciaPrevia.trim().length < 20) {
    errors.experienciaPrevia = "Descreva a experiência prévia com mais detalhes."
  }

  if (!data.historicoAluno.trim()) {
    errors.historicoAluno = "Informe ou anexe o histórico do aluno."
  }

  if (!data.disponibilidadeCargaHoraria.trim()) {
    errors.disponibilidadeCargaHoraria = "Informe a disponibilidade de carga horária."
  }

  if (!data.aceiteTermos) errors.aceiteTermos = "É necessário aceitar os termos."
  if (!data.aceiteDisponibilidade) {
    errors.aceiteDisponibilidade = "Confirme sua disponibilidade."
  }
  if (!data.aceiteDocumentos) {
    errors.aceiteDocumentos = "Confirme a regularidade documental."
  }

  return errors
}

export default function NoticeApplicationUnifiedPage() {
  const { id } = useParams()

  const notice = NOTICES.find((item) => item.id === id) ?? NOTICES[0]
  const existingApplication = APPLICATIONS_BY_NOTICE_ID[notice.id]
  const publishedResult = RESULTS_BY_NOTICE_ID[notice.id]

  const [form, setForm] = useState<FormData>({
    planoId: "",
    modalidade: "",
    justificativa: "",
    experienciaPrevia: "",
    historicoAluno: "",
    disponibilidadeCargaHoraria: "",
    aceiteTermos: false,
    aceiteDisponibilidade: false,
    aceiteDocumentos: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [applicationSent, setApplicationSent] = useState(Boolean(existingApplication))

  const selectedPlan = useMemo(() => {
    return AVAILABLE_PLANS.find((plan) => plan.id === form.planoId)
  }, [form.planoId])

  const generatedApplication = useMemo<ApplicationRecord | undefined>(() => {
    if (!applicationSent || existingApplication) return existingApplication

    const plan = AVAILABLE_PLANS.find((item) => item.id === form.planoId)

    return {
      protocolo: "PROP-2026-000999",
      dataEnvio: "21/04/2026",
      horaEnvio: "10:15",
      discente: "Ana Beatriz Lima",
      matricula: "20230012345",
      cpf: "123.456.789-00",
      email: "ana.lima@academico.ufpb.br",
      modalidade: form.modalidade === "BOLSISTA" ? "Bolsista" : "Voluntário",
      planoTitulo: plan?.titulo || "-",
      orientador: plan?.professor || "-",
      justificativa: form.justificativa,
      experienciaPrevia: form.experienciaPrevia,
      historicoArquivo: form.historicoAluno,
      cargaHoraria: form.disponibilidadeCargaHoraria,
      observacao:
        "Sua inscrição foi enviada com sucesso e está aguardando triagem documental.",
      timeline: [
        {
          titulo: "Inscrição enviada",
          data: "21/04/2026 • 10:15",
          status: "DONE",
          descricao: "Sua candidatura foi registrada com sucesso no sistema.",
        },
        {
          titulo: "Triagem documental",
          data: "Em andamento",
          status: "CURRENT",
          descricao: "A coordenação está verificando os documentos informados.",
        },
        {
          titulo: "Análise da inscrição",
          data: "Aguardando",
          status: "PENDING",
          descricao: "A avaliação será iniciada após a triagem.",
        },
        {
          titulo: "Resultado final",
          data: "Aguardando publicação",
          status: "PENDING",
          descricao: "Quando disponível, o resultado aparecerá nesta mesma página.",
        },
      ],
    }
  }, [applicationSent, existingApplication, form])

  const application = generatedApplication
  const shouldShowForm = notice.status === "ABERTO" && !application
  const shouldShowTracking = Boolean(application)
  const shouldShowResult = Boolean(publishedResult)

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
    setSuccessMessage("")
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const nextErrors = validateForm(form)
    setErrors(nextErrors)
    setSuccessMessage("")

    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)

    setTimeout(() => {
      setSubmitting(false)
      setApplicationSent(true)
      setSuccessMessage("Inscrição enviada com sucesso. O acompanhamento agora aparece abaixo.")
    }, 900)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Inscrição e Acompanhamento • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-4">
            <Link
              to={`/discente/editais/${notice.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral hover:border-primary/30 hover:text-primary transition"
            >
              <ArrowLeft size={16} />
              Voltar para o edital
            </Link>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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
                  <BadgeCheck size={14} />
                  {getStatusLabel(notice.status)}
                </span>

                {shouldShowTracking && application && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <FileCheck2 size={14} />
                    Protocolo {application.protocolo}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-primary">
                Inscrição e acompanhamento
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                {notice.titulo}. Nesta mesma página você pode realizar sua inscrição, acompanhar o andamento do processo e consultar o resultado final quando ele for publicado.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl border border-primary
                  px-4 py-3 text-sm font-medium text-primary
                  hover:bg-primary/5 transition
                "
              >
                <Printer size={16} />
                Gerar comprovante de inscrição (PDF)
              </button>
            </div>
          </div>
        </header>

        {/* ALERTA */}
        {!shouldShowForm && !shouldShowTracking && (
          <div className="rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm font-medium text-warning">
            Este edital não está disponível para novas inscrições no momento.
          </div>
        )}

        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="text-sm text-neutral">Unidade</div>
            <div className="mt-1 text-sm font-semibold text-primary">{notice.unidade}</div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="text-sm text-neutral">Prazo final</div>
            <div className="mt-1 text-sm font-semibold text-primary">{notice.inscricaoAte}</div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="text-sm text-neutral">Tipo</div>
            <div className="mt-1 text-sm font-semibold text-primary">{notice.tipo}</div>
          </Card>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            {/* FORMULÁRIO */}
            {shouldShowForm && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <Card
                  title={
                    <h2 className="text-sm font-semibold text-primary">
                      Preenchimento de formulário
                    </h2>
                  }
                  className="bg-white border border-neutral/30 rounded-2xl p-8"
                >
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1.5">
                        Plano de trabalho *
                      </label>
                      <select
                        value={form.planoId}
                        onChange={(e) => updateField("planoId", e.target.value)}
                        className="
                          w-full rounded-xl border border-neutral/30 bg-white
                          px-4 py-3 text-sm text-primary outline-none
                          focus:border-primary
                        "
                      >
                        <option value="">Selecione um plano</option>
                        {AVAILABLE_PLANS.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.titulo}
                          </option>
                        ))}
                      </select>
                      {errors.planoId && (
                        <p className="mt-1 text-xs text-danger">{errors.planoId}</p>
                      )}
                    </div>

                    {selectedPlan && (
                      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm">
                        <div className="font-semibold text-primary">Plano selecionado</div>
                        <div className="mt-2 space-y-1 text-neutral">
                          <p>
                            <span className="font-medium text-primary">Título:</span>{" "}
                            {selectedPlan.titulo}
                          </p>
                          <p>
                            <span className="font-medium text-primary">Professor:</span>{" "}
                            {selectedPlan.professor}
                          </p>
                          <p>
                            <span className="font-medium text-primary">Área:</span>{" "}
                            {selectedPlan.area}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-primary mb-1.5">
                        Modalidade *
                      </label>
                      <select
                        value={form.modalidade}
                        onChange={(e) => updateField("modalidade", e.target.value)}
                        className="
                          w-full rounded-xl border border-neutral/30 bg-white
                          px-4 py-3 text-sm text-primary outline-none
                          focus:border-primary
                        "
                      >
                        <option value="">Selecione</option>
                        <option value="BOLSISTA">Bolsista</option>
                        <option value="VOLUNTARIO">Voluntário</option>
                      </select>
                      {errors.modalidade && (
                        <p className="mt-1 text-xs text-danger">{errors.modalidade}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-1.5">
                        Justificativa de interesse *
                      </label>
                      <textarea
                        value={form.justificativa}
                        onChange={(e) => updateField("justificativa", e.target.value)}
                        rows={5}
                        className="
                          w-full rounded-xl border border-neutral/30 bg-white
                          px-4 py-3 text-sm text-primary outline-none
                          focus:border-primary resize-none
                        "
                        placeholder="Explique seu interesse em participar deste edital e do plano de trabalho selecionado."
                      />
                      {errors.justificativa && (
                        <p className="mt-1 text-xs text-danger">{errors.justificativa}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-1.5">
                        Experiência prévia *
                      </label>
                      <textarea
                        value={form.experienciaPrevia}
                        onChange={(e) => updateField("experienciaPrevia", e.target.value)}
                        rows={5}
                        className="
                          w-full rounded-xl border border-neutral/30 bg-white
                          px-4 py-3 text-sm text-primary outline-none
                          focus:border-primary resize-none
                        "
                        placeholder="Descreva experiências anteriores em ensino, pesquisa, extensão, projetos, monitoria, desenvolvimento ou áreas relacionadas."
                      />
                      {errors.experienciaPrevia && (
                        <p className="mt-1 text-xs text-danger">{errors.experienciaPrevia}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-1.5">
                        Histórico do aluno *
                      </label>
                      <div className="rounded-2xl border border-dashed border-neutral/30 bg-neutral/5 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-sm text-neutral leading-6">
                            Informe o nome do arquivo ou referência do histórico anexado.
                          </div>

                          <button
                            type="button"
                            className="
                              inline-flex items-center justify-center gap-2
                              rounded-xl border border-primary
                              px-4 py-2.5 text-sm font-medium text-primary
                              hover:bg-primary/5 transition
                            "
                          >
                            <Upload size={16} />
                            Anexar histórico
                          </button>
                        </div>

                        <input
                          type="text"
                          value={form.historicoAluno}
                          onChange={(e) => updateField("historicoAluno", e.target.value)}
                          placeholder="Ex.: historico_aluno_2026.pdf"
                          className="
                            mt-4 w-full rounded-xl border border-neutral/30 bg-white
                            px-4 py-3 text-sm text-primary outline-none
                            focus:border-primary
                          "
                        />
                      </div>
                      {errors.historicoAluno && (
                        <p className="mt-1 text-xs text-danger">{errors.historicoAluno}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-1.5">
                        Disponibilidade de carga horária *
                      </label>
                      <select
                        value={form.disponibilidadeCargaHoraria}
                        onChange={(e) =>
                          updateField("disponibilidadeCargaHoraria", e.target.value)
                        }
                        className="
                          w-full rounded-xl border border-neutral/30 bg-white
                          px-4 py-3 text-sm text-primary outline-none
                          focus:border-primary
                        "
                      >
                        <option value="">Selecione</option>
                        <option value="12 horas semanais">12 horas semanais</option>
                        <option value="16 horas semanais">16 horas semanais</option>
                        <option value="20 horas semanais">20 horas semanais</option>
                      </select>
                      {errors.disponibilidadeCargaHoraria && (
                        <p className="mt-1 text-xs text-danger">
                          {errors.disponibilidadeCargaHoraria}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>

                <Card
                  title={
                    <h2 className="text-sm font-semibold text-primary">
                      Declarações e confirmações
                    </h2>
                  }
                  className="bg-white border border-neutral/30 rounded-2xl p-8"
                >
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 text-sm text-primary">
                      <input
                        type="checkbox"
                        checked={form.aceiteTermos}
                        onChange={(e) => updateField("aceiteTermos", e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-neutral/40"
                      />
                      <span>
                        Declaro que li e concordo com as regras e condições deste edital.
                      </span>
                    </label>
                    {errors.aceiteTermos && (
                      <p className="text-xs text-danger">{errors.aceiteTermos}</p>
                    )}

                    <label className="flex items-start gap-3 text-sm text-primary">
                      <input
                        type="checkbox"
                        checked={form.aceiteDisponibilidade}
                        onChange={(e) =>
                          updateField("aceiteDisponibilidade", e.target.checked)
                        }
                        className="mt-1 h-4 w-4 rounded border-neutral/40"
                      />
                      <span>
                        Confirmo que possuo disponibilidade para cumprir a carga horária informada.
                      </span>
                    </label>
                    {errors.aceiteDisponibilidade && (
                      <p className="text-xs text-danger">{errors.aceiteDisponibilidade}</p>
                    )}

                    <label className="flex items-start gap-3 text-sm text-primary">
                      <input
                        type="checkbox"
                        checked={form.aceiteDocumentos}
                        onChange={(e) =>
                          updateField("aceiteDocumentos", e.target.checked)
                        }
                        className="mt-1 h-4 w-4 rounded border-neutral/40"
                      />
                      <span>
                        Confirmo que meus dados cadastrais e documentos obrigatórios estão atualizados.
                      </span>
                    </label>
                    {errors.aceiteDocumentos && (
                      <p className="text-xs text-danger">{errors.aceiteDocumentos}</p>
                    )}
                  </div>
                </Card>

                {(successMessage || Object.keys(errors).length > 0) && (
                  <div className="space-y-2">
                    {successMessage && (
                      <div className="rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success">
                        {successMessage}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                  <Link
                    to={`/discente/editais/${notice.id}`}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-xl border border-neutral/30
                      px-4 py-3 text-sm font-medium text-neutral
                      hover:bg-neutral/5 transition
                    "
                  >
                    Cancelar
                  </Link>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-xl bg-primary px-4 py-3
                      text-sm font-semibold text-white
                      hover:opacity-90 transition disabled:opacity-60
                    "
                  >
                    <Send size={16} />
                    {submitting ? "Enviando..." : "Enviar inscrição"}
                  </button>
                </div>
              </form>
            )}

            {/* ACOMPANHAMENTO */}
            {shouldShowTracking && application && (
              <>
                <Card
                  title={
                    <h2 className="text-sm font-semibold text-primary">
                      Acompanhamento da inscrição
                    </h2>
                  }
                  className="bg-white border border-neutral/30 rounded-2xl p-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-4">
                      <div className="text-sm text-neutral">Protocolo</div>
                      <div className="mt-1 text-sm font-semibold text-primary">
                        {application.protocolo}
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-4">
                      <div className="text-sm text-neutral">Data do envio</div>
                      <div className="mt-1 text-sm font-semibold text-primary">
                        {application.dataEnvio}
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-4">
                      <div className="text-sm text-neutral">Horário</div>
                      <div className="mt-1 text-sm font-semibold text-primary">
                        {application.horaEnvio}
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-4">
                      <div className="text-sm text-neutral">Modalidade</div>
                      <div className="mt-1 text-sm font-semibold text-primary">
                        {application.modalidade}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card
                  title={
                    <h2 className="text-sm font-semibold text-primary">
                      Linha do tempo
                    </h2>
                  }
                  className="bg-white border border-neutral/30 rounded-2xl p-8"
                >
                  <div className="space-y-4">
                    {application.timeline.map((step, index) => (
                      <div
                        key={`${step.titulo}-${index}`}
                        className={`rounded-2xl border p-4 ${getTimelineCardClasses(
                          step.status
                        )}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getTimelineIcon(step.status)}</div>

                          <div className="flex-1">
                            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                              <div className="text-sm font-semibold text-primary">
                                {step.titulo}
                              </div>
                              <div className="text-xs font-medium text-neutral">
                                {step.data}
                              </div>
                            </div>

                            {step.descricao && (
                              <p className="mt-2 text-sm text-neutral leading-6">
                                {step.descricao}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card
                  title={
                    <h2 className="text-sm font-semibold text-primary">
                      Dados enviados
                    </h2>
                  }
                  className="bg-white border border-neutral/30 rounded-2xl p-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                    <div className="md:col-span-2">
                      <div className="text-neutral">Plano de trabalho</div>
                      <div className="mt-1 font-semibold text-primary">
                        {application.planoTitulo}
                      </div>
                    </div>

                    <div>
                      <div className="text-neutral">Orientador(a)</div>
                      <div className="mt-1 font-medium text-primary">
                        {application.orientador}
                      </div>
                    </div>

                    <div>
                      <div className="text-neutral">Carga horária disponível</div>
                      <div className="mt-1 font-medium text-primary">
                        {application.cargaHoraria}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-neutral">Justificativa de interesse</div>
                      <div className="mt-1 font-medium text-primary leading-6">
                        {application.justificativa}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-neutral">Experiência prévia</div>
                      <div className="mt-1 font-medium text-primary leading-6">
                        {application.experienciaPrevia}
                      </div>
                    </div>

                    <div>
                      <div className="text-neutral">Histórico informado</div>
                      <div className="mt-1 font-medium text-primary">
                        {application.historicoArquivo}
                      </div>
                    </div>

                    <div>
                      <div className="text-neutral">Discente</div>
                      <div className="mt-1 font-medium text-primary">
                        {application.discente}
                      </div>
                    </div>

                    {application.observacao && (
                      <div className="md:col-span-2">
                        <div className="text-neutral">Observação</div>
                        <div className="mt-1 font-medium text-primary leading-6">
                          {application.observacao}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </>
            )}

            {/* RESULTADO */}
            {shouldShowResult && publishedResult && application && (
              <>
                <Card
                  title={
                    <h2 className="text-sm font-semibold text-primary">
                      Resultado da inscrição
                    </h2>
                  }
                  className={`${getHighlightCardClasses(
                    publishedResult.resultadoFinal
                  )} rounded-2xl p-6`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <Trophy
                        size={22}
                        className={
                          publishedResult.resultadoFinal === "INDEFERIDO"
                            ? "mt-0.5 text-danger"
                            : publishedResult.resultadoFinal === "NAO_CLASSIFICADO"
                            ? "mt-0.5 text-neutral"
                            : publishedResult.resultadoFinal === "SUPLENTE"
                            ? "mt-0.5 text-warning"
                            : "mt-0.5 text-success"
                        }
                      />

                      <div>
                        <div
                          className={`text-base font-semibold ${
                            publishedResult.resultadoFinal === "INDEFERIDO"
                              ? "text-danger"
                              : publishedResult.resultadoFinal === "NAO_CLASSIFICADO"
                              ? "text-primary"
                              : publishedResult.resultadoFinal === "SUPLENTE"
                              ? "text-warning"
                              : "text-success"
                          }`}
                        >
                          {getResultLabel(publishedResult.resultadoFinal)}
                        </div>

                        <p className="mt-1 text-sm text-neutral leading-6">
                          {getResultMessage(publishedResult.resultadoFinal)}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
                      <div className="text-xs font-medium text-neutral">Protocolo</div>
                      <div className="mt-1 text-base font-bold text-primary">
                        {application.protocolo}
                      </div>
                    </div>
                  </div>
                </Card>

                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <CalendarDays size={20} className="text-primary" />
                      <div>
                        <div className="text-sm text-neutral">Data do resultado</div>
                        <div className="mt-1 text-sm font-semibold text-primary">
                          {publishedResult.dataResultado}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <UserCheck size={20} className="text-primary" />
                      <div>
                        <div className="text-sm text-neutral">Modalidade pretendida</div>
                        <div className="mt-1 text-sm font-semibold text-primary">
                          {application.modalidade}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <Medal size={20} className="text-primary" />
                      <div>
                        <div className="text-sm text-neutral">Classificação</div>
                        <div className="mt-1 text-sm font-semibold text-primary">
                          {publishedResult.classificacao
                            ? `${publishedResult.classificacao}º lugar`
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-primary" />
                      <div>
                        <div className="text-sm text-neutral">Pontuação</div>
                        <div className="mt-1 text-sm font-semibold text-primary">
                          {publishedResult.pontuacao || "-"}
                        </div>
                      </div>
                    </div>
                  </Card>
                </section>

                <Card
                  title={
                    <h2 className="text-sm font-semibold text-primary">
                      Parecer e observações
                    </h2>
                  }
                  className="bg-white border border-neutral/30 rounded-2xl p-8"
                >
                  <div
                    className={`
                      rounded-xl px-4 py-4 text-sm leading-6
                      ${
                        publishedResult.resultadoFinal === "INDEFERIDO"
                          ? "border border-danger/20 bg-danger/5 text-danger"
                          : publishedResult.resultadoFinal === "NAO_CLASSIFICADO"
                          ? "border border-neutral/20 bg-neutral/5 text-neutral"
                          : publishedResult.resultadoFinal === "SUPLENTE"
                          ? "border border-warning/20 bg-warning/5 text-neutral"
                          : "border border-success/20 bg-success/5 text-neutral"
                      }
                    `}
                  >
                    {publishedResult.parecer}
                  </div>
                </Card>

                <Card
                  title={
                    <h2 className="text-sm font-semibold text-primary">
                      Próximos passos
                    </h2>
                  }
                  className="bg-white border border-neutral/30 rounded-2xl p-8"
                >
                  <ul className="space-y-3">
                    {publishedResult.proximosPassos.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-primary"
                      >
                        {publishedResult.resultadoFinal === "INDEFERIDO" ||
                        publishedResult.resultadoFinal === "NAO_CLASSIFICADO" ? (
                          <AlertTriangle size={16} className="mt-0.5 text-warning" />
                        ) : (
                          <CheckCircle2 size={16} className="mt-0.5 text-success" />
                        )}
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </>
            )}
          </div>

          {/* COLUNA LATERAL */}
          <div className="space-y-5">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Orientações
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <p className="text-sm text-neutral leading-6">{notice.orientacao}</p>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Documentos obrigatórios
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3">
                {notice.documentosObrigatorios.map((doc) => (
                  <li key={doc} className="flex items-start gap-3 text-sm text-primary">
                    <FileText size={16} className="mt-0.5 text-primary" />
                    <span>{doc}</span>
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
                <button
                  type="button"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <Printer size={16} />
                  Gerar comprovante (PDF)
                </button>

                <Link
                  to={`/discente/editais/${notice.id}`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <ClipboardList size={16} />
                  Ver edital
                </Link>

                <Link
                  to="/discente/editais"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90 transition
                  "
                >
                  <ArrowLeft size={16} />
                  Voltar para editais
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}