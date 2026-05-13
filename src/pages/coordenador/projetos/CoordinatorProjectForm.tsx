// src/pages/coordenador/projetos/CoordinatorProjectForm.tsx

import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Hash,
  Layers,
  Save,
  Tags,
} from "lucide-react"

/* ================= TIPOS ================= */

type ProjectType = "interno" | "externo"

type ODS = {
  id: number
  label: string
}

type GeneralData = {
  titulo: string
  unidade: string
  centro: string
  periodoIni: string
  periodoFim: string

  editalPesquisa: string
  termo: string
  email: string

  palavrasChave: string
  objetivosDS: ODS[]
  areaConhecimento: string
  grandeArea: string
  area: string
  subarea: string
  especialidade: string
  linhaPesquisa: string
}

type InternalData = {
  vinculadoGrupo: "Sim" | "Não"
  grupoPesquisa: string

  possuiProtocoloEtica: "Sim" | "Não"
  comiteEticaNome: string
  protocoloEtica: string
}

type ExternalData = {
  categoriaProjeto: string
  subcategoriaNivelI: string
  subcategoriaNivelII: string
  definicaoPropriedadeIntelectual: string
  tratamentoProducao: string
}

type FormState = {
  tipo: ProjectType | null
  gerais: GeneralData
  interno: InternalData
  externo: ExternalData
}

type Step = 1 | 2 | 3 | 4

/* ================= ESTADO INICIAL ================= */

const initialState: FormState = {
  tipo: null,
  gerais: {
    titulo: "",
    unidade: "",
    centro: "",
    periodoIni: "",
    periodoFim: "",
    editalPesquisa: "",
    termo: "",
    email: "",
    palavrasChave: "",
    objetivosDS: [],
    areaConhecimento: "",
    grandeArea: "",
    area: "",
    subarea: "",
    especialidade: "",
    linhaPesquisa: "",
  },
  interno: {
    vinculadoGrupo: "Não",
    grupoPesquisa: "",
    possuiProtocoloEtica: "Não",
    comiteEticaNome: "",
    protocoloEtica: "",
  },
  externo: {
    categoriaProjeto: "",
    subcategoriaNivelI: "",
    subcategoriaNivelII: "",
    definicaoPropriedadeIntelectual: "",
    tratamentoProducao: "",
  },
}

/* ================= OPTIONS ================= */

const centros = ["CCHLA", "CCEN", "CT", "CCS", "CE", "CCTA"]

const unidades = [
  "Departamento A",
  "Departamento B",
  "Laboratório X",
  "Programa Y",
]

const editais = [
  "Edital 01/2026",
  "Edital 02/2026",
  "PIBIC 2026",
  "PIBITI 2026",
  "PIVIC 2026",
  "PROBEX 2026",
]

const termos = [
  "Termo de Compromisso",
  "Termo de Sigilo",
  "Termo de Consentimento (TCLE)",
  "Outro",
]

const areaConhecimentoOptions = [
  "Ciência da Computação",
  "Engenharias",
  "Saúde",
  "Humanas",
  "Linguística/Artes",
  "Outra",
]

const grandeAreas = [
  "Ciências Exatas",
  "Ciências Humanas",
  "Saúde",
  "Engenharias",
  "Linguística, Letras e Artes",
]

const areas = [
  "Visão Computacional",
  "IA Aplicada",
  "Processamento de Imagens",
  "Sistemas Embarcados",
  "Segurança",
]

const subareas = [
  "Detecção",
  "Segmentação",
  "Classificação",
  "Otimização",
  "TinyML",
]

const especialidades = [
  "Especialidade A",
  "Especialidade B",
  "Especialidade C",
  "Outra",
]

const linhas = ["Linha 01", "Linha 02", "Linha 03"]

const grupos = ["GP I", "GP II", "GP III", "Outro"]

const categoriasProjeto = [
  "Pesquisa (Externo)",
  "Extensão (Externo)",
  "Inovação (Externo)",
  "Ensino (Externo)",
]

