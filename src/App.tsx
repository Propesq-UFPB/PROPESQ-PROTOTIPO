import { Route, Routes, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"

// Landing
import LandingHome from "./landing"
import LandingLayout from "./landing/LandingLayout"

// Landing / Publications
import Publications from "./landing/Publications"
import Papers from "./landing/Papers"
import AwardedWorks from "./landing/AwardedWorks"

// Sistema
import AppHeader from "./components/AppHeader"
import Login from "./pages/Login"

//admin pages
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
import CallQuotas from "./pages/adm/calls/Quotas"

import GlobalSettings from "./pages/adm/settings/GlobalSettings"
import ScholarshipEntities from "./pages/adm/settings/ScholarshipEntities"
import AcademicUnits from "./pages/adm/settings/AcademicUnits"
import RolesDictionary from "./pages/adm/settings/RolesDictionary"
import UserTypes from "./pages/adm/settings/UserTypes"
import CreateInternalProject from "./pages/adm/projects/CreateInternalProject"
import CreateExternalProject from "./pages/adm/projects/CreateExternalProject"
import AdmProjectCommunication from "./pages/adm/projects/AdmProjectCommunication"
import AdmResearchModuleParameters from "./pages/adm/settings/Parameters"


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
import AdmCallQuotas from "./pages/adm/calls/Quotas"

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

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* LANDING PÚBLICA */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingHome />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/publications/anais" element={<Papers />} />
          <Route path="/publications/iniciados" element={<AwardedWorks />} />
        </Route>

        {/* 🔐 LOGIN */}
        <Route path="/login" element={<Login />} />

        {/*SISTEMA */}
        {/*SISTEMA - ADMIN */}
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

        <Route path="/adm/projetos/novo-interno" element={<Protected><Shell><CreateInternalProject /></Shell></Protected>} />
        <Route path="/adm/projetos/novo-externo" element={<Protected><Shell><CreateExternalProject /></Shell></Protected>} />
        <Route path="/adm/projetos/comunicacao" element={<Protected><Shell><AdmProjectCommunication /></Shell></Protected>} />



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

