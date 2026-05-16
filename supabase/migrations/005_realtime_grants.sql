-- Enable Supabase Realtime for live tracking and order updates

-- Allow realtime on deliveries table (status updates for customer + rider)
ALTER PUBLICATION supabase_realtime ADD TABLE deliveries;

-- Allow realtime on rider_location_cache (live map tracking)
ALTER PUBLICATION supabase_realtime ADD TABLE rider_location_cache;

-- Allow realtime on notifications (push-style in-app notifications)
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Allow realtime on dispatch_requests (rider receives dispatch in real-time)
ALTER PUBLICATION supabase_realtime ADD TABLE dispatch_requests;
