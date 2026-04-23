import { translate } from "@vitalets/google-translate-api";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ translatedText: "" });
    return;
  }

  const text = request.body?.text;

  if (!text || typeof text !== "string") {
    response.status(200).json({ translatedText: "" });
    return;
  }

  try {
    const result = await translate(text, { to: "pt" });
    response.status(200).json({
      translatedText: typeof result.text === "string" ? result.text : "",
    });
  } catch {
    response.status(200).json({ translatedText: "" });
  }
}
