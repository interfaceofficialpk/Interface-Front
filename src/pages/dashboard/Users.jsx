import DashboardPage from "../../components/dashboard/DashboardPage";
import UserOverviewCards from "../../components/users/UserOverviewCards";
import RegistrationTrendChart from "../../components/users/RegistrationTrendChart";
import CounselorLoadChart from "../../components/users/CounselorLoadChart";
import AdmissionAdvisorLoadChart from "../../components/users/AdmissionAdvisorLoadChart";
import UsersByLocationChart from "../../components/users/UsersByLocationChart";
import UsersByNationalityChart from "../../components/users/UsersByNationalityChart";
import UsersByRegistererChart from "../../components/users/UsersByRegistererChart";
import UniversityAcceptancesPerUniversityChart from "../../components/users/UniversityAcceptancesPerUniversityChart";
import UniversityApplicationsByStatusChart from "../../components/users/UniversityApplicationsByStatusChart";
import UniversityApplicationSuccessRateChart from "../../components/users/UniversityApplicationSuccessRateChart";
import VisaApplicationsByStatusChart from "../../components/users/VisaApplicationsByStatusChart";
import VisaApplicationsByTypeChart from "../../components/users/VisaApplicationsByTypeChart";
import VisaApplicationSuccessRateChart from "../../components/users/VisaApplicationSuccessRateChart";
import RecentRegistrationsTable from "../../components/users/RecentRegistrationsTable";
import UsersByClientSourceChart from "../../components/users/UsersByClientSourceChart";

export default function Users() {
  return (
    <DashboardPage title="Users Dashboard">
      <h1 className="text-3xl font-bold mb-6">Users Overview</h1>
      <UserOverviewCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RegistrationTrendChart />
        <RecentRegistrationsTable />
        {/* <CounselorLoadChart /> */}
        <AdmissionAdvisorLoadChart />
        <UsersByLocationChart />
        <UsersByNationalityChart />
        <UsersByRegistererChart />
        <UsersByClientSourceChart />
        <UniversityAcceptancesPerUniversityChart />
        <UniversityApplicationsByStatusChart />
        <UniversityApplicationSuccessRateChart />
        <VisaApplicationsByStatusChart />
        <VisaApplicationsByTypeChart />
        <VisaApplicationSuccessRateChart />
      </div>
    </DashboardPage>
  );
}
