import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsEvent, type RiderLocationPayload } from '@rapide/types';

import { TrackingService } from './tracking.service';

@WebSocketGateway({
  cors: { origin: process.env.API_CORS_ORIGINS?.split(',') ?? '*' },
  namespace: '/tracking',
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TrackingGateway.name);

  constructor(private readonly trackingService: TrackingService) {}

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('rider:join')
  async handleRiderJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { riderId: string },
  ) {
    await client.join(`rider:${data.riderId}`);
    this.logger.debug(`Rider ${data.riderId} joined room`);
  }

  @SubscribeMessage('delivery:watch')
  async handleDeliveryWatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { deliveryId: string },
  ) {
    await client.join(`delivery:${data.deliveryId}`);
  }

  @SubscribeMessage(WsEvent.RIDER_LOCATION_UPDATE)
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: RiderLocationPayload,
  ) {
    await this.trackingService.updateRiderLocation(payload);

    // Broadcast to all watchers of active deliveries for this rider
    const deliveryId = await this.trackingService.getRiderActiveDelivery(payload.riderId);
    if (deliveryId) {
      this.server.to(`delivery:${deliveryId}`).emit(WsEvent.TRACKING_UPDATE, {
        deliveryId,
        riderLocation: { latitude: payload.latitude, longitude: payload.longitude },
        timestamp: payload.timestamp,
      });
    }
  }

  async sendToRider(riderId: string, event: WsEvent, data: unknown) {
    this.server.to(`rider:${riderId}`).emit(event, data);
  }

  async broadcastDeliveryUpdate(deliveryId: string, data: unknown) {
    this.server.to(`delivery:${deliveryId}`).emit(WsEvent.TRACKING_UPDATE, data);
  }
}
