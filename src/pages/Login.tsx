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

  // Novos estados para integração
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setRole(initialRole)
  }, [initialRole])

  /**
   * Centraliza a navegação pós-login.
   * - ADMINISTRADOR -> /dashboard
   * - DISCENTE -> /discente/projetos
   * - COORDENADOR -> /coordenador/projetos
   */
  const redirectByRole = (selectedRole: Role) => {
    if (selectedRole === "ADMINISTRADOR") {
      navigate("/dashboard")
    } else if (selectedRole === "DISCENTE") {
      navigate("/discente/projetos")
    } else if (selectedRole === "COORDENADOR") {
      navigate("/coordenador/projetos")
    } else {
      navigate("/projetos")
    }
  }

  /**
   * Lê JSON de forma segura.
   *
   * Motivo:
   * Quando o backend retorna resposta vazia, HTML, erro 404/500 sem corpo,
   * ou qualquer conteúdo que não seja JSON válido, o response.json() quebra com:
   * "Unexpected end of JSON input".
   *
   * Essa função evita esse erro feio na interface e permite exibir
   * uma mensagem mais controlada para o usuário.
   */
  const readJsonSafe = async (response: Response) => {
    const text = await response.text()

    if (!text) {
      return null
    }

    try {
      return JSON.parse(text)
    } catch {
      return null
    }
  }

  // Função adaptada para consumir o serviço do backend que irá rodar localmente na VM disponibilizada
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Limpa erros anteriores e inicia o loading
    setError("")
    setLoading(true)

    try {
      /**
       * MODO MOCK / TESTE SEM BACKEND PARA O RENDER
       *
       * Objetivo: Permitir que a interface hospedada no Render seja acessada por outras pessoas sem precisar publicar o backend.
       *
       * Como ativar no Render:
       * 1. Abrir o serviço do frontend no Render
       * 2. Ir em Environment
       * 3. Adicionar:
       *    VITE_AUTH_MODE=mock
       * 4. Fazer Clear build cache & deploy
       *
       * Quando VITE_AUTH_MODE estiver como "mock", este bloco faz login local,
       * salva um token fictício e NÃO chama a API do backend.
       *
       * Para voltar ao login integrado:
       * - Remover VITE_AUTH_MODE do Render, ou
       * - Alterar para VITE_AUTH_MODE=api
       * - Fazer novo deploy
       */
      const authMode = import.meta.env.VITE_AUTH_MODE as string

      if (authMode === "mock") {
        const mockEmail = email || "usuario@ufpb.br"
        const mockPassword = password || "123456"

        // Token fictício apenas para liberar navegação no protótipo.
        // Não deve ser usado como autenticação real em produção.
        localStorage.setItem("token", "token-para-teste")

        // Mantém o perfil escolhido salvo para preservar o comportamento anterior da tela.
        localStorage.setItem("role", role)

        // Passa os dados para o contexto como se o login tivesse sido validado.
        login(mockEmail, mockPassword, role)

        // Navegação baseada na Role
        redirectByRole(role)

        return
      }

      // Pega a URL do backend da variável de ambiente
      const apiUrl = import.meta.env.VITE_API_URL as string

      /**
       * Validação simples para evitar uma chamada para "undefined/authentications/sessions".
       *
       * Em modo integrado, VITE_API_URL precisa existir no ambiente.
       * Exemplo:
       * VITE_API_URL=https://seu-backend.onrender.com/api
       */
      if (!apiUrl) {
        throw new Error(
          "VITE_API_URL não está configurada. Ative VITE_AUTH_MODE=mock para testar sem backend."
        )
      }

      // Faz a requisição para a rota de login
      // Se necessário testar o dashboard basta comentar:
      /*  */
      const response = await fetch(`${apiUrl}/authentications/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          // Se o backend precisar da role para autenticar, descomentar a linha abaixo:
          // role
        }),
      })

      // Converte a resposta do NestJS de JSON para um objeto typescript.
      // Usa leitura segura para evitar erro "Unexpected end of JSON input".
      const data = await readJsonSafe(response)

      if (!response.ok) {
        // Se o status HTTP não for 200-299, lança um erro
        throw new Error(
          data?.message ||
            data?.error ||
            `E-mail ou senha incorretos. Status: ${response.status}`
        )
      }
      /* */

      // Descomentar linha abaixo para testes sem backend
      // const data = { token: "token-para-teste" }

      // Salva o token
      if (data?.token) {
        localStorage.setItem("token", data.token)
      }

      localStorage.setItem("role", role)

      // Passa os dados para o contexto
      login(email || "usuario@ufpb.br", password, role)

      // Navegação baseada na Role
      redirectByRole(role)
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

          {/* MENSAGEM DE ERRO */}
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
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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