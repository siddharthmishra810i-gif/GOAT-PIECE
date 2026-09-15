import {
  PipelineEntityType,
  DuplicateCandidate,
  CanonicalCharacter,
} from "../../types/pipeline";
import { canonicalDb } from "../database/canonicalStore";

export class EntityResolver {
  /**
   * Normalizes a name string for comparison:
   * lowercase, removes punctuation (dots, hyphens, commas), normalizes whitespace
   */
  public static cleanName(name: string): string {
    if (!name) return "";
    return name
      .toLowerCase()
      .replace(/[.\-,'’"“”;:()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Calculates Levenshtein edit distance between two strings
   */
  public static levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  /**
   * Computes string similarity percentage (0 to 100)
   */
  public static calculateSimilarity(str1: string, str2: string): number {
    const s1 = this.cleanName(str1);
    const s2 = this.cleanName(str2);
    if (s1 === s2) return 100;

    const maxLen = Math.max(s1.length, s2.length);
    if (maxLen === 0) return 100;

    const distance = this.levenshteinDistance(s1, s2);
    const levScore = Math.max(0, 1 - distance / maxLen) * 100;

    // Token overlap (Jaccard similarity)
    const tokens1 = new Set(s1.split(" ").filter(Boolean));
    const tokens2 = new Set(s2.split(" ").filter(Boolean));
    let intersection = 0;
    tokens1.forEach((t) => {
      if (tokens2.has(t)) intersection++;
    });
    const union = new Set([...tokens1, ...tokens2]).size;
    const tokenScore = union > 0 ? (intersection / union) * 100 : 0;

    // Substring containment bonus (e.g. "Luffy" is contained in "Monkey D. Luffy")
    let containmentScore = 0;
    if (s1.includes(s2) || s2.includes(s1)) {
      containmentScore = 80;
    }

    return Math.round(Math.max(levScore, tokenScore, containmentScore));
  }

  /**
   * Check for potential duplicates against existing canonical entities
   * Never automatically merges; generates DuplicateCandidates for Admin Review.
   */
  public static detectDuplicates(
    newItemTempId: string,
    newItemName: string,
    entityType: PipelineEntityType,
    newItemAliases: string[] = []
  ): DuplicateCandidate[] {
    const candidates: DuplicateCandidate[] = [];
    const cleanNew = this.cleanName(newItemName);

    if (entityType === "character") {
      const existingCharacters = Array.from(canonicalDb.characters.values());

      for (const existing of existingCharacters) {
        const cleanExisting = this.cleanName(existing.name);
        const matchReasons: string[] = [];
        let isMatch = false;
        let score = 0;

        // 1. Exact normalized match (e.g. "Monkey D. Luffy" vs "Monkey D Luffy")
        if (cleanNew === cleanExisting) {
          isMatch = true;
          score = 99;
          matchReasons.push("Exact normalized name match (punctuation/spacing variant)");
        }

        // 2. Alias match (e.g. new item is "Luffy" and existing aliases contains "Luffy")
        const existingCleanAliases = existing.aliases.map((a) => this.cleanName(a));
        if (existingCleanAliases.includes(cleanNew)) {
          isMatch = true;
          score = Math.max(score, 95);
          matchReasons.push(`Matches existing canonical alias: '${newItemName}'`);
        }

        // 3. Reverse alias check (existing name is an alias in the incoming item)
        const newCleanAliases = newItemAliases.map((a) => this.cleanName(a));
        if (newCleanAliases.includes(cleanExisting)) {
          isMatch = true;
          score = Math.max(score, 95);
          matchReasons.push(`Incoming item lists existing character as alias: '${existing.name}'`);
        }

        // 4. Fuzzy Similarity match (>= 75% similarity)
        const sim = this.calculateSimilarity(newItemName, existing.name);
        if (sim >= 75 && !isMatch) {
          isMatch = true;
          score = sim;
          matchReasons.push(`Fuzzy token and Levenshtein similarity: ${sim}%`);
        }

        if (isMatch) {
          candidates.push({
            candidate_id: `dup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            new_item_temp_id: newItemTempId,
            new_item_name: newItemName,
            existing_entity_id: existing.id,
            existing_entity_name: existing.name,
            entity_type: entityType,
            similarity_score: score,
            match_reasons: matchReasons,
            status: "PENDING_CONFIRMATION",
          });
        }
      }
    }

    return candidates;
  }
}
