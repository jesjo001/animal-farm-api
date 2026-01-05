import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/event.service';
import { container } from 'tsyringe';
import { getPaginationOptions } from '../utils/pagination.util';

const eventService = container.resolve(EventService);

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = getPaginationOptions(req.query);
    const filters: any = { tenantId: req.tenantId };

    if (req.query.eventType) filters.eventType = req.query.eventType;
    if (req.query.startDate) filters.date = { $gte: new Date(req.query.startDate as string) };
    if (req.query.endDate) filters.date = { ...filters.date, $lte: new Date(req.query.endDate as string) };

    const events = await eventService.getEvents(filters, options);
    res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.createEvent(req.body, req.tenantId!, req.user!.id);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.getEventById(req.params.id, req.tenantId!);
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body, req.tenantId!, req.user!.id);
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await eventService.deleteEvent(req.params.id, req.tenantId!, req.user!.id);
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};