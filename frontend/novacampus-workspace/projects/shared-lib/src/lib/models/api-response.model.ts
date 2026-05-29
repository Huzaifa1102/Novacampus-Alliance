export interface ApiResponse<T> {
  status:    'success' | 'failure' | 'pending';
  data:      T;
  error:     string | null;
  timestamp: string;
}