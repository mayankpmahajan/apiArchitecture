import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import mongoose, { Schema, Model } from "mongoose";


extendZodWithOpenApi(z);

export type Events = z.infer<typeof EventSchema>;

export const EventSchema = z.object({
  id: z.number(),
  category: z.number(), // 1 for sessions 2 for conference
  name: z.string(),
  leadOrganiser: z.string(),
  nOrganisers: z.number(),
  managedBy: z.string(),
  date: z.date(),
  totalSeats: z.number(),
  remainingSeats: z.number(),
});

const EventMongooseSchema = new Schema<Events>({
  id: { type: Number, required: true },
  category: { type: Number, required: true },
  name: { type: String, required: true },
  leadOrganiser: { type: String, required: true },
  nOrganisers: { type: Number, required: true },
  managedBy: { type: String, required: true },
  date: { type: Date, required: true },
  totalSeats: { type: Number, required: true },
  remainingSeats: { type: Number, required: true },
});

EventMongooseSchema.index({ id: 1 }, { unique: true });

export const EventModel: Model<Events> = mongoose.model(
  "Event",
  EventMongooseSchema
);

export const GetEventsRequestSchema = z.object({
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
});

export const GetEventRequestSchema = z.object({
  params: z.object({ id: z.number() }),
});

export const PostEventRequestSchema = z.object({
  body: z.object({
    category: z.number(), // 1 for sessions 2 for conference
    name: z.string(),
    leadOrganiser: z.string(),
    nOrganisers: z.number(),
    date: z.date(),
    totalSeats: z.number(),
  }),
});

export const PutEventRequestSchema = z.object({
    body: z.object({
      category: z.number(), // 1 for sessions 2 for conference
      name: z.string(),
      leadOrganiser: z.string(),
      nOrganisers: z.number(),
      date: z.date(),
      totalSeats: z.number(),
      remainginSeats: z.number(),
    }),
  });

  export const DeleteEventRequestSchema = z.object({
    params: z.object({ id: z.number() }),
  });

