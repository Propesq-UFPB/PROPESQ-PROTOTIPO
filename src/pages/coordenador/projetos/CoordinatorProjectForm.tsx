// src/pages/coordenador/projetos/CoordinatorProjectForm.tsx

import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  Copy,
  FileText,
  GraduationCap,
  Hash,
  Layers,
  Plus,
  RefreshCcw,
  Save,
  Tags,
  Trash2,
  Lock,
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

type WorkPlan = {
  id: string
  tipoBolsa: string
  direcionamento: string
  periodoIni: string
  periodoFim: string
  cota: string
  vinculacaoInstitucional: string
  areaConhecimento: string
  introducaoJustificativa: string
  objetivos: string
  metodologia: string
  cronogramaAtividades: string
  referencias: string
  resumoPlano: string
  palavrasChave: string
}

type FormState = {
  tipo: ProjectType | null
  gerais: GeneralData
  interno: InternalData
  externo: ExternalData
  planosTrabalho: WorkPlan[]
}

type Step = 1 | 2 | 3 | 4 | 5

/* ================= ESTADO INICIAL ================= */

const emptyWorkPlan: WorkPlan = {
  id: "",
  tipoBolsa: "",
  direcionamento: "",
  periodoIni: "",
  periodoFim: "",
  cota: "",
  vinculacaoInstitucional: "",
  areaConhecimento: "",
  introducaoJustificativa: "",
  objetivos: "",
  metodologia: "",
  cronogramaAtividades: "",
  referencias: "",
  resumoPlano: "",
  palavrasChave: "",
}

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
  planosTrabalho: [],
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

const tipoBolsaOptions = [
  "PIBIC",
  "PIBITI",
  "PIVIC",
  "PIBIC-AF",
  "PIBIC-EM",
  "Voluntário",
  "Outro",
]

const direcionamentos = [
  "Discente de graduação",
  "Discente de ensino médio",
  "Discente voluntário",
  "Bolsista institucional",
  "Outro",
]

const cotas = ["1", "2", "3", "4", "5", "Mais de 5"]

