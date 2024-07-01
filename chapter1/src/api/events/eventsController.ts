import { StatusCodes } from "http-status-codes";
import { DeleteEventRequestSchema, EventModel, Events, GetEventRequestSchema, GetEventsRequestSchema, PostEventRequestSchema, PutEventRequestSchema } from "./eventsMode";
import {
    ResponseStatus,
    ServiceResponse,
} from "@/common/models/serviceResponse";
import { Request, Response } from "express";
import { logger } from "@/server";
// import { getDB } from "@/initializers/mongodb_intialiser";
// const db = getDB();




export const eventController = {
    createEvent: async (request: Request, response: Response): Promise<ServiceResponse<Events | null>> => {
        try {
            const event = {
                name: request.body.id,
                category: request.body.category,
                leadOrganiser: request.body.leadOrganiser,
                nOrganisers: request.body.nOrganisers,
                date: request.body.date,
                totalSeats: request.body.totalSeats,
                remainginSeats: request.body.totalSeats, //initially all seats are empty
                id: 1121215421, //dummy id to be changed
                managedBy: 'Mayank Mahajan' //dummy id employee to be changed
            };

            const eventData = await EventModel.create(event);
            return new ServiceResponse<Events>(
                ResponseStatus.Success,
                "Event Created Successfully",
                eventData,
                StatusCodes.CREATED
            );

        } catch (ex) {
            const errorMessage = `Error creating the event: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );

        }
    },

    getEvents: async (request: Request, response: Response): Promise<ServiceResponse<Events[] | null>> => {
        try {
            const eventData = await EventModel.find();
            if (!eventData) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "No Events found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }

            return new ServiceResponse(
                ResponseStatus.Success,
                "Events found",
                eventData,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = `Error fetching events: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    getEventById: async (req: Request): Promise<ServiceResponse<Events | null>> => {
        try {
            const eventData = await EventModel.findById(req.params.id);
            if (!eventData) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Event not found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Event found",
                eventData,
                StatusCodes.OK
            )
            } catch (ex) {
            const errorMessage = `Error fetching event by id: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    // updateEventById: async (req: Request): Promise<ServiceResponse<Events | null>> => {
    //     try {
    //         const d = {
    //             id: req.params.id,
    //             name: req.body.name,
    //             category: req.body.category,
    //             leadOrganiser: req.body.leadOrganiser,
    //             nOrganisers: req.body.nOrganisers,
    //             date: req.body.date,
    //             totalSeats: req.body.totalSeats,
    //             remainginSeats: req.body.remainginSeats,
    //         };
    //         const userData: any = await EventModel.findOneAndUpdate(
    //             { req.params.id },
    //             {
    //                 $set: { name: user.name,  },
    //             },
    //             { returnDocument: "after" }
    //         );
    //         if (!eventData) {
    //             return new ServiceResponse(
    //                 ResponseStatus.Failed,
    //                 "Event not found",
    //                 null,
    //                 StatusCodes.NOT_FOUND
    //             );
    //         }
    //         return new ServiceResponse(
    //             ResponseStatus.Success,
    //             "Event updated",
    //             eventData,
    //             StatusCodes.OK
    //         );
    //     } catch (ex) {
    //         const errorMessage = `Error updating event by id: $${(ex as Error).message}`;
    //         logger.error(errorMessage);
    //         return new ServiceResponse(
    //             ResponseStatus.Failed,
    //             errorMessage,
    //             null,
    //             StatusCodes.INTERNAL_SERVER_ERROR
    //         );
    //     }
    // },



};
