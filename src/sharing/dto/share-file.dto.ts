import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FileUserPermissionDto } from './file-user-permission.dto';


export class ShareFileDto {
  @ApiProperty({
    description: 'List of users to share the file with',
    type: [FileUserPermissionDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileUserPermissionDto)
  users: FileUserPermissionDto[];
}