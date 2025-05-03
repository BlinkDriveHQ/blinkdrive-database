import { IsString, IsNumber, IsOptional, IsPositive, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDirectoryDto {
  @ApiProperty({
    description: 'Name of the directory',
    example: 'Project Documents'
  })
  @IsString()
  @IsNotEmpty()
  directory_name: string;

  @ApiProperty({
    description: 'ID of the parent directory',
    example: 10,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  parent_directory_id?: number;
  
  @ApiProperty({
    description: 'ID of the user who owns the directory',
    example: 1
  })
  @IsNumber()
  @IsPositive()
  owner_user_id: number;
}