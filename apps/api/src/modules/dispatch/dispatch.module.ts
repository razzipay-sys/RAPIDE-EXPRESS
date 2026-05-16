import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { DispatchQueueProcessor } from './dispatch-queue.processor';
import { DispatchService } from './dispatch.service';

export const DISPATCH_QUEUE = 'dispatch';

@Module({
  imports: [
    BullModule.registerQueue({ name: DISPATCH_QUEUE }),
  ],
  providers: [DispatchService, DispatchQueueProcessor],
  exports: [DispatchService],
})
export class DispatchModule {}
