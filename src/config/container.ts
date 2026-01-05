import { container } from 'tsyringe';

// Repositories
import { BaseRepository } from '../repositories/BaseRepository';
import { AnimalRepository } from '../repositories/AnimalRepository';
import { ProductionRepository } from '../repositories/ProductionRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';

// Models
import Tenant from '../models/Tenant.model';
import User from '../models/User.model';
import Animal from '../models/Animal.model';
import Production from '../models/Production.model';
import Event from '../models/Event.model';
import Transaction from '../models/Transaction.model';
import FeedInventory from '../models/FeedInventory.model';
import Notification from '../models/Notification.model';
import AuditLog from '../models/AuditLog.model';

// Register repositories
container.register('TenantRepository', { useValue: new BaseRepository(Tenant) });
container.register('UserRepository', { useValue: new BaseRepository(User) });
container.register('AnimalRepository', { useClass: AnimalRepository });
container.register('ProductionRepository', { useClass: ProductionRepository });
container.register('TransactionRepository', { useClass: TransactionRepository });
container.register('EventRepository', { useValue: new BaseRepository(Event) });
container.register('FeedInventoryRepository', { useValue: new BaseRepository(FeedInventory) });
container.register('NotificationRepository', { useValue: new BaseRepository(Notification) });
container.register('AuditLogRepository', { useValue: new BaseRepository(AuditLog) });

// Services will be registered automatically via @singleton() decorator