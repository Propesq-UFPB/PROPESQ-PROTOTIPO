// src/pages/admin/projects/ProjectCommunication.tsx
import React, { useMemo, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  Paperclip,
  Search,
  Send,
  Users,
  X,
} from "lucide-react"

import { projetos } from "@/mock/data"

/* ================= TIPOS ================= */

type RecipientMode = "COORDENADORES" | "DISCENTES"

type Projeto = {
  id: string | number
  titulo: string
  status?: string
  tipo?: "interno" | "externo"
  pesquisador?: string // coordenador (mock)
  centro?: string
  unidade?: string
  prazo?: string
  dataInicio?: string
  dataFim?: string
}

type Attachment = {
  id: string
  name: string
  size: number
}

type Recipient = {
  id: string
  name: string
  role: "COORDENADOR" | "DISCENTE"
  projectId: string | number
  email?: string
}

/* ================= UTIL ================= */

function cx(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ")
}

function normalize(s: string) {
  return (s || "").trim().toLowerCase()
}

const statusPillClass = (status?: string) => {
  const s = normalize(status || "")
  if (s.includes("aprov")) return "bg-green-100 text-green-800"
  if (s.includes("reprov") || s.includes("indefer")) return "bg-red-100 text-red-800"
  if (s.includes("submet") || s.includes("aguard") || s.includes("distrib") || s.includes("anál") || s.includes("analise"))
    return "bg-amber-100 text-amber-800"
  return "bg-neutral-light text-neutral"
}

