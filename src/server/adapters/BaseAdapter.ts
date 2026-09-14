import { PipelineEntityType, SourceType } from "../../types/pipeline";

export interface AdapterFetchResult {
  records: Record<string, any>[];
  total: number;
  hasMore: boolean;
  sourceUrl: string;
  isMockFallback?: boolean;
}

export interface BaseAdapter {
  name: string;
  sourceId: string;
  sourceType: SourceType;
  baseUrl: string;

  fetchRecords(
    entityType: PipelineEntityType,
    options?: { page?: number; limit?: number; query?: string }
  ): Promise<AdapterFetchResult>;

  validateSchema(
    rawRecord: Record<string, any>,
    entityType: PipelineEntityType
  ): { isValid: boolean; errors: string[] };
}
