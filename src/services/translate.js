/* global __HAS_TRANSLATE_PROXY__ */

export async function translateQuoteContent(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  if (typeof __HAS_TRANSLATE_PROXY__ !== "undefined" && !__HAS_TRANSLATE_PROXY__) {
    return "";
  }

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      return "";
    }

    const payload = await response.json();
    return typeof payload.translatedText === "string" ? payload.translatedText.trim() : "";
  } catch {
    return "";
  }
}
