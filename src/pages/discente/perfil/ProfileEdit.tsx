import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import { ArrowLeft, Save, UserCircle2 } from "lucide-react"

type FormData = {
  nome: string
  email: string
  telefone: string
  cpf: string
  matricula: string
  curso: string
  centro: string
  semestre: string
  lattes: string
  areaInteresse: string
}

const INITIAL_FORM: FormData = {
  nome: "Mariana Martins",
  email: "mariana@academico.ufpb.br",
  telefone: "(83) 99999-9999",
  cpf: "123.456.789-00",
  matricula: "20230012345",
  curso: "Ciência de Dados e Inteligência Artificial",
  centro: "CI - Centro de Informática",
  semestre: "2026.1",
  lattes: "http://lattes.cnpq.br/1234567890123456",
  areaInteresse: "Inteligência Artificial, Ciência de Dados e Sistemas Acadêmicos",
}

type FormErrors = Partial<Record<keyof FormData, string>>

function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
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

  if (!data.nome.trim()) errors.nome = "Informe o nome completo."
  if (!data.email.trim()) errors.email = "Informe o e-mail."
  else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Informe um e-mail válido."

  if (!data.telefone.trim()) errors.telefone = "Informe o telefone."
  else if (onlyDigits(data.telefone).length < 10) errors.telefone = "Informe um telefone válido."

  if (!data.cpf.trim()) errors.cpf = "Informe o CPF."
  else if (onlyDigits(data.cpf).length !== 11) errors.cpf = "Informe um CPF válido."

  if (!data.matricula.trim()) errors.matricula = "Informe a matrícula."
  if (!data.curso.trim()) errors.curso = "Informe o curso."
  if (!data.centro.trim()) errors.centro = "Informe o centro."
  if (!data.semestre.trim()) errors.semestre = "Informe o semestre."
  if (data.lattes.trim() && !/^https?:\/\/.+/i.test(data.lattes)) {
    errors.lattes = "Informe uma URL válida começando com http:// ou https://"
  }

  return errors
}

export default function ProfileEdit() {
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
      setSuccessMessage("Perfil atualizado com sucesso.")
    }, 900)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Editar Perfil • PROPESQ</title>
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
              Editar Perfil
            </h1>

            <p className="mt-1 text-base text-neutral">
              Atualize seus dados pessoais e acadêmicos.
            </p>
          </div>
        </header>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Card
            title={
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <UserCircle2 size={18} />
                Dados cadastrais
              </div>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Nome completo *
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => updateField("nome", e.target.value)}
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary
                  "
                  placeholder="Digite seu nome completo"
                />
                {errors.nome && (
                  <p className="mt-1 text-xs text-danger">{errors.nome}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">
                  E-mail *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary
                  "
                  placeholder="seuemail@academico.ufpb.br"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-danger">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Telefone *
                </label>
                <input
                  type="text"
                  value={form.telefone}
                  onChange={(e) => updateField("telefone", formatPhone(e.target.value))}
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary
                  "
                  placeholder="(83) 99999-9999"
                />
                {errors.telefone && (
                  <p className="mt-1 text-xs text-danger">{errors.telefone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">
                  CPF *
                </label>
                <input
                  type="text"
                  value={form.cpf}
                  onChange={(e) => updateField("cpf", formatCpf(e.target.value))}
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary
                  "
                  placeholder="000.000.000-00"
                />
                {errors.cpf && (
                  <p className="mt-1 text-xs text-danger">{errors.cpf}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Matrícula *
                </label>
                <input
                  type="text"
                  value={form.matricula}
                  onChange={(e) => updateField("matricula", e.target.value)}
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary
                  "
                  placeholder="Digite sua matrícula"
                />
                {errors.matricula && (
                  <p className="mt-1 text-xs text-danger">{errors.matricula}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Curso *
                </label>
                <input
                  type="text"
                  value={form.curso}
                  onChange={(e) => updateField("curso", e.target.value)}
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary
                  "
                  placeholder="Digite seu curso"
                />
                {errors.curso && (
                  <p className="mt-1 text-xs text-danger">{errors.curso}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Centro *
                </label>
                <input
                  type="text"
                  value={form.centro}
                  onChange={(e) => updateField("centro", e.target.value)}
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary
                  "
                  placeholder="Digite seu centro"
                />
                {errors.centro && (
                  <p className="mt-1 text-xs text-danger">{errors.centro}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Semestre atual *
                </label>
                <input
                  type="text"
                  value={form.semestre}
                  onChange={(e) => updateField("semestre", e.target.value)}
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary
                  "
                  placeholder="Ex.: 2026.1"
                />
                {errors.semestre && (
                  <p className="mt-1 text-xs text-danger">{errors.semestre}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Currículo Lattes
                </label>
                <input
                  type="url"
                  value={form.lattes}
                  onChange={(e) => updateField("lattes", e.target.value)}
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary
                  "
                  placeholder="https://lattes.cnpq.br/..."
                />
                {errors.lattes && (
                  <p className="mt-1 text-xs text-danger">{errors.lattes}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Área de interesse
                </label>
                <textarea
                  value={form.areaInteresse}
                  onChange={(e) => updateField("areaInteresse", e.target.value)}
                  rows={4}
                  className="
                    w-full rounded-xl border border-neutral/30 bg-white
                    px-4 py-3 text-sm text-primary outline-none
                    focus:border-primary resize-none
                  "
                  placeholder="Descreva suas áreas de interesse acadêmico"
                />
              </div>
            </div>
          </Card>

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
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl bg-primary px-4 py-3
                text-sm font-semibold text-white
                hover:opacity-90 transition disabled:opacity-60
              "
            >
              <Save size={16} />
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}