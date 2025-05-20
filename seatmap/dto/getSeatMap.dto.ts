/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetSeatMapDto {
  @IsString()
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  venueId: string;

}