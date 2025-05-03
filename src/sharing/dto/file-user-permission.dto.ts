import { IsEnum, IsNumber, IsOptional, IsDate, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum PermissionLevel {
  READ = 'READ',
  WRITE = 'WRITE',
  FULL = 'FULL'
}

export class FileUserPermissionDto {
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
