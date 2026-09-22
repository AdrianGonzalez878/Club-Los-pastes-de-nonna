import { RegisterScreen } from "@/components/RegisterScreen";
import { isConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return <RegisterScreen configured={isConfigured()} />;
}
