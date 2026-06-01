import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
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
  Lock,
  Plus,
  RefreshCcw,
  Save,
  Tags,
  Trash2,
  Upload,
  Users,
} from "lucide-react"

type ProjectType = "interno" | "externo"

type ProjectStatus =
  | "em_elaboracao"
  | "submetido"
  | "em_avaliacao"
  | "aprovado"
  | "reprovado"
  | "cancelado"

type ODS = {
  id: number
  label: string
}

type ScheduleItem = {
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

type ProjectFormState = {
  id: number
  status: ProjectStatus
  prazoEdicaoAberto: boolean

  tipo: ProjectType
  editalPesquisa: string

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

  email: string
  centro: string
  unidade: string
  periodoIni: string
  periodoFim: string

  areaConhecimento: string
  grandeArea: string
  area: string
  subarea: string
  especialidade: string
  linhaPesquisa: string

  objetivosDS: ODS[]
  cronograma: ScheduleItem[]
  membros: ProjectMember[]

  pdfComplementarAtual: string
  comprovanteExternoAtual: string

  pdfComplementarNovo: File | null
  comprovanteExternoNovo: File | null

  interno: {
    vinculadoGrupo: "Sim" | "Não"
    grupoPesquisa: string
    possuiProtocoloEtica: "Sim" | "Não"
    comiteEticaNome: string
    protocoloEtica: string
  }

  externo: {
    categoriaProjeto: string
    subcategoriaNivelI: string
    subcategoriaNivelII: string
    definicaoPropriedadeIntelectual: string
    tratamentoProducao: string
  }
}

type Step = 1 | 2 | 3 | 4 | 5

const TITLE_MAX = 400
const LONG_TEXT_MAX = 15000
const EXTERNAL_PROJECTS_ENABLED = false

const editais = [
  "Edital 01/2026",
  "Edital 02/2026",
  "PIBIC 2026",
  "PIBITI 2026",
  "PIVIC 2026",
  "PROBEX 2026",
]

const centros = ["CCHLA", "CCEN", "CT", "CCS", "CE", "CCTA", "CI"]

const unidades = [
  "Centro de Informática",
  "Departamento A",
  "Departamento B",
  "Laboratório X",
  "Programa Y",
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
  "Ciências Exatas e da Terra",
  "Ciências Exatas",
  "Ciências Humanas",
  "Saúde",
  "Engenharias",
  "Linguística, Letras e Artes",
]

const areas = [
  "Ciência da Computação",
  "Visão Computacional",
  "IA Aplicada",
  "Processamento de Imagens",
  "Sistemas Embarcados",
  "Segurança",
]

const subareas = [
  "Interação Humano-Computador",
  "Detecção",
  "Segmentação",
  "Classificação",
  "Otimização",
  "TinyML",
]

const especialidades = [
  "Tecnologias Assistivas",
  "Especialidade A",
  "Especialidade B",
  "Especialidade C",
  "Outra",
]

const linhas = [
  "Tecnologias Assistivas e Sistemas Inteligentes",
  "Linha 01",
  "Linha 02",
  "Linha 03",
]

const grupos = [
  "Tecnologias Assistivas e Sistemas Inteligentes",
  "GP I",
  "GP II",
  "GP III",
  "Outro",
]

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

const definicoesPI = ["Institucional", "Compartilhada", "Privada", "A definir"]

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
  "Mês 1 — Revisão bibliográfica e levantamento de requisitos",
  "Mês 2 — Definição metodológica e organização dos instrumentos",
  "Mês 3 — Desenvolvimento ou execução da primeira etapa",
  "Mês 4 — Desenvolvimento ou execução da segunda etapa",
  "Mês 5 — Consolidação dos resultados e ajustes",
  "Mês 6 — Elaboração de relatório e socialização dos resultados",
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

const initialMember: ProjectMember = {
  id: "",
  nome: "",
  papel: "",
  vinculo: "",
  email: "",
  lattes: "",
}

const initialProject: ProjectFormState = {
  id: 1,
  status: "submetido",
  prazoEdicaoAberto: true,

  tipo: "interno",
  editalPesquisa: "PIBIC 2026",

  titulo: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
  title: "Development of Digital Accessibility Resources with VLibras",

  palavrasChave: "Acessibilidade, VLibras, Tecnologia Assistiva, Inclusão Digital",
  keywords: "Accessibility, VLibras, Assistive Technology, Digital Inclusion",

  descricaoResumida:
    "O projeto propõe o desenvolvimento e a avaliação de recursos digitais voltados à acessibilidade comunicacional, com foco em ferramentas integradas ao ecossistema VLibras.",
  abstract:
    "This project proposes the development and evaluation of digital resources for communicational accessibility, focusing on tools integrated into the VLibras ecosystem.",

  introducaoJustificativa:
    "A acessibilidade digital é essencial para ampliar a inclusão de pessoas surdas em serviços públicos, plataformas educacionais e sistemas institucionais.",
  objetivos:
    "Investigar, desenvolver e avaliar recursos computacionais voltados à acessibilidade digital, considerando usabilidade, tradução automática e experiência do usuário.",
  metodologia:
    "A metodologia será organizada em etapas: levantamento bibliográfico, análise de requisitos, prototipação, desenvolvimento incremental, testes com usuários, análise de resultados e documentação.",
  referencias:
    "BRASIL. Lei Brasileira de Inclusão da Pessoa com Deficiência. W3C. Web Content Accessibility Guidelines. NIELSEN, J. Usability Engineering.",

  email: "coordenador@ufpb.br",
  centro: "CI",
  unidade: "Centro de Informática",
  periodoIni: "2026-08-01",
  periodoFim: "2027-07-31",

  areaConhecimento: "Ciência da Computação",
  grandeArea: "Ciências Exatas e da Terra",
  area: "Ciência da Computação",
  subarea: "Interação Humano-Computador",
  especialidade: "Tecnologias Assistivas",
  linhaPesquisa: "Tecnologias Assistivas e Sistemas Inteligentes",

  objetivosDS: [
    { id: 4, label: "Educação de qualidade" },
    { id: 9, label: "Indústria, inovação e infraestrutura" },
    { id: 10, label: "Redução das desigualdades" },
  ],

  cronograma: [
    {
      id: "cronograma-1",
      mes: "Mês 1",
      atividade: "Revisão bibliográfica e levantamento de requisitos.",
    },
    {
      id: "cronograma-2",
      mes: "Mês 2",
      atividade: "Definição metodológica e análise de soluções existentes.",
    },
    {
      id: "cronograma-3",
      mes: "Mês 3",
      atividade: "Prototipação inicial dos recursos de acessibilidade.",
    },
  ],

  membros: [
    {
      id: "membro-1",
      nome: "Prof. Dr. Carlos Henrique Almeida",
      papel: "Coordenador",
      vinculo: "UFPB",
      email: "carlos.almeida@ufpb.br",
      lattes: "http://lattes.cnpq.br/0000000000000001",
    },
    {
      id: "membro-2",
      nome: "Ana Beatriz Santos",
      papel: "Discente",
      vinculo: "Graduação em Ciência de Dados e IA",
      email: "ana.santos@academico.ufpb.br",
      lattes: "http://lattes.cnpq.br/0000000000000002",
    },
  ],

  pdfComplementarAtual: "projeto-complementar-vlibras.pdf",
  comprovanteExternoAtual: "Não se aplica a projeto interno",

  pdfComplementarNovo: null,
  comprovanteExternoNovo: null,

  interno: {
    vinculadoGrupo: "Sim",
    grupoPesquisa: "Tecnologias Assistivas e Sistemas Inteligentes",
    possuiProtocoloEtica: "Sim",
    comiteEticaNome: "CEP/UFPB",
    protocoloEtica: "1234567",
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

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const disabledInputClassName =
  "w-full cursor-not-allowed rounded-xl border border-neutral/30 bg-neutral/5 px-3 py-2.5 text-sm text-neutral outline-none"

const selectClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"

const textareaClassName =
  "min-h-[140px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

function getStatusLabel(status: ProjectStatus) {
  const labels: Record<ProjectStatus, string> = {
    em_elaboracao: "Em elaboração",
    submetido: "Submetido",
    em_avaliacao: "Em avaliação",
    aprovado: "Aprovado",
    reprovado: "Reprovado",
    cancelado: "Cancelado",
  }

  return labels[status]
}

function getStatusClass(status: ProjectStatus) {
  switch (status) {
    case "aprovado":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "submetido":
    case "em_avaliacao":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "em_elaboracao":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "reprovado":
    case "cancelado":
      return "border-red-200 bg-red-50 text-red-700"
    default:
      return "border-neutral/20 bg-neutral/5 text-neutral"
  }
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

      {hint && <p className="text-[11px] leading-5 text-neutral">{hint}</p>}
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
      <p className="text-[11px] font-bold uppercase tracking-wide text-neutral">
        {label}
      </p>

      <p
        className={cx(
          "mt-1 text-sm leading-6 text-neutral",
          preWrap && "whitespace-pre-wrap"
        )}
      >
        {value || "—"}
      </p>
    </div>
  )
}

function OdsPicker({
  value,
  onChange,
  disabled,
}: {
  value: ODS[]
  onChange: (v: ODS[]) => void
  disabled?: boolean
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
    if (disabled) return

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
            disabled={disabled}
            onClick={() => toggle(ods)}
            className={cx(
              "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition",
              disabled && "cursor-not-allowed opacity-70",
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

function CronogramaEditor({
  value,
  onChange,
  disabled,
}: {
  value: ScheduleItem[]
  onChange: (value: ScheduleItem[]) => void
  disabled?: boolean
}) {
  const [mes, setMes] = useState("")
  const [atividade, setAtividade] = useState("")

  const canAdd = Boolean(mes.trim() && atividade.trim()) && !disabled

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
    if (disabled) return
    onChange(value.filter((item) => item.id !== id))
  }

  function applyModelo(modelo: string[]) {
    if (disabled) return

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
          disabled={disabled}
          onChange={(event) => setMes(event.target.value)}
          className={disabled ? disabledInputClassName : selectClassName}
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
          disabled={disabled}
          onChange={(event) => setAtividade(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              addLinha()
            }
          }}
          className={disabled ? disabledInputClassName : inputClassName}
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
          onClick={() => onChange([])}
          disabled={disabled || value.length === 0}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
            disabled || value.length === 0
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
                disabled={disabled}
                className={cx(
                  "inline-flex w-fit items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
                  disabled
                    ? "cursor-not-allowed border-neutral/20 bg-neutral/5 text-neutral"
                    : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                )}
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
  currentFile,
  newFile,
  onChange,
  required,
  disabled,
}: {
  label: string
  hint?: string
  currentFile: string
  newFile: File | null
  onChange: (file: File | null) => void
  required?: boolean
  disabled?: boolean
}) {
  return (
    <Field label={label} hint={hint} required={required}>
      <div className="rounded-2xl border border-neutral/20 bg-neutral/5 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-neutral">
          Arquivo atual
        </p>

        <p className="mt-1 break-all text-sm font-semibold text-primary">
          {currentFile || "Nenhum arquivo cadastrado"}
        </p>
      </div>

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
          {newFile ? newFile.name : "Selecionar novo arquivo PDF"}
        </p>

        <p className="mt-1 text-xs text-neutral">
          {disabled
            ? "Campo indisponível no fluxo atual."
            : "O novo arquivo substituirá o arquivo atual após salvar."}
        </p>
      </label>

      {newFile && !disabled && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
        >
          <Trash2 size={14} />
          Remover novo arquivo
        </button>
      )}
    </Field>
  )
}

export default function CoordinatorProjectEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<ProjectFormState>(initialProject)
  const [memberDraft, setMemberDraft] = useState<ProjectMember>({
    ...initialMember,
    id: createId("membro"),
  })

  const isLocked = !form.prazoEdicaoAberto

  const canEditExternal =
    EXTERNAL_PROJECTS_ENABLED && form.tipo === "externo"

  const canStep1 = useMemo(() => {
    return Boolean(
      form.editalPesquisa.trim() &&
        form.titulo.trim() &&
        form.title.trim() &&
        form.palavrasChave.trim() &&
        form.keywords.trim() &&
        form.descricaoResumida.trim() &&
        form.abstract.trim() &&
        form.introducaoJustificativa.trim() &&
        form.objetivos.trim() &&
        form.metodologia.trim() &&
        form.referencias.trim()
    )
  }, [form])

  const canStep2 = useMemo(() => {
    return Boolean(
      canStep1 &&
        form.email.trim() &&
        form.centro.trim() &&
        form.unidade.trim() &&
        form.periodoIni &&
        form.periodoFim &&
        form.grandeArea.trim() &&
        form.area.trim() &&
        form.especialidade.trim() &&
        form.linhaPesquisa.trim()
    )
  }, [form, canStep1])

  const canStep3 = useMemo(() => {
    return Boolean(
      canStep2 &&
        form.objetivosDS.length > 0 &&
        form.cronograma.length > 0
    )
  }, [form, canStep2])

  const canStep4 = useMemo(() => {
    return Boolean(canStep3 && form.membros.length > 0)
  }, [form, canStep3])

  const canStep5 = useMemo(() => {
    if (!canStep4) return false

    if (form.tipo === "interno") {
      if (!form.interno.grupoPesquisa.trim()) return false

      if (form.interno.possuiProtocoloEtica === "Sim") {
        return Boolean(
          form.interno.comiteEticaNome.trim() &&
            form.interno.protocoloEtica.trim()
        )
      }

      return true
    }

    if (canEditExternal) {
      return Boolean(
        form.externo.categoriaProjeto.trim() &&
          form.externo.subcategoriaNivelI.trim() &&
          form.externo.subcategoriaNivelII.trim() &&
          form.externo.definicaoPropriedadeIntelectual.trim()
      )
    }

    return false
  }, [form, canStep4, canEditExternal])

  const canAddMember = useMemo(() => {
    return Boolean(
      memberDraft.nome.trim() &&
        memberDraft.papel.trim() &&
        memberDraft.vinculo.trim() &&
        memberDraft.email.trim()
    )
  }, [memberDraft])

  function stepDone(currentStep: Step) {
    if (currentStep === 1) return canStep1
    if (currentStep === 2) return canStep2
    if (currentStep === 3) return canStep3
    if (currentStep === 4) return canStep4
    if (currentStep === 5) return canStep5

    return false
  }

  function goNext() {
    if (step === 1 && !canStep1) return
    if (step === 2 && !canStep2) return
    if (step === 3 && !canStep3) return
    if (step === 4 && !canStep4) return

    setStep((current) => (current < 5 ? ((current + 1) as Step) : current))
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
    if (!canAddMember || isLocked) return

    setForm((current) => ({
      ...current,
      membros: [
        ...current.membros,
        {
          ...memberDraft,
          id: memberDraft.id || createId("membro"),
        },
      ],
    }))

    resetMemberDraft()
  }

  function removeMember(memberId: string) {
    if (isLocked) return

    setForm((current) => ({
      ...current,
      membros: current.membros.filter((membro) => membro.id !== memberId),
    }))
  }

  async function saveProject() {
    if (!canStep5 || isLocked) return

    setSaving(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  function saveAndBack() {
    void saveProject().then(() => {
      navigate(`/coordenador/projetos/${id ?? form.id}`)
    })
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to={`/coordenador/projetos/${id ?? form.id}`}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Voltar para visualização
          </Link>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/coordenador/projetos"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              Lista de projetos
            </Link>

            <button
              type="button"
              onClick={saveAndBack}
              disabled={saving || isLocked || !canStep5}
              className={cx(
                "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                saving || isLocked || !canStep5
                  ? "cursor-not-allowed bg-neutral/10 text-neutral"
                  : "bg-primary text-white hover:bg-primary/90"
              )}
            >
              <Save size={16} />
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </div>

        <section className="rounded-3xl border border-neutral/30 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                <FileText size={14} />
                Editar projeto #{id ?? form.id}
              </div>

              <h1 className="mt-3 max-w-4xl text-2xl font-bold tracking-tight text-primary">
                {form.titulo || "Projeto sem título"}
              </h1>

              <p className="mt-2 max-w-4xl text-sm leading-6 text-neutral">
                Altere os dados do projeto enquanto o prazo de edição estiver aberto.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={cx(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                    getStatusClass(form.status)
                  )}
                >
                  {getStatusLabel(form.status)}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral/20 bg-neutral/5 px-3 py-1 text-xs font-semibold text-neutral">
                  {form.tipo === "interno" ? "Interno" : "Externo"}
                </span>

                {form.prazoEdicaoAberto ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <Check size={14} />
                    Prazo de edição aberto
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                    <Lock size={14} />
                    Prazo de edição encerrado
                  </span>
                )}
              </div>
            </div>

            <div className="hidden max-w-xl flex-wrap items-center justify-end gap-2 md:flex">
              <StepPill active={step === 1} done={stepDone(1)}>
                1. Anexo II
              </StepPill>

              <StepPill active={step === 2} done={stepDone(2)}>
                2. Dados gerais
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
            </div>
          </div>

          {isLocked && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />

              <div>
                <p className="text-sm font-bold">
                  Edição indisponível para este projeto
                </p>

                <p className="mt-1 text-xs leading-5">
                  O prazo de edição foi encerrado. Os campos permanecem visíveis
                  apenas para consulta.
                </p>
              </div>
            </div>
          )}

          {saved && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
              <Check size={18} className="mt-0.5 shrink-0" />

              <div>
                <p className="text-sm font-bold">
                  Alterações salvas com sucesso
                </p>

                <p className="mt-1 text-xs leading-5">
                  Os dados foram atualizados no protótipo. Na integração real,
                  este ponto deve chamar a API do backend.
                </p>
              </div>
            </div>
          )}
        </section>

        {step === 1 && (
          <Card
            title="Passo 1 — Campos do Anexo II"
            subtitle="Edite os campos textuais principais do projeto."
            icon={<FileText size={18} className="text-primary" />}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Edital de pesquisa" required>
                <select
                  value={form.editalPesquisa}
                  disabled={isLocked}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      editalPesquisa: event.target.value,
                    }))
                  }
                  className={isLocked ? disabledInputClassName : selectClassName}
                >
                  <option value="">Selecione</option>
                  {editais.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Tipo do projeto" required>
                <input
                  value={form.tipo === "interno" ? "Interno" : "Externo"}
                  readOnly
                  className={disabledInputClassName}
                />
              </Field>

              <Field label="Título" required hint="Limite de 400 caracteres.">
                <input
                  value={form.titulo}
                  maxLength={TITLE_MAX}
                  disabled={isLocked}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      titulo: event.target.value,
                    }))
                  }
                  className={isLocked ? disabledInputClassName : inputClassName}
                  placeholder="Título do projeto em português"
                />

                <CharacterCounter value={form.titulo} max={TITLE_MAX} />
              </Field>

              <Field label="Title" required hint="Limite de 400 caracteres.">
                <input
                  value={form.title}
                  maxLength={TITLE_MAX}
                  disabled={isLocked}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  className={isLocked ? disabledInputClassName : inputClassName}
                  placeholder="Project title in English"
                />

                <CharacterCounter value={form.title} max={TITLE_MAX} />
              </Field>

              <Field label="Palavras-chave" required>
                <input
                  value={form.palavrasChave}
                  disabled={isLocked}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      palavrasChave: event.target.value,
                    }))
                  }
                  className={isLocked ? disabledInputClassName : inputClassName}
                  placeholder="ex.: acessibilidade, IA, educação"
                />
              </Field>

              <Field label="Keywords" required>
                <input
                  value={form.keywords}
                  disabled={isLocked}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      keywords: event.target.value,
                    }))
                  }
                  className={isLocked ? disabledInputClassName : inputClassName}
                  placeholder="ex.: accessibility, AI, education"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Descrição resumida" required>
                  <textarea
                    value={form.descricaoResumida}
                    maxLength={LONG_TEXT_MAX}
                    disabled={isLocked}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        descricaoResumida: event.target.value,
                      }))
                    }
                    className={isLocked ? disabledInputClassName : textareaClassName}
                    placeholder="Apresente uma descrição resumida do projeto."
                  />

                  <CharacterCounter
                    value={form.descricaoResumida}
                    max={LONG_TEXT_MAX}
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Abstract" required>
                  <textarea
                    value={form.abstract}
                    maxLength={LONG_TEXT_MAX}
                    disabled={isLocked}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        abstract: event.target.value,
                      }))
                    }
                    className={isLocked ? disabledInputClassName : textareaClassName}
                    placeholder="Provide the project abstract in English."
                  />

                  <CharacterCounter value={form.abstract} max={LONG_TEXT_MAX} />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Introdução / justificativa" required>
                  <textarea
                    value={form.introducaoJustificativa}
                    maxLength={LONG_TEXT_MAX}
                    disabled={isLocked}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        introducaoJustificativa: event.target.value,
                      }))
                    }
                    className={isLocked ? disabledInputClassName : textareaClassName}
                    placeholder="Apresente o contexto, problema, relevância e justificativa do projeto."
                  />

                  <CharacterCounter
                    value={form.introducaoJustificativa}
                    max={LONG_TEXT_MAX}
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Objetivos" required>
                  <textarea
                    value={form.objetivos}
                    maxLength={LONG_TEXT_MAX}
                    disabled={isLocked}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        objetivos: event.target.value,
                      }))
                    }
                    className={isLocked ? disabledInputClassName : textareaClassName}
                    placeholder="Informe os objetivos gerais e específicos do projeto."
                  />

                  <CharacterCounter value={form.objetivos} max={LONG_TEXT_MAX} />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Metodologia" required>
                  <textarea
                    value={form.metodologia}
                    maxLength={LONG_TEXT_MAX}
                    disabled={isLocked}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        metodologia: event.target.value,
                      }))
                    }
                    className={isLocked ? disabledInputClassName : textareaClassName}
                    placeholder="Descreva os procedimentos, métodos e etapas."
                  />

                  <CharacterCounter value={form.metodologia} max={LONG_TEXT_MAX} />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Referências" required>
                  <textarea
                    value={form.referencias}
                    maxLength={LONG_TEXT_MAX}
                    disabled={isLocked}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        referencias: event.target.value,
                      }))
                    }
                    className={isLocked ? disabledInputClassName : textareaClassName}
                    placeholder="Informe as referências bibliográficas do projeto."
                  />

                  <CharacterCounter value={form.referencias} max={LONG_TEXT_MAX} />
                </Field>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={goNext}
                disabled={!canStep1}
                className={cx(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  canStep1
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
            subtitle="Edite dados institucionais, área e período do projeto."
            icon={<ClipboardCheck size={18} className="text-primary" />}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="E-mail de contato" required>
                <input
                  type="email"
                  value={form.email}
                  disabled={isLocked}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className={isLocked ? disabledInputClassName : inputClassName}
                  placeholder="ex.: coordenador@ufpb.br"
                />
              </Field>

              <Field label="Período do projeto" required>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="date"
                    value={form.periodoIni}
                    disabled={isLocked}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        periodoIni: event.target.value,
                      }))
                    }
                    className={isLocked ? disabledInputClassName : inputClassName}
                  />

                  <input
                    type="date"
                    value={form.periodoFim}
                    disabled={isLocked}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        periodoFim: event.target.value,
                      }))
                    }
                    className={isLocked ? disabledInputClassName : inputClassName}
                  />
                </div>
              </Field>

              <Field label="Centro" required>
                <select
                  value={form.centro}
                  disabled={isLocked}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      centro: event.target.value,
                    }))
                  }
                  className={isLocked ? disabledInputClassName : selectClassName}
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
                  value={form.unidade}
                  disabled={isLocked}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      unidade: event.target.value,
                    }))
                  }
                  className={isLocked ? disabledInputClassName : selectClassName}
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
                  value={form.areaConhecimento}
                  disabled={isLocked}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      areaConhecimento: event.target.value,
                    }))
                  }
                  className={isLocked ? disabledInputClassName : selectClassName}
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
                  value={form.grandeArea}
                  disabled={isLocked}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      grandeArea: event.target.value,
                    }))
                  }
                  className={isLocked ? disabledInputClassName : selectClassName}
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
                  value={form.area}
                  disabled={isLocked}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      area: event.target.value,
                    }))
                  }
                  className={isLocked ? disabledInputClassName : selectClassName}
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
                  value={form.subarea}
                  disabled={isLocked}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      subarea: event.target.value,
                    }))
                  }
                  className={isLocked ? disabledInputClassName : selectClassName}
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
                  value={form.especialidade}
                  disabled={isLocked}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      especialidade: event.target.value,
                    }))
                  }
                  className={isLocked ? disabledInputClassName : selectClassName}
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
                  value={form.linhaPesquisa}
                  disabled={isLocked}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      linhaPesquisa: event.target.value,
                    }))
                  }
                  className={isLocked ? disabledInputClassName : selectClassName}
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
                disabled={!canStep2}
                className={cx(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  canStep2
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
            subtitle="Atualize os ODS vinculados e o cronograma do projeto."
            icon={<GraduationCap size={18} className="text-primary" />}
          >
            <div className="space-y-6">
              <Field label="Objetivos do Desenvolvimento Sustentável" required>
                <OdsPicker
                  value={form.objetivosDS}
                  disabled={isLocked}
                  onChange={(objetivosDS) =>
                    setForm((current) => ({
                      ...current,
                      objetivosDS,
                    }))
                  }
                />
              </Field>

              <Field
                label="Cronograma"
                required
                hint="Você pode adicionar novas atividades, remover linhas ou aplicar um modelo."
              >
                <CronogramaEditor
                  value={form.cronograma}
                  disabled={isLocked}
                  onChange={(cronograma) =>
                    setForm((current) => ({
                      ...current,
                      cronograma,
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
                disabled={!canStep3}
                className={cx(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  canStep3
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
            subtitle="Atualize a equipe vinculada e os documentos do projeto."
            icon={<Users size={18} className="text-primary" />}
          >
            <div className="rounded-2xl border border-neutral/20 p-5">
              <div className="flex flex-col gap-3 border-b border-neutral/20 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-primary">
                    Adicionar membro
                  </h3>

                  <p className="mt-1 text-xs text-neutral">
                    Informe os dados principais do membro e clique em adicionar.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetMemberDraft}
                  disabled={isLocked}
                  className={cx(
                    "inline-flex w-fit items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
                    isLocked
                      ? "cursor-not-allowed border-neutral/20 bg-neutral/5 text-neutral"
                      : "border-neutral/20 bg-white text-primary hover:border-primary/30"
                  )}
                >
                  <RefreshCcw size={14} />
                  Limpar
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Nome" required>
                  <input
                    value={memberDraft.nome}
                    disabled={isLocked}
                    onChange={(event) =>
                      setMemberDraft((current) => ({
                        ...current,
                        nome: event.target.value,
                      }))
                    }
                    className={isLocked ? disabledInputClassName : inputClassName}
                    placeholder="Nome completo"
                  />
                </Field>

                <Field label="Papel no projeto" required>
                  <select
                    value={memberDraft.papel}
                    disabled={isLocked}
                    onChange={(event) =>
                      setMemberDraft((current) => ({
                        ...current,
                        papel: event.target.value as MemberRole | "",
                      }))
                    }
                    className={isLocked ? disabledInputClassName : selectClassName}
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
                    disabled={isLocked}
                    onChange={(event) =>
                      setMemberDraft((current) => ({
                        ...current,
                        vinculo: event.target.value,
                      }))
                    }
                    className={isLocked ? disabledInputClassName : inputClassName}
                    placeholder="ex.: UFPB, CNPq, instituição parceira"
                  />
                </Field>

                <Field label="E-mail" required>
                  <input
                    type="email"
                    value={memberDraft.email}
                    disabled={isLocked}
                    onChange={(event) =>
                      setMemberDraft((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    className={isLocked ? disabledInputClassName : inputClassName}
                    placeholder="ex.: membro@ufpb.br"
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Currículo Lattes">
                    <input
                      value={memberDraft.lattes}
                      disabled={isLocked}
                      onChange={(event) =>
                        setMemberDraft((current) => ({
                          ...current,
                          lattes: event.target.value,
                        }))
                      }
                      className={isLocked ? disabledInputClassName : inputClassName}
                      placeholder="URL do currículo Lattes"
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={addMember}
                  disabled={!canAddMember || isLocked}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                    canAddMember && !isLocked
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
                      {form.membros.length}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {form.membros.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-neutral/30 bg-neutral/5 p-5 text-center">
                    <p className="text-sm font-semibold text-primary">
                      Nenhum membro cadastrado.
                    </p>
                  </div>
                ) : (
                  form.membros.map((membro) => (
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
                            <p className="mt-3 break-all text-xs text-neutral">
                              Lattes: {membro.lattes}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeMember(membro.id)}
                          disabled={isLocked}
                          className={cx(
                            "inline-flex w-fit items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
                            isLocked
                              ? "cursor-not-allowed border-neutral/20 bg-neutral/5 text-neutral"
                              : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                          )}
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
                label="PDF complementar"
                required
                currentFile={form.pdfComplementarAtual}
                newFile={form.pdfComplementarNovo}
                disabled={isLocked}
                hint="Envie um novo PDF apenas se quiser substituir o arquivo atual."
                onChange={(pdfComplementarNovo) =>
                  setForm((current) => ({
                    ...current,
                    pdfComplementarNovo,
                  }))
                }
              />

              <FileInputBox
                label="Comprovante de aprovação/financiamento"
                required={form.tipo === "externo"}
                currentFile={form.comprovanteExternoAtual}
                newFile={form.comprovanteExternoNovo}
                disabled={isLocked || form.tipo !== "externo"}
                hint="Obrigatório apenas para projeto externo. O fluxo externo está desativado no momento."
                onChange={(comprovanteExternoNovo) =>
                  setForm((current) => ({
                    ...current,
                    comprovanteExternoNovo,
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
                disabled={!canStep4}
                className={cx(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  canStep4
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
            title="Passo 5 — Dados específicos e revisão"
            subtitle={
              form.tipo === "interno"
                ? "Revise os dados específicos do projeto interno antes de salvar."
                : "Revise os dados específicos do projeto externo antes de salvar."
            }
            icon={<Upload size={18} className="text-primary" />}
          >
            {form.tipo === "interno" && (
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
                          disabled={isLocked}
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
                    disabled={isLocked}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        interno: {
                          ...current.interno,
                          grupoPesquisa: event.target.value,
                        },
                      }))
                    }
                    className={isLocked ? disabledInputClassName : selectClassName}
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
                          disabled={isLocked}
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
                >
                  <input
                    value={form.interno.comiteEticaNome}
                    disabled={
                      isLocked || form.interno.possuiProtocoloEtica !== "Sim"
                    }
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        interno: {
                          ...current.interno,
                          comiteEticaNome: event.target.value,
                        },
                      }))
                    }
                    className={
                      isLocked || form.interno.possuiProtocoloEtica !== "Sim"
                        ? disabledInputClassName
                        : inputClassName
                    }
                    placeholder="ex.: CEP/HULW, CEP/UFPB"
                  />
                </Field>

                <Field
                  label="Nº do protocolo"
                  required={form.interno.possuiProtocoloEtica === "Sim"}
                >
                  <input
                    value={form.interno.protocoloEtica}
                    disabled={
                      isLocked || form.interno.possuiProtocoloEtica !== "Sim"
                    }
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        interno: {
                          ...current.interno,
                          protocoloEtica: event.target.value,
                        },
                      }))
                    }
                    className={
                      isLocked || form.interno.possuiProtocoloEtica !== "Sim"
                        ? disabledInputClassName
                        : inputClassName
                    }
                    placeholder="ex.: 1234567"
                  />
                </Field>
              </div>
            )}

            {form.tipo === "externo" && (
              <div className="space-y-5">
                {!EXTERNAL_PROJECTS_ENABLED && (
                  <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />

                    <div>
                      <p className="text-sm font-bold">
                        Edição de projeto externo desativada no fluxo atual
                      </p>

                      <p className="mt-1 text-xs leading-5">
                        Os campos foram mantidos no código para reativação futura.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Categoria do projeto" required>
                    <select
                      value={form.externo.categoriaProjeto}
                      disabled={isLocked || !EXTERNAL_PROJECTS_ENABLED}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          externo: {
                            ...current.externo,
                            categoriaProjeto: event.target.value,
                          },
                        }))
                      }
                      className={
                        isLocked || !EXTERNAL_PROJECTS_ENABLED
                          ? disabledInputClassName
                          : selectClassName
                      }
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
                      disabled={isLocked || !EXTERNAL_PROJECTS_ENABLED}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          externo: {
                            ...current.externo,
                            subcategoriaNivelI: event.target.value,
                          },
                        }))
                      }
                      className={
                        isLocked || !EXTERNAL_PROJECTS_ENABLED
                          ? disabledInputClassName
                          : selectClassName
                      }
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
                      disabled={isLocked || !EXTERNAL_PROJECTS_ENABLED}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          externo: {
                            ...current.externo,
                            subcategoriaNivelII: event.target.value,
                          },
                        }))
                      }
                      className={
                        isLocked || !EXTERNAL_PROJECTS_ENABLED
                          ? disabledInputClassName
                          : selectClassName
                      }
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
                      disabled={isLocked || !EXTERNAL_PROJECTS_ENABLED}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          externo: {
                            ...current.externo,
                            definicaoPropriedadeIntelectual: event.target.value,
                          },
                        }))
                      }
                      className={
                        isLocked || !EXTERNAL_PROJECTS_ENABLED
                          ? disabledInputClassName
                          : selectClassName
                      }
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
                    <Field label="Tratamento da produção intelectual do projeto">
                      <textarea
                        value={form.externo.tratamentoProducao}
                        disabled={isLocked || !EXTERNAL_PROJECTS_ENABLED}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            externo: {
                              ...current.externo,
                              tratamentoProducao: event.target.value,
                            },
                          }))
                        }
                        className={
                          isLocked || !EXTERNAL_PROJECTS_ENABLED
                            ? disabledInputClassName
                            : textareaClassName
                        }
                        placeholder="Descreva como a produção intelectual será tratada."
                      />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-neutral/20 bg-neutral/5 p-5">
              <h3 className="text-sm font-bold text-primary">
                Resumo da edição
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <Info label="Status" value={getStatusLabel(form.status)} />
                <Info label="Tipo" value={form.tipo === "interno" ? "Interno" : "Externo"} />
                <Info label="Edital" value={form.editalPesquisa} />
                <Info label="Membros" value={`${form.membros.length} membro(s)`} />
                <Info label="ODS" value={`${form.objetivosDS.length} ODS vinculado(s)`} />
                <Info label="Cronograma" value={`${form.cronograma.length} atividade(s)`} />
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
                onClick={saveProject}
                disabled={saving || isLocked || !canStep5}
                className={cx(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                  saving || isLocked || !canStep5
                    ? "cursor-not-allowed bg-neutral/10 text-neutral"
                    : "bg-primary text-white hover:bg-primary/90"
                )}
              >
                <Save size={16} />
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}