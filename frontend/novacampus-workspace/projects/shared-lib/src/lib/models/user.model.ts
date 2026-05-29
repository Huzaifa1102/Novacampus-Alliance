export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'MANAGEMENT';

export interface AuthUser {
  sub:       string;
  email:     string;
  role:      UserRole;
  campusId:  string;
  programId?: string;
  exp:       number;
}