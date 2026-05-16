import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../shared/theme/app_theme.dart' show AppColors;

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            floating: true,
            backgroundColor: AppColors.dark,
            title: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Bonjour 👋', style: TextStyle(color: Colors.white.withAlpha(128), fontSize: 12)),
                const Text('Que souhaitez-vous envoyer ?', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600)),
              ],
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Quick actions
                const Text('Actions rapides', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 15)),
                const SizedBox(height: 12),
                Row(children: [
                  Expanded(child: _QuickActionCard(label: 'Envoyer', icon: Icons.send_rounded, onTap: () => context.push('/send'))),
                  const SizedBox(width: 12),
                  Expanded(child: _QuickActionCard(label: 'Suivre', icon: Icons.location_on_rounded, onTap: () {})),
                ]),
                const SizedBox(height: 24),
                const Text('Livraisons récentes', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 15)),
                const SizedBox(height: 12),
                const _EmptyState(),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;
  const _QuickActionCard({required this.label, required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: AppColors.orange, size: 28),
            const SizedBox(height: 12),
            Text(label, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: const Column(
        children: [
          Text('📦', style: TextStyle(fontSize: 40)),
          SizedBox(height: 12),
          Text('Aucune livraison', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
          SizedBox(height: 4),
          Text('Votre historique apparaîtra ici', style: TextStyle(color: Color(0x80FFFFFF), fontSize: 13)),
        ],
      ),
    );
  }
}
