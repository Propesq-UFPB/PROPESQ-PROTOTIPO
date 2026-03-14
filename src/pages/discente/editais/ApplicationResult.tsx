import React from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  BadgeCheck,
  Trophy,
  FileText,
  ClipboardList,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Medal,
  UserCheck,
} from "lucide-react"

type FinalResultStatus =
  | "CLASSIFICADO_BOLSISTA"
  | "CLASSIFICADO_VOLUNTARIO"
  | "SUPLENTE"
  | "NAO_CLASSIFICADO"
  | "INDEFERIDO"

type ApplicationResultData = {
  id: string
  noticeId: string
  editalTitulo: string
  editalTipo: string
  unidade: string
  protocolo: string
  dataResultado: string
  modalidadePretendida: string
  resultadoFinal: FinalResultStatus
  classificacao?: number
  pontuacao?: string
  planoTitulo: string
  orientador: string
  discente: string
  matricula: string
  parecer: string
  proximosPassos: string[]
}

const RESULTS: ApplicationResultData[] = [
  {
    id: "inscricao_001",
    noticeId: "edital_001",
    editalTitulo: "Edital PIBIC 2026",
    editalTipo: "PIBIC",
    unidade: "PROPESQ / UFPB",
    protocolo: "PROP-2026-000184",
    dataResultado: "30/04/2026",
    modalidadePretendida: "Bolsista",
    resultadoFinal: "CLASSIFICADO_BOLSISTA",
    classificacao: 3,
    pontuacao: "92,5",
    planoTitulo: "Plano de Trabalho em Ciência de Dados Aplicada",
    orientador: "Prof. André Silva",
    discente: "Mariana Martins",
    matricula: "20230012345",
    parecer:
      "A candidatura atendeu aos requisitos do edital, apresentou documentação regular e obteve desempenho satisfatório nos critérios de classificação.",
    proximosPassos: [
      "Aguardar a etapa de homologação institucional.",
      "Acompanhar notificações no sistema para envio de documentos complementares, se necessário.",
      "Verificar a vinculação final ao projeto e ao plano de trabalho.",
    ],
  },
  {
    id: "inscricao_002",
    noticeId: "edital_002",
    editalTitulo: "Edital PIBITI 2026",
    editalTipo: "PIBITI",
    unidade: "PROPESQ / UFPB",
    protocolo: "PROP-2026-000133",
    dataResultado: "10/04/2026",
    modalidadePretendida: "Voluntário",
    resultadoFinal: "NAO_CLASSIFICADO",
    classificacao: 19,
    pontuacao: "61,0",
    planoTitulo: "Plano de Trabalho em Inteligência Artificial para Educação",
    orientador: "Profa. Helena Costa",
    discente: "Mariana Martins",
    matricula: "20230012345",
    parecer:
      "A inscrição foi considerada válida, porém não alcançou pontuação suficiente para classificação dentro do número de vagas disponíveis.",
    proximosPassos: [
      "Acompanhar novas oportunidades e editais disponíveis no sistema.",
      "Revisar documentação e critérios para futuras inscrições.",
      "Consultar o orientador para novas possibilidades de participação.",
    ],
  },
]

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

