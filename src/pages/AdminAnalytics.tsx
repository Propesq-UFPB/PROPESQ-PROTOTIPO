// src/pages/AdminAnalytics.tsx

import React, { useState } from "react"
import StatCard from "@/components/StatCard"
import Card from "@/components/Card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts"
import { Helmet } from "react-helmet"

/* ================= TAXONOMIAS ================= */

const AREAS = ["Exatas", "Humanas", "Saúde", "Tecnologia", "Biológicas"]

const CENTROS = [
  "Centro de Ciências da Saúde",
  "Centro de Informática",
  "Centro de Ciências Humanas",
  "Centro de Tecnologia",
  "Centro de Ciências Exatas",
]

const EIXOS = [
  "Saúde",
  "Educação",
  "Trabalho & Renda",
  "Inovação & Tecnologia",
  "Sustentabilidade",
  "Inclusão Social",
]

const STATUS = [
  "Submissão",
  "Em avaliação",
  "Aprovado",
  "Em andamento",
  "Concluído",
]

const TIPOS_BOLSA = [
  "Iniciação Científica",
  "Mestrado",
  "Doutorado",
  "Extensão",
]

/* ================= MOCKS ================= */

const projetos = Array.from({ length: 140 }, (_, i) => ({
  id: i + 1,
  area: AREAS[Math.floor(Math.random() * AREAS.length)],
  centro: CENTROS[Math.floor(Math.random() * CENTROS.length)],
  eixo: EIXOS[Math.floor(Math.random() * EIXOS.length)],
  status: STATUS[Math.floor(Math.random() * STATUS.length)],
  ano: 2019 + Math.floor(Math.random() * 7),
  aprovados: Math.floor(Math.random() * 25),
  reprovados: Math.floor(Math.random() * 8),
}))

const bolsas = Array.from({ length: 220 }, (_, i) => ({
  centro: CENTROS[Math.floor(Math.random() * CENTROS.length)],
  area: AREAS[Math.floor(Math.random() * AREAS.length)],
  tipo: TIPOS_BOLSA[Math.floor(Math.random() * TIPOS_BOLSA.length)],
}))

const COLORS = [
  "#022859",
  "#03588C",
  "#0597F2",
  "#F2B705",
  "#D97D0D",
  "#6A4C93",
]

/* ================= COMPONENTE ================= */

export default function AdminAnalytics() {
  const [centroFiltro, setCentroFiltro] =
    useState<string | "Todos">("Todos")

  const projetosFiltrados = projetos.filter(
    (p) => centroFiltro === "Todos" || p.centro === centroFiltro
  )

  const bolsasFiltradas = bolsas.filter(
    (b) => centroFiltro === "Todos" || b.centro === centroFiltro
  )

  /* ================= KPIs (INALTERADOS) ================= */

  const estatisticas = {
    totalProjetos: projetosFiltrados.length,
    emAndamento: projetosFiltrados.filter(
      (p) => p.status === "Em andamento"
    ).length,
    concluidos: projetosFiltrados.filter(
      (p) => p.status === "Concluído"
    ).length,
    bolsistas: bolsasFiltradas.length,
    editaisAtivos: 3,
    taxaAprovacao: Math.round(
      (projetosFiltrados.reduce((a, p) => a + p.aprovados, 0) /
        (projetosFiltrados.reduce(
          (a, p) => a + p.aprovados + p.reprovados,
          0
        ) || 1)) *
        100
    ),
  }

  /* ================= GRÁFICOS ================= */

  const projetosPorCentro = CENTROS.map((c) => ({
    centro: c,
    total: projetosFiltrados.filter((p) => p.centro === c).length,
  }))

  const projetosPorEixo = EIXOS.map((e) => ({
    eixo: e,
    total: projetosFiltrados.filter((p) => p.eixo === e).length,
  }))

  const statusPorCentro = CENTROS.map((c) => ({
    centro: c,
    andamento: projetosFiltrados.filter(
      (p) => p.centro === c && p.status === "Em andamento"
    ).length,
    concluido: projetosFiltrados.filter(
      (p) => p.centro === c && p.status === "Concluído"
    ).length,
  }))

  const bolsasPorCentro = CENTROS.map((c) => ({
    name: c,
    value: bolsasFiltradas.filter((b) => b.centro === c).length,
  }))

  const evolucaoProjetos = Array.from(
    new Set(projetosFiltrados.map((p) => p.ano))
  ).map((ano) => ({
    ano,
    total: projetosFiltrados.filter((p) => p.ano === ano).length,
  }))

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Dashboard Gerencial • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-16">
        {/* HEADER */}
        <header>
          <h1 className="text-3xl font-bold text-primary">
            Dashboard Gerencial de Pesquisa
          </h1>
          <p className="mt-2 text-neutral">
            Análises institucionais por centro, eixo temático e área estratégica
          </p>
        </header>

        {/* FILTRO */}
        <section className="max-w-md">
          <label className="block text-sm font-semibold text-primary mb-2">
            Centro Acadêmico
          </label>
          <select
            value={centroFiltro}
            onChange={(e) => setCentroFiltro(e.target.value)}
            className="w-full rounded-lg border border-primary px-4 py-2 text-sm"
          >
            <option>Todos</option>
            {CENTROS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </section>

        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          <StatCard title="Projetos cadastrados" value={estatisticas.totalProjetos} />
          <StatCard title="Em andamento" value={estatisticas.emAndamento} />
          <StatCard title="Concluídos" value={estatisticas.concluidos} />
          <StatCard title="Bolsistas ativos" value={estatisticas.bolsistas} />
          <StatCard title="Editais ativos" value={estatisticas.editaisAtivos} />
          <StatCard title="Taxa de aprovação (%)" value={estatisticas.taxaAprovacao} />
        </section>

        {/* GRÁFICOS POR CENTRO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-primary rounded-2xl p-4">
            <Card title={<span className="text-xl font-bold">Projetos por Centro Acadêmico</span>}>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projetosPorCentro}>
                    <XAxis dataKey="centro" hide />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#03588C" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="border border-primary rounded-2xl p-4">
            <Card title={<span className="text-xl font-bold">Status dos Projetos por Centro</span>}>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusPorCentro}>
                    <XAxis dataKey="centro" hide />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="andamento" stackId="a" fill="#0597F2" />
                    <Bar dataKey="concluido" stackId="a" fill="#F2B705" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </section>

        {/* EIXOS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-primary rounded-2xl p-4">
            <Card title={<span className="text-xl font-bold">Projetos por Eixo Temático</span>}>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={projetosPorEixo} dataKey="total" outerRadius={110} label>
                      {projetosPorEixo.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="border border-primary rounded-2xl p-4">
            <Card title={<span className="text-xl font-bold">Distribuição de Bolsas por Centro</span>}>
              <div className=" p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={bolsasPorCentro} dataKey="value" outerRadius={110} label>
                      {bolsasPorCentro.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </section>

        {/* EVOLUÇÃO */}
        <div className="border border-primary rounded-2xl p-4">
          <Card title={<span className="text-xl font-bold">Quantidade de Bolsas ao Longo do Tempo</span>}>
            <div className=" p-4">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={evolucaoProjetos}>
                  <XAxis dataKey="ano" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    dataKey="total"
                    stroke="#022859"
                    fill="#02285933"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
