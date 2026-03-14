import React from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import { Pencil, FileText, Landmark } from "lucide-react"

/* ================= MOCK ================= */

const perfil = {
  nome: "Mariana Martins",
  email: "mariana@academico.ufpb.br",
  cpf: "123.456.789-00",
  matricula: "20230012345",
  curso: "Ciência de Dados e Inteligência Artificial",
  centro: "CI - Centro de Informática",
  telefone: "(83) 99999-9999",
  statusCadastro: "Completo",
}

const dadosBancarios = {
  banco: "Banco do Brasil",
  agencia: "1234-5",
  conta: "98765-4",
  tipo: "Conta Corrente",
}

const documentos = [
  { nome: "RG", status: "Enviado" },
  { nome: "CPF", status: "Enviado" },
  { nome: "Comprovante de matrícula", status: "Pendente" },
  { nome: "Comprovante bancário", status: "Enviado" },
]

/* ================= HELPERS ================= */

function statusBadge(status: string) {
  if (status === "Enviado") {
    return "bg-success/10 text-success border-success/30"
  }

  if (status === "Pendente") {
    return "bg-warning/10 text-warning border-warning/30"
  }

  return "bg-neutral/10 text-neutral border-neutral/30"
}

/* ================= COMPONENTE ================= */

export default function ProfileView() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Meu Perfil • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Meu Perfil
            </h1>
            <p className="mt-1 text-base text-neutral">
              Consulte e mantenha seus dados atualizados.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/discente/perfil/editar"
              className="
                inline-flex items-center gap-2
                rounded-xl border border-primary
                px-4 py-2 text-sm font-medium
                text-primary hover:bg-primary/5 transition
              "
            >
              <Pencil size={16} />
              Editar perfil
            </Link>

            <Link
              to="/discente/perfil/documentos"
              className="
                inline-flex items-center gap-2
                rounded-xl border border-primary
                px-4 py-2 text-sm font-medium
                text-primary hover:bg-primary/5 transition
              "
            >
              <FileText size={16} />
              Documentos
            </Link>

            <Link
              to="/discente/perfil/dados-bancarios"
              className="
                inline-flex items-center gap-2
                rounded-xl border border-primary
                px-4 py-2 text-sm font-medium
                text-primary hover:bg-primary/5 transition
              "
            >
              <Landmark size={16} />
              Dados bancários
            </Link>
          </div>
        </header>

        {/* STATUS */}
        <section>
          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm text-neutral">
                  Situação do cadastro
                </div>
                <div className="text-lg font-semibold text-primary">
                  {perfil.statusCadastro}
                </div>
              </div>

              <span
                className="
                  inline-flex items-center justify-center
                  rounded-full border border-success/30
                  bg-success/10 px-4 py-2
                  text-sm font-semibold text-success
                  w-fit
                "
              >
                Perfil validado
              </span>
            </div>
          </Card>
        </section>

        {/* DADOS GERAIS + BANCÁRIOS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card
            title={
              <h2 className="text-sm font-semibold text-primary">
                Dados pessoais e acadêmicos
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-neutral">Nome</div>
                <div className="font-medium text-primary">{perfil.nome}</div>
              </div>

              <div>
                <div className="text-neutral">E-mail</div>
                <div className="font-medium text-primary">{perfil.email}</div>
              </div>

              <div>
                <div className="text-neutral">CPF</div>
                <div className="font-medium text-primary">{perfil.cpf}</div>
              </div>

              <div>
                <div className="text-neutral">Telefone</div>
                <div className="font-medium text-primary">{perfil.telefone}</div>
              </div>

              <div>
                <div className="text-neutral">Matrícula</div>
                <div className="font-medium text-primary">{perfil.matricula}</div>
              </div>

              <div>
                <div className="text-neutral">Curso</div>
                <div className="font-medium text-primary">{perfil.curso}</div>
              </div>

              <div className="sm:col-span-2">
                <div className="text-neutral">Centro</div>
                <div className="font-medium text-primary">{perfil.centro}</div>
              </div>
            </div>
          </Card>

          <Card
            title={
              <h2 className="text-sm font-semibold text-primary">
                Dados bancários
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-neutral">Banco</div>
                <div className="font-medium text-primary">
                  {dadosBancarios.banco}
                </div>
              </div>

              <div>
                <div className="text-neutral">Tipo de conta</div>
                <div className="font-medium text-primary">
                  {dadosBancarios.tipo}
                </div>
              </div>

              <div>
                <div className="text-neutral">Agência</div>
                <div className="font-medium text-primary">
                  {dadosBancarios.agencia}
                </div>
              </div>

              <div>
                <div className="text-neutral">Conta</div>
                <div className="font-medium text-primary">
                  {dadosBancarios.conta}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* DOCUMENTOS */}
        <section>
          <Card
            title={
              <h2 className="text-sm font-semibold text-primary">
                Situação dos documentos
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            <ul className="space-y-4">
              {documentos.map((doc) => (
                <li
                  key={doc.nome}
                  className="
                    flex items-center justify-between gap-3
                    border-b border-neutral/20 pb-3 text-sm
                  "
                >
                  <span className="text-neutral">{doc.nome}</span>

                  <span
                    className={`
                      inline-flex items-center justify-center
                      rounded-full border px-3 py-1
                      text-xs font-semibold min-w-[110px]
                      ${statusBadge(doc.status)}
                    `}
                  >
                    {doc.status}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </div>
  )
}