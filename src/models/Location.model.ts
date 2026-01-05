import { Schema, model, Document } from 'mongoose';

export interface ILocation extends Document {
  tenantId: Schema.Types.ObjectId;
  name: string;
  type: 'barn' | 'pen' | 'field' | 'coop' | 'stable';
  capacity: number;
  description?: string;
}

const LocationSchema = new Schema<ILocation>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    type: {
      type: String,
      required: true,
      enum: ['barn', 'pen', 'field', 'coop', 'stable'],
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  }
);

export const Location = model<ILocation>('Location', LocationSchema);
