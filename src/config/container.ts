import { container } from 'tsyringe';

// Repositories
import { BaseRepository } from '../repositories/BaseRepository';
import { AnimalRepository } from '../repositories/AnimalRepository';
import { ProductionRepository } from '../repositories/ProductionRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { LocationRepository } from '../repositories/LocationRepository';

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
import { Location } from '../models/Location.model';

// Register repositories
container.register('TenantRepository', { useValue: new BaseRepository(Tenant) });
container.register('UserRepository', { useValue: new BaseRepository(User) });
container.register('AnimalRepository', { useClass: AnimalRepository });
container.register('ProductionRepository', { useClass: ProductionRepository });
container.register('TransactionRepository', { useClass: TransactionRepository });
container.register('LocationRepository', { useClass: LocationRepository });
container.register('EventRepository', { useValue: new BaseRepository(Event) });
container.register('FeedInventoryRepository', { useValue: new BaseRepository(FeedInventory) });
container.register('NotificationRepository', { useValue: new BaseRepository(Notification) });
container.register('AuditLogRepository', { useValue: new BaseRepository(AuditLog) });

// Services will be registered automatically via @singleton() decorator