import { UAParser } from "ua-parser-js";

export const getDeviceInfo = (req) => {
  const userAgent = req.headers["user-agent"] || "Unknown User-Agent";

  let browser = "Unknown Browser";
  let os = "Unknown OS";
  let deviceType = "Desktop";

  try {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    browser = result.browser.name || "Unknown Browser";
    os = result.os.name || "Unknown OS";

    if (result.device.type === "mobile") {
      deviceType = "Mobile";
    } else if (result.device.type === "tablet") {
      deviceType = "Tablet";
    }
  } catch (error) {
    // Fallback regex detection
    if (/mobile/i.test(userAgent)) {
      deviceType = "Mobile";
    } else if (/tablet|ipad/i.test(userAgent)) {
      deviceType = "Tablet";
    }

    if (/edg/i.test(userAgent)) {
      browser = "Microsoft Edge";
    } else if (/chrome/i.test(userAgent)) {
      browser = "Google Chrome";
    } else if (/firefox/i.test(userAgent)) {
      browser = "Mozilla Firefox";
    } else if (/safari/i.test(userAgent)) {
      browser = "Safari";
    }
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "127.0.0.1";

  return {
    device: `${os} · ${browser}`,
    deviceType,
    browser,
    os,
    userAgent,
    ip,
  };
};

export default getDeviceInfo;
