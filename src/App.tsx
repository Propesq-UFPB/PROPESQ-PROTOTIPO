import React from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"

// Landing
import LandingHome from "./landing"
import LandingLayout from "./landing/LandingLayout"
import NewsAll from "./landing/NewsAll"
import Who from "./landing/Who"

// Landing / Publications
import Publications from "./landing/Publications"
import Papers from "./landing/Papers"
import AwardedWorks from "./landing/AwardedWorks"

// Publisher Sistema
import LoginPublisher from "./publisher/LoginPublisher"
import NewsList from "./publisher/NewsList"
import NewsCreate from "./publisher/NewsCreate"
import NewsEdit from "./publisher/NewsEdit"
import NewsPreview from "./publisher/NewsPreview"
import CategoriesTags from "./publisher/CategoriesTags"
import UsersAndRoles from "./publisher/UsersAndRoles"

// Sistema
import AppHeader from "./components/AppHeader"
import Login from "./pages/Login"

// admin pages
import Dashboard from "./pages/adm/Dashboard"
import EvaluationScore from "./pages/adm/avaliacao/EvaluationScore"
import Classification from "./pages/adm/avaliacao/Classification"
import IPIScore from "./pages/adm/avaliacao/IPIScore"
import Evaluators from "./pages/adm/avaliacao/Evaluators"

import MonitoringCertification from "./pages/adm/monitoring/MonitoringCertification"
import StudentReplacements from "./pages/adm/monitoring/StudentReplacements"
import ReportValidation from "./pages/adm/monitoring/ReportValidation"
import AdmCertificates from "./pages/adm/monitoring/AdmCertificates"

import CallsManagement from "./pages/adm/calls/CallsManagement"
import CreateCall from "./pages/adm/calls/CreateCall"
import CallSchedule from "./pages/adm/calls/CallSchedule"
import CallWorkflow from "./pages/adm/calls/CallWorkflow"
import AdmCallsManage from "./pages/adm/calls/Manage"
import AdmCallQuotas from "./pages/adm/calls/Quotas"

import GlobalSettings from "./pages/adm/settings/GlobalSettings"
import ScholarshipEntities from "./pages/adm/settings/ScholarshipEntities"
import AcademicUnits from "./pages/adm/settings/AcademicUnits"
import RolesDictionary from "./pages/adm/settings/RolesDictionary"
import UserTypes from "./pages/adm/settings/UserTypes"

import AdmProjectCommunication from "./pages/adm/projects/AdmProjectCommunication"
import AdmResearchModuleParameters from "./pages/adm/settings/Parameters"

import ProjectDetail from "./pages/adm/projects/ProjectDetail"
import ProjectCreateWizard from "./pages/adm/projects/ProjectCreateWizard"
import ProjectChangeStatus from "./pages/adm/projects/ProjectChangeStatus"
import ProjectCommunication from "./pages/adm/projects/ProjectCommunication"
import ProjectViewEdit from "./pages/adm/projects/ProjectViewEdit"
import AdmProjects from "./pages/adm/projects/AdmProjects"

// discente pages
import DisDashboard from "./pages/discente/DisDashboard"

import ProfileView from "./pages/discente/perfil/ProfileView"
import ProfileEdit from "./pages/discente/perfil/ProfileEdit"
import Documents from "./pages/discente/perfil/DocumentsUpload"
import BankData from "./pages/discente/perfil/BankDataForm"

import NoticesList from "./pages/discente/editais/NoticesList"
import NoticeView from "./pages/discente/editais/NoticeView"
import NoticeApplicationForm from "./pages/discente/editais/NoticeApplicationForm"
import NoticeApplicationStatus from "./pages/discente/editais/ApplicationStatus"
import NoticeApplicationReceipt from "./pages/discente/editais/ApplicationReceipt"
import NoticeApplicationResult from "./pages/discente/editais/ApplicationResult"

import DisProjects from "./pages/discente/projetos/MyProjects"
import DisProjectView from "./pages/discente/projetos/ProjectView"
import DisProjectHistory from "./pages/discente/projetos/ProjectHistory"
import BondStatus from "./pages/discente/perfil/BondStatus"

import ReportsList from "./pages/discente/relatorios/ReportsList"
import PartialReportForm from "./pages/discente/relatorios/PartialReportForm"
import FinalReportForm from "./pages/discente/relatorios/FinalReportForm"
import ReportView from "./pages/discente/relatorios/ReportView"
// import ReportStatus from "./pages/discente/relatorios/ReportStatus"

