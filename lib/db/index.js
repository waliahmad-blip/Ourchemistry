/**
 * Sovereign Database DAL for ourchemistry.ai
 * Concurrency-safe persistence with vector operations and /tmp serverless fallback.
 */

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as schema from './schema.js';
import { BOND_STAGES, evaluateBondProgression, resolveDoubleBlind } from '../bond/bondStateMachine.js';

const START_COUNT = 12847;
const ELEMENTS = ['Aqua', 'Ignis', 'Terra', 'Ventus'];
const FILES = [
  path.join(process.cwd(), 'data', 'sovereign-db.json'),
  path.join(typeof process.env.TMPDIR === 'string' ? process.env.TMPDIR : '/tmp', 'ourchemistry-db.json'),
];

class SovereignDatabase {
  constructor() {
    this.schema = schema;
    this._cache = null;
    this._lock = Promise.resolve();
  }

  getSchema() {
    return this.schema;
  }

  async _pickPath() {
    for (const p of FILES) {
      try {
        await fs.mkdir(path.dirname(p), { recursive: true });
        await fs.access(path.dirname(p), fs.constants.W_OK);
        return p;
      } catch {}
    }
    return null;
  }

  async _load() {
    if (this._cache) return this._cache;
    for (const p of FILES) {
      try {
        const raw = await fs.readFile(p, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.count === 'number') {
          this._cache = parsed;
          return this._cache;
        }
      } catch {}
    }
    this._cache = { count: START_COUNT, users: [], voicePrints: [], bonds: [], vanishLogs: [] };
    return this._cache;
  }

  async _commit() {
    const file = await this._pickPath();
    if (!file || !this._cache) return;
    this._lock = this._lock.then(async () => {
      try {
        const tmp = `${file}.${Date.now()}.tmp`;
        await fs.writeFile(tmp, JSON.stringify(this._cache, null, 2), 'utf-8');
        await fs.rename(tmp, file);
      } catch (err) {
        console.warn('[db] commit failed:', err.message);
      }
    });
    return this._lock;
  }

  calculateAcousticCosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    return normA === 0 || normB === 0 ? 0 : dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async getWaitlistCount() {
    const d = await this._load();
    return d.count;
  }

  async addWaitlistUser({ email, referralBy, element = null }) {
    const d = await this._load();
    const normalized = email.trim().toLowerCase();
    let user = d.users.find((u) => u.email === normalized);
    if (!user) {
      d.count += 1;
      const refCode = 'OU-' + crypto.randomBytes(3).toString('hex').toUpperCase();
      user = {
        id: crypto.randomUUID(),
        email: normalized,
        referralCode: refCode,
        referredBy: referralBy ? referralBy.trim().toUpperCase() : null,
        referralCount: 0,
        element: element || ELEMENTS[d.count % ELEMENTS.length],
        queueRank: d.count,
        createdAt: new Date().toISOString(),
      };
      d.users.push(user);
      if (user.referredBy) {
        const ref = d.users.find((u) => u.referralCode === user.referredBy);
        if (ref) {
          ref.referralCount = (ref.referralCount || 0) + 1;
          ref.queueRank = Math.max(1, (ref.queueRank || d.count) - 500);
        }
      }
      await this._commit();
    }
    return user;
  }

  async findUserByEmail(email) {
    if (!email) return null;
    const d = await this._load();
    return d.users.find((u) => u.email === email.trim().toLowerCase()) || null;
  }

  async saveVoicePrint(payload) {
    const d = await this._load();
    const vp = {
      id: crypto.randomUUID(),
      userId: payload.userId || 'anon-' + crypto.randomUUID().slice(0, 8),
      acousticHash: String(payload.acousticHash || crypto.randomBytes(16).toString('hex')),
      vector64: Array.isArray(payload.vector64) ? payload.vector64 : new Array(64).fill(0.1),
      warmth: Number(payload.warmth || 80),
      resonance: Number(payload.resonance || 85),
      createdAt: new Date().toISOString(),
    };
    d.voicePrints.push(vp);
    await this._commit();
    return vp;
  }

  async findAcousticMatches(vector64, limit = 3) {
    const d = await this._load();
    if (!Array.isArray(vector64)) return [];
    return d.voicePrints
      .map((vp) => ({
        id: vp.id,
        acousticHash: vp.acousticHash,
        similarity: this.calculateAcousticCosineSimilarity(vector64, vp.vector64),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  async advanceBondStage({ bondId = 'BOND-01', day = 1, responseText }) {
    const d = await this._load();
    let bond = d.bonds.find((b) => b.id === bondId);
    if (!bond) {
      bond = { id: bondId, currentDay: day, status: 'ACTIVE' };
      d.bonds.push(bond);
    }
    const progression = evaluateBondProgression({ currentDay: day, userACompleted: true, userBCompleted: true, status: 'ACTIVE' });
    if (progression.canAdvance) bond.currentDay = progression.nextDay;
    await this._commit();
    return { bond, progression, stage: BOND_STAGES[`DAY_${bond.currentDay}`] };
  }

  async resolveDoubleBlind({ decisionA, decisionB }) {
    return resolveDoubleBlind(decisionA, decisionB);
  }

  async recordVanishAudit(data) {
    const d = await this._load();
    d.vanishLogs.push({ ...data, createdAt: new Date().toISOString() });
    await this._commit();
    return data;
  }
}

export const db = new SovereignDatabase();
