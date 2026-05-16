import { AdminRole, PrismaClient, RiderStatus, VehicleType, WalletType } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Pricing zones — Cotonou main zone
  const cotonouZone = await db.pricingZone.upsert({
    where: { slug: 'cotonou' },
    update: {},
    create: {
      name: 'Cotonou',
      slug: 'cotonou',
      baseFare: 500,      // 500 XOF base
      perKmRate: 150,     // 150 XOF per km
      minFare: 500,
      currency: 'XOF',
      isActive: true,
    },
  });

  // Pricing rules — weight surcharge
  await db.pricingRule.upsert({
    where: { id: 'rule-weight-5kg' },
    update: {},
    create: {
      id: 'rule-weight-5kg',
      zoneId: cotonouZone.id,
      ruleType: 'weight',
      condition: { operator: 'gte', value: 5 },
      addedFee: 250,
      priority: 1,
      isActive: true,
    },
  });

  // Priority rule
  await db.pricingRule.upsert({
    where: { id: 'rule-priority' },
    update: {},
    create: {
      id: 'rule-priority',
      zoneId: cotonouZone.id,
      ruleType: 'priority',
      condition: { operator: 'eq', value: true },
      multiplier: 1.3,
      priority: 10,
      isActive: true,
    },
  });

  // Insurance rule
  await db.pricingRule.upsert({
    where: { id: 'rule-insurance' },
    update: {},
    create: {
      id: 'rule-insurance',
      zoneId: cotonouZone.id,
      ruleType: 'insurance',
      condition: { operator: 'eq', value: true },
      multiplier: 1.05,
      priority: 5,
      isActive: true,
    },
  });

  // Service zone
  await db.serviceZone.upsert({
    where: { id: 'zone-cotonou' },
    update: {},
    create: {
      id: 'zone-cotonou',
      name: 'Grand Cotonou',
      cityName: 'Cotonou',
      country: 'BJ',
      isActive: true,
    },
  });

  // Welcome coupon
  await db.coupon.upsert({
    where: { code: 'RAPIDE2026' },
    update: {},
    create: {
      code: 'RAPIDE2026',
      discountType: 'percentage',
      discountValue: 20,
      maxDiscount: 1000,
      maxUses: 1000,
      isActive: true,
    },
  });

  // Admin accounts
  await db.adminUser.upsert({
    where: { email: 'razzipay@gmail.com' },
    update: {},
    create: {
      supabaseId: '00000000-0000-0000-0000-000000000001',
      email: 'razzipay@gmail.com',
      fullName: 'Razzi Pay',
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  await db.adminUser.upsert({
    where: { email: 'adegbesanadebola1@gmail.com' },
    update: {},
    create: {
      supabaseId: '00000000-0000-0000-0000-000000000002',
      email: 'adegbesanadebola1@gmail.com',
      fullName: 'Adegbesan Adebola',
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log('✅ Seed complete.');
  console.log(`   Pricing zone: ${cotonouZone.name} (${cotonouZone.slug})`);
  console.log('   Admins: razzipay@gmail.com, adegbesanadebola1@gmail.com');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
