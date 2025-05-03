import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DirectoryUserPermissionDto } from './directory-user-permission.dto';

export class ShareDirectoryDto {
  @ApiProperty({
    description: 'List of users to share the directory with',
    type: [DirectoryUserPermissionDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DirectoryUserPermissionDto)
  users: DirectoryUserPermissionDto[];
}