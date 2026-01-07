import { Link } from "react-router-dom"
import brasao from "@/utils/img/brasao.png"
import AnimateIn from "@/components/AnimateIn"

const publications = [
  {
    title: "Anais de Iniciação Científica",
    description:
      "Publicações oficiais dos eventos de iniciação científica da UFPB, organizadas por edição e ano.",
    to: "/publications/anais",
  },
  {
    title: "Série Iniciados",
    description:
      "Série editorial que reúne trabalhos selecionados de iniciação científica, com caráter permanente.",
    to: "/publications/iniciados",
  },
]

const Publications = () => {
  return (
    <section
      id="publications"
      className="py-16 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          {/* TEXTO + AÇÕES */}
          <AnimateIn>
            <div className="max-w-xl">
              <h1 className="text-2xl md:text-4xl font-bold text-primary">
                Publicações
              </h1>

              {/* Linha decorativa */}
              <div className="mt-2 w-24 h-[4px] bg-accent rounded-full" />

              <p className="mt-4 text-sm md:text-base text-neutral">
                Repositório institucional das publicações vinculadas à iniciação
                científica da Universidade Federal da Paraíba.
              </p>

              {/* Cards / Botões */}
              <div className="mt-10 space-y-4">
                {publications.map((item, index) => (
                  <AnimateIn key={index} delay={index * 120}>
                    <Link
                      to={item.to}
                      className="
                        group block
                        rounded-2xl bg-white
                        border-2 border-primary
                        p-4
                        transition-all duration-300
                        hover:bg-primary
                      "
                    >
                      <h2
                        className="
                          text-base font-semibold text-primary
                          transition-colors
                          group-hover:text-white
                        "
                      >
                        {item.title}
                      </h2>

                      <p
                        className="
                          mt-2 text-sm md:text-base text-neutral
                          transition-colors
                          group-hover:text-white/90
                        "
                      >
                        {item.description}
                      </p>

                      <span
                        className="
                          inline-block mt-4 text-sm font-semibold
                          text-primary
                          transition-colors
                          group-hover:text-white
                        "
                      >
                        Acessar publicações →
                      </span>
                    </Link>
                  </AnimateIn>
                ))}
              </div>
            </div>
          </AnimateIn>

          {/* IMAGEM */}
          <AnimateIn delay={200}>
            <div className="relative flex justify-center lg:justify-end">
              {/* Fundo decorativo */}
              <div className="absolute -right-28 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

              <img
                src={brasao}
                alt="Brasão da UFPB"
                className="
                  relative z-10
                  w-64 md:w-80 lg:w-[400px]
                  opacity-90
                  drop-shadow-xl
                  lg:-translate-x-10
                "
              />
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}

export default Publications
