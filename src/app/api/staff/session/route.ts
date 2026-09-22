import { NextRequest } from "next/server";
import { readStaffSessionFromRequest } from "@/lib/auth";
import { jsonOk, rejectIfCrossOrigin, requireEnv } from "@/lib/http";
import { getLocationName } from "@/lib/locations";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const originError = rejectIfCrossOrigin(request);
  if (originError) return originError;

  const configured = requireEnv();
  if (configured.error) {
    return jsonOk({ configured: false, session: null });
  }

  const session = readStaffSessionFromRequest(
    request,
    configured.env.loyaltySecret,
  );
  if (!session) {
    return jsonOk({ configured: true, session: null });
  }

  return jsonOk({
    configured: true,
    session: {
      locationId: session.locationId,
      locationName: getLocationName(session.locationId),
      exp: session.exp,
    },
  });
}
