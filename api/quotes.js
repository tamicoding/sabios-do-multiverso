export default async function handler(_request, response) {
  try {
    const upstreamResponse = await fetch("https://zenquotes.io/api/quotes", {
      headers: {
        Accept: "application/json",
      },
    });

    if (!upstreamResponse.ok) {
      response.status(upstreamResponse.status).json({ quotes: [] });
      return;
    }

    const payload = await upstreamResponse.json();
    const quotes = Array.isArray(payload) ? payload : [];

    response.setHeader("Cache-Control", "s-maxage=7200, stale-while-revalidate=14400");
    response.status(200).json({ quotes });
  } catch {
    response.status(200).json({ quotes: [] });
  }
}
