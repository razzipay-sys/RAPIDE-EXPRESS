import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});
  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _phoneCtrl = TextEditingController();
  bool _isLoading = false;
  bool _otpSent = false;
  final List<TextEditingController> _otpCtrl = List.generate(6, (_) => TextEditingController());
  String? _error;

  @override
  void dispose() {
    _phoneCtrl.dispose();
    for (final c in _otpCtrl) { c.dispose(); }
    super.dispose();
  }

  Future<void> _sendOtp() async {
    setState(() { _isLoading = true; _error = null; });
    try {
      await Supabase.instance.client.auth.signInWithOtp(
        phone: '+229${_phoneCtrl.text.replaceAll(RegExp(r'\D'), '')}',
      );
      setState(() { _otpSent = true; });
    } catch (e) {
      setState(() { _error = e.toString(); });
    } finally {
      setState(() { _isLoading = false; });
    }
  }

  Future<void> _verifyOtp() async {
    final code = _otpCtrl.map((c) => c.text).join();
    if (code.length < 6) return;
    setState(() { _isLoading = true; _error = null; });
    try {
      await Supabase.instance.client.auth.verifyOTP(
        phone: '+229${_phoneCtrl.text.replaceAll(RegExp(r'\D'), '')}',
        token: code,
        type: OtpType.sms,
      );
      if (mounted) context.go('/home');
    } catch (e) {
      setState(() { _error = 'Code incorrect'; });
    } finally {
      setState(() { _isLoading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 48),
              Container(
                height: 48, width: 48,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(colors: [Color(0xFFFF6B00), Color(0xFFFF8C3A)]),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Center(child: Text('R', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 22))),
              ),
              const SizedBox(height: 32),
              Text(
                _otpSent ? 'Vérification' : 'Bienvenue',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(color: Colors.white, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                _otpSent
                    ? 'Entrez le code envoyé au +229 ${_phoneCtrl.text}'
                    : 'Entrez votre numéro pour continuer',
                style: const TextStyle(color: Color(0x80FFFFFF)),
              ),
              const SizedBox(height: 32),
              if (!_otpSent) ...[
                TextField(
                  controller: _phoneCtrl,
                  keyboardType: TextInputType.phone,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    hintText: 'XX XX XX XX',
                    prefixText: '🇧🇯 +229  ',
                    prefixStyle: TextStyle(color: Color(0x80FFFFFF)),
                  ),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: _isLoading ? null : _sendOtp,
                  child: _isLoading
                      ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text('Recevoir le code'),
                ),
              ] else ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: List.generate(6, (i) => SizedBox(
                    width: 44,
                    child: TextField(
                      controller: _otpCtrl[i],
                      keyboardType: TextInputType.number,
                      maxLength: 1,
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                      decoration: const InputDecoration(counterText: ''),
                      onChanged: (v) {
                        if (v.isNotEmpty && i < 5) FocusScope.of(context).nextFocus();
                        if (i == 5 && _otpCtrl.every((c) => c.text.isNotEmpty)) _verifyOtp();
                      },
                    ),
                  )),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: _isLoading ? null : _verifyOtp,
                  child: _isLoading
                      ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text('Confirmer'),
                ),
                TextButton(
                  onPressed: () => setState(() { _otpSent = false; }),
                  child: const Text('← Changer de numéro', style: TextStyle(color: Color(0x80FFFFFF))),
                ),
              ],
              if (_error != null) ...[
                const SizedBox(height: 12),
                Text(_error!, style: const TextStyle(color: Colors.redAccent, fontSize: 13)),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
