export interface LogPoint {
  id: string;
  label: string;
  description?: string;
  log: string;
  tag: string;
  success?: string;
  next?: string;
}