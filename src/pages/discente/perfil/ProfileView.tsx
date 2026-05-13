import React from "react"
import { Helmet } from "react-helmet"

/* ================= MOCK ================= */

const perfil = {
  nome: "Mariana Martins",
  email: "mariana@academico.ufpb.br",
  cpf: "123.456.789-00",
  matricula: "20230012345",
  curso: "Ciência de Dados e Inteligência Artificial",
  centro: "CI - Centro de Informática",
  telefone: "(83) 99999-9999",
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

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="space-y-6">
          {/* HEADER */}
          <header className="w-full rounded-2xl border border-neutral/30 bg-white px-6 py-6">
            <h1 className="text-2xl font-bold text-primary">Meu Perfil</h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
              Consulte seus dados pessoais, acadêmicos, bancários e a situação
              dos documentos vinculados ao seu perfil.
            </p>
          </header>

          {/* DADOS GERAIS + BANCÁRIOS */}
          <section className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral/30 bg-white p-6">
              <h2 className="mb-5 text-sm font-semibold text-primary">
                Dados pessoais e acadêmicos
              </h2>

              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <div className="text-neutral">Nome</div>
                  <div className="mt-1 font-medium text-primary">
                    {perfil.nome}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">E-mail</div>
                  <div className="mt-1 font-medium text-primary">
                    {perfil.email}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">CPF</div>
                  <div className="mt-1 font-medium text-primary">
                    {perfil.cpf}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Telefone</div>
                  <div className="mt-1 font-medium text-primary">
                    {perfil.telefone}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Matrícula</div>
                  <div className="mt-1 font-medium text-primary">
                    {perfil.matricula}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Curso</div>
                  <div className="mt-1 font-medium text-primary">
                    {perfil.curso}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="text-neutral">Centro</div>
                  <div className="mt-1 font-medium text-primary">
                    {perfil.centro}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral/30 bg-white p-6">
              <h2 className="mb-5 text-sm font-semibold text-primary">
                Dados bancários
              </h2>

              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <div className="text-neutral">Banco</div>
                  <div className="mt-1 font-medium text-primary">
                    {dadosBancarios.banco}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Tipo de conta</div>
                  <div className="mt-1 font-medium text-primary">
                    {dadosBancarios.tipo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Agência</div>
                  <div className="mt-1 font-medium text-primary">
                    {dadosBancarios.agencia}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Conta</div>
                  <div className="mt-1 font-medium text-primary">
                    {dadosBancarios.conta}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DOCUMENTOS */}
          <section className="w-full rounded-2xl border border-neutral/30 bg-white p-6">
            <h2 className="mb-5 text-sm font-semibold text-primary">
              Situação dos documentos
            </h2>

            <ul className="space-y-4">
              {documentos.map((doc) => (
                <li
                  key={doc.nome}
                  className="
                    flex items-center justify-between gap-3
                    border-b border-neutral/20 pb-3 text-sm
                    last:border-b-0 last:pb-0
                  "
                >
                  <span className="text-neutral">{doc.nome}</span>

                  <span
                    className={`
                      inline-flex min-w-[110px] items-center justify-center
                      rounded-full border px-3 py-1
                      text-xs font-semibold
                      ${statusBadge(doc.status)}
                    `}
                  >
                    {doc.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}