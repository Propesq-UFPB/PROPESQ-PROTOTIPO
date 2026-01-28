import React, { useMemo, useState } from "react"
import {
  BadgeCheck,
  QrCode,
  FileText,
  Users,
  BookOpen,
  ChevronDown,
  Search,
  Download,
  Eye,
  Info,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Copy,
  History,
} from "lucide-react"

type Call = { id: string; title: string; baseYear: number }
type Project = { id: string; callId: string; title: string; center?: string }

type Role = "ORIENTADOR" | "ALUNO" | "AVALIADOR"
type Lang = "PT_BR" | "EN"

type Participant = {
  id: string
  name: string
  role: Role
  email?: string
  period?: { start: string; end?: string } // vivências passadas/atuais
}

type Certificate = {
  id: string
  callId: string
  projectId: string
  participantId: string
  role: Role
  lang: Lang
  status: "ISSUED" | "REVOKED"
  issuedAt: string
  qrToken: string
  lastDownloadAt?: string
}

function roleLabel(r: Role) {
  if (r === "ORIENTADOR") return "Orientador"
  if (r === "AVALIADOR") return "Avaliador"
  return "Aluno"
}

function langLabel(l: Lang) {
  return l === "PT_BR" ? "PT-BR" : "EN"
}

function chip(text: string, tone: "neutral" | "green" | "red" | "amber" = "neutral") {
  const cls =
    tone === "green"
      ? "bg-green-50 text-green-700 border-green-200"
      : tone === "red"
      ? "bg-red-50 text-red-700 border-red-200"
      : tone === "amber"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-neutral-50 text-neutral border-neutral-light"
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${cls}`}>
      {text}
    </span>
  )
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

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

function token() {
  return Math.random().toString(36).slice(2) + "-" + Math.random().toString(36).slice(2)
}

export default function AdmCertificates() {
  const [mode, setMode] = useState<"pdf" | "qr">("pdf")

  // ===== Mock: editais e projetos (projeto pertence a um edital) =====
  const [calls] = useState<Call[]>([
    { id: "call_2026_01", title: "Edital PROPESQ 01/2026", baseYear: 2026 },
    { id: "call_2025_03", title: "PIBIC 03/2025", baseYear: 2025 },
  ])

  const [projects] = useState<Project[]>([
    { id: "p1", callId: "call_2026_01", title: "Detecção de presença com TinyML", center: "CT" },
    { id: "p2", callId: "call_2026_01", title: "Otimização de energia em datacenters", center: "CI" },
    { id: "p9", callId: "call_2025_03", title: "Robótica educacional em escolas públicas", center: "CCHLA" },
  ])

  // ===== Participantes por projeto (vivências passadas e atuais) =====
  const [participantsByProject] = useState<Record<string, Participant[]>>({
    p1: [
      { id: "u1", name: "Profa. Ana Souza", role: "ORIENTADOR", email: "ana@ufpb.br", period: { start: "2026-01-01" } },
      { id: "u2", name: "Discente Maria", role: "ALUNO", email: "maria@ufpb.br", period: { start: "2026-01-01" } },
      { id: "u3", name: "Dr. Paulo (Externo)", role: "AVALIADOR", email: "paulo@gmail.com", period: { start: "2026-02-01", end: "2026-03-01" } },
    ],
    p2: [
      { id: "u4", name: "Prof. Diego Ramos", role: "ORIENTADOR", email: "diego@ufpb.br", period: { start: "2026-01-01" } },
      { id: "u5", name: "Discente Marcos", role: "ALUNO", email: "marcos@ufpb.br", period: { start: "2026-01-15" } },
      { id: "u6", name: "Profa. Carla (Avaliadora)", role: "AVALIADOR", email: "carla@ufpb.br", period: { start: "2026-02-10", end: "2026-03-20" } },
    ],
    p9: [
      { id: "u7", name: "Profa. Aline Mendes", role: "ORIENTADOR", email: "aline@ufpb.br", period: { start: "2025-05-01", end: "2025-12-20" } },
      { id: "u8", name: "Discente Pedro (Externo)", role: "ALUNO", email: "pedro@escola.br", period: { start: "2025-05-01", end: "2025-10-01" } },
      { id: "u9", name: "Discente Aline (Externa)", role: "ALUNO", email: "aline@escola.br", period: { start: "2025-10-05", end: "2025-12-20" } },
    ],
  })

  // ===== Certificados emitidos (registro + QR Token) =====
  const [certs, setCerts] = useState<Certificate[]>([
    {
      id: "c1",
      callId: "call_2026_01",
      projectId: "p1",
      participantId: "u2",
      role: "ALUNO",
      lang: "PT_BR",
      status: "ISSUED",
      issuedAt: "2026-03-25T10:00:00Z",
      qrToken: "cert-" + token(),
      lastDownloadAt: "2026-03-25T10:10:00Z",
    },
  ])

  // ===== Filtros / seleção =====
  const [selectedCallId, setSelectedCallId] = useState(calls[0]?.id ?? "")
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [role, setRole] = useState<Role>("ALUNO")
  const [lang, setLang] = useState<Lang>("PT_BR")
  const [includePast, setIncludePast] = useState(true)
  const [includeCurrent, setIncludeCurrent] = useState(true)
  const [searchName, setSearchName] = useState("")
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<Record<string, boolean>>({})

  // ===== QR verification =====
  const [qrInput, setQrInput] = useState("")
  const [qrResult, setQrResult] = useState<Certificate | null>(null)

  const projectsForCall = useMemo(
    () => projects.filter((p) => p.callId === selectedCallId),
    [projects, selectedCallId]
  )

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  )

  const participants = useMemo(() => {
    const list = participantsByProject[selectedProjectId] ?? []
    const now = new Date()

    const isPast = (p: Participant) => {
      if (!p.period?.end) return false
      return new Date(p.period.end) < now
    }
    const isCurrent = (p: Participant) => {
      if (!p.period?.start) return true
      const start = new Date(p.period.start)
      const end = p.period.end ? new Date(p.period.end) : null
      return start <= now && (!end || end >= now)
    }

    const nq = searchName.trim().toLowerCase()

    return list
      .filter((p) => p.role === role)
      .filter((p) => {
        const past = isPast(p)
        const current = isCurrent(p)
        const allowed = (includePast && past) || (includeCurrent && current) || (!past && !current)
        return allowed
      })
      .filter((p) => (nq ? p.name.toLowerCase().includes(nq) : true))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [participantsByProject, selectedProjectId, role, includePast, includeCurrent, searchName])

  const selectedIds = useMemo(
    () => Object.keys(selectedParticipantIds).filter((id) => selectedParticipantIds[id]),
    [selectedParticipantIds]
  )

  const certsForProject = useMemo(() => {
    if (!selectedProjectId) return []
    return certs
      .filter((c) => c.projectId === selectedProjectId)
      .slice()
      .sort((a, b) => (a.issuedAt < b.issuedAt ? 1 : -1))
  }, [certs, selectedProjectId])

  const canGenerate = !!selectedCallId && !!selectedProjectId && selectedIds.length > 0

  function toggleParticipant(id: string) {
    setSelectedParticipantIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function clearSelection() {
    setSelectedParticipantIds({})
  }

  function generatePDFs() {
    if (!canGenerate) return

    const nowIso = new Date().toISOString()
    const newCerts: Certificate[] = selectedIds.map((pid) => ({
      id: uid("cert"),
      callId: selectedCallId,
      projectId: selectedProjectId,
      participantId: pid,
      role,
      lang,
      status: "ISSUED",
      issuedAt: nowIso,
      qrToken: "cert-" + token(),
    }))

    setCerts((prev) => [...newCerts, ...prev])
    clearSelection()
    alert("PDFs gerados (placeholder).")
  }

  function previewTemplate() {
    alert("Pré-visualização do modelo (placeholder).")
  }

  function downloadCert(certId: string) {
    setCerts((prev) =>
      prev.map((c) => (c.id === certId ? { ...c, lastDownloadAt: new Date().toISOString() } : c))
    )
    alert(`Download do certificado ${certId} (placeholder).`)
  }

  function revokeCert(certId: string) {
    setCerts((prev) => prev.map((c) => (c.id === certId ? { ...c, status: "REVOKED" } : c)))
  }

  function validateQR() {
    const t = qrInput.trim()
    if (!t) return
    const found = certs.find((c) => c.qrToken === t) ?? null
    setQrResult(found)
  }

  function copyToken(t: string) {
    navigator.clipboard?.writeText(t).catch(() => {})
    alert("Token copiado (placeholder).")
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-primary">Certificados</h1>
        <p className="text-sm text-neutral">
          Gere PDFs com QR Code de autenticidade para participantes (orientadores, alunos e avaliadores) por{" "}
          <span className="font-semibold text-primary">projeto</span> — cada projeto pertence a um{" "}
          <span className="font-semibold text-primary">edital</span>.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setMode("pdf")}
          className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors
            ${mode === "pdf" ? "bg-primary text-white border-primary" : "bg-white text-primary border-primary"}
          `}
        >
          <span className="inline-flex items-center gap-2">
            <FileText size={16} /> Gerar PDFs
          </span>
        </button>

        <button
          onClick={() => setMode("qr")}
          className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors
            ${mode === "qr" ? "bg-primary text-white border-primary" : "bg-white text-primary border-primary"}
          `}
        >
          <span className="inline-flex items-center gap-2">
            <QrCode size={16} /> Verificar QR
          </span>
        </button>
      </div>

      {mode === "pdf" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Config + seleção */}
          <div className="lg:col-span-7 space-y-4">
            <Section title="Configuração" icon={<BadgeCheck size={18} />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="text-sm md:col-span-2">
                  <span className="block text-xs text-neutral mb-1">Edital</span>
                  <div className="relative">
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none" />
                    <select
                      value={selectedCallId}
                      onChange={(e) => {
                        setSelectedCallId(e.target.value)
                        setSelectedProjectId("")
                        clearSelection()
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

                <label className="text-sm">
                  <span className="block text-xs text-neutral mb-1">Idioma</span>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as Lang)}
                    className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="PT_BR">PT-BR</option>
                    <option value="EN">EN</option>
                  </select>
                </label>

                <label className="text-sm md:col-span-2">
                  <span className="block text-xs text-neutral mb-1">Projeto (do edital)</span>
                  <div className="relative">
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none" />
                    <select
                      value={selectedProjectId}
                      onChange={(e) => {
                        setSelectedProjectId(e.target.value)
                        clearSelection()
                      }}
                      className="w-full appearance-none border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Selecione…</option>
                      {projectsForCall.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} {p.center ? `• ${p.center}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>

                <label className="text-sm">
                  <span className="block text-xs text-neutral mb-1">Tipo de certificado</span>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value as Role)
                      clearSelection()
                    }}
                    className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="ALUNO">Aluno</option>
                    <option value="ORIENTADOR">Orientador</option>
                    <option value="AVALIADOR">Avaliador</option>
                  </select>
                </label>

                <div className="md:col-span-3 rounded-xl border border-neutral-light bg-neutral-50 p-4 flex items-start gap-2">
                  <Info size={16} className="mt-0.5 text-neutral" />
                  <p className="text-xs text-neutral">
                    O gerador deve emitir um PDF por participante e inserir um QR Code com um token de autenticidade.
                    A validação deve permitir checar o projeto e o edital relacionados.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2 flex-col md:flex-row">
                <button
                  onClick={generatePDFs}
                  disabled={!canGenerate}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold text-white inline-flex items-center gap-2 justify-center
                    ${!canGenerate ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}
                  `}
                >
                  <FileText size={16} />
                  Gerar PDFs ({selectedIds.length || 0})
                </button>
                <button
                  onClick={previewTemplate}
                  className="px-3 py-2 rounded-lg text-sm font-medium border border-neutral-light hover:bg-neutral-light inline-flex items-center gap-2 justify-center"
                >
                  <Eye size={16} />
                  Pré-visualizar modelo
                </button>
                <button
                  onClick={() => alert("Gerar para todos do projeto (placeholder).")}
                  disabled={!selectedProjectId}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border border-neutral-light inline-flex items-center gap-2 justify-center
                    ${!selectedProjectId ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-light"}
                  `}
                >
                  <Users size={16} />
                  Gerar para todos (filtro atual)
                </button>
              </div>
            </Section>

            <Section
              title="Participantes (vivências passadas e atuais)"
              icon={<Users size={18} />}
              right={
                <button
                  onClick={clearSelection}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light hover:bg-neutral-50"
                >
                  <RefreshCcw size={16} />
                  Limpar seleção
                </button>
              }
            >
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
                <div className="relative w-full md:max-w-md">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
                  <input
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full border border-neutral-light rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Buscar por nome..."
                    disabled={!selectedProjectId}
                  />
                </div>

                <div className="flex gap-3 items-center">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={includeCurrent}
                      onChange={() => setIncludeCurrent((v) => !v)}
                      disabled={!selectedProjectId}
                    />
                    <span className="text-neutral">Atuais</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={includePast}
                      onChange={() => setIncludePast((v) => !v)}
                      disabled={!selectedProjectId}
                    />
                    <span className="text-neutral">Passados</span>
                  </label>
                </div>
              </div>

              {!selectedProjectId ? (
                <div className="rounded-xl border border-neutral-light bg-neutral-50 p-6 text-sm text-neutral text-center">
                  Selecione um projeto para listar participantes.
                </div>
              ) : participants.length === 0 ? (
                <div className="rounded-xl border border-neutral-light bg-neutral-50 p-6 text-sm text-neutral text-center">
                  Nenhum participante encontrado para este filtro.
                </div>
              ) : (
                <div className="space-y-2">
                  {participants.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-neutral-light p-4 hover:bg-neutral-50"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={!!selectedParticipantIds[p.id]}
                          onChange={() => toggleParticipant(p.id)}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-primary truncate">{p.name}</p>
                          <p className="text-xs text-neutral mt-1">
                            {roleLabel(p.role)}
                            {p.email ? (
                              <>
                                {" "}
                                • <span className="font-semibold text-primary">{p.email}</span>
                              </>
                            ) : null}
                          </p>
                          {p.period?.start ? (
                            <p className="text-xs text-neutral mt-1">
                              Período: {p.period.start}
                              {p.period.end ? ` → ${p.period.end}` : " → atual"}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {p.period?.end ? chip("Vivência passada", "neutral") : chip("Vivência atual", "green")}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {selectedProject && (
                <div className="mt-4 rounded-xl border border-neutral-light bg-neutral-50 p-4">
                  <p className="text-xs text-neutral">Projeto selecionado</p>
                  <p className="text-sm font-semibold text-primary">{selectedProject.title}</p>
                  <p className="text-xs text-neutral mt-1">
                    Edital:{" "}
                    <span className="font-semibold text-primary">
                      {calls.find((c) => c.id === selectedProject.callId)?.title ?? "—"}
                    </span>
                  </p>
                </div>
              )}
            </Section>
          </div>

          {/* Emitidos / histórico */}
          <div className="lg:col-span-5 space-y-4">
            <Section title="Certificados emitidos (projeto)" icon={<History size={18} />}>
              {!selectedProjectId ? (
                <div className="rounded-xl border border-neutral-light bg-neutral-50 p-6 text-sm text-neutral text-center">
                  Selecione um projeto para ver certificados emitidos.
                </div>
              ) : certsForProject.length === 0 ? (
                <div className="rounded-xl border border-neutral-light bg-neutral-50 p-6 text-sm text-neutral text-center">
                  Nenhum certificado emitido ainda.
                </div>
              ) : (
                <div className="space-y-2">
                  {certsForProject.map((c) => {
                    const p = (participantsByProject[c.projectId] ?? []).find((x) => x.id === c.participantId)
                    return (
                      <div key={c.id} className="rounded-xl border border-neutral-light p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-primary truncate">{p?.name ?? c.participantId}</p>
                            <p className="text-xs text-neutral mt-1">
                              {roleLabel(c.role)} • {langLabel(c.lang)} • Emitido em{" "}
                              {new Date(c.issuedAt).toLocaleString()}
                            </p>
                            <p className="text-xs text-neutral mt-1">
                              Token QR: <span className="font-semibold text-primary break-all">{c.qrToken}</span>
                            </p>
                            {c.lastDownloadAt ? (
                              <p className="text-xs text-neutral mt-1">
                                Último download: {new Date(c.lastDownloadAt).toLocaleString()}
                              </p>
                            ) : null}
                          </div>

                          <div className="shrink-0 flex flex-col items-end gap-2">
                            {c.status === "ISSUED" ? chip("Emitido", "green") : chip("Revogado", "red")}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => downloadCert(c.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light hover:bg-neutral-50"
                          >
                            <Download size={16} />
                            Baixar
                          </button>
                          <button
                            onClick={() => copyToken(c.qrToken)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light hover:bg-neutral-50"
                          >
                            <Copy size={16} />
                            Copiar token
                          </button>
                          {c.status === "ISSUED" ? (
                            <button
                              onClick={() => revokeCert(c.id)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-red-200 text-red-700 bg-red-50 hover:opacity-95"
                            >
                              <XCircle size={16} />
                              Revogar
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                setCerts((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: "ISSUED" } : x)))
                              }
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-green-200 text-green-700 bg-green-50 hover:opacity-95"
                            >
                              <CheckCircle2 size={16} />
                              Reativar
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Section>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7">
            <Section title="Verificação por QR Code" icon={<QrCode size={18} />}>
              <p className="text-sm text-neutral mb-4">
                Valide um certificado usando o token do QR Code e exiba os dados do projeto, edital e participante.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-sm md:col-span-2">
                  <span className="block text-xs text-neutral mb-1">Token / hash do QR</span>
                  <input
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Cole o token…"
                  />
                </label>

                <button
                  onClick={validateQR}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:opacity-90 inline-flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Validar
                </button>

                <button
                  onClick={() => {
                    setQrInput("")
                    setQrResult(null)
                  }}
                  className="px-3 py-2 rounded-lg text-sm font-medium border border-neutral-light hover:bg-neutral-light inline-flex items-center justify-center gap-2"
                >
                  <RefreshCcw size={16} />
                  Limpar
                </button>
              </div>

              {/* Implementação real: token deve ser assinado/validado (ex.: JWT / HMAC) e consultar registro de emissão no backend. */}
            </Section>
          </div>

          <div className="lg:col-span-5">
            <Section title="Resultado" icon={<Users size={18} />}>
              {!qrResult ? (
                <div className="rounded-xl border border-neutral-light bg-neutral-50 p-6 text-sm text-neutral text-center">
                  Informe um token para validar.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border border-neutral-light bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-primary">Certificado</p>
                        <p className="text-xs text-neutral mt-1 break-all">
                          Token: <span className="font-semibold text-primary">{qrResult.qrToken}</span>
                        </p>
                        <p className="text-xs text-neutral mt-1">
                          Status:{" "}
                          {qrResult.status === "ISSUED" ? chip("Válido", "green") : chip("Revogado", "red")}
                        </p>
                        <p className="text-xs text-neutral mt-1">
                          Emitido em {new Date(qrResult.issuedAt).toLocaleString()} • {roleLabel(qrResult.role)} •{" "}
                          {langLabel(qrResult.lang)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const proj = projects.find((p) => p.id === qrResult.projectId) ?? null
                    const call = calls.find((c) => c.id === qrResult.callId) ?? null
                    const part =
                      (participantsByProject[qrResult.projectId] ?? []).find((p) => p.id === qrResult.participantId) ??
                      null

                    return (
                      <>
                        <div className="rounded-xl border border-neutral-light bg-white p-4">
                          <p className="text-sm font-semibold text-primary">Participante</p>
                          <p className="text-sm text-neutral mt-1">{part?.name ?? "—"}</p>
                          <p className="text-xs text-neutral mt-1">
                            Papel: <span className="font-semibold text-primary">{roleLabel(qrResult.role)}</span>
                          </p>
                          {part?.email ? <p className="text-xs text-neutral mt-1">Email: {part.email}</p> : null}
                        </div>

                        <div className="rounded-xl border border-neutral-light bg-white p-4">
                          <p className="text-sm font-semibold text-primary">Projeto</p>
                          <p className="text-sm text-neutral mt-1">{proj?.title ?? "—"}</p>
                          {proj?.center ? <p className="text-xs text-neutral mt-1">Centro: {proj.center}</p> : null}
                        </div>

                        <div className="rounded-xl border border-neutral-light bg-white p-4">
                          <p className="text-sm font-semibold text-primary">Edital</p>
                          <p className="text-sm text-neutral mt-1">{call?.title ?? "—"}</p>
                          <p className="text-xs text-neutral mt-1">Ano-base: {call?.baseYear ?? "—"}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
            </Section>
          </div>
        </div>
      )}
    </div>
  )
}
