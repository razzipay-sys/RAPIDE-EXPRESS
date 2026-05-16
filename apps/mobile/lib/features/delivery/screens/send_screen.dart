import 'package:flutter/material.dart';
import '../../shared/theme/app_theme.dart' show AppColors;

class SendScreen extends StatelessWidget {
  const SendScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Envoyer un colis')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _AddressField(label: 'Adresse de collecte', hint: 'Ex: Plateau, Cotonou', icon: Icons.circle, iconColor: AppColors.orange),
            const SizedBox(height: 12),
            _AddressField(label: 'Adresse de livraison', hint: 'Ex: Akpakpa, Cotonou', icon: Icons.location_on, iconColor: Colors.white),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {},
              child: const Text('Voir le tarif'),
            ),
          ],
        ),
      ),
    );
  }
}

class _AddressField extends StatelessWidget {
  final String label;
  final String hint;
  final IconData icon;
  final Color iconColor;
  const _AddressField({required this.label, required this.hint, required this.icon, required this.iconColor});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Color(0x80FFFFFF), fontSize: 12, fontWeight: FontWeight.w500)),
        const SizedBox(height: 6),
        TextField(
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: Icon(icon, color: iconColor, size: 16),
          ),
        ),
      ],
    );
  }
}
