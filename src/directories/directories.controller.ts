// src/directories/directories.controller.ts
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
import { DirectoriesService } from './directories.service';
import { CreateDirectoryDto } from './dto/create-directory.dto';
import { UpdateDirectoryDto } from './dto/update-directory.dto';
import { RenameDirectoryDto } from '../resources/dto/rename-resource.dto';
import { MoveResourceDto } from '../resources/dto/move-resource.dto';

@ApiTags('directories')
@Controller('directories')
export class DirectoriesController {
  constructor(private readonly directoriesService: DirectoriesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new directory' })
  @ApiResponse({ status: 201, description: 'Directory created successfully' })
  @ApiResponse({ status: 404, description: 'Parent directory not found' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDirectoryDto: CreateDirectoryDto) {
    return this.directoriesService.create(createDirectoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all directories' })
  @ApiResponse({ status: 200, description: 'Returns all directories' })
  findAll() {
    return this.directoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get directory by ID' })
  @ApiParam({ name: 'id', description: 'Directory ID' })
  @ApiResponse({ status: 200, description: 'Returns the directory' })
  @ApiResponse({ status: 404, description: 'Directory not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.directoriesService.findOne(id);
  }

  @Get('parent/:parentId')
  @ApiOperation({ summary: 'Get directories by parent ID' })
  @ApiParam({ name: 'parentId', description: 'Parent Directory ID' })
  @ApiResponse({ status: 200, description: 'Returns directories with specified parent' })
  findByParent(@Param('parentId', ParseIntPipe) parentId: number) {
    return this.directoriesService.findByParent(parentId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a directory' })
  @ApiParam({ name: 'id', description: 'Directory ID' })
  @ApiResponse({ status: 200, description: 'Directory updated successfully' })
  @ApiResponse({ status: 404, description: 'Directory not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDirectoryDto: UpdateDirectoryDto,
  ) {
    return this.directoriesService.update(id, updateDirectoryDto);
  }

  @Put(':id/rename')
  @ApiOperation({ summary: 'Rename a directory' })
  @ApiParam({ name: 'id', description: 'Directory ID' })
  @ApiResponse({ status: 200, description: 'Directory renamed successfully' })
  @ApiResponse({ status: 404, description: 'Directory not found' })
  rename(
    @Param('id', ParseIntPipe) id: number,
    @Body() renameDirectoryDto: RenameDirectoryDto,
  ) {
    return this.directoriesService.rename(id, renameDirectoryDto.directory_name);
  }

  @Put(':id/move')
  @ApiOperation({ summary: 'Move a directory' })
  @ApiParam({ name: 'id', description: 'Directory ID' })
  @ApiResponse({ status: 200, description: 'Directory moved successfully' })
  @ApiResponse({ status: 404, description: 'Directory or target directory not found' })
  move(
    @Param('id', ParseIntPipe) id: number,
    @Body() moveResourceDto: MoveResourceDto,
  ) {
    return this.directoriesService.move(id, moveResourceDto.directory_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a directory' })
  @ApiParam({ name: 'id', description: 'Directory ID' })
  @ApiResponse({ status: 204, description: 'Directory deleted successfully' })
  @ApiResponse({ status: 404, description: 'Directory not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.directoriesService.remove(id);
  }

  @Get(':id/size')
  @ApiOperation({ summary: 'Calculate directory size' })
  @ApiParam({ name: 'id', description: 'Directory ID' })
  @ApiResponse({ status: 200, description: 'Returns the total size of the directory' })
  @ApiResponse({ status: 404, description: 'Directory not found' })
  calculateSize(@Param('id', ParseIntPipe) id: number) {
    return this.directoriesService.calculateSize(id).then(size => ({
      directory_id: id,
      total_size_bytes: size,
      total_size_formatted: this.formatBytes(size)
    }));
  }

  private formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}