import { QueryResult } from 'pg';
import { query } from '../db';

export interface PaymentRow {
  payment_id:     string;
  student_id:     string;
  campus_id:      string;
  amount:         number;
  due_date:       string;
  payment_date:   string | null;
  status:         string;
  reminder_level: number;
  academic_year:  string;
  first_name?:    string;
  last_name?:     string;
  email?:         string;
}

export const financialRepository = {

  // ── Payments ──────────────────────────────────────────────

  async findAll(
    campusId: string,
    filters: {
      status?:       string;
      academicYear?: string;
      studentId?:    string;
    }
  ): Promise<QueryResult<PaymentRow>> {
    const conditions: string[] = ['p.campus_id = $1'];
    const params: unknown[]    = [campusId];
    let   idx = 2;

    if (filters.status) {
      conditions.push(`p.status = $${idx++}`);
      params.push(filters.status);
    }
    if (filters.academicYear) {
      conditions.push(`p.academic_year = $${idx++}`);
      params.push(filters.academicYear);
    }
    if (filters.studentId) {
      conditions.push(`p.student_id = $${idx++}`);
      params.push(filters.studentId);
    }

    return query(
      `SELECT p.*,
              s.first_name,
              s.last_name,
              s.email
       FROM payments p
       JOIN students s ON p.student_id = s.student_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY p.due_date ASC`,
      params,
      campusId
    );
  },

  async findById(
    paymentId: string,
    campusId:  string
  ): Promise<QueryResult<PaymentRow>> {
    return query(
      `SELECT p.*, s.first_name, s.last_name, s.email
       FROM payments p
       JOIN students s ON p.student_id = s.student_id
       WHERE p.payment_id = $1 AND p.campus_id = $2`,
      [paymentId, campusId],
      campusId
    );
  },

  async findByStudent(
    studentId: string,
    campusId:  string
  ): Promise<QueryResult<PaymentRow>> {
    return query(
      `SELECT * FROM payments
       WHERE student_id = $1
         AND campus_id  = $2
       ORDER BY due_date ASC`,
      [studentId, campusId],
      campusId
    );
  },

  async create(data: {
    studentId:    string;
    campusId:     string;
    amount:       number;
    dueDate:      string;
    academicYear: string;
  }): Promise<QueryResult<PaymentRow>> {
    return query(
      `INSERT INTO payments
         (student_id, campus_id, amount, due_date, academic_year)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [
        data.studentId,
        data.campusId,
        data.amount,
        data.dueDate,
        data.academicYear
      ],
      data.campusId
    );
  },

  async confirmPayment(
    paymentId: string,
    campusId:  string
  ): Promise<QueryResult<PaymentRow>> {
    return query(
      `UPDATE payments
       SET status       = 'Paid',
           payment_date = CURRENT_DATE
       WHERE payment_id = $1
         AND campus_id  = $2
         AND status     != 'Paid'
       RETURNING *`,
      [paymentId, campusId],
      campusId
    );
  },

  async updateStatus(
    paymentId: string,
    status:    string,
    campusId:  string
  ): Promise<QueryResult<PaymentRow>> {
    return query(
      `UPDATE payments
       SET status = $1
       WHERE payment_id = $2 AND campus_id = $3
       RETURNING *`,
      [status, paymentId, campusId],
      campusId
    );
  },

  // ── CRON queries ──────────────────────────────────────────

  // Find all overdue payments for the nightly reminder job
  async findOverdue(campusId?: string): Promise<QueryResult<PaymentRow>> {
    const conditions = [
      `p.status = 'Delay'`,
      `p.payment_date IS NULL`,
      `p.due_date < CURRENT_DATE`
    ];
    const params: unknown[] = [];

    if (campusId) {
      conditions.push(`p.campus_id = $1`);
      params.push(campusId);
    }

    return query(
      `SELECT p.*,
              s.first_name,
              s.last_name,
              s.email
       FROM payments p
       JOIN students s ON p.student_id = s.student_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY p.due_date ASC`,
      params
    );
  },

  // Update reminder level after sending a reminder
  async updateReminderLevel(
    paymentId:     string,
    reminderLevel: number
  ): Promise<QueryResult<PaymentRow>> {
    return query(
      `UPDATE payments
       SET reminder_level = $1
       WHERE payment_id   = $2
       RETURNING *`,
      [reminderLevel, paymentId]
    );
  },

  // Mark payments as Delay when they pass their due date
  async markOverduePayments(): Promise<QueryResult<PaymentRow>> {
    return query(
      `UPDATE payments
       SET status = 'Delay'
       WHERE status   = 'Pending'
         AND due_date < CURRENT_DATE
       RETURNING *`
    );
  },

  // Dashboard summary per campus
  async getSummary(campusId: string): Promise<QueryResult<{
    total:    number;
    paid:     number;
    pending:  number;
    delay:    number;
    exempted: number;
    total_amount:     number;
    collected_amount: number;
    default_rate:     number;
  }>> {
    return query(
      `SELECT
         COUNT(*)                                           AS total,
         COUNT(*) FILTER (WHERE status = 'Paid')           AS paid,
         COUNT(*) FILTER (WHERE status = 'Pending')        AS pending,
         COUNT(*) FILTER (WHERE status = 'Delay')          AS delay,
         COUNT(*) FILTER (WHERE status = 'Exempted')       AS exempted,
         SUM(amount)                                        AS total_amount,
         SUM(amount) FILTER (WHERE status = 'Paid')        AS collected_amount,
         ROUND(
           100.0 * COUNT(*) FILTER (WHERE status = 'Delay')
           / NULLIF(COUNT(*), 0), 2
         )                                                  AS default_rate
       FROM payments
       WHERE campus_id = $1`,
      [campusId],
      campusId
    );
  }
};