import { GlobalConfig } from "../GlobalConfig";

export default function Contact() {
  const { appName } = GlobalConfig;
  const title = `${appName} - Contact`;

  return (
    <div>
      <title>{title}</title>
      <h1>Contact Us</h1>
      <p>This page contains our contact information.</p>
    </div>
  );
}
