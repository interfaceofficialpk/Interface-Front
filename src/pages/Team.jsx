import { GlobalConfig } from "../GlobalConfig";

export default function Team() {
  const { appName } = GlobalConfig;
  const title = `${appName} - Team`;

  return (
    <div>
      <title>{title}</title>
      <h1>Team Page</h1>
      <p>This is the team page of our application.</p>
    </div>
  );
}