import EnicSubmissionForm from "./pages/discente/enic/EnicSubmissionForm"
// import EnicSubmissionStatus from "./pages/discente/enic/EnicSubmissionStatus"
import EnicSubmissionView from "./pages/discente/enic/EnicSubmissionView"
import EnicSubmissionsList from "./pages/discente/enic/EnicSubmissionsList"

// import NotificationsCenter from "./pages/discente/notificacoes/NotificationsCenter"
// import MessageThread from "./pages/discente/notificacoes/MessageThread"
// import MessagesInbox from "./pages/discente/notificacoes/MessagesInbox"

import CertificatesList from "./pages/discente/certificados/CertificatesList"
//import DisCertificateView from "./pages/discente/certificados/CertificateView"
import ParticipationHistory from "./pages/discente/certificados/ParticipationHistory"

import AvailablePlans from "./pages/discente/planos/AvailablePlans"
import PlanView from "./pages/discente/planos/PlanView"
// import InterestForm from "./pages/discente/planos/InterestForm"

import DisSettings from "./pages/discente/DisSettings"

import Projects from "./pages/Projects"
import MyProjects from "./pages/MyProjects"
import ProjectForm from "./pages/ProjectForm"
import Plans from "./pages/Plans"
import PlanForm from "./pages/PlanForm"
import Evaluations from "./pages/Evaluations"
import EvaluationDetail from "./pages/EvaluationDetail"
import Monitoring from "./pages/Monitoring"
import Reports from "./pages/Reports"
import Certificates from "./pages/Certificates"
import CertificateView from "./pages/CertificateView"
import AdminAnalytics from "./pages/AdminAnalytics"
import Settings from "./pages/Settings"
import NotFound from "./pages/NotFound"

/* ================= SISTEMA PRINCIPAL ================= */

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
    <AppHeader />
    <main className="p-4 md:p-6">{children}</main>
  </div>
)

/* ================= PUBLISHER  ================= */

const PUBLISHER_STORAGE_KEY = "publisher_session"

const PublisherProtected: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const raw = localStorage.getItem(PUBLISHER_STORAGE_KEY)
  const session = raw ? JSON.parse(raw) : null
  const ok = session?.role === "PUBLICADOR"
  if (!ok) return <Navigate to="/publisher/login" replace />
  return <>{children}</>
}


import PublisherHeader from "./publisher/PublisherHeader"
const PublisherShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-slate-100">
    <PublisherHeader />
    <main className="mx-auto max-w-6xl px-4 md:px-6 py-4 md:py-6">
      {children}
    </main>
  </div>
)


