import { IsArray, IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum PermissionLevel {
  READ = 'READ',
  WRITE = 'WRITE',
  FULL = 'FULL'
}

class ShareUserDto {
  @ApiProperty({
    description: 'ID of the user to share with',
    example: 2
  })
  @IsNumber()
  @IsPositive()
  user_id: number;

  @ApiProperty({
    description: 'Permission level to grant to the user',
    enum: PermissionLevel,
    example: 'READ',
    default: 'READ'
  })
  @IsEnum(PermissionLevel)
  @IsOptional()
  permission_level?: PermissionLevel;

  @ApiProperty({
    description: 'Expiry date of the share',
    example: '2025-05-19T10:35:00Z',
    required: false
  })
  @IsOptional()
  @IsDate()
  expiry_date?: Date;
}

class ShareDirectoryUserDto extends ShareUserDto {
  @ApiProperty({
    description: 'Whether to include subdirectories in the share',
    example: true,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  include_subdirectories?: boolean;
}

export class ShareFileDto {
  @ApiProperty({
    description: 'List of users to share with',
    type: [ShareUserDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShareUserDto)
  users: ShareUserDto[];
}

export class ShareDirectoryDto {
  @ApiProperty({
    description: 'List of users to share with',
    type: [ShareDirectoryUserDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShareDirectoryUserDto)
  users: ShareDirectoryUserDto[];
}