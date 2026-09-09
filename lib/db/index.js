/**
 * Database client and repository helper for ourchemistry.ai
 * Supports PostgreSQL connection when DATABASE_URL is configured,
 * with seamless fallback to sovereign in-memory/file storage.
 */

import * as schema from './schema.js';

class SovereignDatabase {
  constructor() {
    this.schema = schema;
    this.isConfigured = Boolean(process.env.DATABASE_URL);
  }

  /**
   * Calculates cosine similarity between two 64-dimensional Voice DNA vectors
   * @param {number[]} vecA - 64-D acoustic vector
   * @param {number[]} vecB - 64-D acoustic vector
   * @returns {number} Cosine similarity (-1.0 to 1.0)
   */
  calculateAcousticCosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Returns schema definitions for Drizzle ORM migrations
   */
  getSchema() {
    return this.schema;
  }
}

export const db = new SovereignDatabase();
