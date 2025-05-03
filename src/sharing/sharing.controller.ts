// src/sharing/sharing.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Headers
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiHeader } from '@nestjs/swagger';
import { SharingService } from './sharing.service';
import { ShareFileDto } from './dto/share-file.dto';
import { ShareDirectoryDto } from './dto/share-directory.dto';

@ApiTags('sharing')
@Controller('sharing')
export class SharingController {
  constructor(private readonly sharingService: SharingService) { }

  @Post('file/:id')
  @ApiOperation({ summary: 'Share a file with users' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiHeader({ name: 'user-id', description: 'ID of the user performing the share' })
  @ApiResponse({ status: 201, description: 'File shared successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  @HttpCode(HttpStatus.CREATED)
  shareFile(
    @Param('id', ParseIntPipe) id: number,
    @Body() shareFileDto: ShareFileDto,
    @Headers('user-id') userIdHeader: string,
  ) {
    const userId = parseInt(userIdHeader, 10);
    return this.sharingService.shareFile(id, shareFileDto, userId);
  }

  @Get('file/:id')
  @ApiOperation({ summary: 'Get all shares for a file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'Returns all shares for the file' })
  @ApiResponse({ status: 404, description: 'File not found' })
  getFileShares(@Param('id', ParseIntPipe) id: number) {
    return this.sharingService.getFileShares(id);
  }

  @Post('directory/:id')
  @ApiOperation({ summary: 'Share a directory with users' })
  @ApiParam({ name: 'id', description: 'Directory ID' })
  @ApiHeader({ name: 'user-id', description: 'ID of the user performing the share' })
  @ApiResponse({ status: 201, description: 'Directory shared successfully' })
  @ApiResponse({ status: 404, description: 'Directory not found' })
  @HttpCode(HttpStatus.CREATED)
  shareDirectory(
    @Param('id', ParseIntPipe) id: number,
    @Body() shareDirectoryDto: ShareDirectoryDto,
    @Headers('user-id') userIdHeader: string,
  ) {
    const userId = parseInt(userIdHeader, 10);
    return this.sharingService.shareDirectory(id, shareDirectoryDto, userId);
  }

  @Get('directory/:id')
  @ApiOperation({ summary: 'Get all shares for a directory' })
  @ApiParam({ name: 'id', description: 'Directory ID' })
  @ApiResponse({ status: 200, description: 'Returns all shares for the directory' })
  @ApiResponse({ status: 404, description: 'Directory not found' })
  getDirectoryShares(@Param('id', ParseIntPipe) id: number) {
    return this.sharingService.getDirectoryShares(id);
  }

  @Delete('file/:id')
  @ApiOperation({ summary: 'Remove a file share' })
  @ApiParam({ name: 'id', description: 'File Share ID' })
  @ApiResponse({ status: 204, description: 'File share removed successfully' })
  @ApiResponse({ status: 404, description: 'File share not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFileShare(@Param('id', ParseIntPipe) id: number) {
    return this.sharingService.removeShare(id, 'file');
  }

  @Delete('directory/:id')
  @ApiOperation({ summary: 'Remove a directory share' })
  @ApiParam({ name: 'id', description: 'Directory Share ID' })
  @ApiResponse({ status: 204, description: 'Directory share removed successfully' })
  @ApiResponse({ status: 404, description: 'Directory share not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeDirectoryShare(@Param('id', ParseIntPipe) id: number) {
    return this.sharingService.removeShare(id, 'directory');
  }
}