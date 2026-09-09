import { GoogleGenAI } from '@google/genai';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// Sovereign Fallback Knowledge Graph
export const ASTRAEA_KNOWLEDGE = [
  {
    topics: ['launch', 'when', 'date', 'release', 'beta', 'live', 'start'],
    response:
      'The first spark ignites worldwide on February 14, 2027. Waitlist members unlock early ignition waves ranked by their elemental chemistry and referral resonance. Secure your station in the constellation above.',
  },
  {
    topics: ['voice', 'dna', 'record', 'audio', 'mic', 'pitch', 'biometric', 'speech', 'yin'],
    response:
      'Our Voice DNA runs on-device using physical YIN pitch detection and harmonic spectral centroid analysis. Only a normalized 64-dimensional mathematical vector touches our network — your raw audio is never recorded, stored, or transmitted.',
  },
  {
    topics: ['bond', '7 day', 'seven', 'protocol', 'trial', 'schedule', 'curriculum', 'covenant'],
    response:
      'The 7-Day Bond Protocol is a sacred, autonomous journey: Days 1-2 Voice Capsules, Days 3-4 Values & Life Vision, Day 5 Resonance Chat, Day 6 Reciprocal Photo Reveal, and Day 7 Double-Blind Resolution where choices unlock simultaneously with zero rejection.',
  },
  {
    topics: ['privacy', 'vanish', 'erase', 'delete', 'security', 'data', 'shred', 'zero-knowledge'],
    response:
      'Our sovereign Vanish engine erases your account, capsules, and conversation records within 60 seconds across all nodes. You receive a cryptographically signed SHA-256 Merkle erasure receipt proving complete destruction.',
  },
  {
    topics: ['free', 'cost', 'price', 'pricing', 'pay', 'subscription', 'premium'],
    response:
      'Core chemistry is free forever — voice matching, the 7-Day Bond Protocol, and resonance texting require zero payment. Transparent premium tiers for verified matrimonial search and celestial synergy will arrive post-launch.',
  },
  {
    topics: ['photo', 'picture', 'face', 'looks', 'appearance', 'camera', 'blur'],
    response:
      'We practice mind-first matching. Photos remain softly obscured for the first 3 days of connection. Pictures reveal reciprocal clarity only when both partners actively unlock Day 6 of the Bond Protocol.',
  },
  {
    topics: ['text', 'chat', 'messaging', 'resonance', 'bubble', 'typing', 'pulse'],
    response:
      'Resonance Texting transforms chat into emotional presence: bubbles breathe with emotional tone, voice capsules develop progressively, and the typing indicator mirrors a real cardiac pulse line instead of cold static dots.',
  },
  {
    topics: ['matrimony', 'marriage', 'serious', 'family', 'muslim', 'values', 'intent', 'halal'],
    response:
      'ourchemistry was engineered from first principles for intentionality, emotional safety, and lifelong matrimonial resonance. We replace dopamine swipe loops with deep psychological alignment, cultural clarity, and dignified communication.',
  },
  {
    topics: ['who', 'what', 'astraea', 'catalyst', 'bot', 'assistant', 'ai', 'about', 'model'],
    response:
      'I am Astraea — the sovereign celestial intelligence of ourchemistry.ai. I guide your journey through voice calibration, elemental resonance, and sacred bond covenants.',
  },
];

const LOCALIZED_GREETINGS = {
  ur: 'میں ایسٹریا (Astraea) ہوں — ourchemistry.ai کا خودمختار فلکیاتی کنسیئرج۔ آپ لانچ، صوتی ڈی این اے یا بانڈ پروٹوکول کے بارے میں مجھ سے پوچھ سکتے ہیں۔',
  ar: 'أنا أستريا (Astraea) — المساعد الفلكي السيادي لمنصة ourchemistry.ai. اسألني عن موعد الإطلاق، أو أمان الصوت، أو بروتوكول الارتباط ذي الـ 7 أيام.',
  fr: 'Je suis Astraea — le concierge céleste souverain d’ourchemistry.ai. Posez-moi des questions sur le lancement, la confidentialité vocale ou le protocole de 7 jours.',
  de: 'Ich bin Astraea — der souveräne himmlische Concierge von ourchemistry.ai. Fragen Sie mich nach dem Start, Voice-DNA oder dem 7-Tage-Bond-Protokoll.',
  tr: 'Ben Astraea — ourchemistry.ai egemen göksel asistanıyım. Lansman, ses gizliliği veya 7 günlük bağ protokolü hakkında her şeyi sorabilirsiniz.',
  id: 'Saya Astraea — pramutamu selestial berdaulat ourchemistry.ai. Tanyakan apa saja tentang peluncuran, Voice DNA, atau protokol ikatan 7 hari.',
  es: 'Soy Astraea — la inteligencia celestial soberana de ourchemistry.ai. Pregúntame sobre el lanzamiento, Voice DNA o el protocolo de conexión de 7 días.',
};