function formatPeriod(p: Projeto) {
  const ini = (p.dataInicio || "").slice(0, 10)
  const fim = (p.dataFim || p.prazo || "").slice(0, 10)
  if (!ini && !fim) return "—"
  return `${ini || "—"} → ${fim || "—"}`
}

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`
  const kb = n / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}

/* ================= UI ================= */

function StepPill({ active, done, children }: { active: boolean; done: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cx(
        "inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold border",
        active ? "bg-primary text-white border-primary" : done ? "bg-green-50 text-green-700 border-green-200" : "bg-white text-primary border-neutral-light"
      )}
    >
      {done ? <Check size={14} /> : null}
      {children}
    </div>
  )
}

function Card({
  title,
  subtitle,
  icon,
  children,
  right,
}: {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-neutral-light bg-white shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-light flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <h2 className="text-sm font-bold text-primary">{title}</h2>
            {subtitle && <p className="text-xs text-neutral/70 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {right}
      </div>
      <div className="p-6">{children}</div>
    </section>
  )
}

/* ================= PÁGINA ================= */

type Step = 1 | 2

export default function ProjectCommunication() {
  const nav = useNavigate()
  const fileRef = useRef<HTMLInputElement | null>(null)

  const [step, setStep] = useState<Step>(1)

  // Step 1
  const [mode, setMode] = useState<RecipientMode>("COORDENADORES")
  const [q, setQ] = useState("")
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([])

  // Step 2
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const all = useMemo(() => projetos as Projeto[], [])

  const filteredProjects = useMemo(() => {
    const nq = normalize(q)
    if (!nq) return all
    return all.filter((p) => {
      const hit =
        normalize(p.titulo).includes(nq) ||
        normalize(p.pesquisador || "").includes(nq) ||
        String(p.id).toLowerCase().includes(nq) ||
        normalize(p.status || "").includes(nq) ||
        normalize(p.tipo || "").includes(nq)
      return hit
    })
  }, [all, q])

  const recipients = useMemo<Recipient[]>(() => {
    // mock simples: coordenador vem do projeto, discentes são placeholders
    const base: Recipient[] = []

    for (const p of all) {
      const pid = p.id
      base.push({
        id: `coord_${pid}`,
        name: p.pesquisador || "Coordenador",
        role: "COORDENADOR",
        projectId: pid,
        email: undefined, // depois liga em cadastro real
      })

      // placeholders de discentes
      base.push({ id: `disc1_${pid}`, name: "Discente 01", role: "DISCENTE", projectId: pid })
      base.push({ id: `disc2_${pid}`, name: "Discente 02", role: "DISCENTE", projectId: pid })
    }

    // filtra pelo modo e pelos projetos selecionados
    const selectedSet = new Set(selectedIds.map(String))
    return base
      .filter((r) => (mode === "COORDENADORES" ? r.role === "COORDENADOR" : r.role === "DISCENTE"))
      .filter((r) => selectedSet.has(String(r.projectId)))
  }, [all, mode, selectedIds])

  const toggleProject = (id: string | number) => {
    setSelectedIds((prev) => {
      const sid = String(id)
      const set = new Set(prev.map(String))
      if (set.has(sid)) return prev.filter((x) => String(x) !== sid)
      return [...prev, id]
    })
  }

  const selectAllFiltered = () => {
    const ids = filteredProjects.map((p) => p.id)
    setSelectedIds((prev) => {
      const set = new Set(prev.map(String))
      for (const id of ids) set.add(String(id))
      // volta como array mantendo (aprox) a ordem
      return Array.from(set).map((s) => {
        // tenta recuperar o tipo original; como é mock, ok retornar string
        const found = all.find((p) => String(p.id) === s)
        return found ? found.id : s
      })
    })
  }

  const clearSelection = () => setSelectedIds([])

  const canGoStep2 = selectedIds.length > 0
  const canSend = subject.trim().length > 0 && body.trim().length > 0 && recipients.length > 0 && !sending

  const onPickFiles = (files: FileList | null) => {
    if (!files) return
    const arr: Attachment[] = []
    for (const f of Array.from(files)) {
      arr.push({
        id: `${f.name}_${f.size}_${f.lastModified}`,
        name: f.name,
        size: f.size,
      })
    }
    setAttachments((prev) => {
      const set = new Set(prev.map((a) => a.id))
      const merged = [...prev]
      for (const a of arr) if (!set.has(a.id)) merged.push(a)
      return merged
    })
  }

  const removeAttachment = (id: string) => setAttachments((prev) => prev.filter((a) => a.id !== id))

  const goNext = () => {
    if (step === 1 && !canGoStep2) return
    setStep(2)
  }

  const goPrev = () => setStep(1)

  const send = async () => {
    if (!canSend) return
    setSending(true)
    try {
      // aqui você integrará com backend (fila de envio)
      await new Promise((r) => setTimeout(r, 900))
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  const resetAll = () => {
    setStep(1)
    setMode("COORDENADORES")
    setQ("")
    setSelectedIds([])
    setSubject("")
    setBody("")
    setAttachments([])
    setSending(false)
    setSent(false)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Comunicação • Projetos • PROPESQ</title>
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

            <h1 className="mt-3 text-xl font-bold text-primary">Comunicação</h1>
            <p className="text-sm text-neutral mt-1">
              Selecione projetos e envie mensagens para <span className="font-semibold">{mode === "COORDENADORES" ? "coordenadores" : "discentes"}</span>.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <StepPill active={step === 1} done={step === 2 || canGoStep2}>
              1. Seleção
            </StepPill>
            <StepPill active={step === 2} done={sent}>
              2. Mensagem
            </StepPill>
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filtros */}
            <Card
              title="Passo 1 — Seleção"
              subtitle="Filtre e selecione os projetos que receberão a comunicação."
              icon={<Users size={18} className="text-primary" />}
              right={
                <span className="text-xs text-neutral/70">
                  Selecionados: <span className="font-semibold text-neutral">{selectedIds.length}</span>
                </span>
              }
            >
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-neutral/70">Destinatários</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMode("COORDENADORES")}
                      className={cx(
                        "px-4 py-2 rounded-xl text-sm font-semibold border",
                        mode === "COORDENADORES"
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-primary border-neutral-light hover:bg-neutral-light/50"
                      )}
                    >
                      Coordenadores
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("DISCENTES")}
                      className={cx(
                        "px-4 py-2 rounded-xl text-sm font-semibold border",
                        mode === "DISCENTES"
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-primary border-neutral-light hover:bg-neutral-light/50"
                      )}
                    >
                      Discentes
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-neutral/70">
                    Você filtra por projetos e o sistema resolve os destinatários conforme a escolha.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-neutral/70">Busca</p>
                  <div className="mt-2 relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Título, coordenador, código, status…"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-light text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={selectAllFiltered}
                    className="px-3 py-2 rounded-xl border border-neutral-light text-sm font-semibold text-primary hover:bg-neutral-light/50"
                  >
                    Selecionar filtrados
                  </button>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="px-3 py-2 rounded-xl border border-neutral-light text-sm font-semibold text-neutral hover:bg-neutral-light/50"
                  >
                    Limpar seleção
                  </button>
                </div>

                <div className="rounded-xl border border-neutral-light bg-neutral-light/40 p-4">
                  <p className="text-xs font-bold text-primary">Prévia de destinatários</p>
                  <p className="text-sm text-neutral mt-1">
                    {selectedIds.length === 0
                      ? "Selecione projetos para ver destinatários."
                      : `${recipients.length} destinatário(s) estimado(s)`}
                  </p>
                  <p className="text-[11px] text-neutral/70 mt-2">
                    Nesta versão, discentes são placeholders e e-mails não estão vinculados.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canGoStep2}
                  className={cx(
                    "w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold",
                    canGoStep2 ? "bg-primary text-white hover:opacity-95" : "bg-neutral-light text-neutral cursor-not-allowed"
                  )}
                >
                  Próximo
                  <ChevronRight size={16} />
                </button>
              </div>
            </Card>

            {/* Lista de projetos */}
            <div className="lg:col-span-2">
              <Card
                title="Projetos"
                subtitle="Clique para selecionar. Use filtros para reduzir a lista."
                icon={<Mail size={18} className="text-primary" />}
              >
                {filteredProjects.length === 0 ? (
                  <div className="text-center py-12 text-sm text-neutral">Nenhum projeto encontrado.</div>
                ) : (
                  <div className="space-y-3">
                    {filteredProjects.map((p) => {
                      const checked = selectedIds.map(String).includes(String(p.id))
                      return (
                        <button
                          key={String(p.id)}
                          type="button"
                          onClick={() => toggleProject(p.id)}
                          className={cx(
                            "w-full text-left rounded-2xl border p-4 transition-all flex items-start justify-between gap-4",
                            checked ? "border-primary bg-primary/5" : "border-neutral-light hover:bg-neutral-light/40"
                          )}
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-primary truncate">{p.titulo}</p>
                            <p className="text-xs text-neutral/70 mt-1">
                              #{String(p.id)} • Coord.: {p.pesquisador || "—"} • Tipo: {p.tipo || "—"} • Período:{" "}
                              {formatPeriod(p)}
                            </p>
                            <div className="mt-2">
                              <span className={cx("inline-flex px-3 py-1 rounded-full text-xs font-semibold", statusPillClass(p.status))}>
                                {p.status || "—"}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0">
                            <div
                              className={cx(
                                "h-6 w-6 rounded-md border grid place-items-center",
                                checked ? "bg-primary border-primary text-white" : "bg-white border-neutral-light text-transparent"
                              )}
                              aria-hidden="true"
                            >
                              <Check size={16} />
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Composição */}
            <Card
              title="Passo 2 — Mensagem"
              subtitle="Preencha assunto e corpo. Anexos são opcionais."
              icon={<Send size={18} className="text-primary" />}
              right={
                <span className="text-xs text-neutral/70">
                  Destinatários: <span className="font-semibold text-neutral">{recipients.length}</span>
                </span>
              }
            >
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-neutral/70">
                    Assunto <span className="text-red-600">*</span>
                  </label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Assunto do e-mail…"
                    className="mt-2 w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-neutral/70">
                    Corpo <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Escreva a mensagem…"
                    className="mt-2 w-full min-h-[220px] rounded-xl border border-neutral-light px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                  <p className="mt-2 text-[11px] text-neutral/70">
                    Dica: mantenha instruções claras e inclua prazos quando necessário.
                  </p>
                </div>

                {/* Anexos */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-neutral/70">Anexos (opcional)</p>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-light text-sm font-semibold text-primary hover:bg-neutral-light/50"
                    >
                      <Paperclip size={16} />
                      Adicionar
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => onPickFiles(e.target.files)}
                    />
                  </div>

                  {attachments.length === 0 ? (
                    <p className="mt-2 text-sm text-neutral">Nenhum anexo.</p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {attachments.map((a) => (
                        <div key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-neutral-light p-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-primary truncate">{a.name}</p>
                            <p className="text-xs text-neutral/70">{fmtBytes(a.size)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(a.id)}
                            className="p-2 rounded-lg hover:bg-neutral-light/60"
                            aria-label="Remover anexo"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={send}
                  disabled={!canSend || sent}
                  className={cx(
                    "w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold",
                    canSend && !sent ? "bg-primary text-white hover:opacity-95" : "bg-neutral-light text-neutral cursor-not-allowed"
                  )}
                >
                  {sending ? "Enviando..." : sent ? "Enviado" : "Enviar"}
                  <Send size={16} />
                </button>

                {sent && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="text-sm font-bold text-green-800">Mensagem enviada!</p>
                    <p className="text-xs text-green-800/80 mt-1">
                      Nesta versão, o envio é simulado. Depois ligaremos ao serviço real.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={resetAll}
                        className="px-3 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-95"
                      >
                        Nova mensagem
                      </button>
                      <Link
                        to="/adm/projetos"
                        className="px-3 py-2 rounded-xl border border-green-200 text-green-800 text-sm font-semibold hover:bg-green-100"
                      >
                        Voltar para Projetos
                      </Link>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-light text-sm font-semibold text-primary hover:bg-neutral-light/50"
                  >
                    <ChevronLeft size={16} />
                    Voltar
                  </button>

                  <Link to="/adm/projetos" className="text-xs text-neutral/70 underline hover:text-primary">
                    Cancelar
                  </Link>
                </div>
              </div>
            </Card>

            {/* Preview / Seleção */}
            <div className="lg:col-span-2 space-y-6">
              <Card
                title="Seleção"
                subtitle="Revise os projetos e destinatários antes de enviar."
                icon={<Users size={18} className="text-primary" />}
                right={
                  <span className="text-xs text-neutral/70">
                    Projetos: <span className="font-semibold text-neutral">{selectedIds.length}</span>
                  </span>
                }
              >
                <div className="space-y-3">
                  {all
                    .filter((p) => selectedIds.map(String).includes(String(p.id)))
                    .map((p) => (
                      <div key={String(p.id)} className="rounded-2xl border border-neutral-light p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-primary truncate">{p.titulo}</p>
                            <p className="text-xs text-neutral/70 mt-1">
                              #{String(p.id)} • Coord.: {p.pesquisador || "—"} • Tipo: {p.tipo || "—"} • Período:{" "}
                              {formatPeriod(p)}
                            </p>
                          </div>
                          <span className={cx("shrink-0 px-3 py-1 rounded-full text-xs font-semibold", statusPillClass(p.status))}>
                            {p.status || "—"}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link
                            to={`/adm/projetos/${p.id}`}
                            className="px-3 py-2 rounded-xl border border-neutral-light text-sm font-semibold text-primary hover:bg-neutral-light/50"
                          >
                            Ver projeto
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              // remove do selection
                              setSelectedIds((prev) => prev.filter((x) => String(x) !== String(p.id)))
                            }}
                            className="px-3 py-2 rounded-xl border border-neutral-light text-sm font-semibold text-neutral hover:bg-neutral-light/50"
                          >
                            Remover da seleção
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>

              <Card
                title="Destinatários"
                subtitle={`Modo: ${mode === "COORDENADORES" ? "Coordenadores" : "Discentes"}`}
                icon={<Mail size={18} className="text-primary" />}
                right={
                  <span className="text-xs text-neutral/70">
                    Total: <span className="font-semibold text-neutral">{recipients.length}</span>
                  </span>
                }
              >
                {recipients.length === 0 ? (
                  <p className="text-sm text-neutral">Nenhum destinatário (selecione projetos).</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recipients.slice(0, 12).map((r) => (
                      <div key={r.id} className="rounded-xl border border-neutral-light p-3">
                        <p className="text-sm font-semibold text-primary">{r.name}</p>
                        <p className="text-xs text-neutral/70">
                          {r.role} • Projeto #{String(r.projectId)} {r.email ? `• ${r.email}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {recipients.length > 12 && (
                  <p className="text-xs text-neutral/70 mt-3">
                    Mostrando 12 de {recipients.length}. (No backend, você verá a lista completa.)
                  </p>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Mobile steps bottom */}
        <div className="md:hidden flex items-center justify-between gap-2">
          <span className="text-xs text-neutral/70">Passo {step} de 2</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => (step === 2 ? goPrev() : nav(-1))}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-light text-sm font-semibold text-primary hover:bg-neutral-light/50"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={() => (step === 1 ? goNext() : send())}
              disabled={step === 1 ? !canGoStep2 : !canSend || sent}
              className={cx(
                "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold",
                step === 1
                  ? canGoStep2
                    ? "bg-primary text-white hover:opacity-95"
                    : "bg-neutral-light text-neutral cursor-not-allowed"
                  : canSend && !sent
                    ? "bg-primary text-white hover:opacity-95"
                    : "bg-neutral-light text-neutral cursor-not-allowed"
              )}
            >
              {step === 1 ? <ChevronRight size={16} /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
