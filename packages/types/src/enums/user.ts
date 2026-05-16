export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OPS_ADMIN = 'OPS_ADMIN',
  FINANCE_ADMIN = 'FINANCE_ADMIN',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
  VIEWER = 'VIEWER',
}

export enum MerchantMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export const ADMIN_ROLE_HIERARCHY: Record<AdminRole, number> = {
  [AdminRole.SUPER_ADMIN]: 100,
  [AdminRole.OPS_ADMIN]: 80,
  [AdminRole.FINANCE_ADMIN]: 60,
  [AdminRole.SUPPORT_AGENT]: 40,
  [AdminRole.VIEWER]: 10,
};
