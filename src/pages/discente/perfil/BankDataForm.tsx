import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import { ArrowLeft, Landmark, Save } from "lucide-react"

type AccountType = "corrente" | "poupanca" | "pagamento"

type FormData = {
  banco: string
  agencia: string
  conta: string
  digito: string
  tipoConta: AccountType | ""
  titular: string
  cpfTitular: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

const INITIAL_FORM: FormData = {
  banco: "Banco do Brasil",
  agencia: "1234",
  conta: "98765",
  digito: "4",
  tipoConta: "corrente",
  titular: "Mariana Martins",
  cpfTitular: "123.456.789-00",
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.banco.trim()) errors.banco = "Informe o banco."

  if (!data.agencia.trim()) errors.agencia = "Informe a agência."
  else if (onlyDigits(data.agencia).length < 3) {
    errors.agencia = "Informe uma agência válida."
  }

  if (!data.conta.trim()) errors.conta = "Informe o número da conta."
  else if (onlyDigits(data.conta).length < 3) {
    errors.conta = "Informe uma conta válida."
  }

  if (!data.digito.trim()) errors.digito = "Informe o dígito."
  if (!data.tipoConta) errors.tipoConta = "Selecione o tipo de conta."
  if (!data.titular.trim()) errors.titular = "Informe o nome do titular."

  if (!data.cpfTitular.trim()) errors.cpfTitular = "Informe o CPF do titular."
  else if (onlyDigits(data.cpfTitular).length !== 11) {
    errors.cpfTitular = "Informe um CPF válido."
  }

  return errors
}

export default function BankDataForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const isFormValid = useMemo(() => {
    return Object.keys(validateForm(form)).length === 0
  }, [form])

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

    setSaving(true)

    setTimeout(() => {
      setSaving(false)
      setSuccessMessage("Dados bancários atualizados com sucesso.")
    }, 900)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Dados Bancários • PROPESQ</title>
      </Helmet>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* BOTÃO VOLTAR */}
          <div className="flex items-center">
            <Link
              to="/discente/perfil"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              <ArrowLeft size={16} />
              Voltar para perfil
            </Link>
          </div>

          {/* HEADER */}
          <header className="w-full rounded-3xl border border-neutral/20 bg-white px-6 py-6">
            <h1 className="text-2xl font-bold text-primary">
              Dados Bancários
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
              Atualize os dados da conta utilizada para vínculo e pagamento.
            </p>
          </header>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="w-full rounded-3xl border border-neutral/20 bg-white p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-primary">
                <Landmark size={18} />
                Conta bancária
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-primary">
                    Banco *
                  </label>
                  <input
                    type="text"
                    value={form.banco}
                    onChange={(e) => updateField("banco", e.target.value)}
                    className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                    placeholder="Ex.: Banco do Brasil, Caixa, Bradesco"
                  />
                  {errors.banco && (
                    <p className="mt-1 text-xs text-danger">{errors.banco}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-primary">
                    Agência *
                  </label>
                  <input
                    type="text"
                    value={form.agencia}
                    onChange={(e) =>
                      updateField(
                        "agencia",
                        onlyDigits(e.target.value).slice(0, 8),
                      )
                    }
                    className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                    placeholder="Digite a agência"
                  />
                  {errors.agencia && (
                    <p className="mt-1 text-xs text-danger">{errors.agencia}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-primary">
                    Tipo de conta *
                  </label>
                  <select
                    value={form.tipoConta}
                    onChange={(e) =>
                      updateField("tipoConta", e.target.value as AccountType)
                    }
                    className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                  >
                    <option value="">Selecione</option>
                    <option value="corrente">Conta corrente</option>
                    <option value="poupanca">Conta poupança</option>
                    <option value="pagamento">Conta de pagamento</option>
                  </select>
                  {errors.tipoConta && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.tipoConta}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-primary">
                    Número da conta *
                  </label>
                  <input
                    type="text"
                    value={form.conta}
                    onChange={(e) =>
                      updateField(
                        "conta",
                        onlyDigits(e.target.value).slice(0, 12),
                      )
                    }
                    className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                    placeholder="Digite a conta"
                  />
                  {errors.conta && (
                    <p className="mt-1 text-xs text-danger">{errors.conta}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-primary">
                    Dígito *
                  </label>
                  <input
                    type="text"
                    value={form.digito}
                    onChange={(e) =>
                      updateField(
                        "digito",
                        onlyDigits(e.target.value).slice(0, 2),
                      )
                    }
                    className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                    placeholder="Digite o dígito"
                  />
                  {errors.digito && (
                    <p className="mt-1 text-xs text-danger">{errors.digito}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-primary">
                    Nome do titular *
                  </label>
                  <input
                    type="text"
                    value={form.titular}
                    onChange={(e) => updateField("titular", e.target.value)}
                    className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                    placeholder="Digite o nome do titular da conta"
                  />
                  {errors.titular && (
                    <p className="mt-1 text-xs text-danger">{errors.titular}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-primary">
                    CPF do titular *
                  </label>
                  <input
                    type="text"
                    value={form.cpfTitular}
                    onChange={(e) =>
                      updateField("cpfTitular", formatCpf(e.target.value))
                    }
                    className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                    placeholder="000.000.000-00"
                  />
                  {errors.cpfTitular && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.cpfTitular}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ALERTAS */}
            {(successMessage || !isFormValid) && (
              <div className="space-y-2">
                {successMessage && (
                  <div className="rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success">
                    {successMessage}
                  </div>
                )}

                {!isFormValid && !successMessage && (
                  <div className="rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm font-medium text-warning">
                    Revise os campos obrigatórios antes de salvar.
                  </div>
                )}
              </div>
            )}

            {/* AÇÕES */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Link
                to="/discente/perfil"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/30 px-4 py-3 text-sm font-medium text-neutral transition hover:bg-neutral/5"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Salvando..." : "Salvar dados bancários"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}