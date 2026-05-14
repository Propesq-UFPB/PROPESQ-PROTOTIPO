// não estou usando essa pagina

import React, { useMemo, useState } from "react"
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
  ChevronDown,
  SearchCheck,
  Clock3,
  XCircle,
  ListOrdered,
} from "lucide-react"

type ApplicationStatus =
  | "SUBMETIDA"
  | "APROVADO_BOLSA"
  | "APROVADO_VOLUNTARIO"
  | "LISTA_ESPERA"
  | "NAO_APROVADO"

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
  dataInscricao: string
  dataResultado: string
  modalidadePretendida: string
  statusInscricao: ApplicationStatus
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
    dataInscricao: "12/03/2026",
    dataResultado: "30/04/2026",
    modalidadePretendida: "Bolsista",
    statusInscricao: "APROVADO_BOLSA",
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
    dataInscricao: "05/03/2026",
    dataResultado: "10/04/2026",
    modalidadePretendida: "Voluntário",
    statusInscricao: "NAO_APROVADO",
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
  {
    id: "inscricao_003",
    noticeId: "edital_003",
    editalTitulo: "Edital PROBEX 2026",
    editalTipo: "PROBEX",
    unidade: "PROPESQ / UFPB",
    protocolo: "PROP-2026-000221",
    dataInscricao: "18/03/2026",
    dataResultado: "15/05/2026",
    modalidadePretendida: "Bolsista",
    statusInscricao: "LISTA_ESPERA",
    resultadoFinal: "SUPLENTE",
    classificacao: 8,
    pontuacao: "84,0",
    planoTitulo: "Plano de Extensão com Tecnologias Assistivas",
    orientador: "Prof. Lucas Almeida",
    discente: "Mariana Martins",
    matricula: "20230012345",
    parecer:
      "A inscrição foi homologada e obteve pontuação compatível com a lista de espera, podendo ser convocada em caso de remanejamento.",
    proximosPassos: [
      "Acompanhar a convocação de suplentes no sistema.",
      "Manter seus dados atualizados para contato institucional.",
      "Consultar periodicamente o edital e os avisos oficiais.",
    ],
  },
]

function getApplicationStatusLabel(status: ApplicationStatus) {
  switch (status) {
    case "SUBMETIDA":
      return "Inscrição submetida"
    case "APROVADO_BOLSA":
      return "Aprovado com bolsa"
    case "APROVADO_VOLUNTARIO":
      return "Aprovado voluntário"
    case "LISTA_ESPERA":
      return "Lista de espera"
    case "NAO_APROVADO":
      return "Não aprovado"
    default:
      return status
  }
}

