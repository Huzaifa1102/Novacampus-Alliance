export type PaymentStatus = 'Paid' | 'Pending' | 'Delay' | 'Exempted';

export interface Payment {
  paymentId:     string;
  studentId:     string;
  campusId:      string;
  amount:        number;
  dueDate:       string;
  paymentDate:   string | null;
  status:        PaymentStatus;
  reminderLevel: number;
  academicYear:  string;
}