const subcatNivelI = [
  "Subcategoria Nível I — A",
  "Subcategoria Nível I — B",
  "Subcategoria Nível I — C",
]

const subcatNivelII = [
  "Subcategoria Nível II — 1",
  "Subcategoria Nível II — 2",
  "Subcategoria Nível II — 3",
]

const definicoesPI = [
  "Institucional",
  "Compartilhada",
  "Privada",
  "A definir",
]

/* ================= UTIL/UI ================= */

function cx(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ")
}

const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const disabledInputClassName =
  "w-full rounded-xl border border-neutral/30 bg-neutral/5 px-3 py-2.5 text-sm text-neutral outline-none"

const selectClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"

const textareaClassName =
  "min-h-[120px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

function Card({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-neutral/30 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-neutral/20 px-6 py-4">
        {icon}

        <div>
          <h2 className="text-sm font-bold text-primary">{title}</h2>

          {subtitle && (
            <p className="mt-0.5 text-xs text-neutral">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="p-6">{children}</div>
    </section>
  )
}

function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wide text-neutral">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {children}

      {hint && <p className="text-[11px] text-neutral">{hint}</p>}
    </div>
  )
}

function StepPill({
  active,
  done,
  children,
}: {
  active: boolean
  done: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold",
        active
          ? "border-primary bg-primary text-white"
          : done
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-neutral/20 bg-white text-primary"
      )}
    >
      {done && <Check size={14} />}
      {children}
    </div>
  )
}

