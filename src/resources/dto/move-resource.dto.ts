import { IsNumber, IsPositive, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MoveResourceDto {
    @ApiProperty({
        description: 'ID of the destination directory',
        example: 125
    })
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    directory_id: number; // For files, this is the destination directory
    // For directories, this is the new parent directory
}