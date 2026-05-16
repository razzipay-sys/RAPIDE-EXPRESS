import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { prisma } from '@rapide/database';

import { DISPATCH_QUEUE } from './dispatch.module';
import { DispatchService } from './dispatch.service';

@Processor(DISPATCH_QUEUE)
export class DispatchQueueProcessor {
  private readonly logger = new Logger(DispatchQueueProcessor.name);

  constructor(private readonly dispatchService: DispatchService) {}

  @Process('find-rider')
  async handleFindRider(job: Job<{ deliveryId: string; attempt: number }>) {
    const { deliveryId, attempt } = job.data;
    this.logger.log(`Dispatch attempt ${attempt} for delivery ${deliveryId}`);

    // Check delivery is still pending
    const delivery = await prisma.delivery.findUnique({ where: { id: deliveryId } });
    if (!delivery || delivery.status !== 'PENDING') {
      this.logger.log(`Delivery ${deliveryId} is no longer pending — skipping dispatch`);
      return;
    }

    const assigned = await this.dispatchService.findAndAssignRider(deliveryId);

    if (!assigned) {
      this.logger.warn(`No rider found for delivery ${deliveryId} on attempt ${attempt}`);
      // BullMQ will retry via job config
      throw new Error(`No rider available for delivery ${deliveryId}`);
    }
  }
}
