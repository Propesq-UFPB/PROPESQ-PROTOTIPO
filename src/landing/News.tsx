// Notícias e comunicados

import React from "react"
import AnimateIn from "@/components/AnimateIn"

type NewsItem = {
  title: string
  description: string
  image: string
  tag: string
  date: string
  time: string
}

const NEWS_DATA: NewsItem[] = [
  {
    title: "Lançamento da plataforma PROPESQ",
    description:
      "Nova etapa na gestão da pesquisa, centralizando projetos, bolsas e acordos.",
    tag: "Notícia",
    date: "05/01/2026",
    time: "10:30",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Novo fluxo digital de projetos",
    description:
      "Submissão e acompanhamento de projetos de forma totalmente digital.",
    tag: "Notícia",
    date: "03/01/2026",
    time: "14:10",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop", 
  },
  {
    title: "Indicadores estratégicos",
    description:
      "Painéis com métricas para apoio à decisão científica.",
    tag: "Notícia",
    date: "28/12/2025",
    time: "09:00",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop", 
  },
]


const News: React.FC = () => {
  return (
    <section id="news" className="w-full bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho */}
        <AnimateIn>
          <div className="max-w-3xl mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-primary">
              Notícias e comunicados
            </h2>

            {/* Linha decorativa */}
            <div className="mt-3 w-20 h-[4px] bg-accent rounded-full" />

            <p className="mt-4 text-sm md:text-base text-neutral">
              Atualizações institucionais e comunicados oficiais da PROPESQ.
            </p>
          </div>
        </AnimateIn>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {NEWS_DATA.map((news, index) => (
            <AnimateIn key={index} delay={index * 120}>
              <article
                className="
                  group relative h-full
                  rounded-2xl bg-white
                  border border-neutral/10
                  shadow-card overflow-hidden
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-lg
                  flex flex-col
                "
              >
                {/* Barra lateral decorativa */}
                <div className="absolute left-0 top-0 h-full w-[5px] bg-primary" />

                {/* Imagem */}
                <div className="h-40 w-full overflow-hidden shrink-0">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="
                      h-full w-full object-cover
                      transition-transform duration-500
                      group-hover:scale-105
                    "
                  />
                </div>

                {/* Conteúdo */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Meta */}
                  <div className="flex items-center justify-between mb-3 text-[11px] text-neutral">
                    <span>
                      {news.date} • {news.time}
                    </span>

                    <span
                      className="
                        px-3 py-1 rounded-full
                        bg-gradient-to-r from-accent to-accent-medium
                        text-neutral font-semibold
                      "
                    >
                      {news.tag}
                    </span>
                  </div>

                  {/* Título */}
                  <h3 className="text-base md:text-lg font-semibold text-primary mb-2 leading-snug">
                    {news.title}
                  </h3>

                  {/* Descrição */}
                  <p className="text-xs md:text-sm text-neutral leading-relaxed flex-grow">
                    {news.description}
                  </p>
                </div>
              </article>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default News
