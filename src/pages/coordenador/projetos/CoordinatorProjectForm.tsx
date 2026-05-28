// src/pages/coordenador/projetos/CoordinatorProjectForm.tsx

import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  FileText,
  FileUp,
  GraduationCap,
  Hash,
  Layers,
  Lock,
  Plus,
  RefreshCcw,
  Save,
  Tags,
  Trash2,
  Upload,
  Users,
} from "lucide-react"

/* ================= TIPOS ================= */

type ProjectType = "interno" | "externo"

type ODS = {
  id: number
  label: string
}

type CronogramaItem = {
  id: string
  mes: string
  atividade: string
}

type MemberRole =
  | "Coordenador"
  | "Vice-coordenador"
  | "Pesquisador"
  | "Discente"
  | "Colaborador externo"
  | "Técnico"

type ProjectMember = {
  id: string
  nome: string
  papel: MemberRole | ""
  vinculo: string
  email: string
  lattes: string
}

type GeneralData = {
  tipo: ProjectType | null

  titulo: string
  title: string

  palavrasChave: string
  keywords: string

  descricaoResumida: string
  abstract: string

  introducaoJustificativa: string
  objetivos: string
  metodologia: string
  referencias: string

  objetivosDS: ODS[]
  cronograma: CronogramaItem[]
  membros: ProjectMember[]

  pdfComplementar: File | null
  comprovanteExterno: File | null

  editalPesquisa: string
  unidade: string
  centro: string
  periodoIni: string
  periodoFim: string
  email: string
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
  gerais: GeneralData
  interno: InternalData
  externo: ExternalData
}

type Step = 1 | 2 | 3 | 4 | 5 | 6

/* ================= CONSTANTES ================= */

const TITLE_MAX = 400
const LONG_TEXT_MAX = 15000

// Por enquanto, o cadastro de projeto externo fica preservado no código,
// mas indisponível para seleção no fluxo da tela.
const EXTERNAL_PROJECTS_ENABLED = false

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

const memberRoles: MemberRole[] = [
  "Coordenador",
  "Vice-coordenador",
  "Pesquisador",
  "Discente",
  "Colaborador externo",
  "Técnico",
]

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

/* ================= ESTADO INICIAL ================= */

const initialMember: ProjectMember = {
  id: "",
  nome: "",
  papel: "",
  vinculo: "",
  email: "",
  lattes: "",
}

