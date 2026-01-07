import React from "react"
import bgImage from "@/utils/img/bg1.png"
import {
  Layers,
  Users,
  ShieldCheck,
  Lightbulb,
} from "lucide-react"
import AnimateIn from "@/components/AnimateIn"

/* Dados */
const pillars = [
  {
    title: "Gestão Inteligente",
    description:
      "Acompanhamento de projetos, bolsas e acordos institucionais em tempo real, com dados organizados e acessíveis.",
    icon: Layers,
  },
  {
    title: "Integração Acadêmica",
    description:
      "Conecta discentes, docentes, pesquisadores e gestores em um único ecossistema digital.",
    icon: Users,
  },
  {
    title: "Transparência e Controle",
    description:
      "Fluxos claros, histórico completo e rastreabilidade de decisões e documentos.",
    icon: ShieldCheck,
  },
  {
    title: "Inovação Institucional",
    description:
      "Base estratégica para indicadores científicos e políticas institucionais.",
    icon: Lightbulb,
  },
]

const indicators = [
  { value: "120+", label: "Projetos ativos" },
  { value: "300+", label: "Bolsas concedidas" },
  { value: "420+", label: "Docentes pesquisadores" },
  { value: "15+", label: "Editais ativos" },
  { value: "1.2k+", label: "Discentes em pesquisa" },
]

const About: React.FC = () => {
  return (
    <section id="about" className="w-full overflow-hidden pb-12">
      {/* HERO */}
      <div
        className="relative w-full h-[60vh] md:h-[75vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <span className="text-xs md:text-sm tracking-widest text-accent uppercase">
            Universidade Federal da Paraíba - UFPB
          </span>

          <h1 className="mt-4 text-3xl md:text-6xl font-bold text-white">
            Pró-Reitoria de Pesquisa
          </h1>

          <span className="mt-3 text-lg md:text-2xl font-semibold text-accent">
            PROPESQ
          </span>

          <div className="mt-4 w-28 h-[3px] bg-accent rounded-full" />
        </div>
      </div>

      {/* BLOCO INSTITUCIONAL */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* TEXTO */}
          <AnimateIn>
            <div className="max-w-xl space-y-5 text-neutral">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                Sobre a PROPESQ
              </h2>

              <div className="mt-2 w-20 h-[4px] bg-accent rounded-full" />

              <p className="text-base md:text-lg text-justify">
                A Pró-Reitoria de Pesquisa (Propesq) é o órgão auxiliar de direção
                superior incumbido de propor, planejar, coordenar, controlar,
                executar e avaliar as políticas de pesquisa científica e
                tecnológica mantidas pela Universidade.
              </p>

              <p className="text-base md:text-lg text-justify">
                A plataforma PROPESQ foi desenvolvida para organizar,
                acompanhar e fortalecer projetos de pesquisa, bolsas, acordos
                institucionais e trajetórias acadêmicas.
              </p>

              <p className="text-base md:text-lg text-justify pb-5">
                Atua como ambiente estratégico para integração acadêmica,
                transparência administrativa e inovação científica.
              </p>
            </div>
          </AnimateIn>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <AnimateIn key={index} delay={index * 120}>
                  <div className="
                    h-full
                    rounded-2xl p-6
                    bg-primary
                    border border-primary/20
                    shadow-card
                    flex flex-col
                  ">
                    {/* Cabeçalho */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-white text-primary shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg text-white/90">
                        {pillar.title}
                      </h3>
                    </div>

                    {/* Conteúdo */}
                    <p className="text-sm text-white/80 flex-grow">
                      {pillar.description}
                    </p>
                  </div>
                </AnimateIn>
              )
            })}
          </div>

        </div>
      </div>

      {/* INDICADORES */}
      <div className="py-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {indicators.map((item, index) => (
              <AnimateIn key={index} delay={index * 100}>
                <div className="group flex flex-col items-center justify-center rounded-2xl bg-white p-8 border-2 border-primary transition-colors duration-300 hover:bg-primary">
                  <span className="text-2xl md:text-3xl font-bold text-primary group-hover:text-white transition-colors">
                    {item.value}
                  </span>
                  <span className="mt-2 text-xs md:text-sm font-medium text-center text-primary group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
