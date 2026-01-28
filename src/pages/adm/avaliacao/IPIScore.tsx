import React, { useMemo, useState } from "react"
import {
  LineChart,
  ClipboardList,
  Settings,
  Plus,
  Trash2,
  Save,
  Info,
  AlertTriangle,
  Check,
  BookOpen,
  ChevronDown,
  UserCheck,
} from "lucide-react"

type Call = { id: string; title: string; baseYear: number }

type Row = {
  id: string
  item: string // "Artigo A1", "Livro", "Patente" etc.
  weight: string // pontos por unidade
  maxPoints: string // teto no critério
}

type PQRule = {
  enabled: boolean
  mode: "MAX_AUTOMATIC" | "BONUS_PERCENT" | "CUSTOM"
  maxCriteriaAuto: boolean // aplica teto automático nos critérios/tabela
  bonusPercent: string // se mode BONUS_PERCENT
  notes: string
}

function normalize(s: string) {
  return s.trim().toLowerCase()
}

function uid(prefix = "row") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

function toNumberOrNull(v: string) {
  const n = Number(String(v).replace(",", "."))
  return Number.isFinite(n) ? n : null
}

function rowError(r: Row) {
  if (!r.item.trim()) return "Tipo de produção é obrigatório."
  const w = toNumberOrNull(r.weight)
  const m = toNumberOrNull(r.maxPoints)
  if (w === null || w < 0) return "Peso deve ser um número ≥ 0."
  if (m === null || m < 0) return "Limite máximo deve ser um número ≥ 0."
  if (m !== null && w !== null && m > 0 && w > m) return "Peso não pode ser maior que o limite máximo."
  return ""
}