const vinculacoesInstitucionais = [
  "UFPB",
  "CNPq",
  "FAPESQ",
  "CAPES",
  "Instituição parceira",
  "Outra",
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

// Por enquanto, o cadastro de projeto externo fica preservado no código,
// mas indisponível para seleção no fluxo da tela.
const EXTERNAL_PROJECTS_ENABLED = false

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

function createWorkPlanId() {
  return `plano-${Date.now()}-${Math.random().toString(16).slice(2)}`
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


const cronogramaMeses = [
  "Mês 1",
  "Mês 2",
  "Mês 3",
  "Mês 4",
  "Mês 5",
  "Mês 6",
  "Mês 7",
  "Mês 8",
  "Mês 9",
  "Mês 10",
  "Mês 11",
  "Mês 12",
]

const modeloCronograma6Meses = [
  "Mês 1 — Revisão bibliográfica e alinhamento metodológico",
  "Mês 2 — Definição dos instrumentos, materiais ou procedimentos",
  "Mês 3 — Coleta, organização ou preparação dos dados",
  "Mês 4 — Execução dos experimentos, análises ou atividades principais",
  "Mês 5 — Consolidação dos resultados e discussão parcial",
  "Mês 6 — Elaboração do relatório, revisão final e entrega dos produtos",
]

const modeloCronograma12Meses = [
  "Mês 1 — Revisão bibliográfica inicial e planejamento detalhado",
  "Mês 2 — Aprofundamento teórico e definição dos procedimentos",
  "Mês 3 — Preparação dos instrumentos, bases, materiais ou ambiente",
  "Mês 4 — Coleta ou levantamento inicial de dados",
  "Mês 5 — Organização, limpeza ou categorização dos dados",
  "Mês 6 — Execução da primeira etapa de análise ou experimentação",
  "Mês 7 — Execução da segunda etapa de análise ou experimentação",
  "Mês 8 — Validação, comparação ou refinamento dos resultados",
  "Mês 9 — Consolidação dos achados e discussão preliminar",
  "Mês 10 — Escrita do relatório parcial/final e organização dos produtos",
  "Mês 11 — Revisão, ajustes finais e preparação para apresentação",
  "Mês 12 — Entrega final, socialização dos resultados e encerramento",
]

function splitCronograma(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
}

function CronogramaPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [mes, setMes] = useState("")
  const [atividade, setAtividade] = useState("")

  const linhas = useMemo(() => splitCronograma(value), [value])
  const canAdd = Boolean(mes.trim() && atividade.trim())

  function addLinha() {
    if (!canAdd) return

    const next = [...linhas, `${mes} — ${atividade.trim()}`]
    onChange(next.join("\n"))
    setMes("")
    setAtividade("")
  }

  function removeLinha(index: number) {
    onChange(linhas.filter((_, itemIndex) => itemIndex !== index).join("\n"))
  }

  function applyModelo(modelo: string[]) {
    onChange(modelo.join("\n"))
  }

  return (
    <div className="rounded-2xl border border-neutral/20 bg-neutral/5 p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr_auto]">
        <select
          value={mes}
          onChange={(event) => setMes(event.target.value)}
          className={selectClassName}
        >
          <option value="">Selecione o mês</option>
          {cronogramaMeses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          value={atividade}
          onChange={(event) => setAtividade(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              addLinha()
            }
          }}
          className={inputClassName}
          placeholder="Descreva a atividade prevista para o período"
        />

        <button
          type="button"
          onClick={addLinha}
          disabled={!canAdd}
          className={cx(
            "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            canAdd
              ? "bg-primary text-white hover:bg-primary/90"
              : "cursor-not-allowed bg-neutral/10 text-neutral"
          )}
        >
          <Plus size={16} />
          Adicionar
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => applyModelo(modeloCronograma6Meses)}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30"
        >
          <CalendarDays size={14} />
          Usar modelo 6 meses
        </button>

        <button
          type="button"
          onClick={() => applyModelo(modeloCronograma12Meses)}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30"
        >
          <CalendarDays size={14} />
          Usar modelo 12 meses
        </button>

        <button
          type="button"
          onClick={() => onChange("")}
          disabled={linhas.length === 0}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
            linhas.length === 0
              ? "cursor-not-allowed border-neutral/20 bg-neutral/5 text-neutral"
              : "border-neutral/20 bg-white text-primary hover:border-primary/30"
          )}
        >
          <RefreshCcw size={14} />
          Limpar cronograma
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {linhas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral/30 bg-white p-4 text-center">
            <p className="text-sm font-semibold text-primary">
              Nenhuma atividade adicionada ao cronograma.
            </p>

            <p className="mt-1 text-xs text-neutral">
              Selecione um mês, descreva a atividade e clique em adicionar.
            </p>
          </div>
        ) : (
          linhas.map((linha, index) => (
            <div
              key={`${linha}-${index}`}
              className="flex flex-col gap-3 rounded-xl border border-neutral/20 bg-white p-3 md:flex-row md:items-center md:justify-between"
            >
              <p className="text-sm leading-6 text-neutral">{linha}</p>

              <button
                type="button"
                onClick={() => removeLinha(index)}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
              >
                <Trash2 size={14} />
                Remover
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}


/* ================= PÁGINA ================= */

export default function CoordinatorProjectForm() {
  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<FormState>(initialState)
  const [workPlanDraft, setWorkPlanDraft] = useState<WorkPlan>({
    ...emptyWorkPlan,
    id: createWorkPlanId(),
  })

  const canGoStep2 =
    form.tipo === "interno" ||
    (EXTERNAL_PROJECTS_ENABLED && form.tipo === "externo")

  const canGoStep3 = useMemo(() => {
    const g = form.gerais

    return Boolean(
      canGoStep2 &&
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
  }, [form, canGoStep2])

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

    if (EXTERNAL_PROJECTS_ENABLED && form.tipo === "externo") {
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

  const canAddWorkPlan = useMemo(() => {
    return Boolean(
      workPlanDraft.tipoBolsa.trim() &&
        workPlanDraft.direcionamento.trim() &&
        workPlanDraft.periodoIni &&
        workPlanDraft.periodoFim &&
        workPlanDraft.cota.trim() &&
        workPlanDraft.vinculacaoInstitucional.trim() &&
        workPlanDraft.areaConhecimento.trim() &&
        workPlanDraft.introducaoJustificativa.trim() &&
        workPlanDraft.objetivos.trim() &&
        workPlanDraft.metodologia.trim() &&
        workPlanDraft.cronogramaAtividades.trim() &&
        workPlanDraft.referencias.trim() &&
        workPlanDraft.resumoPlano.trim() &&
        workPlanDraft.palavrasChave.trim()
    )
  }, [workPlanDraft])

  const canGoStep5 = canGoStep4 && form.planosTrabalho.length > 0

  function stepDone(currentStep: Step) {
    if (currentStep === 1) return canGoStep2
    if (currentStep === 2) return canGoStep3
    if (currentStep === 3) return canGoStep4
    if (currentStep === 4) return canGoStep5
    if (currentStep === 5) return submitted

    return false
  }

  function goNext() {
    if (step === 1 && !canGoStep2) return
    if (step === 2 && !canGoStep3) return
    if (step === 3 && !canGoStep4) return
    if (step === 4 && !canGoStep5) return

    setStep((current) => (current < 5 ? ((current + 1) as Step) : current))
  }

  function goBack() {
    setStep((current) => (current > 1 ? ((current - 1) as Step) : current))
  }

  function resetWorkPlanDraft() {
    setWorkPlanDraft({
      ...emptyWorkPlan,
      id: createWorkPlanId(),
    })
  }

  function addWorkPlan() {
    if (!canAddWorkPlan) return

    setForm((current) => ({
      ...current,
      planosTrabalho: [
        ...current.planosTrabalho,
        {
          ...workPlanDraft,
          id: workPlanDraft.id || createWorkPlanId(),
        },
      ],
    }))

    resetWorkPlanDraft()
  }

  function removeWorkPlan(id: string) {
    setForm((current) => ({
      ...current,
      planosTrabalho: current.planosTrabalho.filter((plano) => plano.id !== id),
    }))
  }

  function duplicateLastWorkPlan() {
    const lastPlan = form.planosTrabalho[form.planosTrabalho.length - 1]
    if (!lastPlan) return

    setWorkPlanDraft({
      ...lastPlan,
      id: createWorkPlanId(),
    })
  }

  async function submit() {
    if (!canGoStep5) return

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
              Ao submeter, o projeto entra com status inicial{" "}
              <span className="font-semibold text-primary">SUBMETIDO</span>
            </p>
          </div>

          <div className="hidden flex-wrap items-center gap-2 md:flex ">
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
              4. Plano de trabalho
            </StepPill>

            <StepPill active={step === 5} done={stepDone(5)}>
              5. Revisão
            </StepPill>
          </div>
        </section>

        {step === 1 && (
          <Card
            title="Passo 1 — Tipo de projeto"
            subtitle="Escolha o tipo disponível para iniciar o fluxo."
            icon={<Layers size={18} className="text-primary" />}
          >
            {!EXTERNAL_PROJECTS_ENABLED && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />

                <div>
                  <p className="text-sm font-bold">
                    Cadastro de projeto externo temporariamente desativado
                  </p>
                </div>
              </div>
            )}

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
                disabled={!EXTERNAL_PROJECTS_ENABLED}
                onClick={() => {
                  if (!EXTERNAL_PROJECTS_ENABLED) return

                  setForm((current) => ({ ...current, tipo: "externo" }))
                }}
                className={cx(
                  "rounded-2xl border p-6 text-left transition",
                  !EXTERNAL_PROJECTS_ENABLED
                    ? "cursor-not-allowed border-neutral/20 bg-neutral/5 opacity-70"
                    : form.tipo === "externo"
                      ? "border-primary bg-primary/5"
                      : "border-neutral/20 hover:bg-neutral/5"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className={cx(
                      "text-base font-bold",
                      EXTERNAL_PROJECTS_ENABLED ? "text-primary" : "text-neutral"
                    )}
                  >
                    Externo
                  </h3>

                  {EXTERNAL_PROJECTS_ENABLED && form.tipo === "externo" ? (
                    <Check size={18} className="text-primary" />
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral/20 bg-white px-2.5 py-1 text-[11px] font-bold text-neutral">
                      <Lock size={12} />
                      Desativado
                    </span>
                  )}
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
                      : "Desabilitado obrigatoriedade quando não possui protocolo."
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
                      : "Desabilitado obrigatoriedade quando não possui protocolo."
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
            title="Passo 4 — Plano de trabalho"
            subtitle="Cadastre pelo menos 1 plano de trabalho vinculado ao projeto para liberar a revisão."
            icon={<BookOpen size={18} className="text-primary" />}
          >

            <div className="rounded-2xl border border-neutral/20 p-5">
              <div className="flex flex-col gap-3 border-b border-neutral/20 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-primary">
                    Novo plano de trabalho
                  </h3>

                  <p className="mt-1 text-xs text-neutral">
                    Preencha todos os campos obrigatórios e clique em adicionar.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={duplicateLastWorkPlan}
                    disabled={form.planosTrabalho.length === 0}
                    className={cx(
                      "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
                      form.planosTrabalho.length === 0
                        ? "cursor-not-allowed border-neutral/20 bg-neutral/5 text-neutral"
                        : "border-neutral/20 bg-white text-primary hover:border-primary/30"
                    )}
                  >
                    <Copy size={14} />
                    Duplicar último
                  </button>

                  <button
                    type="button"
                    onClick={resetWorkPlanDraft}
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30"
                  >
                    <RefreshCcw size={14} />
                    Limpar
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Tipo de Bolsa" required>
                  <select
                    value={workPlanDraft.tipoBolsa}
                    onChange={(event) =>
                      setWorkPlanDraft((current) => ({
                        ...current,
                        tipoBolsa: event.target.value,
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {tipoBolsaOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Direcionamento" required>
                  <select
                    value={workPlanDraft.direcionamento}
                    onChange={(event) =>
                      setWorkPlanDraft((current) => ({
                        ...current,
                        direcionamento: event.target.value,
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {direcionamentos.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Período" required hint="Defina início e fim do plano.">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="date"
                      value={workPlanDraft.periodoIni}
                      onChange={(event) =>
                        setWorkPlanDraft((current) => ({
                          ...current,
                          periodoIni: event.target.value,
                        }))
                      }
                      className={inputClassName}
                    />

                    <input
                      type="date"
                      value={workPlanDraft.periodoFim}
                      onChange={(event) =>
                        setWorkPlanDraft((current) => ({
                          ...current,
                          periodoFim: event.target.value,
                        }))
                      }
                      className={inputClassName}
                    />
                  </div>
                </Field>

                <Field label="Cota" required>
                  <select
                    value={workPlanDraft.cota}
                    onChange={(event) =>
                      setWorkPlanDraft((current) => ({
                        ...current,
                        cota: event.target.value,
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {cotas.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Vinculação institucional" required>
                  <select
                    value={workPlanDraft.vinculacaoInstitucional}
                    onChange={(event) =>
                      setWorkPlanDraft((current) => ({
                        ...current,
                        vinculacaoInstitucional: event.target.value,
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {vinculacoesInstitucionais.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Área de conhecimento" required>
                  <select
                    value={workPlanDraft.areaConhecimento}
                    onChange={(event) =>
                      setWorkPlanDraft((current) => ({
                        ...current,
                        areaConhecimento: event.target.value,
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

                <div className="md:col-span-2">
                  <Field label="Introdução e justificativa" required>
                    <textarea
                      value={workPlanDraft.introducaoJustificativa}
                      onChange={(event) =>
                        setWorkPlanDraft((current) => ({
                          ...current,
                          introducaoJustificativa: event.target.value,
                        }))
                      }
                      className={textareaClassName}
                      placeholder="Apresente o contexto do plano e a justificativa da atividade."
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Objetivos" required>
                    <textarea
                      value={workPlanDraft.objetivos}
                      onChange={(event) =>
                        setWorkPlanDraft((current) => ({
                          ...current,
                          objetivos: event.target.value,
                        }))
                      }
                      className={textareaClassName}
                      placeholder="Informe os objetivos gerais e específicos do plano."
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Metodologia" required>
                    <textarea
                      value={workPlanDraft.metodologia}
                      onChange={(event) =>
                        setWorkPlanDraft((current) => ({
                          ...current,
                          metodologia: event.target.value,
                        }))
                      }
                      className={textareaClassName}
                      placeholder="Descreva os procedimentos, métodos e etapas de execução."
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field
                    label="Cronograma de atividades"
                    required
                    hint="Monte o cronograma por mês/período. Você pode adicionar linhas manualmente ou usar um modelo rápido."
                  >
                    <CronogramaPicker
                      value={workPlanDraft.cronogramaAtividades}
                      onChange={(cronogramaAtividades) =>
                        setWorkPlanDraft((current) => ({
                          ...current,
                          cronogramaAtividades,
                        }))
                      }
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Referências" required>
                    <textarea
                      value={workPlanDraft.referencias}
                      onChange={(event) =>
                        setWorkPlanDraft((current) => ({
                          ...current,
                          referencias: event.target.value,
                        }))
                      }
                      className={textareaClassName}
                      placeholder="Informe as referências bibliográficas do plano."
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Resumo do plano" required>
                    <textarea
                      value={workPlanDraft.resumoPlano}
                      onChange={(event) =>
                        setWorkPlanDraft((current) => ({
                          ...current,
                          resumoPlano: event.target.value,
                        }))
                      }
                      className={textareaClassName}
                      placeholder="Resumo objetivo do plano de trabalho."
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field
                    label="Palavras-chave"
                    required
                    hint="Separe por vírgula ou ponto e vírgula."
                  >
                    <input
                      value={workPlanDraft.palavrasChave}
                      onChange={(event) =>
                        setWorkPlanDraft((current) => ({
                          ...current,
                          palavrasChave: event.target.value,
                        }))
                      }
                      className={inputClassName}
                      placeholder="ex.: IA, educação, acessibilidade"
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={addWorkPlan}
                  disabled={!canAddWorkPlan}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                    canAddWorkPlan
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "cursor-not-allowed bg-neutral/10 text-neutral"
                  )}
                >
                  <Plus size={16} />
                  Adicionar plano de trabalho
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-neutral/20 p-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-primary">
                    Planos vinculados
                  </h3>

                  <p className="mt-1 text-xs text-neutral">
                    Total cadastrado:{" "}
                    <span className="font-semibold text-primary">
                      {form.planosTrabalho.length}
                    </span>
                  </p>
                </div>

                <span
                  className={cx(
                    "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold",
                    form.planosTrabalho.length > 0
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  )}
                >
                  {form.planosTrabalho.length > 0
                    ? "Regra atendida"
                    : "Obrigatório adicionar 1 plano"}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {form.planosTrabalho.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-neutral/30 bg-neutral/5 p-5 text-center">
                    <p className="text-sm font-semibold text-primary">
                      Nenhum plano de trabalho cadastrado.
                    </p>

                    <p className="mt-1 text-xs text-neutral">
                      Preencha o formulário acima e clique em adicionar para
                      liberar a revisão do projeto.
                    </p>
                  </div>
                ) : (
                  form.planosTrabalho.map((plano, index) => (
                    <div
                      key={plano.id}
                      className="rounded-xl border border-neutral/20 bg-white p-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm font-bold text-primary">
                            Plano de trabalho {index + 1}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral">
                            <span className="inline-flex items-center gap-1 rounded-full bg-neutral/10 px-2 py-1">
                              <BookOpen size={12} />
                              {plano.tipoBolsa}
                            </span>

                            <span className="inline-flex items-center gap-1 rounded-full bg-neutral/10 px-2 py-1">
                              <CalendarDays size={12} />
                              {plano.periodoIni} → {plano.periodoFim}
                            </span>

                            <span className="inline-flex items-center gap-1 rounded-full bg-neutral/10 px-2 py-1">
                              <Hash size={12} />
                              Cota: {plano.cota}
                            </span>
                          </div>

                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral">
                            {plano.resumoPlano}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeWorkPlan(plano.id)}
                          className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          <Trash2 size={14} />
                          Remover
                        </button>
                      </div>
                    </div>
                  ))
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
                onClick={goNext}
                disabled={!canGoStep5}
                className={cx(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  canGoStep5
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

        {step === 5 && (
          <Card
            title="Passo 5 — Revisão e submissão"
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
                          resetWorkPlanDraft()
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

            <div className="mt-6 rounded-2xl border border-neutral/20 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
                <BookOpen size={16} />
                Planos de trabalho vinculados ({form.planosTrabalho.length})
              </h3>

              <div className="mt-4 space-y-4">
                {form.planosTrabalho.map((plano, index) => (
                  <div
                    key={plano.id}
                    className="rounded-xl border border-neutral/20 bg-neutral/5 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-bold text-primary">
                          Plano de trabalho {index + 1}
                        </p>

                        <p className="mt-1 text-xs text-neutral">
                          {plano.tipoBolsa} • {plano.direcionamento} • Cota{" "}
                          {plano.cota}
                        </p>
                      </div>

                      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                        Vinculado
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Info
                        label="Período"
                        value={`${plano.periodoIni} → ${plano.periodoFim}`}
                      />

                      <Info
                        label="Vinculação institucional"
                        value={plano.vinculacaoInstitucional}
                      />

                      <Info
                        label="Área de conhecimento"
                        value={plano.areaConhecimento}
                      />

                      <Info
                        label="Palavras-chave"
                        value={plano.palavrasChave}
                      />

                      <div className="sm:col-span-2">
                        <Info
                          label="Resumo do plano"
                          value={plano.resumoPlano}
                          preWrap
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <Info
                          label="Cronograma de atividades"
                          value={plano.cronogramaAtividades}
                          preWrap
                        />
                      </div>

                    </div>
                  </div>
                ))}
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
                disabled={saving || submitted || !canGoStep5}
                className={cx(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  saving || submitted || !canGoStep5
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
