// Não estou usando

import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock3,
} from "lucide-react"

type DocumentStatus = "ENVIADO" | "PENDENTE" | "REJEITADO" | "NAO_ENVIADO"

type StudentDocument = {
  id: string
  nome: string
  obrigatorio: boolean
  status: DocumentStatus
  arquivo: string
  atualizadoEm?: string
  observacao?: string
}

const INITIAL_DOCUMENTS: StudentDocument[] = [
  {
    id: "rg",
    nome: "RG",
    obrigatorio: true,
    status: "ENVIADO",
    arquivo: "rg_mariana.pdf",
    atualizadoEm: "12/03/2026",
  },
  {
    id: "cpf",
    nome: "CPF",
    obrigatorio: true,
    status: "ENVIADO",
    arquivo: "cpf_mariana.pdf",
    atualizadoEm: "12/03/2026",
  },
  {
    id: "matricula",
    nome: "Comprovante de matrícula",
    obrigatorio: true,
    status: "PENDENTE",
    arquivo: "comprovante_matricula_2026_1.pdf",
    atualizadoEm: "13/03/2026",
  },
  {
    id: "bancario",
    nome: "Comprovante bancário",
    obrigatorio: true,
    status: "REJEITADO",
    arquivo: "conta_bb_print.jpg",
    atualizadoEm: "10/03/2026",
    observacao: "O documento enviado não apresenta claramente agência e conta.",
  },
  {
    id: "historico",
    nome: "Histórico escolar",
    obrigatorio: false,
    status: "NAO_ENVIADO",
    arquivo: "",
  },
  {
    id: "lattes",
    nome: "Currículo Lattes em PDF",
    obrigatorio: false,
    status: "NAO_ENVIADO",
    arquivo: "",
  },
]

function getStatusClasses(status: DocumentStatus) {
  switch (status) {
    case "ENVIADO":
      return "border-success/30 bg-success/10 text-success"
    case "PENDENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "REJEITADO":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getStatusLabel(status: DocumentStatus) {
  switch (status) {
    case "ENVIADO":
      return "Enviado"
    case "PENDENTE":
      return "Em análise"
    case "REJEITADO":
      return "Rejeitado"
    default:
      return "Não enviado"
  }
}

function getStatusIcon(status: DocumentStatus) {
  switch (status) {
    case "ENVIADO":
      return <CheckCircle2 size={15} />
    case "PENDENTE":
      return <Clock3 size={15} />
    case "REJEITADO":
      return <AlertTriangle size={15} />
    default:
      return <FileText size={15} />
  }
}

export default function DocumentsUpload() {
  const [documents, setDocuments] = useState<StudentDocument[]>(INITIAL_DOCUMENTS)
  const [successMessage, setSuccessMessage] = useState("")

  const stats = useMemo(() => {
    const total = documents.length
    const enviados = documents.filter((doc) => doc.status === "ENVIADO").length
    const pendentes = documents.filter((doc) => doc.status === "PENDENTE").length
    const rejeitados = documents.filter((doc) => doc.status === "REJEITADO").length
    const naoEnviados = documents.filter((doc) => doc.status === "NAO_ENVIADO").length

    return {
      total,
      enviados,
      pendentes,
      rejeitados,
      naoEnviados,
    }
  }, [documents])

  function handleMockUpload(id: string) {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              status: "PENDENTE",
              arquivo: `${doc.id}_atualizado.pdf`,
              atualizadoEm: "14/03/2026",
              observacao: "",
            }
          : doc
      )
    )

    setSuccessMessage("Documento enviado com sucesso. Agora ele está aguardando análise.")
  }

  function handleRemoveFile(id: string) {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              status: "NAO_ENVIADO",
              arquivo: "",
              atualizadoEm: undefined,
              observacao: "",
            }
          : doc
      )
    )

    setSuccessMessage("Documento removido com sucesso.")
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Documentos • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              to="/discente/perfil"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para perfil
            </Link>

            <h1 className="mt-2 text-2xl font-bold text-primary">
              Documentos do Discente
            </h1>

            <p className="mt-1 text-base text-neutral">
              Envie, acompanhe e atualize os documentos obrigatórios e complementares.
            </p>
          </div>
        </header>

        {/* AVISO */}
        <Card
          title=""
          className="bg-white border border-neutral/30 rounded-2xl p-6"
        >
          <div className="space-y-2 text-sm">
            <div className="font-semibold text-primary">
              Orientações para envio
            </div>

            <p className="text-neutral">
              Envie arquivos legíveis e atualizados. Documentos obrigatórios pendentes
              ou rejeitados podem impedir sua inscrição, homologação ou manutenção no programa.
            </p>
          </div>
        </Card>

        {/* FEEDBACK */}
        {successMessage && (
          <div className="rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success">
            {successMessage}
          </div>
        )}

        {/* LISTA DE DOCUMENTOS */}
        <section>
          <Card
            title={
              <h2 className="text-sm font-semibold text-primary">
                Situação dos documentos
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            <div className="space-y-5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-neutral/20 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-primary">
                          {doc.nome}
                        </h3>

                        {doc.obrigatorio && (
                          <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                            Obrigatório
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(doc.status)}`}
                        >
                          {getStatusIcon(doc.status)}
                          {getStatusLabel(doc.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-neutral">Arquivo atual</div>
                          <div className="font-medium text-primary">
                            {doc.arquivo || "Nenhum arquivo enviado"}
                          </div>
                        </div>

                        <div>
                          <div className="text-neutral">Última atualização</div>
                          <div className="font-medium text-primary">
                            {doc.atualizadoEm || "-"}
                          </div>
                        </div>
                      </div>

                      {doc.observacao && (
                        <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                          <span className="font-semibold">Observação:</span>{" "}
                          {doc.observacao}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-[180px]">
                      <button
                        type="button"
                        onClick={() => handleMockUpload(doc.id)}
                        className="
                          inline-flex items-center justify-center gap-2
                          rounded-xl bg-primary px-4 py-3
                          text-sm font-semibold text-white
                          hover:opacity-90 transition
                        "
                      >
                        <Upload size={16} />
                        {doc.arquivo ? "Reenviar" : "Enviar"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(doc.id)}
                        disabled={!doc.arquivo}
                        className="
                          inline-flex items-center justify-center gap-2
                          rounded-xl border border-neutral/30
                          px-4 py-3 text-sm font-medium text-neutral
                          hover:bg-neutral/5 transition disabled:opacity-50
                        "
                      >
                        <Trash2 size={16} />
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* RODAPÉ DE AÇÕES */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
          <Link
            to="/discente/perfil"
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl border border-neutral/30
              px-4 py-3 text-sm font-medium text-neutral
              hover:bg-neutral/5 transition
            "
          >
            Voltar
          </Link>

          <Link
            to="/discente/perfil/editar"
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl border border-primary
              px-4 py-3 text-sm font-medium text-primary
              hover:bg-primary/5 transition
            "
          >
            Editar perfil
          </Link>
        </div>
      </div>
    </div>
  )
}