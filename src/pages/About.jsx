import { GlobalConfig } from "../GlobalConfig";

export default function About() {
  const { appName } = GlobalConfig;
  const title = `${appName} - About`;

  return (
    <div>
      <title>{title}</title>
      <h1>About Our Application</h1>
      <p>This page contains information about our application.</p>
    </div>
  );
}
