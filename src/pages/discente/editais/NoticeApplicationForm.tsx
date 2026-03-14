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
} from "lucide-react"

type NoticeStatus = "ABERTO" | "EM_ANALISE" | "ENCERRADO" | "RESULTADO_PUBLICADO"
type NoticeType = "PIBIC" | "PIBITI" | "PROBEX" | "MONITORIA" | "OUTRO"

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

type FormData = {
  planoId: string
  modalidade: string
  justificativa: string
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
      "Este edital já encerrou a fase de inscrição.",
    documentosObrigatorios: [
      "Comprovante de matrícula atualizado",
      "Documento de identificação",
      "CPF",
      "Comprovante bancário",
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

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.planoId.trim()) errors.planoId = "Selecione um plano de trabalho."
  if (!data.modalidade.trim()) errors.modalidade = "Selecione a modalidade."
  if (!data.justificativa.trim()) errors.justificativa = "Informe a justificativa."
  else if (data.justificativa.trim().length < 20) {
    errors.justificativa = "Escreva uma justificativa com mais detalhes."
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

export default function NoticeApplicationForm() {
  const { id } = useParams()

  const notice = NOTICES.find((item) => item.id === id) ?? NOTICES[0]

  const [form, setForm] = useState<FormData>({
    planoId: "",
    modalidade: "",
    justificativa: "",
    aceiteTermos: false,
    aceiteDisponibilidade: false,
    aceiteDocumentos: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const isOpenForApplication = notice.status === "ABERTO"

  const selectedPlan = useMemo(() => {
    return AVAILABLE_PLANS.find((plan) => plan.id === form.planoId)
  }, [form.planoId])

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
    setSuccessMessage("")
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!isOpenForApplication) return

    const nextErrors = validateForm(form)
    setErrors(nextErrors)
    setSuccessMessage("")

    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)

    setTimeout(() => {
      setSubmitting(false)
      setSuccessMessage("Inscrição enviada com sucesso.")
    }, 900)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Inscrição no Edital • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to={`/discente/editais/${notice.id}`}
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para o edital
            </Link>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
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
                  <CheckCircle2 size={14} />
                  {getStatusLabel(notice.status)}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">
                Inscrição no edital
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                {notice.titulo}
              </p>
            </div>
          </div>
        </header>

        {/* ALERTA DO EDITAL */}
        {!isOpenForApplication && (
          <div className="rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm font-medium text-warning">
            Este edital não está disponível para novas inscrições no momento.
          </div>
        )}

        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="text-sm text-neutral">Unidade</div>
            <div className="mt-1 text-sm font-semibold text-primary">
              {notice.unidade}
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="text-sm text-neutral">Prazo final</div>
            <div className="mt-1 text-sm font-semibold text-primary">
              {notice.inscricaoAte}
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="text-sm text-neutral">Tipo</div>
            <div className="mt-1 text-sm font-semibold text-primary">
              {notice.tipo}
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* FORM */}
          <div className="xl:col-span-2 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Dados da inscrição
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
                      disabled={!isOpenForApplication}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary disabled:opacity-60
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
                      <div className="font-semibold text-primary">
                        Plano selecionado
                      </div>
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
                      disabled={!isOpenForApplication}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary disabled:opacity-60
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
                      rows={6}
                      disabled={!isOpenForApplication}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none disabled:opacity-60
                      "
                      placeholder="Descreva seu interesse no edital e no plano de trabalho selecionado."
                    />
                    {errors.justificativa && (
                      <p className="mt-1 text-xs text-danger">{errors.justificativa}</p>
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
                      disabled={!isOpenForApplication}
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
                      disabled={!isOpenForApplication}
                      className="mt-1 h-4 w-4 rounded border-neutral/40"
                    />
                    <span>
                      Confirmo que possuo disponibilidade para cumprir as atividades exigidas.
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
                      disabled={!isOpenForApplication}
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
                  disabled={submitting || !isOpenForApplication}
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
          </div>

          {/* LATERAL */}
          <div className="space-y-5">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Orientações
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <p className="text-sm text-neutral leading-6">
                {notice.orientacao}
              </p>
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
                {notice.documentosObrigatorios.map((doc, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-primary"
                  >
                    <FileText size={16} className="mt-0.5 text-primary" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/discente/perfil/documentos"
                className="
                  mt-5 inline-flex w-full items-center justify-center gap-2
                  rounded-xl border border-primary
                  px-4 py-3 text-sm font-medium text-primary
                  hover:bg-primary/5 transition
                "
              >
                <ClipboardList size={16} />
                Ver meus documentos
              </Link>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Atenção
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-neutral">
                  <AlertTriangle size={16} className="mt-0.5 text-warning" />
                  <span>
                    Revise as informações antes de enviar, pois elas poderão ser analisadas pela equipe responsável.
                  </span>
                </li>

                <li className="flex items-start gap-3 text-sm text-neutral">
                  <AlertTriangle size={16} className="mt-0.5 text-warning" />
                  <span>
                    Dados inconsistentes ou documentos ausentes podem comprometer sua inscrição.
                  </span>
                </li>

                <li className="flex items-start gap-3 text-sm text-neutral">
                  <AlertTriangle size={16} className="mt-0.5 text-warning" />
                  <span>
                    Após o envio, acompanhe o andamento no módulo de inscrições.
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}