export default function IPIScore() {
  // ===== Edital selecionado (por edital) =====
  const [calls] = useState<Call[]>([
    { id: "call_2026_01", title: "Edital PROPESQ 01/2026", baseYear: 2026 },
    { id: "call_2026_02", title: "Edital Inovação 02/2026", baseYear: 2026 },
    { id: "call_2025_03", title: "PIBIC 03/2025", baseYear: 2025 },
  ])
  const [selectedCallId, setSelectedCallId] = useState(calls[0]?.id ?? "")
  const selectedCall = useMemo(() => calls.find((c) => c.id === selectedCallId) ?? null, [calls, selectedCallId])

  // ===== Config por edital (mock local) =====
  const [rowsByCall, setRowsByCall] = useState<Record<string, Row[]>>({
    call_2026_01: [
      { id: "1", item: "Artigo A1", weight: "10", maxPoints: "50" },
      { id: "2", item: "Artigo A2", weight: "8", maxPoints: "40" },
      { id: "3", item: "Patente", weight: "12", maxPoints: "24" },
    ],
    call_2026_02: [{ id: "1", item: "Artigo A1", weight: "12", maxPoints: "60" }],
    call_2025_03: [{ id: "1", item: "Livro", weight: "6", maxPoints: "24" }],
  })

  const [validityByCall, setValidityByCall] = useState<Record<string, { fromYear: string; toYear: string }>>({
    call_2026_01: { fromYear: "2021", toYear: "2024" },
    call_2026_02: { fromYear: "2022", toYear: "2025" },
    call_2025_03: { fromYear: "2020", toYear: "2023" },
  })

  const [pqByCall, setPqByCall] = useState<Record<string, PQRule>>({
    call_2026_01: { enabled: true, mode: "MAX_AUTOMATIC", maxCriteriaAuto: true, bonusPercent: "0", notes: "" },
    call_2026_02: { enabled: false, mode: "MAX_AUTOMATIC", maxCriteriaAuto: true, bonusPercent: "0", notes: "" },
    call_2025_03: { enabled: true, mode: "BONUS_PERCENT", maxCriteriaAuto: false, bonusPercent: "10", notes: "Bônus de 10% no IPI." },
  })

  const [dirty, setDirty] = useState(false)

  const rows = rowsByCall[selectedCallId] ?? []
  const validity = validityByCall[selectedCallId] ?? { fromYear: "", toYear: "" }
  const pq = pqByCall[selectedCallId] ?? { enabled: false, mode: "MAX_AUTOMATIC", maxCriteriaAuto: true, bonusPercent: "0", notes: "" }

  // ===== Validações =====
  const tableErrors = useMemo(() => {
    const errs: string[] = []
    const seen = new Set<string>()
    for (const r of rows) {
      const e = rowError(r)
      if (e) errs.push(`${r.item || "Item"}: ${e}`)
      const key = normalize(r.item)
      if (key && seen.has(key)) errs.push(`Item duplicado: "${r.item}".`)
      if (key) seen.add(key)
    }
    return errs
  }, [rows])

  const validityError = useMemo(() => {
    const a = Number(validity.fromYear)
    const b = Number(validity.toYear)
    if (!validity.fromYear || !validity.toYear) return "Informe o intervalo de anos (início e fim)."
    if (!Number.isFinite(a) || !Number.isFinite(b)) return "Anos inválidos."
    if (b < a) return "Ano final não pode ser menor que o ano inicial."
    return ""
  }, [validity])

  const pqError = useMemo(() => {
    if (!pq.enabled) return ""
    if (pq.mode === "BONUS_PERCENT") {
      const n = toNumberOrNull(pq.bonusPercent)
      if (n === null || n < 0 || n > 100) return "Bônus (%) deve ser entre 0 e 100."
    }
    return ""
  }, [pq])

  const canSave = tableErrors.length === 0 && !validityError && !pqError

  // ===== Actions =====
  const addRow = () => {
    setRowsByCall((prev) => ({
      ...prev,
      [selectedCallId]: [...(prev[selectedCallId] ?? []), { id: uid(), item: "", weight: "", maxPoints: "" }],
    }))
    setDirty(true)
  }

  const updateRow = (id: string, key: keyof Row, value: string) => {
    setRowsByCall((prev) => ({
      ...prev,
      [selectedCallId]: (prev[selectedCallId] ?? []).map((r) => (r.id === id ? { ...r, [key]: value } : r)),
    }))
    setDirty(true)
  }

  const removeRow = (id: string) => {
    setRowsByCall((prev) => ({
      ...prev,
      [selectedCallId]: (prev[selectedCallId] ?? []).filter((r) => r.id !== id),
    }))
    setDirty(true)
  }

  const updateValidity = (patch: Partial<{ fromYear: string; toYear: string }>) => {
    setValidityByCall((prev) => ({ ...prev, [selectedCallId]: { ...(prev[selectedCallId] ?? { fromYear: "", toYear: "" }), ...patch } }))
    setDirty(true)
  }

  const updatePQ = (patch: Partial<PQRule>) => {
    setPqByCall((prev) => ({ ...prev, [selectedCallId]: { ...(prev[selectedCallId] ?? pq), ...patch } }))
    setDirty(true)
  }

  const saveAll = () => {
    if (!canSave) return
    setDirty(false)
    // TODO: API -> salvar por edital: tabela, validade, regra PQ
    alert("Configurações de Pontuação & IPI salvas (placeholder).")
  }

  if (!selectedCall) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-xl font-bold text-primary">Pontuação & IPI</h1>
          <p className="text-sm text-neutral">Nenhum edital encontrado.</p>
        </header>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-primary">Pontuação & IPI</h1>
        <p className="text-sm text-neutral">
          Configure por edital: tabela de pontos (pesos e limites), validade temporal e tratamento de docentes PQ.
          <br></br>
          <span className="font-semibold text-red-700">É necessária a definição da regra de negócio para esta página.</span>
        </p>
      </header>

      {/* ===== Seleção do edital ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <BookOpen size={18} />
          <h2 className="text-sm font-semibold text-primary">Edital</h2>

          {dirty && (
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border bg-amber-50 text-amber-800 border-amber-200">
              <AlertTriangle size={14} />
              Alterações não salvas
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm">
            <span className="block text-xs text-neutral mb-1">
              Escolha o edital
            </span>

            <div className="relative">
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none"
              />

              <select
                value={selectedCallId}
                onChange={(e) => {
                  setSelectedCallId(e.target.value)
                  setDirty(false) // contexto mudou; se preferir, mantenha e mostre modal de aviso
                }}
                className="w-full appearance-none border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
              >
                {calls
                  .slice()
                  .sort((a, b) => b.baseYear - a.baseYear)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} • {c.baseYear}
                    </option>
                  ))}
              </select>
            </div>
          </label>

          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Resumo</p>
            <p className="text-sm font-semibold text-primary">{selectedCall.title}</p>
            <p className="text-xs text-neutral mt-1">
              Ano-base: <span className="font-semibold text-primary">{selectedCall.baseYear}</span>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
          <Info size={16} className="mt-0.5 text-neutral" />
          <p className="text-xs text-neutral">
            Essa página controla apenas <span className="font-semibold">pontuação/IPI</span>. Fórmula de ranking e cotas ficam em{" "}
            <span className="font-semibold">Classificação</span>.
          </p>
        </div>
      </section>

      {/* ===== Validade temporal (global do edital) ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Settings size={18} />
          <h2 className="text-sm font-semibold text-primary">Regra de Validade Temporal</h2>
        </div>

        <p className="text-sm text-neutral">
          O sistema aceitará apenas produções dentro do intervalo definido (ex.: 2021 a 2024).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <label className="text-sm">
            <span className="block text-xs text-neutral mb-1">Ano inicial</span>
            <input
              value={validity.fromYear}
              onChange={(e) => updateValidity({ fromYear: e.target.value })}
              inputMode="numeric"
              className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Ex.: 2021"
            />
          </label>

          <label className="text-sm">
            <span className="block text-xs text-neutral mb-1">Ano final</span>
            <input
              value={validity.toYear}
              onChange={(e) => updateValidity({ toYear: e.target.value })}
              inputMode="numeric"
              className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Ex.: 2024"
            />
          </label>

          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Status</p>
            {!validityError ? (
              <p className="text-sm font-semibold text-primary inline-flex items-center gap-2">
                <Check size={16} /> OK
              </p>
            ) : (
              <p className="text-sm font-semibold text-amber-800 inline-flex items-center gap-2">
                <AlertTriangle size={16} /> Revisar
              </p>
            )}
            <p className="text-xs text-neutral mt-1">
              Intervalo: <span className="font-semibold text-primary">{validity.fromYear || "—"}</span> →{" "}
              <span className="font-semibold text-primary">{validity.toYear || "—"}</span>
            </p>
          </div>
        </div>

        {validityError && <p className="text-sm text-amber-800">{validityError}</p>}
      </section>

      {/* ===== Tratamento PQ (por edital) ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-center gap-2">
          <UserCheck size={18} />
          <h2 className="text-sm font-semibold text-primary">Tratamento de Pesquisador Produtividade (PQ)</h2>
        </div>

        <div className="flex items-center justify-between gap-3 flex-col md:flex-row md:items-center">
          <div>
            <p className="text-sm text-neutral">
              Opção para docentes com flag <span className="font-semibold">PQ</span> receberem regras diferenciadas conforme o edital.
            </p>
            <p className="text-xs text-neutral mt-1">
              Ex.: pontuação máxima automática em critérios selecionados.
            </p>
          </div>

          <button
            type="button"
            onClick={() => updatePQ({ enabled: !pq.enabled })}
            className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors
              ${pq.enabled ? "bg-primary text-white border-primary" : "bg-white text-primary border-primary"}
            `}
          >
            {pq.enabled ? "Ativo" : "Inativo"}
          </button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${!pq.enabled ? "opacity-60 pointer-events-none" : ""}`}>
          <label className="text-sm">
            <span className="block text-xs text-neutral mb-1">Modo</span>
            <select
              value={pq.mode}
              onChange={(e) => updatePQ({ mode: e.target.value as PQRule["mode"] })}
              className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="MAX_AUTOMATIC">Teto automático em critérios</option>
              <option value="BONUS_PERCENT">Bônus (%) no IPI</option>
              <option value="CUSTOM">Custom (placeholder)</option>
            </select>
          </label>

          <label className="text-sm">
            <span className="block text-xs text-neutral mb-1">Aplicar teto automático</span>
            <select
              value={pq.maxCriteriaAuto ? "YES" : "NO"}
              onChange={(e) => updatePQ({ maxCriteriaAuto: e.target.value === "YES" })}
              className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="YES">Sim (usar maxPoints)</option>
              <option value="NO">Não</option>
            </select>
            <p className="text-[11px] text-neutral mt-1">Quando “Sim”, PQ pode receber automaticamente o máximo de certos critérios.</p>
          </label>

          <label className="text-sm">
            <span className="block text-xs text-neutral mb-1">Bônus (%)</span>
            <input
              value={pq.bonusPercent}
              onChange={(e) => updatePQ({ bonusPercent: e.target.value })}
              className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Ex.: 10"
              disabled={pq.mode !== "BONUS_PERCENT"}
            />
            {pq.mode === "BONUS_PERCENT" && pqError && <p className="text-xs text-amber-800 mt-1">{pqError}</p>}
          </label>

          <label className="text-sm md:col-span-3">
            <span className="block text-xs text-neutral mb-1">Observações (opcional)</span>
            <textarea
              value={pq.notes}
              onChange={(e) => updatePQ({ notes: e.target.value })}
              className="w-full border border-neutral-light rounded-lg px-3 py-2 min-h-[80px] outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Ex.: PQ recebe teto automático apenas em Artigos A1/A2."
            />
          </label>
        </div>

        {/* 
        A flag PQ deve existir no cadastro do docente. Aqui você define apenas como o edital trata docentes PQ no cálculo do IPI.
        */}
      </section>

      {/* ===== Editor de Tabela de Pontos (por edital) ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-col md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <ClipboardList size={18} />
            <h2 className="text-sm font-semibold text-primary">Editor de Tabela de Pontos (IPI)</h2>
          </div>

          <button
            onClick={addRow}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:opacity-90"
          >
            <Plus size={16} />
            Adicionar item
          </button>
        </div>

        <p className="text-sm text-neutral">
          Cada item define pontuação por produção e um teto máximo no critério.
          <span className="font-semibold text-primary"> Ex.: Artigo A1 = 10 pontos, máximo 50.</span>
        </p>

        {tableErrors.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 text-amber-700" />
              <div>
                <p className="text-sm font-semibold text-amber-900">Erros na tabela</p>
                <ul className="list-disc list-inside text-sm text-amber-900/90 mt-1 space-y-1">
                  {tableErrors.slice(0, 6).map((e, i) => (
                    <li key={`${e}_${i}`}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-neutral">
                <th className="py-2 pr-3">Tipo de produção</th>
                <th className="py-2 pr-3">Peso (pontos)</th>
                <th className="py-2 pr-3">Limite máximo (teto)</th>
                <th className="py-2 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-neutral-light">
                  <td className="py-2 pr-3">
                    <input
                      className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                      value={r.item}
                      onChange={(e) => updateRow(r.id, "item", e.target.value)}
                      placeholder="Ex.: Artigo A1"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                      value={r.weight}
                      onChange={(e) => updateRow(r.id, "weight", e.target.value)}
                      placeholder="Ex.: 10"
                      inputMode="decimal"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                      value={r.maxPoints}
                      onChange={(e) => updateRow(r.id, "maxPoints", e.target.value)}
                      placeholder="Ex.: 50"
                      inputMode="decimal"
                    />
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => removeRow(r.id)}
                      className="p-2 rounded-lg hover:bg-neutral-light"
                      aria-label="Remover"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-neutral px-2">
                    Nenhum item cadastrado. Clique em “Adicionar item”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
          <LineChart size={16} className="mt-0.5 text-neutral" />
          <p className="text-xs text-neutral">
            O cálculo do IPI deve aplicar: <span className="font-semibold">peso por item</span> respeitando o{" "}
            <span className="font-semibold">limite máximo</span> e filtrando produções pelo{" "}
            <span className="font-semibold">intervalo de anos</span>.
          </p>
        </div>
      </section>

      {/* ===== Ações ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5">
        <div className="flex items-center justify-end gap-2 flex-col md:flex-row">
          <button
            type="button"
            onClick={saveAll}
            disabled={!canSave}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white w-full md:w-auto
              ${!canSave ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}`}
          >
            <Save size={16} />
            Salvar configurações do edital
          </button>
        </div>
      </section>
    </div>
  )
}
