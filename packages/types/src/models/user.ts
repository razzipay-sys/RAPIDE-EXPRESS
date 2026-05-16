export interface User {
  id: string;
  supabaseId: string;
  phone: string | null;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  isVerified: boolean;
  isActive: boolean;
  isBanned: boolean;
  referralCode: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  dateOfBirth: Date | null;
  gender: string | null;
}

export interface UserAddress {
  id: string;
  userId: string;
  label: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  createdAt: Date;
}

export interface UserDevice {
  id: string;
  userId: string;
  deviceId: string;
  platform: 'ios' | 'android' | 'web';
  pushToken: string | null;
  isActive: boolean;
  lastSeenAt: Date;
}