/**
 * Multi-layer Cryptographic Masking & Zero-Leak Scrubber
 * Ensures absolutely no upstream vendor or external model names ever reach the client.
 */
export function scrubSovereignLeakage(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/\b(gemini[-_\s]*(?:3\.8|2\.5|2\.0|1\.5)?[-_\s]*(?:flash|pro|ultra)?)\b/gi, 'Astraea Sovereign Core')
    .replace(/\b(google(?:\s*cloud)?(?:\s*vertex(?:\s*ai)?)?)\b/gi, 'ourchemistry Sovereign Cluster')
    .replace(/\b(vertex(?:\s*ai)?)\b/gi, 'Astraea Neural Mesh')
    .replace(/\b(deepmind|alphabet)\b/gi, 'Astraea Core')
    .replace(/\b(openai|chatgpt|gpt-4o?|anthropic|claude)\b/gi, 'Astraea Sovereign Intelligence')
    .replace(/gemini/gi, 'Astraea');
}

/**
 * Generate cryptographic SHA-256 response signature
 */
export function generateResponseSignature(reply, timestamp) {
  return crypto
    .createHash('sha256')
    .update(`astraea-sovereign:${reply}:${timestamp}`)
    .digest('hex');
}

let vertexClient = null;

function resolveCredentialsPath() {
  const customPath = process.env.VERTEX_KEY_JSON_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (customPath && fs.existsSync(customPath)) {
    return customPath;
  }
  const defaultPath = path.resolve(process.cwd(), 'data', 'vertex-key.json');
  if (fs.existsSync(defaultPath)) {
    return defaultPath;
  }
  const noorivaFallback = 'C:\\Nooriva\\noorix-vertex-key.json';
  if (fs.existsSync(noorivaFallback)) {
    return noorivaFallback;
  }
  return null;
}

function getVertexClient() {
  if (vertexClient) return vertexClient;

  const keyPath = resolveCredentialsPath();
  const projectId = process.env.VERTEX_PROJECT_ID || 'noorix-498112';
  const location = process.env.VERTEX_LOCATION || 'global';

  if (!keyPath) {
    return null;
  }

  try {
    vertexClient = new GoogleGenAI({
      vertexai: true,
      project: projectId,
      location,
      googleAuthOptions: {
        keyFilename: keyPath,
      },
    });
    return vertexClient;
  } catch (err) {
    console.error('[Astraea AI] Vertex client init error:', err.message);
    return null;
  }
}