export default function ApplicationResult() {
  const { id } = useParams()

  const result = RESULTS.find((item) => item.id === id) ?? RESULTS[0]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Resultado da Inscrição • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to={`/discente/inscricoes/${result.id}/status`}
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para acompanhamento
            </Link>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  {result.editalTipo}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getResultClasses(
                    result.resultadoFinal
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getResultLabel(result.resultadoFinal)}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">
                Resultado da inscrição
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                Consulte abaixo o resultado final do seu processo seletivo e os próximos passos relacionados ao edital.
              </p>
            </div>

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
              Imprimir resultado
            </button>
          </div>
        </header>

        {/* DESTAQUE */}
        <Card
          title=""
          className={`${getHighlightCardClasses(result.resultadoFinal)} rounded-2xl p-6`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <Trophy
                size={22}
                className={
                  result.resultadoFinal === "INDEFERIDO"
                    ? "mt-0.5 text-danger"
                    : result.resultadoFinal === "NAO_CLASSIFICADO"
                    ? "mt-0.5 text-neutral"
                    : result.resultadoFinal === "SUPLENTE"
                    ? "mt-0.5 text-warning"
                    : "mt-0.5 text-success"
                }
              />

              <div>
                <div
                  className={`text-base font-semibold ${
                    result.resultadoFinal === "INDEFERIDO"
                      ? "text-danger"
                      : result.resultadoFinal === "NAO_CLASSIFICADO"
                      ? "text-primary"
                      : result.resultadoFinal === "SUPLENTE"
                      ? "text-warning"
                      : "text-success"
                  }`}
                >
                  {getResultLabel(result.resultadoFinal)}
                </div>

                <p className="mt-1 text-sm text-neutral leading-6">
                  {getResultMessage(result.resultadoFinal)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
              <div className="text-xs font-medium text-neutral">Protocolo</div>
              <div className="mt-1 text-base font-bold text-primary">
                {result.protocolo}
              </div>
            </div>
          </div>
        </Card>

        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <CalendarDays size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Data do resultado</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {result.dataResultado}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <UserCheck size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Modalidade pretendida</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {result.modalidadePretendida}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <Medal size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Classificação</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {result.classificacao ? `${result.classificacao}º lugar` : "-"}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Pontuação</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {result.pontuacao || "-"}
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
                  Dados do resultado
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div className="md:col-span-2">
                  <div className="text-neutral">Edital</div>
                  <div className="mt-1 font-semibold text-primary">
                    {result.editalTitulo}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-neutral">Plano de trabalho</div>
                  <div className="mt-1 font-semibold text-primary">
                    {result.planoTitulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Orientador(a)</div>
                  <div className="mt-1 font-medium text-primary">
                    {result.orientador}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Unidade</div>
                  <div className="mt-1 font-medium text-primary">
                    {result.unidade}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Discente</div>
                  <div className="mt-1 font-medium text-primary">
                    {result.discente}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Matrícula</div>
                  <div className="mt-1 font-medium text-primary">
                    {result.matricula}
                  </div>
                </div>
              </div>
            </Card>

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
                    result.resultadoFinal === "INDEFERIDO"
                      ? "border border-danger/20 bg-danger/5 text-danger"
                      : result.resultadoFinal === "NAO_CLASSIFICADO"
                      ? "border border-neutral/20 bg-neutral/5 text-neutral"
                      : result.resultadoFinal === "SUPLENTE"
                      ? "border border-warning/20 bg-warning/5 text-neutral"
                      : "border border-success/20 bg-success/5 text-neutral"
                  }
                `}
              >
                {result.parecer}
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
                {result.proximosPassos.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-primary"
                  >
                    {result.resultadoFinal === "INDEFERIDO" ||
                    result.resultadoFinal === "NAO_CLASSIFICADO" ? (
                      <AlertTriangle size={16} className="mt-0.5 text-warning" />
                    ) : (
                      <CheckCircle2 size={16} className="mt-0.5 text-success" />
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
                  Situação final
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getResultClasses(
                    result.resultadoFinal
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getResultLabel(result.resultadoFinal)}
                </span>

                <p className="text-neutral leading-6">
                  {getResultMessage(result.resultadoFinal)}
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
                <Link
                  to={`/discente/inscricoes/${result.id}/status`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <ClipboardList size={16} />
                  Ver acompanhamento
                </Link>

                <Link
                  to={`/discente/inscricoes/${result.id}/comprovante`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <FileText size={16} />
                  Ver comprovante
                </Link>

                <Link
                  to={`/discente/editais/${result.noticeId}`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90 transition
                  "
                >
                  <BadgeCheck size={16} />
                  Ver edital
                </Link>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Informações adicionais
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3 text-sm text-neutral">
                <li className="leading-6">
                  Consulte notificações do sistema para atualizações posteriores ao resultado.
                </li>
                <li className="leading-6">
                  Guarde o protocolo da inscrição para referência futura.
                </li>
                <li className="leading-6">
                  Em caso de classificação, acompanhe as próximas etapas de homologação e vínculo.
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}