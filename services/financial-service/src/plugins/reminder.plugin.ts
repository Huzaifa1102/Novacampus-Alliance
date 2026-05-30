import cron from 'node-cron';
import { differenceInDays } from 'date-fns';
import { financialRepository } from '../repositories/financial.repository';
import { publishPaymentEvent } from '../events/publishers/payment.publisher';

export function startReminderCron(): void {
  // Runs every night at 02:00
  cron.schedule('0 2 * * *', async () => {
    console.log('[CRON] Running nightly payment reminder job...');
    await runReminderJob();
  });

  console.log('Payment reminder CRON scheduled (runs at 02:00 daily)');
}

export async function runReminderJob(): Promise<{
  processed: number;
  escalated: number;
}> {
  let processed = 0;
  let escalated = 0;

  try {
    // Step 1 — Mark any Pending payments that passed due date as Delay
    const marked = await financialRepository.markOverduePayments();
    if ((marked.rowCount ?? 0) > 0) {
      console.log(`[CRON] Marked ${marked.rowCount} payments as Delay`);
    }

    // Step 2 — Fetch all current Delay payments
    const overdueResult = await financialRepository.findOverdue();
    const overduePayments = overdueResult.rows;

    console.log(`[CRON] Processing ${overduePayments.length} overdue payments`);

    for (const payment of overduePayments) {
      const daysOverdue = differenceInDays(
        new Date(),
        new Date(payment.due_date)
      );

      // Determine escalation level based on days overdue
      let reminderLevel: number;
      let queue: string;
      let messageType: string;

      if (daysOverdue >= 30) {
        reminderLevel = 4;
        queue         = 'payment.overdue';
        messageType   = 'ADMIN_ESCALATION';
        escalated++;
      } else if (daysOverdue >= 14) {
        reminderLevel = 3;
        queue         = 'payment.reminder';
        messageType   = 'SECOND_FORMAL_NOTICE';
      } else if (daysOverdue >= 7) {
        reminderLevel = 2;
        queue         = 'payment.reminder';
        messageType   = 'FIRST_FORMAL_NOTICE';
      } else {
        reminderLevel = 1;
        queue         = 'payment.reminder';
        messageType   = 'FRIENDLY_REMINDER';
      }

      // Only send if reminder level increased since last time
      if (reminderLevel > payment.reminder_level) {
        await publishPaymentEvent(queue, {
          paymentId:     payment.payment_id,
          studentId:     payment.student_id,
          campusId:      payment.campus_id,
          email:         payment.email,
          firstName:     payment.first_name,
          lastName:      payment.last_name,
          amount:        payment.amount,
          dueDate:       payment.due_date,
          daysOverdue,
          reminderLevel,
          messageType,
          academicYear:  payment.academic_year
        });

        // Record that we sent this reminder level
        await financialRepository.updateReminderLevel(
          payment.payment_id,
          reminderLevel
        );

        processed++;
        console.log(
          `[CRON] ${messageType} → ${payment.first_name} ${payment.last_name} ` +
          `(${daysOverdue} days overdue, €${payment.amount})`
        );
      }
    }

    console.log(
      `[CRON] Done. Processed: ${processed}, Escalated to admin: ${escalated}`
    );
  } catch (err) {
    console.error('[CRON] Reminder job failed:', (err as Error).message);
  }

  return { processed, escalated };
}