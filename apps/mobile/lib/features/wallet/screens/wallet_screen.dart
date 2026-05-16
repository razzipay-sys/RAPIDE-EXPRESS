import 'package:flutter/material.dart';
import '../../shared/theme/app_theme.dart' show AppColors;

class WalletScreen extends StatelessWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          const SliverAppBar(
            floating: true,
            backgroundColor: AppColors.dark,
            title: Text('Portefeuille', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Balance card
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFF6B00), Color(0xFFFF8C3A)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Solde disponible', style: TextStyle(color: Colors.white70, fontSize: 13)),
                      const SizedBox(height: 8),
                      const Text('0 XOF', style: TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white.withAlpha(50),
                          foregroundColor: Colors.white,
                          minimumSize: const Size(120, 40),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('+ Recharger', style: TextStyle(fontSize: 13)),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                const Text('Transactions', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 15)),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: const Column(
                    children: [
                      Text('💳', style: TextStyle(fontSize: 36)),
                      SizedBox(height: 8),
                      Text('Aucune transaction', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}
