import DashboardPage from "../../components/dashboard/DashboardPage";

export default function UnderConstruction() {
  return (
    <DashboardPage title="Under Construction">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold mb-4">🚧 Under Construction 🚧</h1>
        <p className="text-lg text-center">
          This section is currently under development. Please check back later!
        </p>
      </div>
    </DashboardPage>
  );
}
