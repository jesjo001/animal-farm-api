"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getEvent = exports.createEvent = exports.getEvents = void 0;
const event_service_1 = require("../services/event.service");
const tsyringe_1 = require("tsyringe");
const pagination_util_1 = require("../utils/pagination.util");
const eventService = tsyringe_1.container.resolve(event_service_1.EventService);
const getEvents = async (req, res, next) => {
    try {
        const options = (0, pagination_util_1.getPaginationOptions)(req.query);
        const filters = { tenantId: req.tenantId };
        if (req.query.eventType)
            filters.eventType = req.query.eventType;
        if (req.query.startDate)
            filters.date = { $gte: new Date(req.query.startDate) };
        if (req.query.endDate)
            filters.date = { ...filters.date, $lte: new Date(req.query.endDate) };
        const events = await eventService.getEvents(filters, options);
        res.json({ success: true, data: events });
    }
    catch (error) {
        next(error);
    }
};
exports.getEvents = getEvents;
const createEvent = async (req, res, next) => {
    try {
        const event = await eventService.createEvent(req.body, req.tenantId, req.user.id);
        res.status(201).json({ success: true, data: event });
    }
    catch (error) {
        next(error);
    }
};
exports.createEvent = createEvent;
const getEvent = async (req, res, next) => {
    try {
        const event = await eventService.getEventById(req.params.id, req.tenantId);
        res.json({ success: true, data: event });
    }
    catch (error) {
        next(error);
    }
};
exports.getEvent = getEvent;
const updateEvent = async (req, res, next) => {
    try {
        const event = await eventService.updateEvent(req.params.id, req.body, req.tenantId, req.user.id);
        res.json({ success: true, data: event });
    }
    catch (error) {
        next(error);
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res, next) => {
    try {
        await eventService.deleteEvent(req.params.id, req.tenantId, req.user.id);
        res.json({ success: true, message: 'Event deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteEvent = deleteEvent;
//# sourceMappingURL=event.controller.js.map