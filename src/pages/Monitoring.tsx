// src/pages/Monitoring.tsx - Painel Administrativo de Editais

import React from "react"
import Card from "@/components/Card"
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaFileAlt,
  FaPlus,
  FaUsers,
  FaExclamationTriangle,
} from "react-icons/fa"
import { Helmet } from "react-helmet"

const etapas = [
  { nome: "Submissão", data: "2025-09-01", done: true },
  { nome: "Avaliação", data: "2025-10-10", done: true },
  { nome: "Vigência", data: "2025-10-20", done: false },
  { nome: "Encerramento", data: "2026-08-31", done: false },
]

const editaisRecentes = [
  { titulo: "PIBIC 2025/2026", status: "Em avaliação" },
  { titulo: "PIBITI 2025", status: "Em vigência" },
  { titulo: "Edital Inovação Aberta", status: "Submissão aberta" },
]

export default function Monitoring() {
  const completed = etapas.filter((e) => e.done).length
  const progress = Math.round((completed / etapas.length) * 100)

  const resumo = [
    {
      title: "Total de Editais",
      value: 12,
      icon: <FaFileAlt />,
      color: "text-primary bg-primary/10",
    },
    {
      title: "Em Avaliação",
      value: 4,
      icon: <FaUsers />,
      color: "text-purple-700 bg-purple-100",
    },
    {
      title: "Em Vigência",
      value: 5,
      icon: <FaClock />,
      color: "text-warning bg-warning/10",
    },
    {
      title: "Encerrados",
      value: 3,
      icon: <FaTimesCircle />,
      color: "text-danger bg-danger/10",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Painel de Editais • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Painel de Editais
            </h1>
            <p className="mt-1 text-base text-neutral">
              Gestão, acompanhamento e controle administrativo dos editais institucionais
            </p>
          </div>

          <a
            href="#"
            className="
              inline-flex items-center gap-3
              rounded-xl bg-primary px-6 py-3
              text-white font-medium
              hover:bg-primary-light transition
            "
          >
            <FaPlus />
            Criar novo edital
          </a>
        </header>

        {/* RESUMO */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resumo.map((r, i) => (
            <div
              key={i}
              className="
                bg-white rounded-2xl
                border border-primary/20
                p-6 shadow-card
                flex items-center gap-4
              "
            >
              <div
                className={`
                  w-12 h-12 rounded-xl
                  flex items-center justify-center
                  text-xl ${r.color}
                `}
              >
                {r.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {r.value}
                </div>
                <div className="text-sm text-neutral">
                  {r.title}
                </div>
              </div>
            </div>
          ))}
        </section>


        {/* AÇÕES + ALERTAS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title={<span className="text-lg">Ações Rápidas</span>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <button
                className="
                  group flex items-center gap-3
                  rounded-xl border border-primary/30
                  bg-white p-4
                  text-sm text-primary
                  hover:bg-primary hover:text-white
                  transition
                "
              >
                <FaFileAlt className="text-lg group-hover:text-white" />
                <span className="font-medium">Gerenciar Inscrições</span>
              </button>

              <button
                className="
                  group flex items-center gap-3
                  rounded-xl border border-primary/30
                  bg-white p-4
                  text-sm text-primary
                  hover:bg-primary hover:text-white
                  transition
                "
              >
                <FaUsers className="text-lg group-hover:text-white" />
                <span className="font-medium">Acompanhar Avaliações</span>
              </button>

              <button
                className="
                  group flex items-center gap-3
                  rounded-xl border border-primary/30
                  bg-white p-4
                  text-sm text-primary
                  hover:bg-primary hover:text-white
                  transition
                "
              >
                <FaClock className="text-lg group-hover:text-white" />
                <span className="font-medium">Prorrogar Prazos</span>
              </button>

              <button
                className="
                  group flex items-center gap-3
                  rounded-xl border border-primary/30
                  bg-white p-4
                  text-sm text-primary
                  hover:bg-primary hover:text-white
                  transition
                "
              >
                <FaCheckCircle className="text-lg group-hover:text-white" />
                <span className="font-medium">Publicar Resultados</span>
              </button>
            </div>
          </Card>


          <div className="md:col-span-2 border border-warning rounded-2xl p-2">
            <Card title={<span className="text-lg text-warning">Alertas</span>}>
              <div className="flex items-center gap-4 bg-warning/10 p-4 rounded-xl">
                <FaExclamationTriangle className="text-2xl text-warning" />
                <div className="text-sm text-warning">
                  Existem <strong>2 editais</strong> com prazos críticos nos próximos dias.
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* EDITAIS RECENTES */}
        <div className="border border-primary rounded-2xl p-4">
          <Card title={<span className="text-lg font-semibold">Editais Recentes</span>}>
            <div className="divide-y divide-neutral-light">
              {editaisRecentes.map((e, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 hover:bg-neutral-light/50 transition"
                >
                  <span className="text-sm text-primary font-medium">
                    {e.titulo}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {e.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
