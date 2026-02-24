// src/pages/admin/projects/ProjectCreateWizard.tsx
import React, { useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Check,
  ChevronLeft,
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

type ODS = { id: number; label: string }

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

// FALTA AJUSTAR 
type ExternalData = {
  categoriaProjeto: string // ADICIONAR
  subcategoriaNivelI: string // ADICIONAR
  subcategoriaNivelII: string // ADICIONAR
  definicaoPropriedadeIntelectual: string // ADICIONAR
  tratamentoProducao: string // já existia (texto)
}

type FormState = {
  tipo: ProjectType | null
  gerais: GeneralData
  interno: InternalData
  externo: ExternalData
}

/* ================= UTIL/UI ================= */

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

function cx(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ")
}

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
    <section className="rounded-2xl border border-neutral-light bg-white shadow-card">
      <div className="px-6 py-4 border-b border-neutral-light flex items-center gap-2">
        {icon}
        <div>
          <h2 className="text-sm font-bold text-primary">{title}</h2>
          {subtitle && <p className="text-xs text-neutral/70 mt-0.5">{subtitle}</p>}
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
      <label className="text-xs font-bold uppercase tracking-wide text-neutral/70">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-neutral/70">{hint}</p>}
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
        "inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold border",
        active
          ? "bg-primary text-white border-primary"
          : done
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-white text-primary border-neutral-light"
      )}
    >
      {done ? <Check size={14} /> : null}
      {children}
    </div>
  )
}

