import React, { useMemo, useState } from "react"
import { CalendarClock, Save, Check, AlertTriangle, Info, Clock, RotateCcw } from "lucide-react"

type StageKey = "SUBMISSAO" | "INDICACAO" | "RELATORIO_PARCIAL" | "RELATORIO_FINAL" | "ENIC"

type Stage = {
  key: StageKey
  title: string
  hint: string
  start: string // datetime-local value
  end: string // datetime-local value
  required: boolean
}

function isFilled(s: string) {
  return !!s && s.trim().length > 0
}

function parseLocal(dt: string) {
  // dt no formato "YYYY-MM-DDTHH:mm" -> Date (local)
  if (!isFilled(dt)) return null
  const d = new Date(dt)
  return Number.isNaN(d.getTime()) ? null : d
}

function fmt(dt: string) {
  if (!isFilled(dt)) return "—"
  // Mostra "dd/mm/aaaa hh:mm" sem depender de libs
  const d = parseLocal(dt)
  if (!d) return "—"
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, "0")
  const min = String(d.getMinutes()).padStart(2, "0")
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}

function durationHours(start: string, end: string) {
  const a = parseLocal(start)
  const b = parseLocal(end)
  if (!a || !b) return null
  const ms = b.getTime() - a.getTime()
  if (ms <= 0) return null
  return Math.round((ms / (1000 * 60 * 60)) * 10) / 10
}

function rowError(s: Stage) {
  const a = parseLocal(s.start)
  const b = parseLocal(s.end)

  if (s.required && (!a || !b)) return "Preencha início e fim."
  if ((!a && b) || (a && !b)) return "Preencha ambos: início e fim."
  if (a && b && b.getTime() <= a.getTime()) return "Fim deve ser após o início."
  return ""
}

function scheduleWarnings(stages: Stage[]) {
  // Regras de consistência (simples e úteis):
  // 1) Indicação deve ser após término da submissão
  // 2) Relatório parcial deve ser após início da indicação (ou após fim da submissão)
  // 3) Relatório final deve ser após relatório parcial
  // 4) ENIC deve ser após submissão (ou após final)
  const byKey = Object.fromEntries(stages.map((s) => [s.key, s])) as Record<StageKey, Stage>

  const warnings: string[] = []

  const subEnd = parseLocal(byKey.SUBMISSAO.end)
  const indStart = parseLocal(byKey.INDICACAO.start)
  const rpStart = parseLocal(byKey.RELATORIO_PARCIAL.start)
  const rfStart = parseLocal(byKey.RELATORIO_FINAL.start)
  const enicStart = parseLocal(byKey.ENIC.start)

  if (subEnd && indStart && indStart.getTime() < subEnd.getTime()) {
    warnings.push("A Indicação de bolsistas começa antes do fim da Submissão de projetos.")
  }
  if (indStart && rpStart && rpStart.getTime() < indStart.getTime()) {
    warnings.push("O Relatório Parcial começa antes da Indicação de bolsistas.")
  }
  const rpEnd = parseLocal(byKey.RELATORIO_PARCIAL.end)
  if (rpEnd && rfStart && rfStart.getTime() < rpEnd.getTime()) {
    warnings.push("O Relatório Final começa antes do fim do Relatório Parcial.")
  }
  if (subEnd && enicStart && enicStart.getTime() < subEnd.getTime()) {
    warnings.push("A Submissão de resumos para o ENIC começa antes do fim da Submissão de projetos.")
  }

  return warnings
}

