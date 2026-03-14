import type { Entity } from '../domain/entities/models';
import type { CreationAuditedEntity, FullAuditedAggregateRoot } from '../domain/entities/auditing/models';

export interface IdentityClaim extends Entity {
  tenantId?: string;
  claimType?: string;
  claimValue?: string;
}

export interface IdentityUser extends FullAuditedAggregateRoot<string> {
  tenantId?: string;
  userName?: string;
  normalizedUserName?: string;
  name?: string;
  surname?: string;
  email?: string;
  normalizedEmail?: string;
  emailConfirmed: boolean;
  passwordHash?: string;
  securityStamp?: string;
  isExternal: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  isActive: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd?: string;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  shouldChangePasswordOnNextLogin: boolean;
  entityVersion: number;
  lastPasswordChangeTime?: string;
  roles: IdentityUserRole[];
  claims: IdentityUserClaim[];
  logins: IdentityUserLogin[];
  tokens: IdentityUserToken[];
  organizationUnits: IdentityUserOrganizationUnit[];
}

export interface IdentityUserClaim extends IdentityClaim {
  userId?: string;
}

export interface IdentityUserLogin extends Entity {
  tenantId?: string;
  userId?: string;
  loginProvider?: string;
  providerKey?: string;
  providerDisplayName?: string;
}

export interface IdentityUserOrganizationUnit extends CreationAuditedEntity {
  tenantId?: string;
  userId?: string;
  organizationUnitId?: string;
}

export interface IdentityUserRole extends Entity {
  tenantId?: string;
  userId?: string;
  roleId?: string;
}

export interface IdentityUserToken extends Entity {
  tenantId?: string;
  userId?: string;
  loginProvider?: string;
  name?: string;
  value?: string;
}
