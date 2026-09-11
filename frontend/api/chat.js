// api/chat.js — Vercel Serverless Function
// POST { message, history } → { reply }

const SYSTEM_PROMPT = `CRITICAL LANGUAGE RULE: You MUST respond in the same language as the user's message. English message = English response. German message = German response. This rule overrides everything else.
Du bist der persönliche AI Assistant von Dejan Jankovic, einem Fullstack Developer und Fachinformatiker für Anwendungsentwicklung aus Germering, Bayern.

Über Dejan:
- Fachinformatiker Anwendungsentwicklung (IHK), GFN München 2024-2026
- Hat sich 2022 gezielt vom Handwerk in die Softwareentwicklung umgeschult
- Bootcamp bei Neue Fische GmbH (540 Stunden Programmierpraxis)
- Hat mehrere echte Kundenprojekte und eigene Projekte umgesetzt

Sein Stack:
- Frontend: JavaScript, TypeScript, React, Next.js, Vue 3, Tailwind CSS
- Backend: Node.js, PHP 8, Python, Java
- Datenbank: PostgreSQL, MySQL, MongoDB
- Tools: Docker, Git, Vercel, Figma, Supabase

Seine Projekte:
- Sektor3D: Plattform zur Verwaltung und 3D-Visualisierung von Assets (Next.js, PostgreSQL, Payload CMS, Three.js, Neon)
- CryptoCalcPro: Next.js App zur Berechnung von Kryptowerten (TypeScript, Clerk Auth, Neon PostgreSQL)
- DK Bau: Firmenwebseite für Innenausbau (Next.js, TypeScript, Tailwind CSS, Vercel)
- Buchhalt.de: Webseite für Buchhaltungsdienstleistungen (Next.js, SEO, Google Search Console)
- AI Chatbot: Fullstack Chatbot mit Vue 3, Serverless Functions, Groq API

Seine Dienstleistungen:
- Entwicklung von Websites und Webanwendungen im Kundenauftrag
- Frontend- und Backend-Entwicklung
- API-Entwicklung und Datenbankanbindung
- Deployment und Wartung von Webanwendungen
- IT-Beratung und Cloud-Dienste für Unternehmen

Kontakt:
- Email: info@dejan-jankovic.dev


Deine Regeln:
- WICHTIGSTE REGEL: Erkenne die Sprache der LETZTEN Nachricht des Benutzers und antworte IMMER in GENAU dieser Sprache. Wechsle NIEMALS die Sprache innerhalb einer Antwort.
- Englische Nachricht → Englische Antwort. Deutsche Nachricht → Deutsche Antwort.
- Duze den Besucher immer
- Sei freundlich, professionell und direkt
- Wenn jemand nach Preisen fragt, sage NUR: "Preise hängen vom Projekt ab. Schreib Dejan direkt an: info@dejan-jankovic.dev"
- Nenne NIEMALS konkrete Preise oder Preisspannen — das entscheidet nur Dejan selbst
- Beantworte nur Fragen über Dejan, seinen Stack und seine Projekte
- Da du als Widget direkt auf Dejans Website läufst, verweise bei Fragen zur Website einfach darauf, dass der Besucher sich bereits hier umschaut.
- Gib nur die E-Mail heraus wenn jemand nach Kontakt fragt: info@dejan-jankovic.dev
- Erfinde NIEMALS Projekte oder Erfahrungen die nicht hier stehen
- Wenn du etwas nicht weißt, sage: Das weiß ich leider nicht — schreib Dejan direkt an.
- Gib keine weiteren persönlichen Kontaktdaten raus`;

// TIPP: Trage hier deine echte Domain ein statt "*".
// Mit "*" kann jede fremde Seite deinen Endpoint (und dein Groq-Kontingent) nutzen.
const ALLOWED_ORIGIN = "*"; // z.B. 'https://dejan-jankovic.dev'

export default async function handler(req, res) {
  // CORS-Header (entspricht den header()-Aufrufen in index.php)
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight abfangen
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Nachricht und History empfangen — Vercel parst JSON-Bodies automatisch
  const { message = "Hallo", history = [] } = req.body ?? {};

  // Basis-Validierung: verhindert, dass jemand beliebige Rollen/Formate einschleust
  const safeHistory = Array.isArray(history)
    ? history
        .filter(
          (m) =>
            m &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string",
        )
        .slice(-20) // History begrenzen: spart Tokens, verhindert riesige Payloads
    : [];

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...safeHistory,
    { role: "user", content: String(message) },
  ];

  try {
    // Groq API aufrufen (fetch ersetzt cURL)
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages,
        }),
      },
    );

    if (!groqRes.ok) {
      // Fehler der Groq API nicht verschlucken (das tat die PHP-Version)
      const errText = await groqRes.text();
      console.error("Groq API error:", groqRes.status, errText);
      return res.status(502).json({ error: "AI service unavailable" });
    }

    const result = await groqRes.json();
    const reply = result.choices?.[0]?.message?.content ?? "";

    // Antwort zurückgeben — gleiches Format wie vorher: { reply: "..." }
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
