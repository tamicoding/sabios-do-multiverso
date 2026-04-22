export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ translatedText: "" });
    return;
  }

  const translationUrl = process.env.LIBRETRANSLATE_URL;
  const text = request.body?.text;

  if (!translationUrl || !text || typeof text !== "string") {
    response.status(200).json({ translatedText: "" });
    return;
  }

  try {
    const translationResponse = await fetch(translationUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: process.env.LIBRETRANSLATE_TARGET || "pt",
        format: "text",
        api_key: process.env.LIBRETRANSLATE_API_KEY || undefined,
      }),
    });

    if (!translationResponse.ok) {
      response.status(200).json({ translatedText: "" });
      return;
    }

    const payload = await translationResponse.json();
    response.status(200).json({
      translatedText: typeof payload.translatedText === "string" ? payload.translatedText : "",
    });
  } catch {
    response.status(200).json({ translatedText: "" });
  }
}
