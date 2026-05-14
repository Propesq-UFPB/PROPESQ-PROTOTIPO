
// não estou usando essa pagina
import React from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  FileCheck2,
  BadgeCheck,
  CalendarDays,
  Clock3,
  ClipboardList,
  FileText,
  UserCheck,
  CheckCircle2,
  Printer,
} from "lucide-react"

type ReceiptStatus = "ENVIADA" | "EM_ANALISE" | "HOMOLOGADA" | "INDEFERIDA"

type ApplicationReceiptData = {
  id: string
  noticeId: string
  editalTitulo: string
  editalTipo: string
  unidade: string
  protocolo: string
  dataEnvio: string
  horaEnvio: string
  modalidade: string
  planoTitulo: string
  orientador: string
  status: ReceiptStatus
  discente: string
  matricula: string
  cpf: string
  email: string
  resumo: string
}

const RECEIPTS: ApplicationReceiptData[] = [
  {
    id: "inscricao_001",
    noticeId: "edital_001",
    editalTitulo: "Edital PIBIC 2026",
    editalTipo: "PIBIC",
    unidade: "PROPESQ / UFPB",
    protocolo: "PROP-2026-000184",
    dataEnvio: "14/03/2026",
    horaEnvio: "09:42",
    modalidade: "Bolsista",
    planoTitulo: "Plano de Trabalho em Ciência de Dados Aplicada",
    orientador: "Prof. André Silva",
    status: "ENVIADA",
    discente: "Mariana Martins",
    matricula: "20230012345",
    cpf: "123.456.789-00",
    email: "mariana@academico.ufpb.br",
    resumo:
      "Inscrição realizada para participação em processo seletivo vinculado ao edital PIBIC 2026.",
  },
  {
    id: "inscricao_002",
    noticeId: "edital_002",
    editalTitulo: "Edital PIBITI 2026",
    editalTipo: "PIBITI",
    unidade: "PROPESQ / UFPB",
    protocolo: "PROP-2026-000133",
    dataEnvio: "18/02/2026",
    horaEnvio: "14:10",
    modalidade: "Voluntário",
    planoTitulo: "Plano de Trabalho em Inteligência Artificial para Educação",
    orientador: "Profa. Helena Costa",
    status: "EM_ANALISE",
    discente: "Mariana Martins",
    matricula: "20230012345",
    cpf: "123.456.789-00",
    email: "mariana@academico.ufpb.br",
    resumo:
      "Inscrição registrada e aguardando análise pela equipe responsável.",
  },
]

function getStatusLabel(status: ReceiptStatus) {
  switch (status) {
    case "ENVIADA":
      return "Enviada"
    case "EM_ANALISE":
      return "Em análise"
    case "HOMOLOGADA":
      return "Homologada"
    case "INDEFERIDA":
      return "Indeferida"
    default:
      return status
  }
}