/* ================= APP ================= */

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* LANDING PÚBLICA */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingHome />} />
          <Route path="/noticias" element={<NewsAll />} />
          <Route path="/publicações" element={<Publications />} />
          <Route path="/publications/anais" element={<Papers />} />
          <Route path="/publications/iniciados" element={<AwardedWorks />} />
          <Route path="/quem-somos" element={<Who />} />
        </Route>

        {/* 🔐 LOGIN (Sistema principal) */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 LOGIN (Publisher) */}
        <Route path="/publisher/login" element={<LoginPublisher />} />

        {/* PAINEL DE PUBLICADORES */}
        <Route path="/publisher" element={<PublisherProtected><PublisherShell><NewsList /></PublisherShell></PublisherProtected>} />
        <Route path="/publisher/news" element={<PublisherProtected><PublisherShell><NewsList /></PublisherShell></PublisherProtected>} />
        <Route path="/publisher/news/new" element={<PublisherProtected><PublisherShell><NewsCreate /></PublisherShell></PublisherProtected>} />
        <Route path="/publisher/news/:id/edit" element={<PublisherProtected><PublisherShell><NewsEdit /></PublisherShell></PublisherProtected>} />
        <Route path="/publisher/news/:id/preview" element={<PublisherProtected><PublisherShell><NewsPreview /></PublisherShell></PublisherProtected>} />
        <Route path="/publisher/tags" element={<PublisherProtected><PublisherShell><CategoriesTags /></PublisherShell></PublisherProtected>} />
        <Route path="/publisher/users" element={<PublisherProtected><PublisherShell><UsersAndRoles /></PublisherShell></PublisherProtected>} />

        {/* SISTEMA */}
        <Route path="/dashboard" element={<Protected><Shell><Dashboard /></Shell></Protected>} />
        <Route path="/adm/avaliacao" element={<Protected><Shell><EvaluationScore /></Shell></Protected>} />
        <Route path="/adm/avaliacao/classificacao" element={<Protected><Shell><Classification /></Shell></Protected>} />
        <Route path="/adm/avaliacao/pontuacao" element={<Protected><Shell><IPIScore /></Shell></Protected>} />
        <Route path="/adm/avaliacao/avaliadores" element={<Protected><Shell><Evaluators /></Shell></Protected>} />

        <Route path="/adm/monitoring" element={<Protected><Shell><MonitoringCertification /></Shell></Protected>} />
        <Route path="/adm/monitoring/replacements" element={<Protected><Shell><StudentReplacements /></Shell></Protected>} />
        <Route path="/adm/monitoring/report-validation" element={<Protected><Shell><ReportValidation /></Shell></Protected>} />
        <Route path="/adm/monitoring/AdmCertificates" element={<Protected><Shell><AdmCertificates /></Shell></Protected>} />

        <Route path="/adm/calls" element={<Protected><Shell><CallsManagement /></Shell></Protected>} />
        <Route path="/adm/calls/CreateCall" element={<Protected><Shell><CreateCall /></Shell></Protected>} />
        <Route path="/adm/calls/Manage" element={<Protected><Shell><AdmCallsManage /></Shell></Protected>} />
        <Route path="/adm/calls/CallSchedule" element={<Protected><Shell><CallSchedule /></Shell></Protected>} />
        <Route path="/adm/calls/CallWorkflow" element={<Protected><Shell><CallWorkflow /></Shell></Protected>} />
        <Route path="/adm/calls/quotas" element={<Protected><Shell><AdmCallQuotas /></Shell></Protected>} />

        <Route path="/adm/settings" element={<Protected><Shell><GlobalSettings /></Shell></Protected>} />
        <Route path="/adm/settings/scholarships" element={<Protected><Shell><ScholarshipEntities /></Shell></Protected>} />
        <Route path="/adm/settings/academic-units" element={<Protected><Shell><AcademicUnits /></Shell></Protected>} />
        <Route path="/adm/settings/roles" element={<Protected><Shell><RolesDictionary /></Shell></Protected>} />
        <Route path="/adm/settings/user-types" element={<Protected><Shell><UserTypes /></Shell></Protected>} />
        <Route path="/adm/settings/parameters" element={<Protected><Shell><AdmResearchModuleParameters /></Shell></Protected>} />

        <Route path="/adm/projetos/comunicacao" element={<Protected><Shell><AdmProjectCommunication /></Shell></Protected>} />
        <Route path="/adm/projetos/detalhes-projetos" element={<Protected><Shell><ProjectDetail /></Shell></Protected>} />
        <Route path="/adm/projetos/novo" element={<Protected><Shell><ProjectCreateWizard /></Shell></Protected>} />
        <Route path="/adm/projetos/status" element={<Protected><Shell><ProjectChangeStatus /></Shell></Protected>} />
        <Route path="/adm/projetos/:id/status" element={<Protected><Shell><ProjectChangeStatus /></Shell></Protected>} />
        <Route path="/adm/projetos/comunicacao/:id" element={<Protected><Shell><ProjectCommunication /></Shell></Protected>} />
        <Route path="/adm/projetos/:id/visualizar" element={<Protected><Shell><ProjectViewEdit /></Shell></Protected>} />
        <Route path="/adm/admprojetos" element={<Protected><Shell><AdmProjects /></Shell></Protected>} />

        {/* Discente */}
        <Route path="/discente/dashboard" element={<Protected><Shell><DisDashboard /></Shell></Protected>} />

        <Route path="/discente/perfil" element={<Protected><Shell><ProfileView /></Shell></Protected>} />
        <Route path="/discente/perfil/editar" element={<Protected><Shell><ProfileEdit /></Shell></Protected>} />
        <Route path="/discente/perfil/documentos" element={<Protected><Shell><Documents /></Shell></Protected>} />
        <Route path="/discente/perfil/dados-bancarios" element={<Protected><Shell><BankData /></Shell></Protected>} />

        <Route path="/discente/editais" element={<Protected><Shell><NoticesList /></Shell></Protected>} />
        <Route path="/discente/editais/:id" element={<Protected><Shell><NoticeView /></Shell></Protected>} />
        <Route path="/discente/editais/:id/inscricao" element={<Protected><Shell><NoticeApplicationForm /></Shell></Protected>} />
        <Route path="/discente/editais/:id/status" element={<Protected><Shell><NoticeApplicationStatus /></Shell></Protected>} />
        <Route path="/discente/editais/:id/inscricao/comprovante" element={<Protected><Shell><NoticeApplicationReceipt /></Shell></Protected>} />
        <Route path="/discente/editais/:id/resultado" element={<Protected><Shell><NoticeApplicationResult /></Shell></Protected>} />

        <Route path="/discente/projetos" element={<Protected><Shell><DisProjects /></Shell></Protected>} />
        <Route path="/discente/projetos/:id" element={<Protected><Shell><DisProjectView /></Shell></Protected>} />
        <Route path="/discente/projetos/:id/historico" element={<Protected><Shell><DisProjectHistory /></Shell></Protected>} />
        <Route path="/discente/vinculo" element={<Protected><Shell><BondStatus /></Shell></Protected>} />

        <Route path="/discente/relatorios" element={<Protected><Shell><ReportsList /></Shell></Protected>} />
        <Route path="/discente/relatorios/:id/parcial" element={<Protected><Shell><PartialReportForm /></Shell></Protected>} />
        <Route path="/discente/relatorios/:id/final" element={<Protected><Shell><FinalReportForm /></Shell></Protected>} />
        <Route path="/discente/relatorios/:id/visualizar" element={<Protected><Shell><ReportView /></Shell></Protected>} />
        {/*<Route path="/discente/relatorios/:id/status" element={<Protected><Shell><ReportStatus /></Shell></Protected>} />*/}

        <Route path="/discente/enic/inscricao" element={<Protected><Shell><EnicSubmissionForm /></Shell></Protected>} />
        {/*<Route path="/discente/enic/status" element={<Protected><Shell><EnicSubmissionStatus /></Shell></Protected>} />*/}
        <Route path="/discente/enic/visualizar/:id" element={<Protected><Shell><EnicSubmissionView /></Shell></Protected>} />
        <Route path="/discente/enic/submissions" element={<Protected><Shell><EnicSubmissionsList /></Shell></Protected>} />

        {/* <Route path="/discente/notificacoes" element={<Protected><Shell><NotificationsCenter /></Shell></Protected>} />*/}
        {/* <Route path="/discente/notificacoes/inbox" element={<Protected><Shell><MessagesInbox /></Shell></Protected>} />*/}
        {/* <Route path="/discente/notificacoes/thread/:id" element={<Protected><Shell><MessageThread /></Shell></Protected>} />*/}

        <Route path="/discente/certificados" element={<Protected><Shell><CertificatesList /></Shell></Protected>} />  
        {/* <Route path="/discente/certificados/:id" element={<Protected><Shell><DisCertificateView /></Shell></Protected>} />*/}
        <Route path="/discente/historico-participacao" element={<Protected><Shell><ParticipationHistory /></Shell></Protected>} />

        <Route path="/discente/planos-disponiveis" element={<Protected><Shell><AvailablePlans /></Shell></Protected>} />
        <Route path="/discente/planos-disponiveis/:id" element={<Protected><Shell><PlanView /></Shell></Protected>} />
        {/* <Route path="/discente/planos-disponiveis/:id/interesse" element={<Protected><Shell><InterestForm /></Shell></Protected>} /> */}

        <Route path="/discente/configuracoes" element={<Protected><Shell><DisSettings /></Shell></Protected>} />

        

        <Route path="/projetos" element={<Protected><Shell><Projects /></Shell></Protected>} />
        <Route path="/meus-projetos" element={<Protected><Shell><MyProjects /></Shell></Protected>} />
        <Route path="/novo-projeto" element={<Protected><Shell><ProjectForm /></Shell></Protected>} />
        <Route path="/planos" element={<Protected><Shell><Plans /></Shell></Protected>} />
        <Route path="/novo-plano" element={<Protected><Shell><PlanForm /></Shell></Protected>} />
        <Route path="/avaliacoes" element={<Protected><Shell><Evaluations /></Shell></Protected>} />
        <Route path="/avaliacoes/:id" element={<Protected><Shell><EvaluationDetail /></Shell></Protected>} />
        <Route path="/acompanhamento" element={<Protected><Shell><Monitoring /></Shell></Protected>} />
        <Route path="/relatorios" element={<Protected><Shell><Reports /></Shell></Protected>} />
        <Route path="/certificados" element={<Protected><Shell><Certificates /></Shell></Protected>} />
        <Route path="/certificados/:id" element={<Protected><Shell><CertificateView /></Shell></Protected>} />
        <Route path="/painel-gerencial" element={<Protected><Shell><AdminAnalytics /></Shell></Protected>} />
        <Route path="/configuracoes" element={<Protected><Shell><Settings /></Shell></Protected>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}
