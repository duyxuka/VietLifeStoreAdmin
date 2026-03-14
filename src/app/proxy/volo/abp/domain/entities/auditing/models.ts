import type { AggregateRoot, Entity } from '../models';

export interface AuditedAggregateRoot<TKey> extends CreationAuditedAggregateRoot<TKey> {
  lastModificationTime?: string;
  lastModifierId?: string;
}

export interface AuditedEntity<TKey> extends CreationAuditedEntity {
  lastModificationTime?: string;
  lastModifierId?: string;
}

export interface CreationAuditedAggregateRoot<TKey> extends AggregateRoot<TKey> {
  creationTime?: string;
  creatorId?: string;
}

export interface CreationAuditedEntity extends Entity {
  creationTime?: string;
  creatorId?: string;
}

export interface FullAuditedAggregateRoot<TKey> extends AuditedAggregateRoot<TKey> {
  isDeleted: boolean;
  deleterId?: string;
  deletionTime?: string;
}

export interface FullAuditedEntity<TKey> extends AuditedEntity<TKey> {
  isDeleted: boolean;
  deleterId?: string;
  deletionTime?: string;
}

export interface CreationAuditedEntity extends Entity {
  creationTime?: string;
  creatorId?: string;
}
