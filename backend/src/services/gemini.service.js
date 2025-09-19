import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function buildPrompt({ soil, ph, rainfall, temperature, state, budget, lang }) {
  const langMap = {
    en: 'English', hi: 'Hindi', mr: 'Marathi', bn: 'Bengali', gu: 'Gujarati', ta: 'Tamil', te: 'Telugu', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi', or: 'Odia'
  };
  const languageInstruction = `Return names, reasons, and fertilizers in ${langMap[lang] || 'English'}.`;
  return (
    'You are AgriGuide, an AI assistant for Indian farmers. ' +
    'Given the soil type, pH, rainfall (mm), temperature (°C), state, and budget (INR), recommend the most suitable crops for Indian farmers. ' +
    'Provide 2-3 crop suggestions with reasoning and suitable fertilizers. ' +
    languageInstruction + ' ' +
    'Respond ONLY in the following strict JSON format without backticks or extra commentary: ' +
    '{ "crops": [ { "name": "<crop>", "reason": "<why>", "fertilizer": "<recommended>" } ] }\n' +
    `Inputs: soil=${soil}, pH=${ph}, rainfall=${rainfall}, temperature=${temperature}, state=${state}, budget=${budget}`
  );
}

function safeParseModelJson(text) {
  try {
    const trimmed = text.trim();
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    const jsonSlice = start !== -1 && end !== -1 ? trimmed.slice(start, end + 1) : trimmed;
    return JSON.parse(jsonSlice);
  } catch (_e) {
    return null;
  }
}

export async function getCropRecommendations(input) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const error = new Error('GEMINI_API_KEY is not configured');
    error.status = 500;
    throw error;
  }

  const prompt = buildPrompt(input);

  try {
    const { data } = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 512,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
        },
        timeout: 15000,
      }
    );

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = safeParseModelJson(text);

    if (!parsed || !Array.isArray(parsed.crops)) {
      // Fallback minimal structure if model deviates
      return [
        {
          name: 'Rice',
          reason: 'Suitable for warm climates with adequate water availability.',
          fertilizer: 'Urea, DAP',
        },
      ];
    }

    // Normalize entries
    return parsed.crops
      .filter(Boolean)
      .slice(0, 3)
      .map((c) => ({
        name: String(c.name || '').trim() || 'Unknown',
        reason: String(c.reason || '').trim() || 'Reason not provided',
        fertilizer: String(c.fertilizer || '').trim() || 'General NPK',
      }));
  } catch (e) {
    const error = new Error('Failed to fetch recommendations from Gemini');
    error.status = 502;
    error.cause = e;
    throw error;
  }
}


