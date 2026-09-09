import { NextResponse } from 'next/server.js';
import { runGuardrails } from '../../../lib/security/guardrails.js';

const KNOWLEDGE_GRAPH = [
  {
    topics: ['launch', 'when', 'date', 'release', 'beta', 'live', 'start'],
    response:
      'The first spark ignites worldwide on February 14, 2027. Waitlist members unlock early ignition waves ranked by their elemental chemistry and referral resonance. Join the waitlist above to secure your station.',
  },
  {
    topics: ['voice', 'dna', 'record', 'audio', 'mic', 'pitch', 'biometric', 'speech'],
    response:
      'Our Voice DNA runs on-device using physical YIN pitch detection and spectral centroid algorithms. Only a normalized 64-dimensional harmonic vector touches our network — your raw audio is never recorded or transmitted.',
  },
  {
    topics: ['bond', '7 day', 'seven', 'protocol', 'trial', 'schedule', 'curriculum'],
    response:
      'The 7-Day Bond Protocol is an autonomous journey: Days 1-2 Voice Capsules, Days 3-4 Values & Life Vision, Day 5 Resonance Chat, Day 6 Reciprocal Photo Reveal, and Day 7 Double-Blind Resolution where choices reveal simultaneously with zero rejection.',
  },
  {
    topics: ['privacy', 'vanish', 'erase', 'delete', 'security', 'data', 'shred'],
    response:
      'Our sovereign Vanish engine deletes your account, capsules, and conversation records within 60 seconds across all nodes. You receive a cryptographically signed SHA-256 Merkle erasure receipt proving complete destruction.',
  },
  {
    topics: ['free', 'cost', 'price', 'pricing', 'pay', 'subscription', 'premium'],
    response:
      'Core chemistry is free forever — voice matching, the 7-day protocol, and resonance texting require zero payment. Transparent premium tiers for verified matrimonial search and astrology/elemental synergy will arrive post-launch.',
  },
  {
    topics: ['photo', 'picture', 'face', 'looks', 'appearance', 'camera', 'blur'],
    response:
      'We practice mind-first matching. Photos remain softly obscured for the first 3 days of connection. Pictures reveal reciprocal clarity only when both partners actively unlock Day 6 of the Bond Protocol.',
  },
  {
    topics: ['text', 'chat', 'messaging', 'resonance', 'bubble', 'typing'],
    response:
      'Resonance Texting transforms chat into emotional presence: bubbles breathe with emotional tone, voice capsules develop progressively, and the typing indicator mirrors a real cardiac pulse line instead of cold static dots.',
  },
  {
    topics: ['matrimony', 'marriage', 'serious', 'family', 'muslim', 'values', 'intent'],
    response:
      'ourchemistry was engineered from first principles for intentionality, emotional safety, and lifelong partnership. We replace dopamine casino loops with deep psychological alignment, cultural clarity, and dignified communication.',
  },
  {
    topics: ['who', 'what', 'catalyst', 'bot', 'assistant', 'ai', 'about'],
    response:
      'I am Catalyst — the intelligent concierge of ourchemistry.ai. I guide your journey through voice calibration, bond protocols, and private connection.',
  },
];

const LOCALIZED_GREETINGS = {
  ur: 'میں کیٹالسٹ ہوں — ourchemistry.ai کا ذہین کنسیئرج۔ آپ لانچ، صوتی ڈی این اے یا بانڈ پروٹوکول کے بارے میں مجھ سے پوچھ سکتے ہیں۔',
  ar: 'أنا كاتاليست — المساعد الذكي لمنصة ourchemistry.ai. اسألني عن موعد الإطلاق، أو أمان الصوت، أو بروتوكول الارتباط.',
  fr: 'Je suis Catalyst — le concierge intelligent d’ourchemistry.ai. Posez-moi des questions sur le lancement, la confidentialité vocale ou le protocole de 7 jours.',
  de: 'Ich bin Catalyst — der intelligente Concierge von ourchemistry.ai. Fragen Sie mich nach dem Start, Voice-DNA oder dem 7-Tage-Bond-Protokoll.',
  tr: 'Ben Catalyst — ourchemistry.ai akıllı asistanıyım. Lansman, ses gizliliği veya 7 günlük bağ protokolü hakkında her şeyi sorabilirsiniz.',
  id: 'Saya Catalyst — pramutamu cerdas ourchemistry.ai. Tanyakan apa saja tentang peluncuran, Voice DNA, atau protokol ikatan 7 hari.',
  es: 'Soy Catalyst — el conserje inteligente de ourchemistry.ai. Pregúntame sobre el lanzamiento, Voice DNA o el protocolo de conexión de 7 días.',
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { message = '', locale = 'en' } = body;

    const guard = runGuardrails(message);
    if (!guard.passed) {
      return NextResponse.json({
        reply: guard.error || 'Input violates our conversational safety guardrails.',
        safe: false,
      });
    }

    if (guard.hadPii) {
      return NextResponse.json({
        reply:
          'For your security, contact details and personal identifiers are protected until after your 7-Day Bond Protocol is completed.',
        safe: true,
        sanitized: true,
      });
    }

    const clean = (guard.sanitizedInput || '').toLowerCase().trim();

    if (/^(hi|hello|hey|salam|assalam|marhaba|bonjour|hola|selam)/i.test(clean)) {
      const greeting = LOCALIZED_GREETINGS[locale];
      if (greeting) {
        return NextResponse.json({ reply: greeting, safe: true });
      }
    }

    let bestMatch = null;
    let maxScore = 0;

    for (const item of KNOWLEDGE_GRAPH) {
      let score = 0;
      for (const topic of item.topics) {
        if (clean.includes(topic)) {
          score += 2;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item.response;
      }
    }

    if (bestMatch && maxScore > 0) {
      return NextResponse.json({ reply: bestMatch, safe: true });
    }

    return NextResponse.json({
      reply:
        'A profound question. We engineered ourchemistry for deep emotional frequency rather than quick superficial hits. Ask me about our Voice DNA biometric security, the 7-Day Bond Protocol, or our Launch countdown!',
      safe: true,
    });
  } catch (err) {
    return NextResponse.json(
      { reply: 'Catalyst is calibrating its resonance. Please ask again in a moment.' },
      { status: 200 }
    );
  }
}
