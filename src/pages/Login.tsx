import React, { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth, Role } from "@/context/AuthContext"
import logo from "@/utils/img/logo_propesq.png"
import { Helmet } from "react-helmet"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const Roles: Role[] = ["DISCENTE", "COORDENADOR", "ADMINISTRADOR"]

  const initialRole = useMemo(() => {
    const fromUrl = (searchParams.get("role") || "").toUpperCase()
    if (Roles.includes(fromUrl as Role)) return fromUrl as Role

    const fromStorage = (localStorage.getItem("role") || "").toUpperCase()
    if (Roles.includes(fromStorage as Role)) return fromStorage as Role

    return "DISCENTE"
  }, [searchParams])

  const [role, setRole] = useState<Role>(initialRole)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  // NOVOS ESTADOS PARA A INTEGRAÇÃO
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setRole(initialRole)
  }, [initialRole])

  // FUNÇÃO ADAPTADA PARA CONSUMIR A API
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Limpa erros anteriores e inicia o loading
    setError("")
    setLoading(true)

    try {
      // Pega a URL do backend da variável de ambiente
      const apiUrl = import.meta.env.VITE_API_URL

      // Faz a requisição para a rota que descobrimos nos logs
      const response = await fetch(`${apiUrl}/authentications/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          // Se o backend precisar da role para autenticar, descomente a linha abaixo:
          // role 
        }),
      })

      if (!response.ok) {
        // Se o status HTTP não for 200-299, lança um erro
        throw new Error("E-mail ou senha incorretos.")
      }

      // Converte a resposta do NestJS para JSON (geralmente contém o Token JWT)
      const data = await response.json()

      // Salva o token (adapte "data.token" para o nome exato que o seu backend retorna)
      if (data.token) {
        localStorage.setItem("token", data.token)
      }
      
      localStorage.setItem("role", role)
      
      // Passa os dados para o contexto
      login(email || "usuario@ufpb.br", password, role)

      // Navegação baseada na Role
      if (role === "ADMINISTRADOR") {
        navigate("/dashboard")
      } else if (role === "DISCENTE") {
        navigate("/discente/dashboard")
      } else if (role === "COORDENADOR") {
        navigate("/coordenador/projetos")
      } else {
        navigate("/projetos")
      }

    } catch (err: any) {
      console.error("Erro no login:", err)
      setError(err.message || "Falha ao conectar com o servidor.")
    } finally {
      // Finaliza o estado de carregamento independentemente de dar certo ou errado
      setLoading(false)
    }
  }

  return (
    <div
      className="
      min-h-screen
      flex flex-col
      bg-gradient-to-br
      from-neutral-light
      via-white
      to-primary/5
    "
    >
      <Helmet>
        <title>Login • PROPESQ UFPB</title>
      </Helmet>

      {/* CONTEÚDO */}
      <main className="flex flex-1 items-center justify-center px-4">
        <form
          onSubmit={onSubmit}
          className="
            w-full max-w-sm
            bg-white
            rounded-2xl
            border border-neutral-light
            shadow-card
            px-6 py-7
          "
        >
          {/* HEADER */}
          <div className="flex flex-col items-center gap-3 mb-7 text-center">
            <img
              src={logo}
              alt="PROPESQ UFPB"
              className="h-10 w-auto select-none"
            />

            <div>
              <h1 className="text-base font-bold text-primary">
                Acesso à Plataforma
              </h1>
              <p className="text-xs text-neutral">
                Pró-Reitoria de Pesquisa • UFPB
              </p>
            </div>
          </div>

          {/* MENSAGEM DE ERRO (NOVO) */}
          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          {/* INPUTS */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral mb-1">
                E-mail institucional
              </label>
              <input
                type="email"
                placeholder="usuario@ufpb.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="
                  w-full
                  rounded-lg
                  border border-neutral-light
                  px-3 py-2
                  text-xs

                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary-lighter/40
                  focus:border-primary
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral mb-1">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="
                  w-full
                  rounded-lg
                  border border-neutral-light
                  px-3 py-2
                  text-xs

                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary-lighter/40
                  focus:border-primary
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              />
            </div>
          </div>

          {/* PERFIL */}
          <div className="mt-6">
            <p className="text-[10px] font-semibold text-primary mb-2 uppercase tracking-wide">
              Perfil de acesso
            </p>

            <div className="flex flex-wrap gap-2">
              {Roles.map((r) => {
                const active = role === r

                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    disabled={loading}
                    className={`
                      px-3 py-1.5
                      rounded-full
                      text-[10px] font-semibold
                      border
                      transition-all duration-200
                      disabled:opacity-50
                      disabled:cursor-not-allowed

                      ${
                        active
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-primary border-primary/30 hover:bg-primary hover:text-white"
                      }
                    `}
                  >
                    {r}
                  </button>
                )
              })}
            </div>
          </div>

          {/* AÇÕES */}
          <div className="mt-7 space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-lg
                bg-primary
                text-white
                py-2.5
                text-xs font-semibold

                transition-all duration-200
                shadow-sm

                hover:bg-primary-light
                hover:shadow-md
                disabled:opacity-70
                disabled:cursor-wait
                flex items-center justify-center gap-2
              "
            >
              {/* Muda o texto dinamicamente se estiver carregando */}
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Conectando...
                </>
              ) : (
                "Entrar"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              disabled={loading}
              className="
                w-full
                rounded-lg
                border border-primary
                bg-white
                py-2.5
                text-xs font-medium
                text-primary

                transition-colors duration-200
                hover:bg-neutral-light
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              Voltar para a página inicial
            </button>
          </div>

          {/* LINK */}
          <div className="mt-4 text-center">
            <a href="#" className="text-[10px] text-primary hover:underline">
              Esqueci minha senha
            </a>
          </div>
        </form>
      </main>

      {/* FOOTER */}
      <footer className="py-4 text-center text-[10px] text-neutral">
        © {new Date().getFullYear()} PROPESQ • Universidade Federal da Paraíba
      </footer>
    </div>
  )
}