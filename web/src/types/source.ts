import type { SourceI } from "./database";

export interface SourceStatsI extends SourceI {
  leadsCount: number;
  convertedCount: number;
  revenue: number;
}

export interface SourceStatsResultI {
  items: SourceStatsI[];
  total: number;
}