function getStatusClasses(status: ReceiptStatus) {
  switch (status) {
    case "ENVIADA":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EM_ANALISE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "HOMOLOGADA":
      return "border-success/30 bg-success/10 text-success"
    case "INDEFERIDA":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

export default function ApplicationReceipt() {
  const { id } = useParams()

  const receipt = RECEIPTS.find((item) => item.id === id) ?? RECEIPTS[0]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Comprovante de Inscrição • PROPESQ</title>
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

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  {receipt.editalTipo}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    receipt.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getStatusLabel(receipt.status)}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">
                Comprovante de inscrição
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                Guarde este comprovante para acompanhar sua inscrição e consultar o andamento do processo.
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
              Imprimir comprovante
            </button>
          </div>
        </header>

        {/* DESTAQUE */}
        <Card
          title=""
          className="bg-white border border-success/30 rounded-2xl p-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={22} className="mt-0.5 text-success" />

              <div>
                <div className="text-base font-semibold text-success">
                  Inscrição registrada com sucesso
                </div>
                <p className="mt-1 text-sm text-neutral leading-6">
                  Sua inscrição foi registrada no sistema e recebeu um número de protocolo para acompanhamento.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
              <div className="text-xs font-medium text-neutral">Protocolo</div>
              <div className="mt-1 text-base font-bold text-primary">
                {receipt.protocolo}
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
                <div className="text-sm text-neutral">Data do envio</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {receipt.dataEnvio}
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
                <div className="text-sm text-neutral">Hora do envio</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {receipt.horaEnvio}
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
                <div className="text-sm text-neutral">Modalidade</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {receipt.modalidade}
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
                <div className="text-sm text-neutral">Situação inicial</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {getStatusLabel(receipt.status)}
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
                  Dados do edital
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div className="md:col-span-2">
                  <div className="text-neutral">Título do edital</div>
                  <div className="mt-1 font-semibold text-primary">
                    {receipt.editalTitulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Tipo</div>
                  <div className="mt-1 font-medium text-primary">
                    {receipt.editalTipo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Unidade</div>
                  <div className="mt-1 font-medium text-primary">
                    {receipt.unidade}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-neutral">Resumo</div>
                  <p className="mt-1 text-primary leading-6">
                    {receipt.resumo}
                  </p>
                </div>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Dados da inscrição
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div className="md:col-span-2">
                  <div className="text-neutral">Plano de trabalho selecionado</div>
                  <div className="mt-1 font-semibold text-primary">
                    {receipt.planoTitulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Orientador(a)</div>
                  <div className="mt-1 font-medium text-primary">
                    {receipt.orientador}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Modalidade</div>
                  <div className="mt-1 font-medium text-primary">
                    {receipt.modalidade}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Protocolo</div>
                  <div className="mt-1 font-medium text-primary">
                    {receipt.protocolo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Situação atual</div>
                  <div className="mt-1 font-medium text-primary">
                    {getStatusLabel(receipt.status)}
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Dados do discente
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div>
                  <div className="text-neutral">Nome</div>
                  <div className="mt-1 font-medium text-primary">
                    {receipt.discente}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Matrícula</div>
                  <div className="mt-1 font-medium text-primary">
                    {receipt.matricula}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">CPF</div>
                  <div className="mt-1 font-medium text-primary">
                    {receipt.cpf}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">E-mail</div>
                  <div className="mt-1 font-medium text-primary">
                    {receipt.email}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Situação do protocolo
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    receipt.status
                  )}`}
                >
                  <FileCheck2 size={14} />
                  {getStatusLabel(receipt.status)}
                </span>

                <p className="text-neutral leading-6">
                  {receipt.status === "ENVIADA" &&
                    "Sua inscrição foi registrada e aguarda conferência inicial."}

                  {receipt.status === "EM_ANALISE" &&
                    "Sua inscrição está em análise pela unidade responsável."}

                  {receipt.status === "HOMOLOGADA" &&
                    "Sua inscrição foi homologada e segue para as próximas etapas do processo."}

                  {receipt.status === "INDEFERIDA" &&
                    "Sua inscrição foi indeferida. Consulte o andamento e eventuais observações."}
                </p>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Próximas ações
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="flex flex-col gap-3">
                <Link
                  to={`/discente/inscricoes/${receipt.id}/status`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90 transition
                  "
                >
                  <ClipboardList size={16} />
                  Acompanhar status
                </Link>

                <Link
                  to={`/discente/editais/${receipt.noticeId}`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <FileText size={16} />
                  Ver edital
                </Link>

                <Link
                  to="/discente/editais"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-neutral/30
                    px-4 py-3 text-sm font-medium text-neutral
                    hover:bg-neutral/5 transition
                  "
                >
                  <ArrowLeft size={16} />
                  Voltar para editais
                </Link>
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
              <ul className="space-y-3 text-sm text-neutral">
                <li className="leading-6">
                  Confira regularmente o andamento da sua inscrição no sistema.
                </li>
                <li className="leading-6">
                  Mantenha seus documentos e dados bancários atualizados.
                </li>
                <li className="leading-6">
                  Guarde o número de protocolo para consultas futuras.
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}