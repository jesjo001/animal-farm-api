"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
// Repositories
const BaseRepository_1 = require("../repositories/BaseRepository");
const AnimalRepository_1 = require("../repositories/AnimalRepository");
const ProductionRepository_1 = require("../repositories/ProductionRepository");
const TransactionRepository_1 = require("../repositories/TransactionRepository");
// Models
const Tenant_model_1 = __importDefault(require("../models/Tenant.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const Event_model_1 = __importDefault(require("../models/Event.model"));
const FeedInventory_model_1 = __importDefault(require("../models/FeedInventory.model"));
const Notification_model_1 = __importDefault(require("../models/Notification.model"));
const AuditLog_model_1 = __importDefault(require("../models/AuditLog.model"));
// Register repositories
tsyringe_1.container.register('TenantRepository', { useValue: new BaseRepository_1.BaseRepository(Tenant_model_1.default) });
tsyringe_1.container.register('UserRepository', { useValue: new BaseRepository_1.BaseRepository(User_model_1.default) });
tsyringe_1.container.register('AnimalRepository', { useClass: AnimalRepository_1.AnimalRepository });
tsyringe_1.container.register('ProductionRepository', { useClass: ProductionRepository_1.ProductionRepository });
tsyringe_1.container.register('TransactionRepository', { useClass: TransactionRepository_1.TransactionRepository });
tsyringe_1.container.register('EventRepository', { useValue: new BaseRepository_1.BaseRepository(Event_model_1.default) });
tsyringe_1.container.register('FeedInventoryRepository', { useValue: new BaseRepository_1.BaseRepository(FeedInventory_model_1.default) });
tsyringe_1.container.register('NotificationRepository', { useValue: new BaseRepository_1.BaseRepository(Notification_model_1.default) });
tsyringe_1.container.register('AuditLogRepository', { useValue: new BaseRepository_1.BaseRepository(AuditLog_model_1.default) });
// Services will be registered automatically via @singleton() decorator
//# sourceMappingURL=container.js.map