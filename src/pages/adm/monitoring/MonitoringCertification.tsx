import React from "react"
import { NavLink } from "react-router-dom"
import { Users, FileCheck, BadgeCheck, QrCode } from "lucide-react"

function CardLink({
  to,
  title,
  desc,
  icon,
}: {
  to: string
  title: string
  desc: string
  icon: React.ReactNode
}) {
  return (
    <NavLink
      to={to}
      className="block rounded-xl border border-neutral-light bg-white p-5 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-neutral-light/60">{icon}</div>
        <div>
          <h3 className="text-sm font-semibold text-primary">{title}</h3>
          <p className="text-sm text-neutral mt-1">{desc}</p>
        </div>
      </div>
    </NavLink>
  )
}

export default function MonitoringCertification() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-primary">Acompanhamento & Certificação</h1>
        <p className="text-sm text-neutral">
          Gerencie substituições de discentes, valide relatórios e emita certificados com verificação via PDF + QR Code.
        </p>
      </header>

      {/* Quick actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardLink
          to="/adm/acompanhamento/replacements"
          title="Substituições de Discentes"
          desc="Analise e aprove solicitações de substituição."
          icon={<Users size={18} />}
        />
        <CardLink
          to="/adm/acompanhamento/report-validation"
          title="Validação de Relatórios"
          desc="Valide relatórios submetidos e acompanhe pendências."
          icon={<FileCheck size={18} />}
        />
        <CardLink
          to="/adm/acompanhamento/certificates"
          title="Certificados"
          desc="Gere PDFs e gerencie a verificação por QR Code."
          icon={<BadgeCheck size={18} />}
        />
      </section>

      {/* Highlights / KPI placeholders */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-neutral-light bg-white p-5">
          <p className="text-xs text-neutral">Substituições pendentes</p>
          <p className="text-2xl font-bold text-primary mt-2">—</p>
        </div>
        <div className="rounded-xl border border-neutral-light bg-white p-5">
          <p className="text-xs text-neutral">Relatórios aguardando validação</p>
          <p className="text-2xl font-bold text-primary mt-2">—</p>
        </div>
        <div className="rounded-xl border border-neutral-light bg-white p-5">
          <p className="text-xs text-neutral">Certificados emitidos</p>
          <p className="text-2xl font-bold text-primary mt-2">—</p>
        </div>
        <div className="rounded-xl border border-neutral-light bg-white p-5">
          <p className="text-xs text-neutral">Validações por QR (7 dias)</p>
          <p className="text-2xl font-bold text-primary mt-2">—</p>
        </div>
      </section>

      {/* Note about certificate verification */}
      <section className="rounded-xl border border-neutral-light bg-white p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-neutral-light/60">
            <QrCode size={18} />
          </div>
          <h2 className="text-sm font-semibold text-primary">Verificação de certificado</h2>
        </div>
        <p className="text-sm text-neutral">
          Os certificados devem suportar geração de PDF e verificação por QR Code, exibindo os papéis:
          Orientador, Aluno e Avaliador.
        </p>
      </section>
    </div>
  )
}
