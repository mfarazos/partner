/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import {
  
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SeatmapService } from './seatmap.service';
import { SeatMapDto } from './dto/seatMap.dto';
import { UpdateSeatMapDto } from './dto/updateSetMap.dto';
import { GetSeatMapDto } from './dto/getSeatMap.dto';

@Controller('seatmap')
@ApiTags('seatMap') 
export class SeatmapController {
  constructor(private readonly seatmapService: SeatmapService) {}

  @ApiOperation({ summary: 'create-seatmap' })
    @ApiBody({ type: SeatMapDto }) // Attach DTO to the method for Swagger UI  // Description for the operation
    @ApiResponse({
      status: 200,
      description: 'create-seatmap SuccessFully',
    })
  @Post('create-seatmap')
  async createSeatMap(@Body() body: SeatMapDto) {
    return await this.seatmapService.createSeatMap(body);
  }

  @Put('updateSeatMap')
  async updateSeatMap(@Body() body: UpdateSeatMapDto) {
    return await this.seatmapService.updateSeatMap(body);
  }

  @Get('get-seatmap')
  async getSeatMap(@Query() query: GetSeatMapDto) {
    return await this.seatmapService.getSeatMap(query);
  }


}

