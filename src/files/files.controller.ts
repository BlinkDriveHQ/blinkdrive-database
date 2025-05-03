// src/files/files.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { RenameFileDto } from '../resources/dto/rename-resource.dto';
import { MoveResourceDto } from '../resources/dto/move-resource.dto';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new file' })
  @ApiResponse({ status: 201, description: 'File created successfully' })
  @ApiResponse({ status: 404, description: 'Directory not found' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all files' })
  @ApiResponse({ status: 200, description: 'Returns all files' })
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'Returns the file' })
  @ApiResponse({ status: 404, description: 'File not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.findOne(id);
  }

  @Get('directory/:directoryId')
  @ApiOperation({ summary: 'Get files by directory ID' })
  @ApiParam({ name: 'directoryId', description: 'Directory ID' })
  @ApiResponse({ status: 200, description: 'Returns files in specified directory' })
  findByDirectory(@Param('directoryId', ParseIntPipe) directoryId: number) {
    return this.filesService.findByDirectory(directoryId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File updated successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFileDto: UpdateFileDto,
  ) {
    return this.filesService.update(id, updateFileDto);
  }

  @Put(':id/rename')
  @ApiOperation({ summary: 'Rename a file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File renamed successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  rename(
    @Param('id', ParseIntPipe) id: number,
    @Body() renameFileDto: RenameFileDto,
  ) {
    return this.filesService.rename(id, renameFileDto.file_name);
  }

  @Put(':id/move')
  @ApiOperation({ summary: 'Move a file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File moved successfully' })
  @ApiResponse({ status: 404, description: 'File or target directory not found' })
  move(
    @Param('id', ParseIntPipe) id: number,
    @Body() moveResourceDto: MoveResourceDto,
  ) {
    return this.filesService.move(id, moveResourceDto.directory_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 204, description: 'File deleted successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.remove(id);
  }
}