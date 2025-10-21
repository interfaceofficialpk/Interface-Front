import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";
import Contact from "./pages/Contact.jsx";
import Signup from "./pages/auth/Signup.jsx";
import Login from "./pages/auth/Login.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import Team from "./pages/Team.jsx";
import Testimonials from "./pages/Testimonials.jsx";
import Locations from "./pages/dashboard/Locations.jsx";
import UniversityTypes from "./pages/dashboard/UniversityTypes.jsx";
import ProgramTypes from "./pages/dashboard/ProgramTypes.jsx";
import DocumentTypes from "./pages/dashboard/DocumentTypes.jsx";
import ExpenseTypes from "./pages/dashboard/ExpenseTypes.jsx";
import IncomeTypes from "./pages/dashboard/IncomeTypes.jsx";
import Nationalities from "./pages/dashboard/Nationalities.jsx";
import Currencies from "./pages/dashboard/Currencies.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import HomeLayout from "./layouts/HomeLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import Expenses from "./pages/dashboard/Expenses.jsx";
import Incomes from "./pages/dashboard/Incomes.jsx";
import Employees from "./pages/dashboard/Employees.jsx";
import Students from "./pages/dashboard/Students.jsx";
import Partners from "./pages/dashboard/Partners.jsx";
import ImmigrationClients from "./pages/dashboard/ImmigrationClients.jsx";
import Users from "./pages/dashboard/Users.jsx";
import Finances from "./pages/dashboard/Finances.jsx";
import Notifications from "./pages/dashboard/Notifications.jsx";
import AuditLogs from "./pages/dashboard/AuditLogs.jsx";
import Universities from "./pages/dashboard/Universities.jsx";
import StudentDetails from "./pages/dashboard/StudentDetails.jsx";
import UniversityDetails from "./pages/dashboard/UniversityDetails.jsx";
import Portal from "./pages/dashboard/Portal.jsx";
import ImmigrationClientDetails from "./pages/dashboard/ImmigrationClientDetails.jsx";
import VisaApplicationTypes from "./pages/dashboard/VisaApplicationTypes.jsx";
import Forbidden from "./pages/dashboard/Forbidden.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ClientSources from "./pages/dashboard/ClientSources.jsx";
import MyStudents from "./pages/dashboard/MyStudents.jsx";
import MyImmigrationClients from "./pages/dashboard/MyImmigrationClients.jsx";
import SessionExpired from "./pages/auth/SessionExpired.jsx";
import Communities from "./pages/dashboard/Communities.jsx";
import Posts from "./pages/dashboard/Posts.jsx";
import ServicesPage from "./pages/Services.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import MyDocuments from "./pages/dashboard/MyDocuments.jsx";
import MyUniversityApplications from "./pages/dashboard/MyUniversityApplications.jsx";
import MyVisaApplications from "./pages/dashboard/MyVisaApplications.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ImmigrationClientCaseTypes from "./pages/dashboard/ImmigrationClientCaseTypes.jsx";
import UnderConstruction from "./pages/dashboard/UnderContruction.jsx";
import Services from "./pages/dashboard/Services.jsx";
import Documents from "./pages/dashboard/Documents.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="team" element={<Team />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="contact" element={<Contact />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="terms-of-service" element={<TermsOfService />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="session-expired" element={<SessionExpired />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      <Route path="*" element={<NotFound />} />

      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        {/* Portal Routes */}
        <Route path="portal" element={<Portal />} />
        <Route path="portal/nationalities" element={<Nationalities />} />
        <Route path="portal/university-types" element={<UniversityTypes />} />
        <Route path="portal/program-types" element={<ProgramTypes />} />
        <Route path="portal/document-types" element={<DocumentTypes />} />
        <Route path="portal/expense-types" element={<ExpenseTypes />} />
        <Route path="portal/income-types" element={<IncomeTypes />} />
        <Route path="portal/locations" element={<Locations />} />
        <Route path="portal/currencies" element={<Currencies />} />
        <Route path="portal/services" element={<Services />} />
        <Route
          path="portal/visa-application-types"
          element={<VisaApplicationTypes />}
        />
        <Route path="portal/client-sources" element={<ClientSources />} />
        <Route
          path="portal/immigration-client-case-types"
          element={<ImmigrationClientCaseTypes />}
        />
        {/* Finances Routes */}
        <Route path="finances" element={<Finances />} />
        <Route path="finances/expenses" element={<Expenses />} />
        <Route path="finances/incomes" element={<Incomes />} />
        {/* Users Routes */}
        <Route path="users" element={<Users />} />
        <Route path="users/employees" element={<Employees />} />
        <Route path="users/students" element={<Students />} />
        <Route path="users/my-students" element={<MyStudents />} />
        <Route path="users/students/:id" element={<StudentDetails />} />{" "}
        <Route path="users/partners" element={<Partners />} />
        <Route
          path="users/immigration-clients"
          element={<ImmigrationClients />}
        />
        <Route
          path="users/my-immigration-clients"
          element={<MyImmigrationClients />}
        />
        <Route
          path="users/immigration-clients/:id"
          element={<ImmigrationClientDetails />}
        />
        "{/* Universities Routes */}
        <Route path="universities" element={<Universities />} />
        <Route path="universities/:id" element={<UniversityDetails />} />
        {/* Client Routes */}
        <Route path="documents" element={<MyDocuments />} />
        <Route path="all-documents" element={<Documents />} />
        <Route
          path="university-applications"
          element={<MyUniversityApplications />}
        />
        <Route path="visa-applications" element={<MyVisaApplications />} />
        {/* Others */}
        <Route path="communities" element={<Communities />} />
        <Route path="communities/:communityId/posts" element={<Posts />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="forbidden" element={<Forbidden />} />
        <Route path="under-construction" element={<UnderConstruction />} />
      </Route>
    </Routes>
  );
}

export default App;
