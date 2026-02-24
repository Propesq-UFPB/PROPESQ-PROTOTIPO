import React, { useMemo, useState } from "react"
import {
  Users,
  Search,
  History,
  ChevronDown,
  Eye,
  // CheckCircle2,
  // XCircle,
  // Clock3,
  FileText,
  Download,
  ArrowRightLeft,
  Info,
  User,
  BookOpen,
} from "lucide-react"

type Call = { id: string; title: string; baseYear: number }

// type ReplacementStatus = "PENDING" | "APPROVED" | "REJECTED"

type Student = {
  id: string
  name: string
  institution: "UFPB" | "EXTERNA"
  level: "MEDIO" | "SUPERIOR" | "POS"
  doc?: string
}

type ReplacementChange = {
  id: string
  at: string // ISO
  by: string
  // sem aprovar/rejeitar
  action: "REQUESTED" | "EDITED"
  note?: string
  fromStudent?: Student
  toStudent?: Student
}

type ReplacementRequest = {
  id: string
  callId: string
  projectId: string
  projectTitle: string
  advisor: string
  currentStudent: Student
  newStudent: Student
  reason: string

  // sem status de decisão
  // status: ReplacementStatus

  createdAt: string
  updatedAt?: string
  history: ReplacementChange[]
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

function chip(text: string) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border bg-neutral-50 text-neutral border-neutral-light">
      {text}
    </span>
  )
}

//  Chip neutro (somente visualização)
function statusChip() {
  return chip("Registrado")
}

function formatStudent(s: Student) {
  const inst = s.institution === "UFPB" ? "UFPB" : "Externa"
  const lvl = s.level === "MEDIO" ? "Ens. médio" : s.level === "SUPERIOR" ? "Graduação" : "Pós"
  return `${s.name} • ${inst} • ${lvl}`
}

function Section({
  title,
  icon,
  children,
  right,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-neutral-light bg-white p-5">
      <div className="flex items-start justify-between gap-3 mb-4 flex-col md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-neutral-light/60">{icon}</span>
          <h2 className="text-sm font-semibold text-primary">{title}</h2>
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      {children}
    </section>
  )
}

function TimelineItem({
  icon,
  title,
  subtitle,
  meta,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  meta?: string
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-primary">{title}</p>
        {subtitle ? <p className="text-sm text-neutral mt-1 break-words">{subtitle}</p> : null}
        {meta ? <p className="text-xs text-neutral mt-1">{meta}</p> : null}
      </div>
    </div>
  )
}

