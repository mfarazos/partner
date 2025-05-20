/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SeatMapDocument = SeatMap & Document;



@Schema()
export class SeatMap {
  @Prop()
  venueId: string;

  @Prop({ type: Array })
  dots: any[];

  @Prop({ type: Object })
  bounds: Record<string, any>;

  @Prop()
  centerVenue: boolean;

  @Prop()
  columns: number;

  @Prop()
  curveIntensity: number;

  @Prop()
  seatMapId: number; // Renamed here to avoid conflict

  @Prop({ type: Array })
  labels: any[];

  @Prop()
  leftVenue: string;

  @Prop()
  rightVenue: string;

  @Prop()
  rotation: number;

  @Prop()
  stretchFactor: number;
  
  
}

export const SeatMapSchema = SchemaFactory.createForClass(SeatMap);
