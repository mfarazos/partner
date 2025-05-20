/* eslint-disable prettier/prettier */
import { IsString, IsBoolean, IsNumber, IsArray, IsObject, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class DotDto {
  @IsNumber()
  @ApiProperty({ example: 112 })
  cx: number;

  @IsNumber()
  @ApiProperty({ example: 66.78125 })
  cy: number;

  @IsNumber()
  @ApiProperty({ example: 66.78125 })
  originalY: number;

  @IsNumber()
  @ApiProperty({ example: 0 })
  row: number;

  @IsNumber()
  @ApiProperty({ example: 0 })
  col: number;

  @IsOptional() 
  @IsNumber()
  @ApiProperty({ example: 0, required: false })
  id?: number;


}

class LabelDto {
  @IsString()
  @ApiProperty({ example: 'R 1' })
  label: string;

  @IsNumber()
  @ApiProperty({ example: 72 })
  x: number;

  @IsNumber()
  @ApiProperty({ example: 66.78125 })
  y: number;
}

class DotGroupDto {
  @IsObject()
  @ApiProperty({ example: { x: 112, y: 66.78125, width: 60, height: 15 } })
  bounds: Record<string, any>;

  @IsBoolean()
  @ApiProperty({ example: false })
  centerVenue: boolean;

  @IsNumber()
  @ApiProperty({ example: 5 })
  columns: number;

  @IsNumber()
  @ApiProperty({ example: 0 })
  curveIntensity: number;

  @IsArray()
  @ApiProperty({ type: [DotDto] })
  dots: DotDto[];

  @IsNumber()
  @ApiProperty({ example: 0 })
  seatMapId: number;

  @IsArray()
  @ApiProperty({ type: [LabelDto] })
  labels: LabelDto[];

  @IsBoolean()
  @ApiProperty({ example: false })
  leftVenue: boolean;

  @IsBoolean()
  @ApiProperty({ example: false })
  rightVenue: boolean;

  @IsNumber()
  @ApiProperty({ example: 0 })
  rotation: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  stretchFactor: number;
}

class SvgDto {
  @IsObject()
  @ApiProperty({ example: { x: 0, y: 0 } })
  position: Record<string, any>;
}

export class SeatMapDto {
  @IsString()
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  venueId: string;

  @IsArray()
  @ApiProperty({ type: [DotGroupDto] })
  dotGroups: DotGroupDto[];

  @IsOptional()
  @IsObject()
  @ApiProperty({ example: { x: 0, y: 0 }, required: false }) // Mark as optional in Swagger
  svg?: SvgDto;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '', required: false }) // Mark as optional in Swagger
  svgLink?: string;
}