export default function StudentReplacements() {
  const [calls] = useState<Call[]>([
    { id: "call_2026_01", title: "Edital PROPESQ 01/2026", baseYear: 2026 },
    { id: "call_2025_03", title: "PIBIC 03/2025", baseYear: 2025 },
  ])
  const [selectedCallId, setSelectedCallId] = useState(calls[0]?.id ?? "")

  const [requests] = useState<ReplacementRequest[]>([
    {
      id: "r1",
      callId: "call_2026_01",
      projectId: "p2",
      projectTitle: "Otimização de energia em datacenters",
      advisor: "Prof. Diego Ramos",
      currentStudent: { id: "s1", name: "Discente Luiza", institution: "UFPB", level: "SUPERIOR", doc: "20201234" },
      newStudent: { id: "s9", name: "Discente Marcos", institution: "UFPB", level: "SUPERIOR", doc: "20209999" },
      reason: "Desligamento do discente por incompatibilidade de horários.",
      createdAt: "2026-01-18T15:30:00Z",
      updatedAt: "2026-01-18T15:30:00Z",
      history: [
        {
          id: "h1",
          at: "2026-01-18T15:30:00Z",
          by: "Coordenador do projeto",
          action: "REQUESTED",
          note: "Solicitação registrada no sistema.",
          fromStudent: { id: "s1", name: "Discente Luiza", institution: "UFPB", level: "SUPERIOR" },
          toStudent: { id: "s9", name: "Discente Marcos", institution: "UFPB", level: "SUPERIOR" },
        },
      ],
    },
    {
      id: "r2",
      callId: "call_2026_01",
      projectId: "p1",
      projectTitle: "Detecção de presença com TinyML",
      advisor: "Profa. Ana Souza",
      currentStudent: { id: "s2", name: "Discente João", institution: "UFPB", level: "SUPERIOR" },
      newStudent: { id: "s3", name: "Discente Maria", institution: "UFPB", level: "SUPERIOR" },
      reason: "Substituição por desempenho acadêmico.",
      createdAt: "2026-01-10T11:10:00Z",
      updatedAt: "2026-01-12T09:02:00Z",
      history: [
        {
          id: "h2",
          at: "2026-01-10T11:10:00Z",
          by: "Coordenador do projeto",
          action: "REQUESTED",
          note: "Solicitação registrada no sistema.",
          fromStudent: { id: "s2", name: "Discente João", institution: "UFPB", level: "SUPERIOR" },
          toStudent: { id: "s3", name: "Discente Maria", institution: "UFPB", level: "SUPERIOR" },
        },
        { id: "h4", at: "2026-01-12T09:02:00Z", by: "Sistema", action: "EDITED", note: "Registro atualizado." },
      ],
    },
  ])

  const [q, setQ] = useState("")
  // sem filtro por status
  // const [status, setStatus] = useState<"ALL" | ReplacementStatus>("ALL")

  const [openId, setOpenId] = useState<string | null>(null)

  const list = useMemo(() => {
    const nq = q.trim().toLowerCase()
    return requests
      .filter((r) => r.callId === selectedCallId)
      // sem filtro por status
      // .filter((r) => (status === "ALL" ? true : r.status === status))
      .filter((r) => {
        if (!nq) return true
        return (
          r.projectTitle.toLowerCase().includes(nq) ||
          r.advisor.toLowerCase().includes(nq) ||
          r.currentStudent.name.toLowerCase().includes(nq) ||
          r.newStudent.name.toLowerCase().includes(nq)
        )
      })
      .sort((a, b) => ((a.updatedAt ?? a.createdAt) < (b.updatedAt ?? b.createdAt) ? 1 : -1))
  }, [requests, selectedCallId, q])

  const openReq = useMemo(() => list.find((r) => r.id === openId) ?? null, [list, openId])

  const stats = useMemo(() => {
    const all = requests.filter((r) => r.callId === selectedCallId)
    return {
      total: all.length,
      // removido: pending/approved/rejected
    }
  }, [requests, selectedCallId])

  function exportData() {
    alert("Exportar (placeholder).")
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-primary">Substituições de Discentes</h1>
        <p className="text-sm text-neutral">
          Página de visualização: acompanhe as trocas (discente antigo → discente novo) e o histórico registrado.
        </p>
      </header>

      {/* Contexto */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen size={18} />
          <h2 className="text-sm font-semibold text-primary">Contexto</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <label className="md:col-span-8 text-sm">
            <span className="block text-xs text-neutral mb-1">Edital</span>
            <div className="relative">
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none" />
              <select
                value={selectedCallId}
                onChange={(e) => {
                  setSelectedCallId(e.target.value)
                  setOpenId(null)
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

          <div className="md:col-span-4">
            <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
              <p className="text-xs text-neutral">Total</p>
              <p className="text-xl font-bold text-primary mt-1">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex items-start gap-2">
          <Info size={16} className="mt-0.5 text-neutral" />
          <p className="text-xs text-neutral">
            Esta tela é somente leitura: ela lista solicitações e exibe o histórico registrado (append-only).
          </p>
        </div>
      </section>

      {/* LISTA + DETALHES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LISTA */}
        <div className="lg:col-span-7">
          <Section
            title="Solicitações"
            icon={<Users size={18} />}
            right={
              <button
                onClick={exportData}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:opacity-90"
              >
                <Download size={16} />
                Exportar
              </button>
            }
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
              <div className="relative w-full md:max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Buscar por projeto, discente, orientador..."
                />
              </div>

              {/* removido filtro por status */}
              {/* <div className="flex gap-2">
                <select ... />
              </div> */}
            </div>

            <div className="space-y-2">
              {list.map((r) => {
                const active = r.id === openId
                return (
                  <button
                    key={r.id}
                    onClick={() => setOpenId((prev) => (prev === r.id ? null : r.id))}
                    className={`w-full text-left rounded-xl border p-4 transition-colors ${
                      active ? "border-primary bg-primary/5" : "border-neutral-light bg-white hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-primary truncate">{r.projectTitle}</p>

                        <p className="text-xs text-neutral mt-1">
                          Orientador: <span className="font-semibold text-primary">{r.advisor}</span>
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-2 text-xs text-neutral">
                            <User size={14} /> {r.currentStudent.name}
                          </span>
                          <ArrowRightLeft size={14} className="text-neutral" />
                          <span className="inline-flex items-center gap-2 text-xs text-neutral">
                            <User size={14} /> {r.newStudent.name}
                          </span>
                        </div>

                        <p className="text-xs text-neutral mt-2 line-clamp-2">{r.reason}</p>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-2">
                        {statusChip()}
                        <span className="text-[11px] text-neutral">
                          {new Date(r.updatedAt ?? r.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}

              {list.length === 0 && (
                <div className="rounded-xl border border-neutral-light bg-neutral-50 p-6 text-sm text-neutral text-center">
                  Nenhuma solicitação encontrada para este edital.
                </div>
              )}
            </div>
          </Section>
        </div>

        {/* DETALHES */}
        <div className="lg:col-span-5">
          <Section
            title="Detalhes & Histórico"
            icon={<History size={18} />}
            right={
              openReq ? (
                <button
                  onClick={() => alert("Gerar relatório do histórico (placeholder).")}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light hover:bg-neutral-50"
                >
                  <FileText size={16} />
                  Relatório
                </button>
              ) : null
            }
          >
            {!openReq ? (
              <div className="rounded-xl border border-neutral-light bg-neutral-50 p-6 text-sm text-neutral text-center">
                Pressione em uma solicitação para ver o histórico do projeto.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary">{openReq.projectTitle}</p>
                      <p className="text-xs text-neutral mt-1">
                        Orientador: <span className="font-semibold text-primary">{openReq.advisor}</span>
                      </p>
                    </div>
                    <div className="shrink-0">{statusChip()}</div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <div className="rounded-lg border border-neutral-light bg-white p-3">
                      <p className="text-xs text-neutral mb-1">Discente atual (antes)</p>
                      <p className="text-sm font-semibold text-primary">{formatStudent(openReq.currentStudent)}</p>
                    </div>

                    <div className="rounded-lg border border-neutral-light bg-white p-3">
                      <p className="text-xs text-neutral mb-1">Novo discente (indicado)</p>
                      <p className="text-sm font-semibold text-primary">{formatStudent(openReq.newStudent)}</p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral mt-3">
                    Motivo: <span className="text-neutral">{openReq.reason}</span>
                  </p>
                </div>

                {/* removido bloco de aprovar/rejeitar */}

                <div className="rounded-xl border border-neutral-light bg-white p-4 space-y-4">
                  <p className="text-sm font-semibold text-primary">Linha do tempo</p>

                  <div className="space-y-4">
                    {openReq.history
                      .slice()
                      .sort((a, b) => (a.at < b.at ? 1 : -1))
                      .map((h) => {
                        const when = new Date(h.at).toLocaleString()

                        // ✅ ícone/título neutros
                        const icon = <Eye size={18} className="text-neutral" />

                        const title = h.action === "REQUESTED" ? "Substituição registrada" : "Registro atualizado"

                        const subtitle = h.fromStudent && h.toStudent ? `${h.fromStudent.name} → ${h.toStudent.name}` : h.note

                        return (
                          <TimelineItem
                            key={h.id}
                            icon={icon}
                            title={title}
                            subtitle={subtitle}
                            meta={`Por: ${h.by} • ${when}`}
                          />
                        )
                      })}
                  </div>

                  {/* Em produção, o histórico deve ser imutável (append-only), com IDs de usuário e trilha de auditoria. */}
                </div>
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  )
}