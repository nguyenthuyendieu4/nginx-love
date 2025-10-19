import parser from 'cron-parser';
import logger from '../../../utils/logger';
import { backupRepository } from '../backup.repository';
import { backupService } from '../backup.service';

/**
 * Backup Scheduler Service
 * Automatically executes scheduled backups using Node.js setInterval
 * No system cron required - pure JavaScript solution
 */
class BackupSchedulerService {
  private intervalId: NodeJS.Timeout | null = null;
  private checkIntervalMs: number = 60000; // Check every 60 seconds

  /**
   * Calculate next run time from cron expression
   */
  calculateNextRun(cronExpression: string, baseDate?: Date): Date {
    try {
      const interval = parser.parseExpression(cronExpression, {
        currentDate: baseDate || new Date(),
        tz: 'UTC'
      });
      return interval.next().toDate();
    } catch (error) {
      logger.error('Failed to parse cron expression:', error);
      throw new Error(`Invalid cron expression: ${cronExpression}`);
    }
  }

  /**
   * Update nextRun for a schedule
   */
  async updateNextRun(scheduleId: string, cronExpression: string): Promise<void> {
    try {
      const nextRun = this.calculateNextRun(cronExpression);
      await backupRepository.updateSchedule(scheduleId, { nextRun });
      logger.debug(`Updated nextRun for schedule ${scheduleId}: ${nextRun.toISOString()}`);
    } catch (error) {
      logger.error(`Failed to update nextRun for schedule ${scheduleId}:`, error);
    }
  }

  /**
   * Check and execute due backups
   */
  async checkAndExecuteDueBackups(): Promise<void> {
    try {
      const now = new Date();
      
      // Find all enabled schedules
      const schedules = await backupRepository.findAllSchedules();
      const enabledSchedules = schedules.filter(s => s.enabled);

      for (const schedule of enabledSchedules) {
        // Skip if already running
        if (schedule.status === 'running') {
          logger.debug(`Schedule ${schedule.id} is already running, skipping...`);
          continue;
        }

        // Initialize nextRun if not set
        if (!schedule.nextRun) {
          await this.updateNextRun(schedule.id, schedule.schedule);
          continue;
        }

        // Check if backup is due
        if (schedule.nextRun <= now) {
          logger.info(`Executing scheduled backup: ${schedule.name} (${schedule.id})`);
          
          // Execute backup asynchronously (don't wait)
          this.executeScheduledBackup(schedule.id, schedule.name, schedule.schedule)
            .catch(error => {
              logger.error(`Failed to execute scheduled backup ${schedule.id}:`, error);
            });
        }
      }
    } catch (error) {
      logger.error('Error in checkAndExecuteDueBackups:', error);
    }
  }

  /**
   * Execute a scheduled backup
   */
  private async executeScheduledBackup(
    scheduleId: string,
    scheduleName: string,
    cronExpression: string
  ): Promise<void> {
    try {
      // Mark as running
      await backupRepository.updateSchedule(scheduleId, {
        status: 'running',
        lastRun: new Date()
      });

      logger.info(`Starting scheduled backup: ${scheduleName}`);

      // Execute the backup using the existing service method
      await backupService.runBackupNow(scheduleId);

      // Calculate and update next run time
      const nextRun = this.calculateNextRun(cronExpression);
      await backupRepository.updateSchedule(scheduleId, {
        status: 'success',
        nextRun
      });

      logger.info(`Scheduled backup completed successfully: ${scheduleName}, next run: ${nextRun.toISOString()}`);
    } catch (error) {
      logger.error(`Scheduled backup failed for ${scheduleName}:`, error);
      
      // Mark as failed and calculate next run
      try {
        const nextRun = this.calculateNextRun(cronExpression);
        await backupRepository.updateSchedule(scheduleId, {
          status: 'failed',
          nextRun
        });
      } catch (updateError) {
        logger.error('Failed to update schedule status:', updateError);
      }
    }
  }

  /**
   * Start the backup scheduler
   */
  start(checkIntervalMs: number = 60000): NodeJS.Timeout {
    if (this.intervalId) {
      logger.warn('Backup scheduler is already running');
      return this.intervalId;
    }

    this.checkIntervalMs = checkIntervalMs;

    logger.info(`Starting backup scheduler (check interval: ${checkIntervalMs}ms)`);

    // Initial check
    this.checkAndExecuteDueBackups().catch(error => {
      logger.error('Error in initial backup check:', error);
    });

    // Schedule periodic checks
    this.intervalId = setInterval(() => {
      this.checkAndExecuteDueBackups().catch(error => {
        logger.error('Error in scheduled backup check:', error);
      });
    }, checkIntervalMs);

    logger.info('✅ Backup scheduler started successfully');

    return this.intervalId;
  }

  /**
   * Stop the backup scheduler
   */
  stop(timerId?: NodeJS.Timeout): void {
    const timerToStop = timerId || this.intervalId;
    
    if (timerToStop) {
      clearInterval(timerToStop);
      this.intervalId = null;
      logger.info('Backup scheduler stopped');
    } else {
      logger.warn('No backup scheduler to stop');
    }
  }

  /**
   * Initialize nextRun for all enabled schedules
   * Should be called on app startup
   */
  async initializeSchedules(): Promise<void> {
    try {
      logger.info('Initializing backup schedules...');
      
      const schedules = await backupRepository.findAllSchedules();
      const enabledSchedules = schedules.filter(s => s.enabled);

      for (const schedule of enabledSchedules) {
        // Reset running status on startup (in case app crashed while backup was running)
        if (schedule.status === 'running') {
          await backupRepository.updateSchedule(schedule.id, { status: 'pending' });
        }

        // Calculate nextRun if not set or if it's in the past
        if (!schedule.nextRun || schedule.nextRun < new Date()) {
          await this.updateNextRun(schedule.id, schedule.schedule);
        }
      }

      logger.info(`Initialized ${enabledSchedules.length} backup schedule(s)`);
    } catch (error) {
      logger.error('Failed to initialize backup schedules:', error);
    }
  }
}

// Export singleton instance
export const backupSchedulerService = new BackupSchedulerService();

// Named exports for testing
export { BackupSchedulerService };
