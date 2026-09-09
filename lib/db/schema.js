/**
 * Database Schema Definition for ourchemistry.ai
 * Designed for PostgreSQL + Drizzle ORM / pgvector
 *
 * Implements:
 * - Sovereign User & Waitlist Records
 * - 64-Dimensional Voice DNA Acoustic Vectors
 * - 7-Day Double-Blind Bond Protocol State Machine
 * - Verifiable Cryptographic Erasure Audit Logs
 */

export const usersTable = {
  name: 'users',
  columns: {
    id: { type: 'uuid', primaryKey: true, default: 'gen_random_uuid()' },
    email: { type: 'text', unique: true, notNull: true },
    element: { type: 'text', default: 'Carbon' }, // Aqua, Ignis, Terra, Ventus
    referralCode: { type: 'text', unique: true, notNull: true },
    referredBy: { type: 'text', references: 'users.referralCode' },
    referralCount: { type: 'integer', default: 0 },
    queueRank: { type: 'integer', notNull: true },
    isVerified: { type: 'boolean', default: false },
    createdAt: { type: 'timestamp', default: 'now()' },
    updatedAt: { type: 'timestamp', default: 'now()' },
  },
};

export const voicePrintsTable = {
  name: 'voice_prints',
  columns: {
    id: { type: 'uuid', primaryKey: true, default: 'gen_random_uuid()' },
    userId: { type: 'uuid', references: 'users.id', notNull: true },
    medianPitchHz: { type: 'numeric(6, 2)', notNull: true },
    stabilityScore: { type: 'numeric(4, 3)', notNull: true },
    spectralCentroidHz: { type: 'numeric(6, 2)', notNull: true },
    acousticHash: { type: 'text', notNull: true },
    deterministicSeed: { type: 'bigint', notNull: true },
    vector64: { type: 'vector(64)', notNull: true }, // pgvector
    createdAt: { type: 'timestamp', default: 'now()' },
  },
};

export const bondsTable = {
  name: 'bonds',
  columns: {
    id: { type: 'uuid', primaryKey: true, default: 'gen_random_uuid()' },
    userAId: { type: 'uuid', references: 'users.id', notNull: true },
    userBId: { type: 'uuid', references: 'users.id', notNull: true },
    currentDay: { type: 'smallint', default: 1, notNull: true }, // 1 to 7
    userACompleted: { type: 'boolean', default: false },
    userBCompleted: { type: 'boolean', default: false },
    userADecision: { type: 'text', enum: ['EXTEND', 'RELEASE', 'PENDING'], default: 'PENDING' },
    userBDecision: { type: 'text', enum: ['EXTEND', 'RELEASE', 'PENDING'], default: 'PENDING' },
    status: { type: 'text', enum: ['ACTIVE', 'EXTENDED', 'RELEASED_GRACEFULLY'], default: 'ACTIVE' },
    unlockedPortraits: { type: 'boolean', default: false },
    createdAt: { type: 'timestamp', default: 'now()' },
    updatedAt: { type: 'timestamp', default: 'now()' },
  },
};

export const vanishAuditLogsTable = {
  name: 'vanish_audit_logs',
  columns: {
    id: { type: 'uuid', primaryKey: true, default: 'gen_random_uuid()' },
    receiptId: { type: 'text', unique: true, notNull: true },
    userIdHash: { type: 'text', notNull: true },
    merkleRoot: { type: 'text', notNull: true },
    signature: { type: 'text', notNull: true },
    erasedCount: { type: 'integer', notNull: true },
    erasureTimestamp: { type: 'timestamp', notNull: true },
  },
};
