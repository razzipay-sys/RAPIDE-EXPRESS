import 'package:flutter/material.dart';
import '../../shared/theme/app_theme.dart' show AppColors;

class TrackScreen extends StatelessWidget {
  final String deliveryId;
  const TrackScreen({super.key, required this.deliveryId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Suivi en temps réel')),
      body: Column(
        children: [
          // Map placeholder
          Expanded(
            flex: 3,
            child: Container(
              color: AppColors.surface2,
              child: const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('🗺️', style: TextStyle(fontSize: 48)),
                    SizedBox(height: 12),
                    Text('Carte en temps réel', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                    Text('Mapbox GL intégré ici', style: TextStyle(color: Color(0x80FFFFFF), fontSize: 13)),
                  ],
                ),
              ),
            ),
          ),
          // Rider info
          Container(
            padding: const EdgeInsets.all(20),
            color: AppColors.surface,
            child: Column(
              children: [
                Row(
                  children: [
                    CircleAvatar(radius: 24, backgroundColor: AppColors.surface2, child: const Text('👤', style: TextStyle(fontSize: 20))),
                    const SizedBox(width: 12),
                    const Expanded(child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Amavi Dossou', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                        Text('★ 4.9 · 🏍️ Moto', style: TextStyle(color: Color(0x80FFFFFF), fontSize: 12)),
                      ],
                    )),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.orange.withAlpha(30),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.orange.withAlpha(80)),
                      ),
                      child: const Text('12 min', style: TextStyle(color: AppColors.orange, fontWeight: FontWeight.bold, fontSize: 16)),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.orange.withAlpha(20),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.orange.withAlpha(60)),
                  ),
                  child: const Row(
                    children: [
                      Text('🟠', style: TextStyle(fontSize: 8)),
                      SizedBox(width: 8),
                      Text('En route vers la collecte', style: TextStyle(color: AppColors.orange, fontSize: 13, fontWeight: FontWeight.w500)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
