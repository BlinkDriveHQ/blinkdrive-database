import { IsString, IsNumber, IsOptional, IsPositive, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty({
    description: 'Name of the file',
    example: 'project_presentation.pptx'
  })
  @IsString()
  @IsNotEmpty()
  file_name: string;

  @ApiProperty({
    description: 'ID of the directory containing the file',
    example: 123
  })
  @IsNumber()
  @IsPositive()
  directory_id: number;

  @ApiProperty({
    description: 'Size of the file in bytes',
    example: 2097152
  })
  @IsNumber()
  @IsPositive()
  file_size_bytes: number;

  @ApiProperty({
    description: 'Type of the file',
    example: 'presentation/powerpoint',
    required: false
  })
  @IsOptional()
  @IsString()
  file_type?: string;

  @ApiProperty({
    description: 'Checksum of the file for integrity verification',
    example: 'a1b2c3d4e5f6g7h8i9j0',
    required: false
  })
  @IsOptional()
  @IsString()
  checksum?: string;

  @ApiProperty({
    description: 'ID of the user who owns the file',
    example: 1
  })
  @IsNumber()
  @IsPositive()
  owner_user_id: number;
}