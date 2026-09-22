import { RegisterScreen } from "@/components/RegisterScreen";
import { isConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function LealtadPage() {
  return <RegisterScreen configured={isConfigured()} />;
}
