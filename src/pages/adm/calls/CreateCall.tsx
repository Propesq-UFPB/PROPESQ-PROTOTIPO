import React, { useMemo, useRef, useState } from "react"
import {
  Upload,
  FileText,
  CalendarRange,
  Save,
  X,
  Check,
  AlertTriangle,
  Info,
  Link as LinkIcon,
  Eye,
  Clock,
  Tag,
} from "lucide-react"

type Status = "DRAFT" | "PUBLISHED"

function normalize(s: string) {
  return s.trim().toLowerCase()
}

function yearNow() {
  return new Date().getFullYear()
}

export default function CreateCall() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  // ===== File =====
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string>("")

  const fileName = file?.name ?? ""

  // ===== Form =====
  const [title, setTitle] = useState("")
  const [code, setCode] = useState("") // ex.: EDITAL_01_2026
  const [baseYear, setBaseYear] = useState<string>(String(yearNow()))
  const [quotaStart, setQuotaStart] = useState<string>("")
  const [quotaEnd, setQuotaEnd] = useState<string>("")
  const [externalLink, setExternalLink] = useState<string>("")

  // Metadados essenciais (mais estruturados)
  const [modality, setModality] = useState<string>("INICIACAO_CIENTIFICA")
  const [funding, setFunding] = useState<string>("UFPB") // placeholder (pode virar select vindo de "Entidades & Bolsas")
  const [tags, setTags] = useState<string>("") // texto; vira chips
  const [notes, setNotes] = useState<string>("")

  // Status
  const [status, setStatus] = useState<Status>("DRAFT")

  // ===== Derived =====
  const fileSizeMb = useMemo(() => {
    if (!file) return 0
    return Math.round((file.size / (1024 * 1024)) * 10) / 10
  }, [file])

  const tagsList = useMemo(() => {
    const parts = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
    // remove duplicatas
    const seen = new Set<string>()
    return parts.filter((p) => {
      const k = normalize(p)
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
  }, [tags])

  const dateError = useMemo(() => {
    if (!quotaStart || !quotaEnd) return ""
    if (quotaEnd < quotaStart) return "A data de fim não pode ser anterior ao início."
    return ""
  }, [quotaStart, quotaEnd])

  const requiredErrors = useMemo(() => {
    const errs: string[] = []
    if (!title.trim()) errs.push("Informe o título do edital.")
    if (!baseYear.trim()) errs.push("Informe o ano-base.")
    if (!quotaStart || !quotaEnd) errs.push("Informe o período de vigência da cota (início e fim).")
    if (dateError) errs.push(dateError)
    if (!file) errs.push("Faça upload do PDF do edital.")
    return errs
  }, [title, baseYear, quotaStart, quotaEnd, dateError, file])

  const canSaveDraft = useMemo(() => {
    // rascunho pode existir com menos dados, mas exige pelo menos título
    return !!title.trim()
  }, [title])

  const canPublish = requiredErrors.length === 0

  // ===== Handlers =====
  function onPickFile(f?: File | null) {
    setFileError("")
    if (!f) {
      setFile(null)
      return
    }
    if (f.type !== "application/pdf") {
      setFile(null)
      setFileError("Formato inválido. Envie um arquivo PDF.")
      return
    }
    // Limite simples (ajuste conforme sua regra)
    const maxMb = 25
    const mb = f.size / (1024 * 1024)
    if (mb > maxMb) {
      setFile(null)
      setFileError(`Arquivo muito grande (${Math.round(mb)}MB). Limite: ${maxMb}MB.`)
      return
    }
    setFile(f)
  }

  function removeFile() {
    setFile(null)
    setFileError("")
    if (inputRef.current) inputRef.current.value = ""
  }

  function autoCodeFromTitle() {
    const y = baseYear?.trim() || String(yearNow())
    const clean = title
      .trim()
      .toUpperCase()
      .replace(/[^\p{L}\p{N}]+/gu, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
    setCode(`${clean}_${y}`.slice(0, 40))
  }

  function saveDraft() {
    setStatus("DRAFT")
    // TODO: integrar com API
    // payload: {title, code, baseYear, quotaStart, quotaEnd, modality, funding, tagsList, notes, externalLink, status: 'DRAFT', file}
    alert("Rascunho salvo (placeholder).")
  }

  function publish() {
    // validação final
    if (!canPublish) return
    setStatus("PUBLISHED")
    // TODO: integrar com API
    alert("Edital publicado (placeholder).")
  }

  function resetForm() {
    setFile(null)
    setFileError("")
    if (inputRef.current) inputRef.current.value = ""
    setTitle("")
    setCode("")
    setBaseYear(String(yearNow()))
    setQuotaStart("")
    setQuotaEnd("")
    setExternalLink("")
    setModality("INICIACAO_CIENTIFICA")
    setFunding("UFPB")
    setTags("")
    setNotes("")
    setStatus("DRAFT")
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-primary">Criar Edital</h1>
        <p className="text-sm text-neutral">
          Registre o edital com upload do PDF e metadados essenciais (Ano-base e vigência da cota).
        </p>
      </header>

      {/* ===== Progresso / Estado ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-3">
        <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <h2 className="text-sm font-semibold text-primary">Status do registro</h2>
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border
              ${
                status === "PUBLISHED"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-neutral-50 text-neutral border-neutral-light"
              }`}
          >
            {status === "PUBLISHED" ? <Check size={14} /> : <Info size={14} />}
            {status === "PUBLISHED" ? "Publicado" : "Rascunho"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">PDF</p>
            <p className="text-sm font-semibold text-primary">{file ? "OK" : "Pendente"}</p>
          </div>
          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Título</p>
            <p className="text-sm font-semibold text-primary">{title.trim() ? "OK" : "Pendente"}</p>
          </div>
          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Ano-base</p>
            <p className="text-sm font-semibold text-primary">{baseYear.trim() ? "OK" : "Pendente"}</p>
          </div>
          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Vigência</p>
            <p className="text-sm font-semibold text-primary">
              {quotaStart && quotaEnd && !dateError ? "OK" : "Pendente"}
            </p>
          </div>
        </div>

        {requiredErrors.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 text-amber-700" />
              <div>
                <p className="text-sm font-semibold text-amber-900">Pendências para publicar</p>
                <ul className="list-disc list-inside text-sm text-amber-900/90 mt-1 space-y-1">
                  {requiredErrors.slice(0, 6).map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
                <p className="text-xs text-amber-900/80 mt-2">
                  Você pode salvar rascunho mesmo com pendências (mínimo: título).
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-6">
        {/* ===== Upload PDF ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Upload size={18} />
            <h2 className="text-sm font-semibold text-primary">PDF do Edital</h2>
          </div>

          <div className="rounded-lg border border-dashed border-neutral-light p-6">
            <label className="block text-sm text-neutral cursor-pointer">
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
              />

              <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neutral-light/60">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-primary">
                      {file ? "PDF selecionado" : "Clique para selecionar o PDF"}
                    </p>
                    <p className="text-xs text-neutral mt-1">
                      {file
                        ? `${fileName} • ${fileSizeMb}MB`
                        : "Somente PDF • limite sugerido: 25MB"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {file && (
                    <>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light text-neutral hover:bg-neutral-50"
                        onClick={() => alert("Preview (placeholder). Aqui você pode abrir o PDF em um viewer.")}
                      >
                        <Eye size={16} />
                        Visualizar
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50"
                        onClick={removeFile}
                      >
                        <X size={16} />
                        Remover
                      </button>
                    </>
                  )}
                </div>
              </div>
            </label>
          </div>

          {fileError && <p className="text-sm text-red-600">{fileError}</p>}
        </div>

        {/* ===== Metadados essenciais ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag size={18} />
            <h2 className="text-sm font-semibold text-primary">Metadados</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Título do edital *</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Ex.: PIBIC 2026"
              />
            </label>

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Código interno (opcional)</span>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Ex.: EDITAL_PIBIC_2026"
                />
                <button
                  type="button"
                  onClick={autoCodeFromTitle}
                  className="px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light text-neutral hover:bg-neutral-50 whitespace-nowrap"
                >
                  Gerar
                </button>
              </div>
              <p className="text-[11px] text-neutral mt-1">
                Útil para integração/relatórios. Você pode deixar em branco.
              </p>
            </label>

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Ano-base *</span>
              <input
                value={baseYear}
                onChange={(e) => setBaseYear(e.target.value)}
                inputMode="numeric"
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Ex.: 2026"
              />
              <p className="text-[11px] text-neutral mt-1">Ano de referência para cotas e relatórios.</p>
            </label>

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Modalidade</span>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="INICIACAO_CIENTIFICA">Iniciação Científica</option>
                <option value="INICIACAO_TECNOLOGICA">Iniciação Tecnológica</option>
                <option value="EXTENSAO">Extensão</option>
                <option value="POS_GRADUACAO">Pós-graduação</option>
                <option value="OUTRA">Outra</option>
              </select>
            </label>

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Fonte/Programa (opcional)</span>
              <input
                value={funding}
                onChange={(e) => setFunding(e.target.value)}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Ex.: PROPESQ / UFPB"
              />
              {/*Nota: Idealmente é pra ser um select integrado a “Entidades & Tipos de Bolsa”.*/}
            </label>

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Link externo (opcional)</span>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
                <input
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  className="w-full pl-9 border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Ex.: página do edital no site institucional"
                />
              </div>
            </label>

            <label className="text-sm md:col-span-2">
              <span className="block text-xs text-neutral mb-1">Tags (opcional)</span>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Ex.: PIBIC, IC, UFPB, 2026 (separe por vírgula)"
              />
              {tagsList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tagsList.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full border border-neutral-light bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </label>

            <label className="text-sm md:col-span-2">
              <span className="block text-xs text-neutral mb-1">Observações internas (opcional)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 min-h-[90px] outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Ex.: critérios principais, restrições, notas para equipe administrativa..."
              />
            </label>
          </div>
        </div>

        {/* ===== Vigência da cota ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarRange size={18} />
            <h2 className="text-sm font-semibold text-primary">Vigência da Cota *</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Início *</span>
              <input
                type="date"
                value={quotaStart}
                onChange={(e) => setQuotaStart(e.target.value)}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Fim *</span>
              <input
                type="date"
                value={quotaEnd}
                onChange={(e) => setQuotaEnd(e.target.value)}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>

          {dateError && <p className="text-sm text-red-600">{dateError}</p>}

          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
            <Info size={16} className="mt-0.5 text-neutral" />
            <p className="text-xs text-neutral">
              A vigência da cota é usada para controlar períodos de indicação/implementação de bolsas e relatórios do edital.
            </p>
          </div>
        </div>

        {/* ===== Actions ===== */}
        <div className="flex items-center justify-between gap-3 flex-col md:flex-row">
          <button
            type="button"
            onClick={resetForm}
            className="px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light text-neutral hover:bg-neutral-50 w-full md:w-auto"
          >
            Limpar
          </button>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={saveDraft}
              disabled={!canSaveDraft}
              className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white w-full md:w-auto
                ${!canSaveDraft ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}`}
            >
              <Save size={16} />
              Salvar rascunho
            </button>

            <button
              type="button"
              onClick={publish}
              disabled={!canPublish}
              className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border w-full md:w-auto
                ${
                  !canPublish
                    ? "border-neutral-light text-neutral/40 bg-neutral-50 cursor-not-allowed"
                    : "border-green-200 bg-green-50 text-green-700 hover:opacity-95"
                }`}
            >
              <Check size={16} />
              Publicar
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
