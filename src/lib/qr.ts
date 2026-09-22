import "server-only";

import QRCode from "qrcode";

export async function generateQrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: {
      dark: "#3a5570",
      light: "#f2ebd9",
    },
  });
}
