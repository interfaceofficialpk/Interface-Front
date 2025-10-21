import { GlobalConfig } from "../GlobalConfig";

export default function Testimonials() {
  const { appName } = GlobalConfig;
  const title = `${appName} - Testimonials`;

  return (
    <div>
      <title>{title}</title>
      <h1>Testimonials Page</h1>
      <p>This is the testimonials page of our application.</p>
    </div>
  );
}