function getApplicationStatusClasses(status: ApplicationStatus) {
  switch (status) {
    case "SUBMETIDA":
      return "border-primary/30 bg-primary/10 text-primary"
    case "APROVADO_BOLSA":
      return "border-success/30 bg-success/10 text-success"
    case "APROVADO_VOLUNTARIO":
      return "border-sky-500/30 bg-sky-500/10 text-sky-700"
    case "LISTA_ESPERA":
      return "border-warning/30 bg-warning/10 text-warning"
    case "NAO_APROVADO":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getResultLabel(status: FinalResultStatus) {
  switch (status) {
    case "CLASSIFICADO_BOLSISTA":
      return "Aprovado com bolsa"
    case "CLASSIFICADO_VOLUNTARIO":
      return "Aprovado voluntário"
    case "SUPLENTE":
      return "Lista de espera"
    case "NAO_CLASSIFICADO":
      return "Não aprovado"
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
      return "border-sky-500/30 bg-sky-500/10 text-sky-700"
    case "SUPLENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "NAO_CLASSIFICADO":
      return "border-danger/30 bg-danger/10 text-danger"
    case "INDEFERIDO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getHighlightCardClasses(status: FinalResultStatus) {
  switch (status) {
    case "CLASSIFICADO_BOLSISTA":
      return "bg-white border border-success/30"
    case "CLASSIFICADO_VOLUNTARIO":
      return "bg-white border border-sky-500/30"
    case "SUPLENTE":
      return "bg-white border border-warning/30"
    case "NAO_CLASSIFICADO":
      return "bg-white border border-danger/30"
    case "INDEFERIDO":
      return "bg-white border border-neutral/30"
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
      return "Sua inscrição está em lista de espera e poderá ser convocada em caso de vacância."
    case "NAO_CLASSIFICADO":
      return "Sua inscrição não alcançou classificação suficiente dentro das vagas disponíveis."
    case "INDEFERIDO":
      return "Sua inscrição foi indeferida no resultado final do processo."
    default:
      return ""
  }
}

function getStatusIcon(status: ApplicationStatus) {
  switch (status) {
    case "SUBMETIDA":
      return <Clock3 size={16} className="text-primary" />
    case "APROVADO_BOLSA":
      return <CheckCircle2 size={16} className="text-success" />
    case "APROVADO_VOLUNTARIO":
      return <BadgeCheck size={16} className="text-sky-700" />
    case "LISTA_ESPERA":
      return <AlertTriangle size={16} className="text-warning" />
    case "NAO_APROVADO":
      return <XCircle size={16} className="text-danger" />
    default:
      return <Clock3 size={16} className="text-primary" />
  }
}

export default function ApplicationResult() {
  const { id } = useParams()

  const initialResult = RESULTS.find((item) => item.id === id) ?? RESULTS[0]
  const [selectedId, setSelectedId] = useState(initialResult.id)

  const result = useMemo(() => {
    return RESULTS.find((item) => item.id === selectedId) ?? RESULTS[0]
  }, [selectedId])

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Status e Resultado da Inscrição • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link
              to="/discente/perfil"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral hover:border-primary/30 hover:text-primary transition"
            >
              <ArrowLeft size={16} />
              Voltar para perfil
            </Link>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  {result.editalTipo}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getApplicationStatusClasses(
                    result.statusInscricao
                  )}`}
                >
                  {getStatusIcon(result.statusInscricao)}
                  {getApplicationStatusLabel(result.statusInscricao)}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">
                Status e resultado da inscrição
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                Selecione abaixo um dos editais em que você se inscreveu para acompanhar o status da inscrição, visualizar o resultado final e consultar sua posição na classificação.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 transition"
            >
              <Printer size={16} />
              Imprimir resultado
            </button>
          </div>
        </header>

        <Card
          title={
            <h2 className="text-sm font-semibold text-primary">
              Selecionar edital inscrito
            </h2>
          }
          className="bg-white border border-neutral/30 rounded-2xl p-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 items-end">
            <div className="space-y-2">
              <label
                htmlFor="edital-inscrito"
                className="text-sm font-medium text-primary"
              >
                Editais em que você se inscreveu
              </label>

              <div className="relative">
                <select
                  id="edital-inscrito"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-neutral/20 bg-white px-4 py-3 pr-10 text-sm text-primary outline-none transition focus:border-primary/40"
                >
                  {RESULTS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.editalTitulo} — {item.protocolo}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-4">
              <div className="text-xs font-medium text-neutral">
                Protocolo selecionado
              </div>
              <div className="mt-1 text-base font-bold text-primary">
                {result.protocolo}
              </div>
              <div className="mt-2 text-sm text-neutral">
                Inscrição realizada em {result.dataInscricao}
              </div>
            </div>
          </div>
        </Card>

        <Card
          title=""
          className={`${getHighlightCardClasses(result.resultadoFinal)} rounded-2xl p-6`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <Trophy
                size={22}
                className={
                  result.resultadoFinal === "CLASSIFICADO_BOLSISTA"
                    ? "mt-0.5 text-success"
                    : result.resultadoFinal === "CLASSIFICADO_VOLUNTARIO"
                    ? "mt-0.5 text-sky-700"
                    : result.resultadoFinal === "SUPLENTE"
                    ? "mt-0.5 text-warning"
                    : result.resultadoFinal === "NAO_CLASSIFICADO"
                    ? "mt-0.5 text-danger"
                    : "mt-0.5 text-neutral"
                }
              />

              <div>
                <div
                  className={`text-base font-semibold ${
                    result.resultadoFinal === "CLASSIFICADO_BOLSISTA"
                      ? "text-success"
                      : result.resultadoFinal === "CLASSIFICADO_VOLUNTARIO"
                      ? "text-sky-700"
                      : result.resultadoFinal === "SUPLENTE"
                      ? "text-warning"
                      : result.resultadoFinal === "NAO_CLASSIFICADO"
                      ? "text-danger"
                      : "text-primary"
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
              <div className="text-xs font-medium text-neutral">
                Posição na classificação
              </div>
              <div className="mt-1 text-base font-bold text-primary">
                {result.classificacao ? `${result.classificacao}º lugar` : "-"}
              </div>
            </div>
          </div>
        </Card>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <SearchCheck size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Status da inscrição</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {getApplicationStatusLabel(result.statusInscricao)}
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
                <div className="text-sm text-neutral">Resultado final</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {getResultLabel(result.resultadoFinal)}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <ListOrdered size={20} className="text-primary" />
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

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Dados da inscrição selecionada
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

                <div>
                  <div className="text-neutral">Data da inscrição</div>
                  <div className="mt-1 font-medium text-primary">
                    {result.dataInscricao}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Data do resultado</div>
                  <div className="mt-1 font-medium text-primary">
                    {result.dataResultado}
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Resultado final
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div
                className={`
                  rounded-xl px-4 py-4 text-sm leading-6
                  ${
                    result.resultadoFinal === "CLASSIFICADO_BOLSISTA"
                      ? "border border-success/20 bg-success/5 text-neutral"
                      : result.resultadoFinal === "CLASSIFICADO_VOLUNTARIO"
                      ? "border border-sky-500/20 bg-sky-500/5 text-neutral"
                      : result.resultadoFinal === "SUPLENTE"
                      ? "border border-warning/20 bg-warning/5 text-neutral"
                      : result.resultadoFinal === "NAO_CLASSIFICADO"
                      ? "border border-danger/20 bg-danger/5 text-neutral"
                      : "border border-neutral/20 bg-neutral/5 text-neutral"
                  }
                `}
              >
                <div className="mb-2 text-sm font-semibold text-primary">
                  {getResultLabel(result.resultadoFinal)}
                </div>
                <p>{result.parecer}</p>
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
                    {result.resultadoFinal === "NAO_CLASSIFICADO" ||
                    result.resultadoFinal === "INDEFERIDO" ? (
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
                  Status da inscrição
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getApplicationStatusClasses(
                    result.statusInscricao
                  )}`}
                >
                  {getStatusIcon(result.statusInscricao)}
                  {getApplicationStatusLabel(result.statusInscricao)}
                </span>

                <p className="text-neutral leading-6">
                  Acompanhe nesta área a situação atual da sua inscrição no edital selecionado.
                </p>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Resultado consolidado
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

                <div className="space-y-2 text-neutral">
                  <div className="flex items-center justify-between gap-3">
                    <span>Posição</span>
                    <span className="font-semibold text-primary">
                      {result.classificacao ? `${result.classificacao}º` : "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span>Pontuação</span>
                    <span className="font-semibold text-primary">
                      {result.pontuacao || "-"}
                    </span>
                  </div>
                </div>
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
                  Use o seletor de edital para consultar cada inscrição realizada.
                </li>
                <li className="leading-6">
                  O status da inscrição e o resultado podem variar conforme o edital selecionado.
                </li>
                <li className="leading-6">
                  Guarde o protocolo da inscrição para referência futura.
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}