function OdsPicker({
  value,
  onChange,
}: {
  value: ODS[]
  onChange: (v: ODS[]) => void
}) {
  const odsOptions: ODS[] = useMemo(
    () => [
      { id: 1, label: "Erradicação da pobreza" },
      { id: 2, label: "Fome zero" },
      { id: 3, label: "Saúde e bem-estar" },
      { id: 4, label: "Educação de qualidade" },
      { id: 5, label: "Igualdade de gênero" },
      { id: 6, label: "Água potável e saneamento" },
      { id: 7, label: "Energia limpa" },
      { id: 8, label: "Trabalho decente e crescimento econômico" },
      { id: 9, label: "Indústria, inovação e infraestrutura" },
      { id: 10, label: "Redução das desigualdades" },
      { id: 11, label: "Cidades e comunidades sustentáveis" },
      { id: 12, label: "Consumo e produção responsáveis" },
      { id: 13, label: "Ação contra a mudança global do clima" },
      { id: 14, label: "Vida na água" },
      { id: 15, label: "Vida terrestre" },
      { id: 16, label: "Paz, justiça e instituições eficazes" },
      { id: 17, label: "Parcerias e meios de implementação" },
    ],
    []
  )

  const selectedIds = new Set(value.map((item) => item.id))

  function toggle(ods: ODS) {
    if (selectedIds.has(ods.id)) {
      onChange(value.filter((item) => item.id !== ods.id))
      return
    }

    onChange([...value, ods])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {odsOptions.map((ods) => {
        const selected = selectedIds.has(ods.id)

        return (
          <button
            key={ods.id}
            type="button"
            onClick={() => toggle(ods)}
            className={cx(
              "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition",
              selected
                ? "border-primary bg-primary text-white"
                : "border-neutral/20 bg-white text-primary hover:bg-neutral/5"
            )}
          >
            <span
              className={cx(
                "grid h-5 w-5 place-items-center rounded-full border text-[11px]",
                selected
                  ? "border-white/30 bg-white/15"
                  : "border-neutral/20 bg-white"
              )}
            >
              {ods.id}
            </span>

            <span className="text-left">{ods.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ================= PÁGINA ================= */

export default function CoordinatorProjectForm() {
  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<FormState>(initialState)

  const canGoStep2 = form.tipo !== null

  const canGoStep3 = useMemo(() => {
    const g = form.gerais

    return Boolean(
      form.tipo &&
        g.titulo.trim() &&
        g.unidade.trim() &&
        g.centro.trim() &&
        g.periodoIni &&
        g.periodoFim &&
        g.editalPesquisa.trim() &&
        g.email.trim() &&
        g.palavrasChave.trim() &&
        g.grandeArea.trim() &&
        g.area.trim() &&
        g.especialidade.trim() &&
        g.linhaPesquisa.trim()
    )
  }, [form])

  const canGoStep4 = useMemo(() => {
    if (!canGoStep3) return false

    if (form.tipo === "interno") {
      const i = form.interno

      if (!i.grupoPesquisa.trim()) return false

      if (i.possuiProtocoloEtica === "Sim") {
        if (!i.comiteEticaNome.trim()) return false
        if (!i.protocoloEtica.trim()) return false
      }

      return true
    }

    if (form.tipo === "externo") {
      const e = form.externo

      return Boolean(
        e.categoriaProjeto.trim() &&
          e.subcategoriaNivelI.trim() &&
          e.subcategoriaNivelII.trim() &&
          e.definicaoPropriedadeIntelectual.trim()
      )
    }

    return false
  }, [form, canGoStep3])

  function stepDone(currentStep: Step) {
    if (currentStep === 1) return canGoStep2
    if (currentStep === 2) return canGoStep3
    if (currentStep === 3) return canGoStep4
    if (currentStep === 4) return submitted

    return false
  }

  function goNext() {
    if (step === 1 && !canGoStep2) return
    if (step === 2 && !canGoStep3) return
    if (step === 3 && !canGoStep4) return

    setStep((current) => (current < 4 ? ((current + 1) as Step) : current))
  }

  function goBack() {
    setStep((current) => (current > 1 ? ((current - 1) as Step) : current))
  }

  async function submit() {
    if (!canGoStep4) return

    setSaving(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      setSubmitted(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to="/coordenador/projetos"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Voltar para projetos
          </Link>
        </div>

        <section className="flex flex-col gap-4 rounded-3xl border border-neutral/30 bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <FileText size={14} />
              Cadastro de projeto
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary">
              Cadastrar projeto
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
              Fluxo guiado em 4 passos. Ao submeter, o projeto entra com status inicial{" "}
              <span className="font-semibold text-primary">SUBMETIDO</span>.
            </p>
          </div>

          <div className="hidden flex-wrap items-center gap-2 md:flex">
            <StepPill active={step === 1} done={stepDone(1)}>
              1. Tipo
            </StepPill>

            <StepPill active={step === 2} done={stepDone(2)}>
              2. Dados gerais
            </StepPill>

            <StepPill active={step === 3} done={stepDone(3)}>
              3. Específico
            </StepPill>

            <StepPill active={step === 4} done={stepDone(4)}>
              4. Revisão
            </StepPill>
          </div>
        </section>

        {step === 1 && (
          <Card
            title="Passo 1 — Tipo de projeto"
            subtitle="Escolha o tipo. Interno e Externo não podem ser misturados no mesmo fluxo."
            icon={<Layers size={18} className="text-primary" />}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, tipo: "interno" }))}
                className={cx(
                  "rounded-2xl border p-6 text-left transition",
                  form.tipo === "interno"
                    ? "border-primary bg-primary/5"
                    : "border-neutral/20 hover:bg-neutral/5"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-primary">Interno</h3>
                  {form.tipo === "interno" && <Check size={18} className="text-primary" />}
                </div>

                <p className="mt-2 text-sm leading-6 text-neutral">
                  Projeto vinculado a estruturas internas, como grupo de pesquisa,
                  unidade e regras institucionais.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, tipo: "externo" }))}
                className={cx(
                  "rounded-2xl border p-6 text-left transition",
                  form.tipo === "externo"
                    ? "border-primary bg-primary/5"
                    : "border-neutral/20 hover:bg-neutral/5"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-primary">Externo</h3>
                  {form.tipo === "externo" && <Check size={18} className="text-primary" />}
                </div>

                <p className="mt-2 text-sm leading-6 text-neutral">
                  Projeto com campos complementares, como propriedade intelectual,
                  categoria e tratamento da produção.
                </p>
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-xs text-neutral">
                {form.tipo ? (
                  <>
                    Tipo selecionado:{" "}
                    <span className="font-semibold text-primary">
                      {form.tipo === "interno" ? "Interno" : "Externo"}
                    </span>
                  </>
                ) : (
                  "Selecione um tipo para continuar."
                )}
              </p>

              <button
                type="button"
                onClick={goNext}
                disabled={!canGoStep2}
                className={cx(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  canGoStep2
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "cursor-not-allowed bg-neutral/10 text-neutral"
                )}
              >
                Próximo
                <ChevronRight size={16} />
              </button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card
            title="Passo 2 — Dados gerais"
            subtitle="Campos comuns aos dois tipos de projeto."
            icon={<FileText size={18} className="text-primary" />}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Tipo do projeto" required>
                <input
                  value={form.tipo ? (form.tipo === "interno" ? "Interno" : "Externo") : ""}
                  readOnly
                  className={disabledInputClassName}
                  placeholder="Selecione no passo 1"
                />
              </Field>

              <Field label="Edital de pesquisa" required>
                <select
                  value={form.gerais.editalPesquisa}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        editalPesquisa: event.target.value,
                      },
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {editais.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Título" required>
                <input
                  value={form.gerais.titulo}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        titulo: event.target.value,
                      },
                    }))
                  }
                  className={inputClassName}
                  placeholder="Título do projeto"
                />
              </Field>

              <Field label="E-mail" required hint="E-mail de contato para o projeto.">
                <input
                  type="email"
                  value={form.gerais.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        email: event.target.value,
                      },
                    }))
                  }
                  className={inputClassName}
                  placeholder="ex.: coordenador@ufpb.br"
                />
              </Field>

              <Field label="Centro" required>
                <select
                  value={form.gerais.centro}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        centro: event.target.value,
                      },
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {centros.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Unidade" required>
                <select
                  value={form.gerais.unidade}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        unidade: event.target.value,
                      },
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {unidades.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Período do projeto"
                required
                hint="Defina início e fim do projeto."
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="date"
                    value={form.gerais.periodoIni}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        gerais: {
                          ...current.gerais,
                          periodoIni: event.target.value,
                        },
                      }))
                    }
                    className={inputClassName}
                  />

                  <input
                    type="date"
                    value={form.gerais.periodoFim}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        gerais: {
                          ...current.gerais,
                          periodoFim: event.target.value,
                        },
                      }))
                    }
                    className={inputClassName}
                  />
                </div>
              </Field>

              <Field label="Termo" hint="Caso aplicável ao edital/projeto.">
                <select
                  value={form.gerais.termo}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        termo: event.target.value,
                      },
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {termos.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Palavras-chave"
                required
                hint="Separe por vírgula ou ponto e vírgula."
              >
                <input
                  value={form.gerais.palavrasChave}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        palavrasChave: event.target.value,
                      },
                    }))
                  }
                  className={inputClassName}
                  placeholder="ex.: visão computacional, TinyML, sustentabilidade"
                />
              </Field>

              <Field label="Área de conhecimento">
                <select
                  value={form.gerais.areaConhecimento}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        areaConhecimento: event.target.value,
                      },
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {areaConhecimentoOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Grande área" required>
                <select
                  value={form.gerais.grandeArea}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        grandeArea: event.target.value,
                      },
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {grandeAreas.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Área" required>
                <select
                  value={form.gerais.area}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        area: event.target.value,
                      },
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {areas.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Subárea">
                <select
                  value={form.gerais.subarea}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        subarea: event.target.value,
                      },
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {subareas.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Especialidade" required>
                <select
                  value={form.gerais.especialidade}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        especialidade: event.target.value,
                      },
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {especialidades.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Linha de pesquisa" required>
                <select
                  value={form.gerais.linhaPesquisa}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        linhaPesquisa: event.target.value,
                      },
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {linhas.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-6">
              <Field label="Objetivos do Desenvolvimento Sustentável">
                <OdsPicker
                  value={form.gerais.objetivosDS}
                  onChange={(objetivosDS) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        objetivosDS,
                      },
                    }))
                  }
                />
              </Field>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={!canGoStep3}
                className={cx(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  canGoStep3
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "cursor-not-allowed bg-neutral/10 text-neutral"
                )}
              >
                Próximo
                <ChevronRight size={16} />
              </button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card
            title="Passo 3 — Dados específicos"
            subtitle={
              form.tipo === "interno"
                ? "Campos adicionais para projeto Interno."
                : "Campos adicionais para projeto Externo."
            }
            icon={<ClipboardCheck size={18} className="text-primary" />}
          >
            {form.tipo === "interno" && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  label="Este projeto está vinculado a algum grupo de pesquisa?"
                  required
                >
                  <div className="flex gap-4">
                    {(["Sim", "Não"] as const).map((item) => (
                      <label key={item} className="inline-flex items-center gap-2 text-sm text-primary">
                        <input
                          type="radio"
                          checked={form.interno.vinculadoGrupo === item}
                          onChange={() =>
                            setForm((current) => ({
                              ...current,
                              interno: {
                                ...current.interno,
                                vinculadoGrupo: item,
                              },
                            }))
                          }
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </Field>

                <Field label="Grupo de pesquisa" required>
                  <select
                    value={form.interno.grupoPesquisa}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        interno: {
                          ...current.interno,
                          grupoPesquisa: event.target.value,
                        },
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {grupos.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Possui protocolo de pesquisa em Comitê de Ética?"
                  required
                >
                  <div className="flex gap-4">
                    {(["Sim", "Não"] as const).map((item) => (
                      <label key={item} className="inline-flex items-center gap-2 text-sm text-primary">
                        <input
                          type="radio"
                          checked={form.interno.possuiProtocoloEtica === item}
                          onChange={() =>
                            setForm((current) => ({
                              ...current,
                              interno: {
                                ...current.interno,
                                possuiProtocoloEtica: item,
                                comiteEticaNome:
                                  item === "Não"
                                    ? ""
                                    : current.interno.comiteEticaNome,
                                protocoloEtica:
                                  item === "Não"
                                    ? ""
                                    : current.interno.protocoloEtica,
                              },
                            }))
                          }
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </Field>

                <Field
                  label="Comitê de Ética"
                  required={form.interno.possuiProtocoloEtica === "Sim"}
                  hint={
                    form.interno.possuiProtocoloEtica === "Sim"
                      ? "Obrigatório quando possui protocolo."
                      : "Desabilitado quando não possui protocolo."
                  }
                >
                  <input
                    value={form.interno.comiteEticaNome}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        interno: {
                          ...current.interno,
                          comiteEticaNome: event.target.value,
                        },
                      }))
                    }
                    disabled={form.interno.possuiProtocoloEtica !== "Sim"}
                    className={cx(
                      inputClassName,
                      form.interno.possuiProtocoloEtica !== "Sim" &&
                        "cursor-not-allowed bg-neutral/5 text-neutral"
                    )}
                    placeholder="ex.: CEP/HULW, CEP/UFPB"
                  />
                </Field>

                <Field
                  label="Nº do protocolo"
                  required={form.interno.possuiProtocoloEtica === "Sim"}
                  hint={
                    form.interno.possuiProtocoloEtica === "Sim"
                      ? "Obrigatório quando possui protocolo."
                      : "Desabilitado quando não possui protocolo."
                  }
                >
                  <input
                    value={form.interno.protocoloEtica}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        interno: {
                          ...current.interno,
                          protocoloEtica: event.target.value,
                        },
                      }))
                    }
                    disabled={form.interno.possuiProtocoloEtica !== "Sim"}
                    className={cx(
                      inputClassName,
                      form.interno.possuiProtocoloEtica !== "Sim" &&
                        "cursor-not-allowed bg-neutral/5 text-neutral"
                    )}
                    placeholder="ex.: 1234567"
                  />
                </Field>
              </div>
            )}

            {form.tipo === "externo" && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Categoria do projeto" required>
                  <select
                    value={form.externo.categoriaProjeto}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        externo: {
                          ...current.externo,
                          categoriaProjeto: event.target.value,
                        },
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {categoriasProjeto.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Subcategoria Nível I" required>
                  <select
                    value={form.externo.subcategoriaNivelI}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        externo: {
                          ...current.externo,
                          subcategoriaNivelI: event.target.value,
                        },
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {subcatNivelI.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Subcategoria Nível II" required>
                  <select
                    value={form.externo.subcategoriaNivelII}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        externo: {
                          ...current.externo,
                          subcategoriaNivelII: event.target.value,
                        },
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {subcatNivelII.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Definição da propriedade intelectual" required>
                  <select
                    value={form.externo.definicaoPropriedadeIntelectual}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        externo: {
                          ...current.externo,
                          definicaoPropriedadeIntelectual: event.target.value,
                        },
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {definicoesPI.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="md:col-span-2">
                  <Field
                    label="Tratamento da produção intelectual do projeto"
                    hint="Campo de texto para regras ou observações."
                  >
                    <textarea
                      value={form.externo.tratamentoProducao}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          externo: {
                            ...current.externo,
                            tratamentoProducao: event.target.value,
                          },
                        }))
                      }
                      className={textareaClassName}
                      placeholder="Descreva como a produção intelectual será tratada."
                    />
                  </Field>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={!canGoStep4}
                className={cx(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  canGoStep4
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "cursor-not-allowed bg-neutral/10 text-neutral"
                )}
              >
                Próximo
                <ChevronRight size={16} />
              </button>
            </div>
          </Card>
        )}

        {step === 4 && (
          <Card
            title="Passo 4 — Revisão e submissão"
            subtitle="Revise todos os dados antes de submeter. Status inicial será SUBMETIDO."
            icon={<Save size={18} className="text-primary" />}
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-neutral/20 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
                  <FileText size={16} />
                  Dados gerais
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Info label="Tipo" value={form.tipo || "—"} />
                  <Info label="Edital" value={form.gerais.editalPesquisa || "—"} />

                  <div className="sm:col-span-2">
                    <Info label="Título" value={form.gerais.titulo || "—"} />
                  </div>

                  <Info label="E-mail" value={form.gerais.email || "—"} />
                  <Info label="Termo" value={form.gerais.termo || "—"} />
                  <Info label="Centro" value={form.gerais.centro || "—"} />
                  <Info label="Unidade" value={form.gerais.unidade || "—"} />

                  <div className="sm:col-span-2">
                    <Info
                      label="Período"
                      value={`${form.gerais.periodoIni || "—"} → ${
                        form.gerais.periodoFim || "—"
                      }`}
                    />
                  </div>

                  <Info
                    label="Área de conhecimento"
                    value={form.gerais.areaConhecimento || "—"}
                  />

                  <Info
                    label="Linha de pesquisa"
                    value={form.gerais.linhaPesquisa || "—"}
                  />

                  <Info
                    label="Grande área"
                    value={form.gerais.grandeArea || "—"}
                  />

                  <Info
                    label="Área / Subárea"
                    value={`${form.gerais.area || "—"}${
                      form.gerais.subarea ? ` • ${form.gerais.subarea}` : ""
                    }`}
                  />

                  <Info
                    label="Especialidade"
                    value={form.gerais.especialidade || "—"}
                  />
                </div>

                <div className="mt-4">
                  <p className="flex items-center gap-2 text-[11px] font-bold uppercase text-neutral">
                    <Tags size={14} />
                    Palavras-chave
                  </p>

                  <p className="mt-1 text-sm text-neutral">
                    {form.gerais.palavrasChave || "—"}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="flex items-center gap-2 text-[11px] font-bold uppercase text-neutral">
                    <GraduationCap size={14} />
                    ODS
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.gerais.objetivosDS.length === 0 ? (
                      <span className="text-sm text-neutral">—</span>
                    ) : (
                      form.gerais.objetivosDS.map((ods) => (
                        <span
                          key={ods.id}
                          className="inline-flex items-center gap-2 rounded-full bg-neutral/10 px-3 py-1 text-xs font-semibold text-neutral"
                        >
                          <span className="grid h-5 w-5 place-items-center rounded-full border border-neutral/20 bg-white text-[11px]">
                            {ods.id}
                          </span>

                          {ods.label}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral/20 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
                  <Hash size={16} />
                  Dados específicos{" "}
                  {form.tipo ? `(${form.tipo === "interno" ? "Interno" : "Externo"})` : ""}
                </h3>

                {form.tipo === "interno" ? (
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Info
                      label="Vinculado a grupo?"
                      value={form.interno.vinculadoGrupo}
                    />

                    <Info
                      label="Grupo de pesquisa"
                      value={form.interno.grupoPesquisa || "—"}
                    />

                    <Info
                      label="Possui protocolo em comitê?"
                      value={form.interno.possuiProtocoloEtica}
                    />

                    <Info
                      label="Comitê de ética"
                      value={form.interno.comiteEticaNome || "—"}
                    />

                    <div className="sm:col-span-2">
                      <Info
                        label="Nº do protocolo"
                        value={form.interno.protocoloEtica || "—"}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Info
                      label="Categoria"
                      value={form.externo.categoriaProjeto || "—"}
                    />

                    <Info
                      label="Subcategoria Nível I"
                      value={form.externo.subcategoriaNivelI || "—"}
                    />

                    <Info
                      label="Subcategoria Nível II"
                      value={form.externo.subcategoriaNivelII || "—"}
                    />

                    <Info
                      label="Definição de PI"
                      value={form.externo.definicaoPropriedadeIntelectual || "—"}
                    />

                    <div className="sm:col-span-2">
                      <Info
                        label="Tratamento da produção intelectual"
                        value={form.externo.tratamentoProducao || "—"}
                        preWrap
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 rounded-xl border border-neutral/20 bg-neutral/5 p-4">
                  <p className="text-xs font-bold text-primary">Status inicial</p>

                  <p className="mt-1.5 text-sm text-neutral">
                    Ao submeter, o projeto será criado com status{" "}
                    <span className="font-semibold text-primary">SUBMETIDO</span>.
                  </p>
                </div>

                {submitted && (
                  <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="text-sm font-bold text-green-800">
                      Submetido com sucesso!
                    </p>

                    <p className="mt-1 text-xs text-green-800/80">
                      Agora você pode voltar para projetos ou cadastrar outro.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        to="/coordenador/projetos"
                        className="inline-flex items-center gap-2 rounded-xl border border-green-200 px-3 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-100"
                      >
                        Voltar para projetos
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setForm(initialState)
                          setSubmitted(false)
                          setStep(1)
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                      >
                        Cadastrar outro
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={submit}
                disabled={saving || submitted || !canGoStep4}
                className={cx(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  saving || submitted || !canGoStep4
                    ? "cursor-not-allowed bg-neutral/10 text-neutral"
                    : "bg-primary text-white hover:bg-primary/90"
                )}
              >
                {saving
                  ? "Submetendo..."
                  : submitted
                    ? "Submetido"
                    : "Confirmar e submeter"}
              </button>
            </div>
          </Card>
        )}

        <div className="flex justify-center pt-2">
          <Link
            to="/coordenador/projetos"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-neutral/5"
          >
            Cancelar e voltar para projetos
          </Link>
        </div>
      </div>
    </main>
  )
}

function Info({
  label,
  value,
  preWrap,
}: {
  label: string
  value: string
  preWrap?: boolean
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase text-neutral">{label}</p>

      <p
        className={cx(
          "text-sm text-neutral",
          preWrap && "whitespace-pre-wrap"
        )}
      >
        {value}
      </p>
    </div>
  )
}