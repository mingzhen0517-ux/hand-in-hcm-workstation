export type AgentCategory = 
  | 'RECRUITMENT' 
  | 'TRAINING' 
  | 'PERFORMANCE' 
  | 'COMPENSATION' 
  | 'RELATIONS' 
  | 'ANALYTICS';

export type AgentStatusType = 'AUTOMATED' | 'HIGH_EFFICIENCY' | 'ON_THE_WAY';

export type HRRole = 'RECRUITER' | 'HRBP' | 'SSC' | 'CB_SPECIALIST' | 'HRD';

export interface AgentMetadata {
  id: string;
  code: string;
  title: string;
  description: string;
  category: AgentCategory;
  status: AgentStatusType;
  efficiency: string;
  targetRoles: HRRole[];
  version: string;
}

export interface ProgressCallback {
  (progress: number, message: string): Promise<void> | void;
}

export interface AgentPlugin<TInput, TOutput> {
  metadata: AgentMetadata;
  execute(input: TInput, onProgress?: ProgressCallback): Promise<TOutput>;
}
