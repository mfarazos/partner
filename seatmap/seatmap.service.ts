/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SeatMap, SeatMapDocument } from './seatmap.schema';
import { SeatMapDto } from './dto/seatMap.dto';
import { UpdateSeatMapDto } from './dto/updateSetMap.dto';
import { GetSeatMapDto } from './dto/getSeatMap.dto';


@Injectable()
export class SeatmapService {
  constructor(
    @InjectModel(SeatMap.name)
    private readonly seatMapModel: Model<SeatMapDocument>,
  ) {}

  async createSeatMap(body: SeatMapDto): Promise<any> {
   
      
      try {
        const dataGroups = body.dotGroups;
        const venueId = body.venueId;
    
        const dotGroups = dataGroups.map((group) => {
          const dotsWithExtraFields = group.dots.map((dot) => ({
            ...dot,
            price: 0,
            images: [],
          }));
    
          return {
            ...group,
            venueId,
            dots: dotsWithExtraFields,
          };
        });
        // Save each group in MongoDB
        // Save each group in MongoDB
        await this.seatMapModel.insertMany(dotGroups);
        
        return {
          success: true,
          message: "successfully saved",
          data: { venueId, dotGroups},
        };
      } catch (error) {
        console.error("Error saving dot groups:", error);
      }

      
  
  }

  async updateSeatMap(body: UpdateSeatMapDto): Promise<any> {
   
    // // Validate that required fields are present
    // if (!body.venueId || !body.dotGroups) {
    //   throw new BadRequestException('Missing required fields');
    // }

    try {
      const dataGroups = body.dotGroups;
      const venueId = body.venueId;
      const responseData = [];
  
      for (const group of dataGroups) {
        const checkdata = await this.seatMapModel.findOne({ venueId, seatMapId: group.seatMapId });
  
        const dotsWithExtraFields = group.dots.map((dot) => ({
          ...dot,
          price: dot.price || 0,
          images: dot.images || [],
        }));
  
        const groupToSave = {
          ...group,
          venueId,
          dots: dotsWithExtraFields,
        };
  
        let savedData;
  
        if (checkdata) {
          await this.seatMapModel.updateOne(
            { venueId, seatMapId: group.seatMapId },
            { $set: groupToSave }
          );
          savedData = await this.seatMapModel.findOne({ venueId, seatMapId: group.seatMapId }); // updated data ko fetch karna
        } else {
          savedData = await this.seatMapModel.create(groupToSave);
        }
  
        responseData.push(savedData);
      }
  
      console.log("Dot groups processed successfully!");
      return {sucess: true, message: "sucessfully updated", data: responseData};
      
  
    } catch (error) {
      console.error("Error saving dot groups:", error);
      throw new BadRequestException("Error saving dot groups:", error);
    }

    

}

  async getSeatMap(query: GetSeatMapDto): Promise<any> {
   
    // Validate that required fields are present
    

    try {
      const venueId = query.venueId;
  
      // Save each group in MongoDB
      const seatMapData =  await this.seatMapModel.find({venueId: venueId});
      return seatMapData.map(doc => doc.toObject());

    // Save to the database
    return {sucess: true, message: "sucessfully saved"};
    } catch (error) {
      console.error("Error saving dot groups:", error);
    }

    

}
}
