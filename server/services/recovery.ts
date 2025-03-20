import { log } from "../vite";
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

interface ServiceStatus {
  database: boolean;
  auth: boolean;
}

export class DeploymentRecovery {
  private static instance: DeploymentRecovery;
  private recoveryAttempts: number = 0;
  private readonly MAX_RECOVERY_ATTEMPTS = 3;
  private readonly RECOVERY_TIMEOUT = 5000; // 5 seconds

  private constructor() {}

  static getInstance(): DeploymentRecovery {
    if (!DeploymentRecovery.instance) {
      DeploymentRecovery.instance = new DeploymentRecovery();
    }
    return DeploymentRecovery.instance;
  }

  async checkServices(): Promise<ServiceStatus> {
    log("Starting service health check...", "recovery");
    const status: ServiceStatus = {
      database: false,
      auth: false
    };

    try {
      log("Testing database connection...", "recovery");
      // Test database connectivity
      const sql = neon(process.env.DATABASE_URL!);
      const db = drizzle(sql);
      await sql`SELECT 1`; // Simple query to test connection
      status.database = true;
      log("✓ Database connection verified", "recovery");
    } catch (error) {
      log(`✗ Database connection failed: ${error}`, "recovery");
      throw error; // Propagate database errors as they are critical
    }

    try {
      log("Testing authentication service...", "recovery");
      // Test session store
      if (process.env.SESSION_SECRET) {
        status.auth = true;
        log("✓ Authentication service verified", "recovery");
      } else {
        throw new Error("Session secret not configured");
      }
    } catch (error) {
      log(`✗ Authentication service failed: ${error}`, "recovery");
      throw error; // Propagate auth errors as they are critical
    }

    return status;
  }

  async attemptRecovery(error: Error): Promise<boolean> {
    if (this.recoveryAttempts >= this.MAX_RECOVERY_ATTEMPTS) {
      log(`Maximum recovery attempts (${this.MAX_RECOVERY_ATTEMPTS}) reached. Manual intervention required.`, "recovery");
      return false;
    }

    this.recoveryAttempts++;
    log(`Starting recovery attempt ${this.recoveryAttempts}/${this.MAX_RECOVERY_ATTEMPTS}`, "recovery");

    try {
      const services = await this.checkServices();

      if (!Object.values(services).every(status => status)) {
        log("Not all services are healthy. Waiting before next recovery attempt...", "recovery");
        await new Promise(resolve => setTimeout(resolve, this.RECOVERY_TIMEOUT));
        return await this.attemptRecovery(error);
      }

      log("Recovery successful - all services are operational", "recovery");
      this.recoveryAttempts = 0;
      return true;
    } catch (recoveryError) {
      log(`Recovery attempt failed: ${recoveryError}`, "recovery");
      return false;
    }
  }

  async handleDeploymentError(error: Error): Promise<void> {
    log(`Deployment error detected: ${error.message}`, "recovery");

    const recovered = await this.attemptRecovery(error);

    if (!recovered) {
      log("Recovery failed - system requires manual intervention", "recovery");
      process.exit(1);
    }
  }
}

export const recoveryService = DeploymentRecovery.getInstance();