function OdsPicker({ value, onChange }: { value: ODS[]; onChange: (v: ODS[]) => void }) {
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

  const selectedIds = new Set(value.map((o) => o.id))

  const toggle = (o: ODS) => {
    if (selectedIds.has(o.id)) onChange(value.filter((x) => x.id !== o.id))
    else onChange([...value, o])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {odsOptions.map((o) => {
        const on = selectedIds.has(o.id)
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => toggle(o)}
            className={cx(
              "inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold border transition-all",
              on
                ? "bg-primary text-white border-primary"
                : "bg-white text-primary border-neutral-light hover:bg-neutral-light/50"
            )}
          >
            <span
              className={cx(
                "h-5 w-5 rounded-full grid place-items-center text-[11px] border",
                on ? "bg-white/15 border-white/30" : "bg-white border-neutral-light"
              )}
            >
              {o.id}
            </span>
            <span className="text-left">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ================= PÁGINA ================= */

type Step = 1 | 2 | 3 | 4

export default function ProjectCreateWizard() {
  const nav = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<FormState>(initialState)

  // mocks de selects (depois você liga em APIs/parametrizações)
  const centros = ["CCHLA", "CCEN", "CT", "CCS", "CE", "CCTA"]
  const unidades = ["Departamento A", "Departamento B", "Laboratório X", "Programa Y"]

  const editais = ["Edital 01/2026", "Edital 02/2026", "PIBIC 2026", "PROBEX 2026"]
  const termos = ["Termo de Compromisso", "Termo de Sigilo", "Termo de Consentimento (TCLE)", "Outro"]

  const areaConhecimentoOptions = ["Ciência da Computação", "Engenharias", "Saúde", "Humanas", "Linguística/Artes", "Outra"]
  const grandeAreas = ["Ciências Exatas", "Ciências Humanas", "Saúde", "Engenharias", "Linguística, Letras e Artes"]
  const areas = ["Visão Computacional", "IA Aplicada", "Processamento de Imagens", "Sistemas Embarcados", "Segurança"]
  const subareas = ["Detecção", "Segmentação", "Classificação", "Otimização", "TinyML"]
  const especialidades = ["Especialidade A", "Especialidade B", "Especialidade C", "Outra"]
  const linhas = ["Linha 01", "Linha 02", "Linha 03"]
  const grupos = ["GP I", "GP II", "GP III", "Outro"]

  // Externo
  const categoriasProjeto = ["Pesquisa (Externo)", "Extensão (Externo)", "Inovação (Externo)", "Ensino (Externo)"]
  const subcatNivelI = ["Subcategoria Nível I — A", "Subcategoria Nível I — B", "Subcategoria Nível I — C"]
  const subcatNivelII = ["Subcategoria Nível II — 1", "Subcategoria Nível II — 2", "Subcategoria Nível II — 3"]
  const definicoesPI = ["Institucional", "Compartilhada", "Privada", "A definir"]

  const canGoStep2 = form.tipo !== null

  const canGoStep3 = useMemo(() => {
    const g = form.gerais

    // mínimos “comuns” 
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
      // Grupo de pesquisa está com * na especificação
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

  const stepDone = (s: Step) => {
    if (s === 1) return canGoStep2
    if (s === 2) return canGoStep3
    if (s === 3) return canGoStep4
    if (s === 4) return submitted
    return false
  }

  const goNext = () => {
    if (step === 1 && !canGoStep2) return
    if (step === 2 && !canGoStep3) return
    if (step === 3 && !canGoStep4) return
    setStep((prev) => (prev < 4 ? ((prev + 1) as Step) : prev))
  }

  const goPrev = () => setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev))

  const submit = async () => {
    if (!canGoStep4) return
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 700))
      setSubmitted(true)
      // nav("/adm/projetos")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Cadastrar Projeto • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Top */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <button
              onClick={() => nav(-1)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-light text-sm font-semibold text-primary hover:bg-neutral-light/50"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>

            <h1 className="mt-3 text-xl font-bold text-primary">Cadastrar Projeto</h1>
            <p className="text-sm text-neutral mt-1">
              Fluxo guiado em 4 passos. Ao submeter, o projeto entra com status inicial{" "}
              <span className="font-semibold">SUBMETIDO</span>.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
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
        </div>

        {/* STEP 1 — Tipo */}
        {step === 1 && (
          <Card
            title="Passo 1 — Tipo de Projeto"
            subtitle="Escolha o tipo. Interno e Externo não podem ser misturados no mesmo fluxo."
            icon={<Layers size={18} className="text-primary" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setForm((s) => ({ ...s, tipo: "interno" }))}
                className={cx(
                  "rounded-2xl border p-6 text-left transition-all",
                  form.tipo === "interno"
                    ? "border-primary bg-primary/5"
                    : "border-neutral-light hover:bg-neutral-light/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-primary">Interno</h3>
                  {form.tipo === "interno" && <Check size={18} className="text-primary" />}
                </div>
                <p className="text-sm text-neutral mt-2">
                  Projetos vinculados a estruturas internas (grupo, unidade, regras institucionais).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setForm((s) => ({ ...s, tipo: "externo" }))}
                className={cx(
                  "rounded-2xl border p-6 text-left transition-all",
                  form.tipo === "externo"
                    ? "border-primary bg-primary/5"
                    : "border-neutral-light hover:bg-neutral-light/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-primary">Externo</h3>
                  {form.tipo === "externo" && <Check size={18} className="text-primary" />}
                </div>
                <p className="text-sm text-neutral mt-2">
                  Projetos com regras e campos complementares (PI, tratamento de produção etc.).
                </p>
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-xs text-neutral/70">
                {form.tipo ? (
                  <>
                    Tipo selecionado: <span className="font-semibold text-neutral">{form.tipo}</span>
                  </>
                ) : (
                  "Selecione um tipo para continuar."
                )}
              </div>

              <button
                type="button"
                onClick={goNext}
                disabled={!canGoStep2}
                className={cx(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold",
                  canGoStep2
                    ? "bg-primary text-white hover:opacity-95"
                    : "bg-neutral-light text-neutral cursor-not-allowed"
                )}
              >
                Próximo
                <ChevronRight size={16} />
              </button>
            </div>
          </Card>
        )}

        {/* STEP 2 — Dados gerais */}
        {step === 2 && (
          <Card
            title="Passo 2 — Dados Gerais"
            subtitle="Campos comuns aos dois tipos de projeto."
            icon={<FileText size={18} className="text-primary" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Tipo do projeto" required>
                <input
                  value={form.tipo ? (form.tipo === "interno" ? "Interno" : "Externo") : ""}
                  readOnly
                  className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-neutral-light/40 text-neutral focus:outline-none"
                  placeholder="Selecione no passo 1"
                />
              </Field>

              <Field label="Edital de Pesquisa" required>
                <select
                  value={form.gerais.editalPesquisa}
                  onChange={(e) => setForm((s) => ({ ...s, gerais: { ...s.gerais, editalPesquisa: e.target.value } }))}
                  className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="">Selecione</option>
                  {editais.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Título" required>
                <input
                  value={form.gerais.titulo}
                  onChange={(e) => setForm((s) => ({ ...s, gerais: { ...s.gerais, titulo: e.target.value } }))}
                  className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  placeholder="Título do projeto…"
                />
              </Field>

              <Field label="E-mail" required hint="E-mail de contato para o projeto.">
                <input
                  type="email"
                  value={form.gerais.email}
                  onChange={(e) => setForm((s) => ({ ...s, gerais: { ...s.gerais, email: e.target.value } }))}
                  className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  placeholder="ex.: coordenador@ufpb.br"
                />
              </Field>

              <Field label="Centro" required>
                <select
                  value={form.gerais.centro}
                  onChange={(e) => setForm((s) => ({ ...s, gerais: { ...s.gerais, centro: e.target.value } }))}
                  className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="">Selecione</option>
                  {centros.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Unidade" required>
                <select
                  value={form.gerais.unidade}
                  onChange={(e) => setForm((s) => ({ ...s, gerais: { ...s.gerais, unidade: e.target.value } }))}
                  className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="">Selecione</option>
                  {unidades.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Período do Projeto" required hint="Defina início e fim do projeto.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={form.gerais.periodoIni}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, gerais: { ...s.gerais, periodoIni: e.target.value } }))
                    }
                    className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                  <input
                    type="date"
                    value={form.gerais.periodoFim}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, gerais: { ...s.gerais, periodoFim: e.target.value } }))
                    }
                    className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </Field>

              <Field label="Termo" hint="Caso aplicável ao edital/projeto.">
                <select
                  value={form.gerais.termo}
                  onChange={(e) => setForm((s) => ({ ...s, gerais: { ...s.gerais, termo: e.target.value } }))}
                  className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="">Selecione</option>
                  {termos.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Palavras-Chave" required hint="Separe por vírgula ou ponto e vírgula.">
                <input
                  value={form.gerais.palavrasChave}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, gerais: { ...s.gerais, palavrasChave: e.target.value } }))
                  }
                  className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  placeholder="ex.: visão computacional, TinyML, sustentabilidade"
                />
              </Field>

              <Field label="Área de Conhecimento">
                <select
                  value={form.gerais.areaConhecimento}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, gerais: { ...s.gerais, areaConhecimento: e.target.value } }))
                  }
                  className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="">Selecione</option>
                  {areaConhecimentoOptions.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Grande Área" required>
                <select
                  value={form.gerais.grandeArea}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, gerais: { ...s.gerais, grandeArea: e.target.value } }))
                  }
                  className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="">Selecione</option>
                  {grandeAreas.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Área" required>
                <select
                  value={form.gerais.area}
                  onChange={(e) => setForm((s) => ({ ...s, gerais: { ...s.gerais, area: e.target.value } }))}
                  className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="">Selecione</option>
                  {areas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Subárea">
                <select
                  value={form.gerais.subarea}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, gerais: { ...s.gerais, subarea: e.target.value } }))
                  }
                  className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="">Selecione</option>
                  {subareas.map((sba) => (
                    <option key={sba} value={sba}>
                      {sba}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Especialidade" required>
                <select
                  value={form.gerais.especialidade}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, gerais: { ...s.gerais, especialidade: e.target.value } }))
                  }
                  className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="">Selecione</option>
                  {especialidades.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Linha de Pesquisa" required>
                <select
                  value={form.gerais.linhaPesquisa}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, gerais: { ...s.gerais, linhaPesquisa: e.target.value } }))
                  }
                  className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="">Selecione</option>
                  {linhas.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-6">
              <Field label="Objetivos do Desenvolvimento Sustentável (seleção)">
                <OdsPicker
                  value={form.gerais.objetivosDS}
                  onChange={(objetivosDS) => setForm((s) => ({ ...s, gerais: { ...s.gerais, objetivosDS } }))}
                />
              </Field>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-light text-sm font-semibold text-primary hover:bg-neutral-light/50"
              >
                <ChevronLeft size={16} />
                Voltar
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={!canGoStep3}
                className={cx(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold",
                  canGoStep3
                    ? "bg-primary text-white hover:opacity-95"
                    : "bg-neutral-light text-neutral cursor-not-allowed"
                )}
              >
                Próximo
                <ChevronRight size={16} />
              </button>
            </div>
          </Card>
        )}

        {/* STEP 3 — Específicos */}
        {step === 3 && (
          <Card
            title="Passo 3 — Dados Específicos"
            subtitle={form.tipo === "interno" ? "Campos adicionais para projeto Interno." : "Campos adicionais para projeto Externo."}
            icon={<ClipboardCheck size={18} className="text-primary" />}
          >
            {/* Interno */}
            {form.tipo === "interno" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Este projeto está vinculado a algum grupo de pesquisa?" required>
                  <div className="flex gap-4">
                    {(["Sim", "Não"] as const).map((v) => (
                      <label key={v} className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          checked={form.interno.vinculadoGrupo === v}
                          onChange={() => setForm((s) => ({ ...s, interno: { ...s.interno, vinculadoGrupo: v } }))}
                        />
                        {v}
                      </label>
                    ))}
                  </div>
                </Field>

                <Field label="Grupo de Pesquisa" required>
                  <select
                    value={form.interno.grupoPesquisa}
                    onChange={(e) => setForm((s) => ({ ...s, interno: { ...s.interno, grupoPesquisa: e.target.value } }))}
                    className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="">Selecione</option>
                    {grupos.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Possui protocolo de pesquisa em Comitê de Ética?" required>
                  <div className="flex gap-4">
                    {(["Sim", "Não"] as const).map((v) => (
                      <label key={v} className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          checked={form.interno.possuiProtocoloEtica === v}
                          onChange={() =>
                            setForm((s) => ({
                              ...s,
                              interno: {
                                ...s.interno,
                                possuiProtocoloEtica: v,
                                ...(v === "Não"
                                  ? { comiteEticaNome: "", protocoloEtica: "" }
                                  : null),
                              },
                            }))
                          }
                        />
                        {v}
                      </label>
                    ))}
                  </div>
                </Field>

                <Field
                  label="Comitê de Ética"
                  required={form.interno.possuiProtocoloEtica === "Sim"}
                  hint={form.interno.possuiProtocoloEtica === "Sim" ? "Obrigatório quando possui protocolo = Sim." : "Desabilitado quando não possui protocolo."}
                >
                  <input
                    value={form.interno.comiteEticaNome}
                    onChange={(e) => setForm((s) => ({ ...s, interno: { ...s.interno, comiteEticaNome: e.target.value } }))}
                    disabled={form.interno.possuiProtocoloEtica !== "Sim"}
                    className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm disabled:bg-neutral-light/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
                    placeholder="ex.: CEP/HULW, CEP/UFPB…"
                  />
                </Field>

                <Field
                  label="Nº do Protocolo"
                  required={form.interno.possuiProtocoloEtica === "Sim"}
                  hint={form.interno.possuiProtocoloEtica === "Sim" ? "Obrigatório quando possui protocolo = Sim." : "Desabilitado quando não possui protocolo."}
                >
                  <input
                    value={form.interno.protocoloEtica}
                    onChange={(e) => setForm((s) => ({ ...s, interno: { ...s.interno, protocoloEtica: e.target.value } }))}
                    disabled={form.interno.possuiProtocoloEtica !== "Sim"}
                    className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm disabled:bg-neutral-light/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
                    placeholder="ex.: 1234567"
                  />
                </Field>
              </div>
            )}

            {/* Externo */}
            {form.tipo === "externo" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Categoria do Projeto (externo)" required>
                  <select
                    value={form.externo.categoriaProjeto}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, externo: { ...s.externo, categoriaProjeto: e.target.value } }))
                    }
                    className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="">Selecione</option>
                    {categoriasProjeto.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Subcategoria Nível I (externo)" required>
                  <select
                    value={form.externo.subcategoriaNivelI}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, externo: { ...s.externo, subcategoriaNivelI: e.target.value } }))
                    }
                    className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="">Selecione</option>
                    {subcatNivelI.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Subcategoria Nível II (externo)" required>
                  <select
                    value={form.externo.subcategoriaNivelII}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, externo: { ...s.externo, subcategoriaNivelII: e.target.value } }))
                    }
                    className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="">Selecione</option>
                    {subcatNivelII.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Definição da Propriedade Intelectual" required>
                  <select
                    value={form.externo.definicaoPropriedadeIntelectual}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        externo: { ...s.externo, definicaoPropriedadeIntelectual: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="">Selecione</option>
                    {definicoesPI.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="md:col-span-2">
                  <Field
                    label="Tratamento da produção intelectual do projeto"
                    hint="Campo de texto para regras/observações."
                    required={false}
                  >
                    <textarea
                      value={form.externo.tratamentoProducao}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, externo: { ...s.externo, tratamentoProducao: e.target.value } }))
                      }
                      className="w-full min-h-[120px] rounded-xl border border-neutral-light px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                      placeholder="Descreva como a produção intelectual será tratada…"
                    />
                  </Field>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-light text-sm font-semibold text-primary hover:bg-neutral-light/50"
              >
                <ChevronLeft size={16} />
                Voltar
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={!canGoStep4}
                className={cx(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold",
                  canGoStep4
                    ? "bg-primary text-white hover:opacity-95"
                    : "bg-neutral-light text-neutral cursor-not-allowed"
                )}
              >
                Próximo
                <ChevronRight size={16} />
              </button>
            </div>
          </Card>
        )}

        {/* STEP 4 — Revisão */}
        {step === 4 && (
          <Card
            title="Passo 4 — Revisão e Submissão"
            subtitle="Revise todos os dados antes de submeter. Status inicial será SUBMETIDO."
            icon={<Save size={18} className="text-primary" />}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-neutral-light p-5">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <FileText size={16} />
                  Dados gerais
                </h3>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase text-neutral/70">Tipo</p>
                    <p className="text-sm text-neutral">{form.tipo || "—"}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase text-neutral/70">Edital</p>
                    <p className="text-sm text-neutral">{form.gerais.editalPesquisa || "—"}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-[11px] font-bold uppercase text-neutral/70">Título</p>
                    <p className="text-sm text-neutral">{form.gerais.titulo || "—"}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase text-neutral/70">E-mail</p>
                    <p className="text-sm text-neutral">{form.gerais.email || "—"}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase text-neutral/70">Termo</p>
                    <p className="text-sm text-neutral">{form.gerais.termo || "—"}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase text-neutral/70">Centro</p>
                    <p className="text-sm text-neutral">{form.gerais.centro || "—"}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase text-neutral/70">Unidade</p>
                    <p className="text-sm text-neutral">{form.gerais.unidade || "—"}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-[11px] font-bold uppercase text-neutral/70">Período</p>
                    <p className="text-sm text-neutral">
                      {form.gerais.periodoIni || "—"} → {form.gerais.periodoFim || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase text-neutral/70">Área de conhecimento</p>
                    <p className="text-sm text-neutral">{form.gerais.areaConhecimento || "—"}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase text-neutral/70">Linha de pesquisa</p>
                    <p className="text-sm text-neutral">{form.gerais.linhaPesquisa || "—"}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase text-neutral/70">Grande área</p>
                    <p className="text-sm text-neutral">{form.gerais.grandeArea || "—"}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase text-neutral/70">Área / Subárea</p>
                    <p className="text-sm text-neutral">
                      {form.gerais.area || "—"}
                      {form.gerais.subarea ? ` • ${form.gerais.subarea}` : ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase text-neutral/70">Especialidade</p>
                    <p className="text-sm text-neutral">{form.gerais.especialidade || "—"}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase text-neutral/70 flex items-center gap-2">
                    <Tags size={14} />
                    Palavras-chave
                  </p>
                  <p className="text-sm text-neutral mt-1">{form.gerais.palavrasChave || "—"}</p>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase text-neutral/70 flex items-center gap-2">
                    <GraduationCap size={14} />
                    ODS
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.gerais.objetivosDS.length === 0 ? (
                      <span className="text-sm text-neutral">—</span>
                    ) : (
                      form.gerais.objetivosDS.map((o) => (
                        <span
                          key={o.id}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-light text-neutral text-xs font-semibold"
                        >
                          <span className="h-5 w-5 rounded-full bg-white border border-neutral-light grid place-items-center text-[11px]">
                            {o.id}
                          </span>
                          {o.label}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-light p-5">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Hash size={16} />
                  Dados específicos ({form.tipo})
                </h3>

                {form.tipo === "interno" ? (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase text-neutral/70">Vinculado a grupo?</p>
                      <p className="text-sm text-neutral">{form.interno.vinculadoGrupo}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase text-neutral/70">Grupo de pesquisa</p>
                      <p className="text-sm text-neutral">{form.interno.grupoPesquisa || "—"}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase text-neutral/70">Possui protocolo em comitê?</p>
                      <p className="text-sm text-neutral">{form.interno.possuiProtocoloEtica}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase text-neutral/70">Comitê de ética</p>
                      <p className="text-sm text-neutral">{form.interno.comiteEticaNome || "—"}</p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-[11px] font-bold uppercase text-neutral/70">Nº do protocolo</p>
                      <p className="text-sm text-neutral">{form.interno.protocoloEtica || "—"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase text-neutral/70">Categoria (externo)</p>
                      <p className="text-sm text-neutral">{form.externo.categoriaProjeto || "—"}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase text-neutral/70">Subcat. Nível I</p>
                      <p className="text-sm text-neutral">{form.externo.subcategoriaNivelI || "—"}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase text-neutral/70">Subcat. Nível II</p>
                      <p className="text-sm text-neutral">{form.externo.subcategoriaNivelII || "—"}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase text-neutral/70">Definição de PI</p>
                      <p className="text-sm text-neutral">{form.externo.definicaoPropriedadeIntelectual || "—"}</p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-[11px] font-bold uppercase text-neutral/70">
                        Tratamento da produção intelectual
                      </p>
                      <p className="text-sm text-neutral whitespace-pre-wrap">
                        {form.externo.tratamentoProducao || "—"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 rounded-xl border border-neutral-light bg-neutral-light/40 p-4">
                  <p className="text-xs font-bold text-primary">Status inicial</p>
                  <p className="text-sm text-neutral mt-1.5">
                    Ao submeter, o projeto será criado com status <span className="font-semibold">SUBMETIDO</span>.
                  </p>
                </div>

                {submitted && (
                  <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="text-sm font-bold text-green-800">Submetido com sucesso!</p>
                    <p className="text-xs text-green-800/80 mt-1">
                      Agora você pode voltar para o hub de projetos ou cadastrar outro.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        to="/adm/projetos"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-green-200 text-sm font-semibold text-green-800 hover:bg-green-100"
                      >
                        Voltar para Projetos
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setForm(initialState)
                          setSubmitted(false)
                          setStep(1)
                        }}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-95"
                      >
                        Cadastrar outro
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-light text-sm font-semibold text-primary hover:bg-neutral-light/50"
              >
                <ChevronLeft size={16} />
                Voltar
              </button>

              <button
                type="button"
                onClick={submit}
                disabled={saving || submitted || !canGoStep4}
                className={cx(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold",
                  saving || submitted || !canGoStep4
                    ? "bg-neutral-light text-neutral cursor-not-allowed"
                    : "bg-primary text-white hover:opacity-95"
                )}
              >
                {saving ? "Submetendo..." : submitted ? "Submetido" : "Confirmar e submeter"}
              </button>
            </div>
          </Card>
        )}

        {/* Mobile steps (rodapé simples) */}
        <div className="md:hidden flex items-center justify-between gap-2">
          <span className="text-xs text-neutral/70">Passo {step} de 4</span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={step === 1}
              className={cx(
                "inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold",
                step === 1
                  ? "border-neutral-light text-neutral/50 cursor-not-allowed"
                  : "border-neutral-light text-primary hover:bg-neutral-light/50"
              )}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={(step === 1 && !canGoStep2) || (step === 2 && !canGoStep3) || (step === 3 && !canGoStep4) || step === 4}
              className={cx(
                "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold",
                step === 4 ? "bg-neutral-light text-neutral cursor-not-allowed" : "bg-primary text-white hover:opacity-95"
              )}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Atalho: cancelar */}
        <div className="text-center">
          <Link to="/adm/projetos" className="text-xs text-neutral/70 underline hover:text-primary">
            Cancelar e voltar para Projetos
          </Link>
        </div>
      </div>
    </div>
  )
}
