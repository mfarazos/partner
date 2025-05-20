/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { Module } from '@nestjs/common';

import { SeatMap, SeatMapSchema } from './seatmap.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SeatmapController } from './seatmap.controller';
import { SeatmapService } from './seatmap.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SeatMap.name, schema: SeatMapSchema },
    ]),
    
],
  controllers: [SeatmapController],
  providers: [SeatmapService]
})
export class SeatmapModule {}
