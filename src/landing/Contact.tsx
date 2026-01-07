import React from "react"
import {
  Instagram,
  Youtube,
  MapPin,
  Mail,
  Clock,
  Building2,
} from "lucide-react"
import AnimateIn from "@/components/AnimateIn"

const Contact: React.FC = () => {
  return (
    <section
      id="contact"
      className="w-full bg-primary py-8 md:py-10"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho */}
        <AnimateIn>
          <div className="mb-6 max-w-3xl">
            <h2 className="text-lg md:text-xl font-semibold text-white">
              Contato
            </h2>
            <p className="mt-1 text-xs md:text-sm text-white/80">
              Canais oficiais da Pró-Reitoria de Pesquisa da UFPB.
            </p>
          </div>
        </AnimateIn>

        {/* Conteúdo em 2 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          {/* Coluna 1 */}
          <AnimateIn>
            <div className="space-y-5 text-sm md:text-sm text-white/85">
              <div>
                <div className="flex items-center gap-2 text-white mb-1">
                  <Building2 size={16} />
                  <span className="font-medium">Instituição</span>
                </div>
                <p>
                  Pró-Reitoria de Pesquisa<br />
                  Universidade Federal da Paraíba
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-white mb-1">
                  <MapPin size={16} />
                  <span className="font-medium">Endereço</span>
                </div>
                <p>
                  Campus I – Cidade Universitária<br />
                  João Pessoa – PB
                </p>
              </div>
            </div>
          </AnimateIn>

          {/* Coluna 2 */}
          <AnimateIn delay={120}>
            <div className="space-y-5 text-sm md:text-sm text-white/85">
              <div>
                <div className="flex items-center gap-2 text-white mb-1">
                  <Mail size={16} />
                  <span className="font-medium">E-mail</span>
                </div>
                <p>contato.propesq@ufpb.br</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-white mb-1">
                  <Clock size={16} />
                  <span className="font-medium">Atendimento</span>
                </div>
                <p>Seg–Sex • 8h às 17h</p>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <a
                  href="https://www.instagram.com/propesqufpb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-accent transition-colors"
                >
                  <Instagram size={16} />
                  <span className="text-xs md:text-sm">Instagram</span>
                </a>

                <a
                  href="https://www.youtube.com/@propesqufpb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-accent transition-colors"
                >
                  <Youtube size={16} />
                  <span className="text-xs md:text-sm">YouTube</span>
                </a>
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}

export default Contact