function StageRow({
  stage,
  onChange,
}: {
  stage: Stage
  onChange: (patch: Partial<Stage>) => void
}) {
  const err = rowError(stage)
  const hours = durationHours(stage.start, stage.end)

  return (
    <div className="rounded-xl border border-neutral-light p-4 space-y-3">
      <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-primary">{stage.title}</p>
          <p className="text-xs text-neutral">{stage.hint}</p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border
              ${
                err
                  ? "bg-red-50 text-red-700 border-red-200"
                  : stage.start && stage.end
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-neutral-50 text-neutral border-neutral-light"
              }`}
          >
            {err ? <AlertTriangle size={14} /> : stage.start && stage.end ? <Check size={14} /> : <Clock size={14} />}
            {err ? "Revisar" : stage.start && stage.end ? "OK" : "Pendente"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="block text-xs text-neutral mb-1">Início</span>
          <input
            type="datetime-local"
            value={stage.start}
            onChange={(e) => onChange({ start: e.target.value })}
            className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label className="text-sm">
          <span className="block text-xs text-neutral mb-1">Fim</span>
          <input
            type="datetime-local"
            value={stage.end}
            onChange={(e) => onChange({ end: e.target.value })}
            className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>

      <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
        {err ? (
          <p className="text-sm text-red-600">{err}</p>
        ) : (
          <p className="text-xs text-neutral">
            Período: <span className="font-semibold text-primary">{fmt(stage.start)}</span> →{" "}
            <span className="font-semibold text-primary">{fmt(stage.end)}</span>
            {hours ? (
              <>
                {" "}
                <span className="text-neutral">•</span> Duração:{" "}
                <span className="font-semibold text-primary">{hours}h</span>
              </>
            ) : null}
          </p>
        )}

        {!stage.required && (
          <span className="text-[11px] text-neutral border border-neutral-light bg-neutral-50 rounded-full px-3 py-1">
            opcional
          </span>
        )}
      </div>
    </div>
  )
}

export default function CallSchedule() {
  const [stages, setStages] = useState<Stage[]>([
    {
      key: "SUBMISSAO",
      title: "Submissão de projetos",
      hint: "Janela em que coordenadores submetem propostas no sistema.",
      start: "",
      end: "",
      required: true,
    },
    {
      key: "INDICACAO",
      title: "Indicação de bolsistas (pós-resultado)",
      hint: "Período para coordenadores indicarem bolsistas após divulgação do resultado.",
      start: "",
      end: "",
      required: true,
    },
    {
      key: "RELATORIO_PARCIAL",
      title: "Entrega de relatório parcial",
      hint: "Coleta intermediária de progresso do projeto (parcial).",
      start: "",
      end: "",
      required: false,
    },
    {
      key: "RELATORIO_FINAL",
      title: "Entrega de relatório final",
      hint: "Encerramento do projeto e entrega do relatório final.",
      start: "",
      end: "",
      required: true,
    },
    {
      key: "ENIC",
      title: "Submissão de resumos para o ENIC",
      hint: "Janela de envio de resumos vinculados ao edital para participação no ENIC.",
      start: "",
      end: "",
      required: false,
    },
  ])

  const errors = useMemo(() => stages.map(rowError).filter(Boolean), [stages])
  const warnings = useMemo(() => scheduleWarnings(stages), [stages])

  const canSave = errors.length === 0 && stages.some((s) => s.start || s.end)

  function updateStage(key: StageKey, patch: Partial<Stage>) {
    setStages((prev) => prev.map((s) => (s.key === key ? { ...s, ...patch } : s)))
  }

  function applyTemplate() {
    // Placeholder: aplica um template mínimo (ajuste conforme sua regra real)
    // Ex.: submissão por 30 dias, indicação 10 dias depois por 15 dias etc.
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, "0")
    const toLocalInput = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`

    const d1 = new Date(now)
    d1.setDate(d1.getDate() + 1)
    d1.setHours(8, 0, 0, 0)

    const d2 = new Date(d1)
    d2.setDate(d2.getDate() + 30)
    d2.setHours(23, 59, 0, 0)

    const d3 = new Date(d2)
    d3.setDate(d3.getDate() + 1)
    d3.setHours(8, 0, 0, 0)

    const d4 = new Date(d3)
    d4.setDate(d4.getDate() + 15)
    d4.setHours(23, 59, 0, 0)

    const d5 = new Date(d2)
    d5.setMonth(d5.getMonth() + 5)
    d5.setHours(8, 0, 0, 0)

    const d6 = new Date(d5)
    d6.setDate(d6.getDate() + 15)
    d6.setHours(23, 59, 0, 0)

    setStages((prev) =>
      prev.map((s) => {
        if (s.key === "SUBMISSAO") return { ...s, start: toLocalInput(d1), end: toLocalInput(d2) }
        if (s.key === "INDICACAO") return { ...s, start: toLocalInput(d3), end: toLocalInput(d4) }
        if (s.key === "RELATORIO_FINAL") return { ...s, start: toLocalInput(d5), end: toLocalInput(d6) }
        return s
      })
    )
  }

  function reset() {
    setStages((prev) => prev.map((s) => ({ ...s, start: "", end: "" })))
  }

  function saveSchedule() {
    if (errors.length) return
    // TODO: integrar com API (persistir por edital)
    alert("Cronograma salvo (placeholder).")
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-primary">Cronograma Crítico</h1>
        <p className="text-sm text-neutral">
          Defina datas para submissão, indicação de bolsistas, entrega de relatórios (parcial/final) e submissão ENIC.
        </p>
      </header>

      {/* ===== Resumo / validações ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <CalendarClock size={18} />
            <h2 className="text-sm font-semibold text-primary">Validação do cronograma</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={applyTemplate}
              className="px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light text-neutral hover:bg-neutral-50"
            >
              Aplicar template
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light text-neutral hover:bg-neutral-50"
            >
              <RotateCcw size={16} />
              Limpar
            </button>
          </div>
        </div>

        {errors.length === 0 ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 text-green-700" />
              <div>
                <p className="text-sm font-semibold text-green-900">Sem erros de preenchimento.</p>
                <p className="text-xs text-green-900/80 mt-1">
                  Você ainda pode revisar avisos de consistência abaixo (não bloqueiam salvar).
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 text-red-700" />
              <div>
                <p className="text-sm font-semibold text-red-900">Há erros no cronograma.</p>
                <ul className="list-disc list-inside text-sm text-red-900/90 mt-1 space-y-1">
                  {errors.slice(0, 6).map((e, i) => (
                    <li key={`${e}_${i}`}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <Info size={16} className="mt-0.5 text-amber-700" />
              <div>
                <p className="text-sm font-semibold text-amber-900">Avisos de consistência</p>
                <ul className="list-disc list-inside text-sm text-amber-900/90 mt-1 space-y-1">
                  {warnings.map((w, i) => (
                    <li key={`${w}_${i}`}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===== Etapas ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-5">
        <div className="flex items-center gap-2">
          <CalendarClock size={18} />
          <h2 className="text-sm font-semibold text-primary">Etapas</h2>
        </div>

        <div className="space-y-4">
          {stages.map((s) => (
            <StageRow key={s.key} stage={s} onChange={(patch) => updateStage(s.key, patch)} />
          ))}
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
          <Info size={16} className="mt-0.5 text-neutral" />
          <p className="text-xs text-neutral">
            O sistema pode usar essas datas para habilitar/desabilitar ações automaticamente (ex.: bloquear submissão
            fora do prazo e liberar indicação após o resultado).
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={saveSchedule}
            disabled={!canSave}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
              ${!canSave ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}`}
          >
            <Save size={16} />
            Salvar cronograma
          </button>
        </div>
      </section>
    </div>
  )
}
