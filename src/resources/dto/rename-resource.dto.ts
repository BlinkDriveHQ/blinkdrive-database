import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RenameFileDto {
  @ApiProperty({
    description: 'New name for the file',
    example: 'revised_presentation.pptx'
  })
  @IsString()
  @IsNotEmpty()
  file_name: string;
}

export class RenameDirectoryDto {
  @ApiProperty({
    description: 'New name for the directory',
    example: 'Revised Project'
  })
  @IsString()
  @IsNotEmpty()
  directory_name: string;
}