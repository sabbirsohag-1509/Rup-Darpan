/**
 * Checks if a given URL is a valid Facebook video, reel, or watch URL
 * @param {string} url 
 * @returns {boolean}
 */
export const isFacebookUrl = (url) => {
  if (!url || typeof url !== "string") return false;

  try {
    const parsedUrl = new URL(url);

    const allowedHosts = [
      "facebook.com",
      "www.facebook.com",
      "m.facebook.com",
      "web.facebook.com",
      "fb.watch",
    ];

    const hostname = parsedUrl.hostname.toLowerCase();

    if (!allowedHosts.includes(hostname)) {
      return false;
    }

    if (hostname === "fb.watch") {
      return true;
    }

    const pathname = parsedUrl.pathname.toLowerCase();

    return (
      pathname.startsWith("/reel/") ||
      pathname.startsWith("/share/v/") ||
      pathname.startsWith("/watch") ||
      pathname.startsWith("/videos/")
    );
  } catch {
    return false;
  }
};

export default {
  isFacebookUrl,
};
