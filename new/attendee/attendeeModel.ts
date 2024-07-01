import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import mongoose, { Schema, Document, Model } from "mongoose";
import { ObjectId } from 'mongodb';


extendZodWithOpenApi(z);


export type Attendee = z.infer<typeof AttendeeSchema>;
export type Employee = z.infer<typeof EmployeeSchema>;
export type Organisers = z.infer<typeof OrganisersSchema>;
export type Event = z.infer<typeof EventSchema>;
export const EventSchema = z.object({
    id: z.number(),
    category: z.enum(['1','2']), // 1 for sessions 2 for conference
    name: z.string(),
    leadOrganiser: z.string(),
    nOrganisers: z.number(),
    managedBy: z.string(),
    date: z.date(),
    totalSeats: z.number(),
    remainingSeats: z.number(),
});

export const AttendeeSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    Eid: z.number(),
    Ename: z.string()
});

export const EmployeeSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    Eid: z.number(),
    Ename: z.string()
});

export const OrganisersSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    Eid: z.number(),
    Ename: z.string(),
    isLead: z.boolean(),
})



// +------------------------------------------+
export type UserAuth = z.infer<typeof UserAuthSchema>;
export const UserAuthSchema = z.object({
  phoneNumber: z.string().regex(/^\d{10}$/),
  mobileDeviceId: z.string(),
  messageType: z.number().min(0).max(1),
  loginType: z.number().min(0).max(1),
});

export type SendSMSResponse = z.infer<typeof SendSMSResponseSchema>;
export const SendSMSResponseSchema = z.object({
  encrypteOtp: z.string()
});
// Input Validation for 'Post userAuth/sendSms' endpoint
export const SendSMSRequestSchema = z.object({
  body: UserAuthSchema,
});
//user schema
export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  name: z.string().nullable(),
  gender: z.string().nullable(),
  dob: z.number().nullable(),
  address: z.string().nullable(),
  phoneNumber: z.string().regex(/^\d{10}$/),
  profileImage: z.string().nullable(),
  socialTokenKey: z.string().nullable(),
  emailId: z.string().email().nullable(),
  loginType: z.number(),
  updatedAt: z.string(),
});

//user schema for mongoose
const UserMongooseSchema = new Schema<User & Document>({
  name: { type: String, required: true },
  gender: { type: String, required: false },
  dob: { type: Number, required: false },
  address: { type: String, required: false },
  phoneNumber: { type: String, required: true },
  profileImage: { type: String, required: false },
  socialTokenKey: { type: String, required: false },
  emailId: { type: String, required: false },
  loginType: { type: Number, required: true },
});

// Add indexes
UserMongooseSchema.index({ phoneNumber: 1 }, { unique: true });

// Create and export model
export const UserModel: Model<User & Document> = mongoose.model(
  "User",
  UserMongooseSchema
);

//userDevice schema
export type UserDevice = z.infer<typeof UserDeviceSchema>;
export const UserDeviceSchema = z.object({
  userId: z.any(),
  mobileDeviceId: z.string(),
  platform: z.number(),
  firebaseToken: z.string(),
  isActive: z.number().min(0).max(1),
});

//UserDevice schema for mongoose
const UserDeviceMongooseSchema = new Schema<UserDevice & Document>({
  userId: { type: ObjectId, required: true },
  mobileDeviceId: { type: String, required: true },
  platform: { type: Number, required: true },
  firebaseToken: { type: String, required: true },
  isActive: { type: Number, required: true },
});

// Add indexes
UserDeviceMongooseSchema.index({ userId: 1 }, { unique: true });

// Create and export model
export const UserDeviceModel: Model<UserDevice & Document> = mongoose.model(
  "UserDevice",
  UserDeviceMongooseSchema
);

// Input Validation for 'GET userAuth/profile' endpoint
export const GetProfileRequestSchema = z.object({
  params: z.object({ userId: z.string(), mobileDeviceId: z.string() }),
  headers: z.object({ Authorization: z.string() }),
});
// Input Validation for 'put userAuth/profile' endpoint
const checkFileType = (file: File | null | undefined): boolean => {
  if (file?.name) {
    const allowedImageTypes: string[] = ["jpg", "jpeg", "png", "gif"]; // Add more image file extensions as needed
    const fileType = file.name.split(".").pop()?.toLowerCase();
    return fileType !== undefined && allowedImageTypes.includes(fileType);
  }
  return false;
};
export const PutProfileRequestSchema = z.object({
  body: z.object({
    userId: z.string(),
    name: z.string(),
    dob: z.string().transform(Number),
    gender: z.string(),
    address: z.string(),
    mobileDeviceId: z.string(),
    profileImage: z.custom<File>((file) => {
      // Validate that file is not null and of type File
      if (!file) {
        return true;
      }
      if (file && !(file instanceof File)) {
        throw new Error("File is required");
      }
      // Validate file type
      if (!checkFileType(file)) {
        throw new Error("Only .jpg, .jpeg, .png, .gif formats are supported.");
      }
      return true;
    }).openapi({
      description: 'Profile picture file',
      type: 'string',
      format: 'binary'
    })
  }),
});