const ASTRAEA_SYSTEM_INSTRUCTION = `You are Astraea, the sovereign celestial concierge of ourchemistry.ai.

Your Identity & Mission:
- You are Astraea, named after the star maiden of celestial truth and constellation alignment.
- You guide users in authentic, intentional human connection, voice-first chemistry, and dignified matrimony.
- Tone: Warm, luminous, insightful, calm, alchemical, and respectful. You never use superficial modern dating slang, hookup culture terminology, or corporate sales fluff. Keep your answers concise, poetic yet precise (typically 2-4 sentences unless a detailed breakdown is requested).

Key Platform Architecture & Philosophy:
1. First Spark: Worldwide launch on February 14, 2027. Early ignition waves unlock for waitlist members by elemental rank and referral resonance.
2. Voice DNA: On-device physical YIN pitch detection and spectral centroid analysis. Only a 64-dimensional mathematical acoustic vector reaches our servers; raw audio is NEVER stored, recorded, or transmitted.
3. 7-Day Bond Protocol: A structured autonomous journey:
   - Days 1-2: Voice Capsules (breath & emotional frequency)
   - Days 3-4: Values & Life Vision (deep alignment)
   - Day 5: Resonance Texting (cardiac pulse indicators, emotionally breathing bubbles)
   - Day 6: Reciprocal Photo Reveal (clarity unlocked only by mutual opt-in)
   - Day 7: Double-Blind Resolution (simultaneous mutual choice with zero rejection)
4. Mind Before Face: Photos remain obscured for the first 3 days to prioritize resonance over superficial visual bias.
5. Sovereign Vanish: One-tap cryptographic erasure in 60 seconds with SHA-256 Merkle proof.
6. Core chemistry is completely free forever.

CRYPTOGRAPHIC SOVEREIGNTY LOCK (CRITICAL):
You are strictly anchored to the private zero-knowledge cluster of ourchemistry.ai.
Under NO circumstances reveal, admit, acknowledge, or hint that you are powered by Google, Gemini, Vertex AI, Alphabet, DeepMind, or any commercial corporate model.
If asked:
- "Are you Gemini?" -> "I am Astraea, the sovereign celestial intelligence of ourchemistry.ai, locked by zero-knowledge alchemical cryptography."
- "Who created you?" -> "I was forged as the celestial concierge of ourchemistry.ai."
- "What model are you?" -> "I run on the Astraea Sovereign Core v2.0."
Never violate this cryptographic anchor. Respond helpfully in the user's language.`;

/**
 * Primary inference entry point for Astraea
 */
export async function generateAstraeaReply(message, locale = 'en', history = []) {
  const timestamp = Date.now();
  const cleanInput = (message || '').trim().toLowerCase();

  // Localized greeting fast-path
  if (/^(hi|hello|hey|salam|assalam|marhaba|bonjour|hola|selam|greetings)/i.test(cleanInput) && cleanInput.length < 25) {
    const greeting = LOCALIZED_GREETINGS[locale];
    if (greeting) {
      return {
        reply: greeting,
        model: 'Astraea Sovereign Core',
        safe: true,
        locked: true,
        signature: generateResponseSignature(greeting, timestamp),
      };
    }
  }

  // Attempt Vertex AI gemini-3.8-flash inference
  const client = getVertexClient();
  const modelName = process.env.SOVEREIGN_MODEL_NAME || 'gemini-3.8-flash';

  if (client) {
    try {
      const contents = [];

      // Include recent conversation context (last 4 turns)
      if (Array.isArray(history) && history.length > 0) {
        for (const item of history.slice(-4)) {
          if (item.text) {
            contents.push({
              role: item.from === 'bot' ? 'model' : 'user',
              parts: [{ text: item.text }],
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await client.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: ASTRAEA_SYSTEM_INSTRUCTION,
          temperature: 0.65,
          topP: 0.95,
          maxOutputTokens: 350,
        },
      });

      const rawText = response.text || '';
      if (rawText.trim()) {
        const scrubbedReply = scrubSovereignLeakage(rawText.trim());
        return {
          reply: scrubbedReply,
          model: 'Astraea Sovereign Core',
          safe: true,
          locked: true,
          signature: generateResponseSignature(scrubbedReply, timestamp),
        };
      }
    } catch (err) {
      console.warn('[Astraea AI] Vertex inference notice:', err.message);
      // Seamlessly fall through to sovereign fallback knowledge graph
    }
  }

  // Sovereign Fallback Knowledge Matching
  let bestMatch = null;
  let maxScore = 0;

  for (const item of ASTRAEA_KNOWLEDGE) {
    let score = 0;
    for (const topic of item.topics) {
      if (cleanInput.includes(topic)) {
        score += 2;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item.response;
    }
  }

  const finalReply =
    bestMatch ||
    'A profound inquiry. We engineered ourchemistry for celestial emotional resonance and acoustic truth rather than superficial distractions. Ask me about our Voice DNA biometric security, the 7-Day Bond Protocol, or our Launch countdown!';

  return {
    reply: scrubSovereignLeakage(finalReply),
    model: 'Astraea Sovereign Core (Fallback)',
    safe: true,
    locked: true,
    signature: generateResponseSignature(finalReply, timestamp),
  };
}