const initialState: FormState = {
  gerais: {
    tipo: null,

    titulo: "",
    title: "",

    palavrasChave: "",
    keywords: "",

    descricaoResumida: "",
    abstract: "",

    introducaoJustificativa: "",
    objetivos: "",
    metodologia: "",
    referencias: "",

    objetivosDS: [],
    cronograma: [],
    membros: [],

    pdfComplementar: null,
    comprovanteExterno: null,

    editalPesquisa: "",
    unidade: "",
    centro: "",
    periodoIni: "",
    periodoFim: "",
    email: "",
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

/* ================= UTIL/UI ================= */

function cx(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ")
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const disabledInputClassName =
  "w-full rounded-xl border border-neutral/30 bg-neutral/5 px-3 py-2.5 text-sm text-neutral outline-none"

const selectClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"

const textareaClassName =
  "min-h-[140px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

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

function CharacterCounter({
  value,
  max,
}: {
  value: string
  max: number
}) {
  const remaining = max - value.length
  const closeToLimit = remaining <= Math.ceil(max * 0.1)

  return (
    <p
      className={cx(
        "text-right text-[11px]",
        closeToLimit ? "text-amber-700" : "text-neutral"
      )}
    >
      {value.length.toLocaleString("pt-BR")} / {max.toLocaleString("pt-BR")} caracteres
    </p>
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
        {value || "—"}
      </p>
    </div>
  )
}

/* ================= COMPONENTES DE SEÇÕES ================= */

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

function CronogramaPicker({
  value,
  onChange,
}: {
  value: CronogramaItem[]
  onChange: (value: CronogramaItem[]) => void
}) {
  const [mes, setMes] = useState("")
  const [atividade, setAtividade] = useState("")

  const canAdd = Boolean(mes.trim() && atividade.trim())

  function addLinha() {
    if (!canAdd) return

    onChange([
      ...value,
      {
        id: createId("cronograma"),
        mes,
        atividade: atividade.trim(),
      },
    ])

    setMes("")
    setAtividade("")
  }

  function removeLinha(id: string) {
    onChange(value.filter((item) => item.id !== id))
  }

  function applyModelo(modelo: string[]) {
    onChange(
      modelo.map((linha) => {
        const [mesModelo, ...resto] = linha.split("—")

        return {
          id: createId("cronograma"),
          mes: mesModelo.trim(),
          atividade: resto.join("—").trim(),
        }
      })
    )
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
          onClick={() => onChange([])}
          disabled={value.length === 0}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
            value.length === 0
              ? "cursor-not-allowed border-neutral/20 bg-neutral/5 text-neutral"
              : "border-neutral/20 bg-white text-primary hover:border-primary/30"
          )}
        >
          <RefreshCcw size={14} />
          Limpar cronograma
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {value.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral/30 bg-white p-4 text-center">
            <p className="text-sm font-semibold text-primary">
              Nenhuma atividade adicionada ao cronograma.
            </p>

            <p className="mt-1 text-xs text-neutral">
              Selecione um mês, descreva a atividade e clique em adicionar.
            </p>
          </div>
        ) : (
          value.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-neutral/20 bg-white p-3 md:flex-row md:items-center md:justify-between"
            >
              <p className="text-sm leading-6 text-neutral">
                <span className="font-semibold text-primary">{item.mes}</span>{" "}
                — {item.atividade}
              </p>

              <button
                type="button"
                onClick={() => removeLinha(item.id)}
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

function FileInputBox({
  label,
  hint,
  file,
  onChange,
  required,
  disabled,
}: {
  label: string
  hint?: string
  file: File | null
  onChange: (file: File | null) => void
  required?: boolean
  disabled?: boolean
}) {
  return (
    <Field label={label} hint={hint} required={required}>
      <label
        className={cx(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition",
          disabled
            ? "cursor-not-allowed border-neutral/20 bg-neutral/5 text-neutral"
            : "border-neutral/30 bg-white text-primary hover:border-primary/40 hover:bg-primary/5"
        )}
      >
        <input
          type="file"
          accept="application/pdf,.pdf"
          disabled={disabled}
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          className="hidden"
        />

        <FileUp size={28} />

        <p className="mt-3 text-sm font-semibold">
          {file ? file.name : "Selecionar arquivo PDF"}
        </p>

        <p className="mt-1 text-xs text-neutral">
          {disabled ? "Campo indisponível no fluxo atual." : "Formato aceito: PDF."}
        </p>
      </label>

      {file && !disabled && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
        >
          <Trash2 size={14} />
          Remover arquivo
        </button>
      )}
    </Field>
  )
}

/* ================= PÁGINA ================= */

export default function CoordinatorProjectForm() {
  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<FormState>(initialState)
  const [memberDraft, setMemberDraft] = useState<ProjectMember>({
    ...initialMember,
    id: createId("membro"),
  })

  const canGoStep2 =
    form.gerais.tipo === "interno" ||
    (EXTERNAL_PROJECTS_ENABLED && form.gerais.tipo === "externo")

  const canGoStep3 = useMemo(() => {
    const g = form.gerais

    return Boolean(
      canGoStep2 &&
        g.editalPesquisa.trim() &&
        g.titulo.trim() &&
        g.title.trim() &&
        g.palavrasChave.trim() &&
        g.keywords.trim() &&
        g.descricaoResumida.trim() &&
        g.abstract.trim() &&
        g.introducaoJustificativa.trim() &&
        g.objetivos.trim() &&
        g.metodologia.trim() &&
        g.referencias.trim() &&
        g.email.trim() &&
        g.centro.trim() &&
        g.unidade.trim() &&
        g.periodoIni &&
        g.periodoFim &&
        g.grandeArea.trim() &&
        g.area.trim() &&
        g.especialidade.trim() &&
        g.linhaPesquisa.trim()
    )
  }, [form, canGoStep2])

  const canGoStep4 = useMemo(() => {
    if (!canGoStep3) return false

    return Boolean(
      form.gerais.objetivosDS.length > 0 &&
        form.gerais.cronograma.length > 0
    )
  }, [form, canGoStep3])

  const canGoStep5 = useMemo(() => {
    if (!canGoStep4) return false

    const hasMembers = form.gerais.membros.length > 0
    const hasComplementaryPdf = Boolean(form.gerais.pdfComplementar)

    if (form.gerais.tipo === "externo") {
      return Boolean(
        hasMembers &&
          hasComplementaryPdf &&
          form.gerais.comprovanteExterno
      )
    }

    return Boolean(hasMembers && hasComplementaryPdf)
  }, [form, canGoStep4])

  const canGoStep6 = useMemo(() => {
    if (!canGoStep5) return false

    if (form.gerais.tipo === "interno") {
      const i = form.interno

      if (!i.grupoPesquisa.trim()) return false

      if (i.possuiProtocoloEtica === "Sim") {
        return Boolean(i.comiteEticaNome.trim() && i.protocoloEtica.trim())
      }

      return true
    }

    if (EXTERNAL_PROJECTS_ENABLED && form.gerais.tipo === "externo") {
      const e = form.externo

      return Boolean(
        e.categoriaProjeto.trim() &&
          e.subcategoriaNivelI.trim() &&
          e.subcategoriaNivelII.trim() &&
          e.definicaoPropriedadeIntelectual.trim()
      )
    }

    return false
  }, [form, canGoStep5])

  const canAddMember = useMemo(() => {
    return Boolean(
      memberDraft.nome.trim() &&
        memberDraft.papel.trim() &&
        memberDraft.vinculo.trim() &&
        memberDraft.email.trim()
    )
  }, [memberDraft])

  function stepDone(currentStep: Step) {
    if (currentStep === 1) return canGoStep2
    if (currentStep === 2) return canGoStep3
    if (currentStep === 3) return canGoStep4
    if (currentStep === 4) return canGoStep5
    if (currentStep === 5) return canGoStep6
    if (currentStep === 6) return submitted

    return false
  }

  function goNext() {
    if (step === 1 && !canGoStep2) return
    if (step === 2 && !canGoStep3) return
    if (step === 3 && !canGoStep4) return
    if (step === 4 && !canGoStep5) return
    if (step === 5 && !canGoStep6) return

    setStep((current) => (current < 6 ? ((current + 1) as Step) : current))
  }

  function goBack() {
    setStep((current) => (current > 1 ? ((current - 1) as Step) : current))
  }

  function resetMemberDraft() {
    setMemberDraft({
      ...initialMember,
      id: createId("membro"),
    })
  }

  function addMember() {
    if (!canAddMember) return

    setForm((current) => ({
      ...current,
      gerais: {
        ...current.gerais,
        membros: [
          ...current.gerais.membros,
          {
            ...memberDraft,
            id: memberDraft.id || createId("membro"),
          },
        ],
      },
    }))

    resetMemberDraft()
  }

  function removeMember(id: string) {
    setForm((current) => ({
      ...current,
      gerais: {
        ...current.gerais,
        membros: current.gerais.membros.filter((membro) => membro.id !== id),
      },
    }))
  }

  async function submit() {
    if (!canGoStep6) return

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
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
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
              Preencha os campos do Anexo II, vincule ODS, cronograma, membros
              e documentos complementares. Ao submeter, o projeto entra com status inicial{" "}
              <span className="font-semibold text-primary">SUBMETIDO</span>.
            </p>
          </div>

          <div className="hidden max-w-xl flex-wrap items-center justify-end gap-2 md:flex">
            <StepPill active={step === 1} done={stepDone(1)}>
              1. Tipo
            </StepPill>

            <StepPill active={step === 2} done={stepDone(2)}>
              2. Anexo II
            </StepPill>

            <StepPill active={step === 3} done={stepDone(3)}>
              3. ODS e cronograma
            </StepPill>

            <StepPill active={step === 4} done={stepDone(4)}>
              4. Membros e uploads
            </StepPill>

            <StepPill active={step === 5} done={stepDone(5)}>
              5. Específico
            </StepPill>

            <StepPill active={step === 6} done={stepDone(6)}>
              6. Revisão
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
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    gerais: {
                      ...current.gerais,
                      tipo: "interno",
                    },
                  }))
                }
                className={cx(
                  "rounded-2xl border p-6 text-left transition",
                  form.gerais.tipo === "interno"
                    ? "border-primary bg-primary/5"
                    : "border-neutral/20 hover:bg-neutral/5"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-primary">Interno</h3>
                  {form.gerais.tipo === "interno" && (
                    <Check size={18} className="text-primary" />
                  )}
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

                  setForm((current) => ({
                    ...current,
                    gerais: {
                      ...current.gerais,
                      tipo: "externo",
                    },
                  }))
                }}
                className={cx(
                  "rounded-2xl border p-6 text-left transition",
                  !EXTERNAL_PROJECTS_ENABLED
                    ? "cursor-not-allowed border-neutral/20 bg-neutral/5 opacity-70"
                    : form.gerais.tipo === "externo"
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

                  {EXTERNAL_PROJECTS_ENABLED && form.gerais.tipo === "externo" ? (
                    <Check size={18} className="text-primary" />
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral/20 bg-white px-2.5 py-1 text-[11px] font-bold text-neutral">
                      <Lock size={12} />
                      Desativado
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm leading-6 text-neutral">
                  Projeto com campos complementares e upload de comprovante de
                  aprovação ou financiamento.
                </p>
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-xs text-neutral">
                {form.gerais.tipo ? (
                  <>
                    Tipo selecionado:{" "}
                    <span className="font-semibold text-primary">
                      {form.gerais.tipo === "interno" ? "Interno" : "Externo"}
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
            title="Passo 2 — Campos do Anexo II"
            subtitle="Preencha os campos principais do projeto em português e inglês."
            icon={<FileText size={18} className="text-primary" />}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Tipo do projeto" required>
                <input
                  value={
                    form.gerais.tipo
                      ? form.gerais.tipo === "interno"
                        ? "Interno"
                        : "Externo"
                      : ""
                  }
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

              <Field label="Título" required hint="">
                <input
                  value={form.gerais.titulo}
                  maxLength={TITLE_MAX}
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
                  placeholder="Título do projeto em português"
                />

                <CharacterCounter value={form.gerais.titulo} max={TITLE_MAX} />
              </Field>

              <Field label="Title" required hint="">
                <input
                  value={form.gerais.title}
                  maxLength={TITLE_MAX}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        title: event.target.value,
                      },
                    }))
                  }
                  className={inputClassName}
                  placeholder="Project title in English"
                />

                <CharacterCounter value={form.gerais.title} max={TITLE_MAX} />
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
                  placeholder="ex.: acessibilidade, IA, educação"
                />
              </Field>

              <Field
                label="Keywords"
                required
                hint="Separe por vírgula ou ponto e vírgula."
              >
                <input
                  value={form.gerais.keywords}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        keywords: event.target.value,
                      },
                    }))
                  }
                  className={inputClassName}
                  placeholder="ex.: accessibility, AI, education"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Descrição resumida" required>
                  <textarea
                    value={form.gerais.descricaoResumida}
                    maxLength={LONG_TEXT_MAX}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        gerais: {
                          ...current.gerais,
                          descricaoResumida: event.target.value,
                        },
                      }))
                    }
                    className={textareaClassName}
                    placeholder="Apresente uma descrição resumida do projeto."
                  />

                  <CharacterCounter
                    value={form.gerais.descricaoResumida}
                    max={LONG_TEXT_MAX}
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Abstract" required>
                  <textarea
                    value={form.gerais.abstract}
                    maxLength={LONG_TEXT_MAX}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        gerais: {
                          ...current.gerais,
                          abstract: event.target.value,
                        },
                      }))
                    }
                    className={textareaClassName}
                    placeholder="Provide the project abstract in English."
                  />

                  <CharacterCounter
                    value={form.gerais.abstract}
                    max={LONG_TEXT_MAX}
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Introdução / justificativa" required>
                  <textarea
                    value={form.gerais.introducaoJustificativa}
                    maxLength={LONG_TEXT_MAX}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        gerais: {
                          ...current.gerais,
                          introducaoJustificativa: event.target.value,
                        },
                      }))
                    }
                    className={textareaClassName}
                    placeholder="Apresente o contexto, problema, relevância e justificativa do projeto."
                  />

                  <CharacterCounter
                    value={form.gerais.introducaoJustificativa}
                    max={LONG_TEXT_MAX}
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Objetivos" required>
                  <textarea
                    value={form.gerais.objetivos}
                    maxLength={LONG_TEXT_MAX}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        gerais: {
                          ...current.gerais,
                          objetivos: event.target.value,
                        },
                      }))
                    }
                    className={textareaClassName}
                    placeholder="Informe os objetivos gerais e específicos do projeto."
                  />

                  <CharacterCounter
                    value={form.gerais.objetivos}
                    max={LONG_TEXT_MAX}
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Metodologia" required>
                  <textarea
                    value={form.gerais.metodologia}
                    maxLength={LONG_TEXT_MAX}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        gerais: {
                          ...current.gerais,
                          metodologia: event.target.value,
                        },
                      }))
                    }
                    className={textareaClassName}
                    placeholder="Descreva procedimentos, métodos, etapas, instrumentos e formas de análise."
                  />

                  <CharacterCounter
                    value={form.gerais.metodologia}
                    max={LONG_TEXT_MAX}
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Referências" required>
                  <textarea
                    value={form.gerais.referencias}
                    maxLength={LONG_TEXT_MAX}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        gerais: {
                          ...current.gerais,
                          referencias: event.target.value,
                        },
                      }))
                    }
                    className={textareaClassName}
                    placeholder="Informe as referências bibliográficas do projeto."
                  />

                  <CharacterCounter
                    value={form.gerais.referencias}
                    max={LONG_TEXT_MAX}
                  />
                </Field>
              </div>

              <Field label="E-mail de contato" required>
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
            title="Passo 3 — ODS e cronograma"
            subtitle="Vincule pelo menos um ODS e cadastre o cronograma do projeto."
            icon={<CalendarDays size={18} className="text-primary" />}
          >
            <div className="space-y-6">
              <Field label="Objetivos do Desenvolvimento Sustentável" required>
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

              <Field
                label="Cronograma"
                required
                hint="Monte o cronograma por mês/período. Você pode adicionar linhas manualmente ou usar um modelo rápido."
              >
                <CronogramaPicker
                  value={form.gerais.cronograma}
                  onChange={(cronograma) =>
                    setForm((current) => ({
                      ...current,
                      gerais: {
                        ...current.gerais,
                        cronograma,
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
            title="Passo 4 — Membros e uploads"
            subtitle="Cadastre os membros do projeto e anexe os documentos complementares."
            icon={<Users size={18} className="text-primary" />}
          >
            <div className="rounded-2xl border border-neutral/20 p-5">
              <div className="flex flex-col gap-3 border-b border-neutral/20 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-primary">
                    Novo membro do projeto
                  </h3>

                  <p className="mt-1 text-xs text-neutral">
                    Informe os dados principais do membro e clique em adicionar.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetMemberDraft}
                  className="inline-flex w-fit items-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30"
                >
                  <RefreshCcw size={14} />
                  Limpar
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Nome" required>
                  <input
                    value={memberDraft.nome}
                    onChange={(event) =>
                      setMemberDraft((current) => ({
                        ...current,
                        nome: event.target.value,
                      }))
                    }
                    className={inputClassName}
                    placeholder="Nome completo"
                  />
                </Field>

                <Field label="Papel no projeto" required>
                  <select
                    value={memberDraft.papel}
                    onChange={(event) =>
                      setMemberDraft((current) => ({
                        ...current,
                        papel: event.target.value as MemberRole | "",
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {memberRoles.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Vínculo" required>
                  <input
                    value={memberDraft.vinculo}
                    onChange={(event) =>
                      setMemberDraft((current) => ({
                        ...current,
                        vinculo: event.target.value,
                      }))
                    }
                    className={inputClassName}
                    placeholder="ex.: UFPB, CNPq, instituição parceira"
                  />
                </Field>

                <Field label="E-mail" required>
                  <input
                    type="email"
                    value={memberDraft.email}
                    onChange={(event) =>
                      setMemberDraft((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    className={inputClassName}
                    placeholder="ex.: membro@ufpb.br"
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Currículo Lattes">
                    <input
                      value={memberDraft.lattes}
                      onChange={(event) =>
                        setMemberDraft((current) => ({
                          ...current,
                          lattes: event.target.value,
                        }))
                      }
                      className={inputClassName}
                      placeholder="URL do currículo Lattes"
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={addMember}
                  disabled={!canAddMember}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                    canAddMember
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "cursor-not-allowed bg-neutral/10 text-neutral"
                  )}
                >
                  <Plus size={16} />
                  Adicionar membro
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-neutral/20 p-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-primary">
                    Membros cadastrados
                  </h3>

                  <p className="mt-1 text-xs text-neutral">
                    Total cadastrado:{" "}
                    <span className="font-semibold text-primary">
                      {form.gerais.membros.length}
                    </span>
                  </p>
                </div>

                <span
                  className={cx(
                    "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold",
                    form.gerais.membros.length > 0
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  )}
                >
                  {form.gerais.membros.length > 0
                    ? "Regra atendida"
                    : "Obrigatório adicionar 1 membro"}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {form.gerais.membros.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-neutral/30 bg-neutral/5 p-5 text-center">
                    <p className="text-sm font-semibold text-primary">
                      Nenhum membro cadastrado.
                    </p>

                    <p className="mt-1 text-xs text-neutral">
                      Preencha o formulário acima e clique em adicionar.
                    </p>
                  </div>
                ) : (
                  form.gerais.membros.map((membro) => (
                    <div
                      key={membro.id}
                      className="rounded-xl border border-neutral/20 bg-white p-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm font-bold text-primary">
                            {membro.nome}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral">
                            <span className="rounded-full bg-neutral/10 px-2 py-1">
                              {membro.papel}
                            </span>

                            <span className="rounded-full bg-neutral/10 px-2 py-1">
                              {membro.vinculo}
                            </span>

                            <span className="rounded-full bg-neutral/10 px-2 py-1">
                              {membro.email}
                            </span>
                          </div>

                          {membro.lattes && (
                            <p className="mt-3 text-xs text-neutral">
                              Lattes: {membro.lattes}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeMember(membro.id)}
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

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <FileInputBox
                label="Upload do PDF complementar"
                required
                hint="Documento complementar do projeto."
                file={form.gerais.pdfComplementar}
                onChange={(pdfComplementar) =>
                  setForm((current) => ({
                    ...current,
                    gerais: {
                      ...current.gerais,
                      pdfComplementar,
                    },
                  }))
                }
              />

              <FileInputBox
                label="Comprovante de aprovação/financiamento"
                required={form.gerais.tipo === "externo"}
                disabled={form.gerais.tipo !== "externo"}
                hint="Obrigatório apenas para projeto externo."
                file={form.gerais.comprovanteExterno}
                onChange={(comprovanteExterno) =>
                  setForm((current) => ({
                    ...current,
                    gerais: {
                      ...current.gerais,
                      comprovanteExterno,
                    },
                  }))
                }
              />
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
            title="Passo 5 — Dados específicos"
            subtitle={
              form.gerais.tipo === "interno"
                ? "Campos adicionais para projeto interno."
                : "Campos adicionais para projeto externo."
            }
            icon={<ClipboardCheck size={18} className="text-primary" />}
          >
            {form.gerais.tipo === "interno" && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  label="Este projeto está vinculado a algum grupo de pesquisa?"
                  required
                >
                  <div className="flex gap-4">
                    {(["Sim", "Não"] as const).map((item) => (
                      <label
                        key={item}
                        className="inline-flex items-center gap-2 text-sm text-primary"
                      >
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
                      <label
                        key={item}
                        className="inline-flex items-center gap-2 text-sm text-primary"
                      >
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
                      : "Campo opcional enquanto não possui protocolo."
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
                      : "Campo opcional enquanto não possui protocolo."
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

            {form.gerais.tipo === "externo" && (
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
                disabled={!canGoStep6}
                className={cx(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  canGoStep6
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

        {step === 6 && (
          <Card
            title="Passo 6 — Revisão e submissão"
            subtitle="Revise todos os dados antes de submeter."
            icon={<Save size={18} className="text-primary" />}
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-neutral/20 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
                  <FileText size={16} />
                  Dados do projeto
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Info
                    label="Tipo"
                    value={
                      form.gerais.tipo === "interno"
                        ? "Interno"
                        : form.gerais.tipo === "externo"
                          ? "Externo"
                          : "—"
                    }
                  />

                  <Info label="Edital" value={form.gerais.editalPesquisa} />
                  <Info label="Centro" value={form.gerais.centro} />
                  <Info label="Unidade" value={form.gerais.unidade} />

                  <div className="sm:col-span-2">
                    <Info label="Título" value={form.gerais.titulo} />
                  </div>

                  <div className="sm:col-span-2">
                    <Info label="Title" value={form.gerais.title} />
                  </div>

                  <Info label="E-mail" value={form.gerais.email} />

                  <Info
                    label="Período"
                    value={`${form.gerais.periodoIni || "—"} → ${
                      form.gerais.periodoFim || "—"
                    }`}
                  />

                  <Info
                    label="Área de conhecimento"
                    value={form.gerais.areaConhecimento}
                  />

                  <Info
                    label="Linha de pesquisa"
                    value={form.gerais.linhaPesquisa}
                  />

                  <Info label="Grande área" value={form.gerais.grandeArea} />

                  <Info
                    label="Área / Subárea"
                    value={`${form.gerais.area || "—"}${
                      form.gerais.subarea ? ` • ${form.gerais.subarea}` : ""
                    }`}
                  />

                  <Info label="Especialidade" value={form.gerais.especialidade} />
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
                    <Tags size={14} />
                    Keywords
                  </p>

                  <p className="mt-1 text-sm text-neutral">
                    {form.gerais.keywords || "—"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral/20 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
                  <Hash size={16} />
                  Dados específicos{" "}
                  {form.gerais.tipo
                    ? `(${form.gerais.tipo === "interno" ? "Interno" : "Externo"})`
                    : ""}
                </h3>

                {form.gerais.tipo === "interno" ? (
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Info
                      label="Vinculado a grupo?"
                      value={form.interno.vinculadoGrupo}
                    />

                    <Info
                      label="Grupo de pesquisa"
                      value={form.interno.grupoPesquisa}
                    />

                    <Info
                      label="Possui protocolo em comitê?"
                      value={form.interno.possuiProtocoloEtica}
                    />

                    <Info
                      label="Comitê de ética"
                      value={form.interno.comiteEticaNome}
                    />

                    <div className="sm:col-span-2">
                      <Info
                        label="Nº do protocolo"
                        value={form.interno.protocoloEtica}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Info
                      label="Categoria"
                      value={form.externo.categoriaProjeto}
                    />

                    <Info
                      label="Subcategoria Nível I"
                      value={form.externo.subcategoriaNivelI}
                    />

                    <Info
                      label="Subcategoria Nível II"
                      value={form.externo.subcategoriaNivelII}
                    />

                    <Info
                      label="Definição de PI"
                      value={form.externo.definicaoPropriedadeIntelectual}
                    />

                    <div className="sm:col-span-2">
                      <Info
                        label="Tratamento da produção intelectual"
                        value={form.externo.tratamentoProducao}
                        preWrap
                      />
                    </div>
                  </div>
                )}

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
                          resetMemberDraft()
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
                <FileText size={16} />
                Campos textuais do Anexo II
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4">
                <Info
                  label="Descrição resumida"
                  value={form.gerais.descricaoResumida}
                  preWrap
                />

                <Info label="Abstract" value={form.gerais.abstract} preWrap />

                <Info
                  label="Introdução / justificativa"
                  value={form.gerais.introducaoJustificativa}
                  preWrap
                />

                <Info label="Objetivos" value={form.gerais.objetivos} preWrap />

                <Info
                  label="Metodologia"
                  value={form.gerais.metodologia}
                  preWrap
                />

                <Info
                  label="Referências"
                  value={form.gerais.referencias}
                  preWrap
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-neutral/20 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
                  <GraduationCap size={16} />
                  ODS vinculados
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
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

              <div className="rounded-2xl border border-neutral/20 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
                  <Upload size={16} />
                  Arquivos
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-4">
                  <Info
                    label="PDF complementar"
                    value={form.gerais.pdfComplementar?.name || "—"}
                  />

                  <Info
                    label="Comprovante externo"
                    value={form.gerais.comprovanteExterno?.name || "—"}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-neutral/20 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
                <CalendarDays size={16} />
                Cronograma
              </h3>

              <div className="mt-4 space-y-2">
                {form.gerais.cronograma.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-neutral/20 bg-neutral/5 p-3 text-sm text-neutral"
                  >
                    <span className="font-semibold text-primary">{item.mes}</span>{" "}
                    — {item.atividade}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-neutral/20 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
                <Users size={16} />
                Membros do projeto ({form.gerais.membros.length})
              </h3>

              <div className="mt-4 space-y-3">
                {form.gerais.membros.map((membro) => (
                  <div
                    key={membro.id}
                    className="rounded-xl border border-neutral/20 bg-neutral/5 p-4"
                  >
                    <p className="text-sm font-bold text-primary">{membro.nome}</p>

                    <div className="mt-2 grid grid-cols-1 gap-3 text-sm text-neutral sm:grid-cols-2">
                      <Info label="Papel" value={membro.papel} />
                      <Info label="Vínculo" value={membro.vinculo} />
                      <Info label="E-mail" value={membro.email} />
                      <Info label="Lattes" value={membro.lattes} />
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
                disabled={saving || submitted || !canGoStep6}
                className={cx(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  saving || submitted || !canGoStep6
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