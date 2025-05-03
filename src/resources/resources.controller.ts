// src/resources/resources.controller.ts
import {
    Controller,
    Put,
    Body,
    Param,
    Delete,
    ParseIntPipe,
    HttpStatus,
    HttpCode,
    Headers
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiHeader } from '@nestjs/swagger';
import { ResourcesService } from './resources.service';
import { MoveResourceDto } from './dto/move-resource.dto';
import { RenameFileDto } from './dto/rename-resource.dto';
import { RenameDirectoryDto } from './dto/rename-resource.dto';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
    constructor(private readonly resourcesService: ResourcesService) { }

    @Put('file/:id/move')
    @ApiOperation({ summary: 'Move a file' })
    @ApiParam({ name: 'id', description: 'File ID' })
    @ApiHeader({ name: 'user-id', description: 'ID of the user performing the operation' })
    @ApiResponse({ status: 200, description: 'File moved successfully' })
    @ApiResponse({ status: 404, description: 'File or target directory not found' })
    moveFile(
        @Param('id', ParseIntPipe) id: number,
        @Body() moveResourceDto: MoveResourceDto,
        @Headers('user-id') userIdHeader: string,
    ) {
        const userId = parseInt(userIdHeader, 10);
        return this.resourcesService.moveFile(id, moveResourceDto, userId);
    }

    @Put('file/:id/rename')
    @ApiOperation({ summary: 'Rename a file' })
    @ApiParam({ name: 'id', description: 'File ID' })
    @ApiHeader({ name: 'user-id', description: 'ID of the user performing the operation' })
    @ApiResponse({ status: 200, description: 'File renamed successfully' })
    @ApiResponse({ status: 404, description: 'File not found' })
    renameFile(
        @Param('id', ParseIntPipe) id: number,
        @Body() renameFileDto: RenameFileDto,
        @Headers('user-id') userIdHeader: string,
    ) {
        const userId = parseInt(userIdHeader, 10);
        return this.resourcesService.renameFile(id, renameFileDto, userId);
    }

    @Delete('file/:id')
    @ApiOperation({ summary: 'Delete a file' })
    @ApiParam({ name: 'id', description: 'File ID' })
    @ApiHeader({ name: 'user-id', description: 'ID of the user performing the operation' })
    @ApiResponse({ status: 204, description: 'File deleted successfully' })
    @ApiResponse({ status: 404, description: 'File not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteFile(
        @Param('id', ParseIntPipe) id: number,
        @Headers('user-id') userIdHeader: string,
    ) {
        const userId = parseInt(userIdHeader, 10);
        return this.resourcesService.deleteFile(id, userId);
    }

    @Put('directory/:id/move')
    @ApiOperation({ summary: 'Move a directory' })
    @ApiParam({ name: 'id', description: 'Directory ID' })
    @ApiHeader({ name: 'user-id', description: 'ID of the user performing the operation' })
    @ApiResponse({ status: 200, description: 'Directory moved successfully' })
    @ApiResponse({ status: 404, description: 'Directory or target directory not found' })
    moveDirectory(
        @Param('id', ParseIntPipe) id: number,
        @Body() moveResourceDto: MoveResourceDto,
        @Headers('user-id') userIdHeader: string,
    ) {
        const userId = parseInt(userIdHeader, 10);
        return this.resourcesService.moveDirectory(id, moveResourceDto, userId);
    }

    @Put('directory/:id/rename')
    @ApiOperation({ summary: 'Rename a directory' })
    @ApiParam({ name: 'id', description: 'Directory ID' })
    @ApiHeader({ name: 'user-id', description: 'ID of the user performing the operation' })
    @ApiResponse({ status: 200, description: 'Directory renamed successfully' })
    @ApiResponse({ status: 404, description: 'Directory not found' })
    renameDirectory(
        @Param('id', ParseIntPipe) id: number,
        @Body() renameDirectoryDto: RenameDirectoryDto,
        @Headers('user-id') userIdHeader: string,
    ) {
        const userId = parseInt(userIdHeader, 10);
        return this.resourcesService.renameDirectory(id, renameDirectoryDto, userId);
    }

    @Delete('directory/:id')
    @ApiOperation({ summary: 'Delete a directory' })
    @ApiParam({ name: 'id', description: 'Directory ID' })
    @ApiHeader({ name: 'user-id', description: 'ID of the user performing the operation' })
    @ApiResponse({ status: 204, description: 'Directory deleted successfully' })
    @ApiResponse({ status: 404, description: 'Directory not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteDirectory(
        @Param('id', ParseIntPipe) id: number,
        @Headers('user-id') userIdHeader: string,
    ) {
        const userId = parseInt(userIdHeader, 10);
        return this.resourcesService.deleteDirectory(id, userId);
    }
}