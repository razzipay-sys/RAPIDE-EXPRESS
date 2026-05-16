import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../features/auth/screens/auth_screen.dart';
import '../../features/home/screens/home_screen.dart';
import '../../features/delivery/screens/send_screen.dart';
import '../../features/tracking/screens/track_screen.dart';
import '../../features/wallet/screens/wallet_screen.dart';
import '../../shared/widgets/app_shell.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final supabase = Supabase.instance.client;

  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final isAuthenticated = supabase.auth.currentSession != null;
      final isAuthRoute = state.matchedLocation.startsWith('/auth');

      if (!isAuthenticated && !isAuthRoute) return '/auth';
      if (isAuthenticated && isAuthRoute) return '/home';
      return null;
    },
    routes: [
      GoRoute(path: '/auth', builder: (ctx, _) => const AuthScreen()),
      ShellRoute(
        builder: (ctx, state, child) => AppShell(child: child),
        routes: [
          GoRoute(path: '/home', builder: (ctx, _) => const HomeScreen()),
          GoRoute(path: '/send', builder: (ctx, _) => const SendScreen()),
          GoRoute(
            path: '/track/:id',
            builder: (ctx, state) => TrackScreen(deliveryId: state.pathParameters['id']!),
          ),
          GoRoute(path: '/wallet', builder: (ctx, _) => const WalletScreen()),
        ],
      ),
      GoRoute(path: '/', redirect: (_, __) => '/home'),
    ],
  );
});
