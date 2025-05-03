// src/storage/storage.controller.ts
import {
    Controller,
    Get,
    Param,
    ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StorageService } from './storage.service';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
    constructor(private readonly storageService: StorageService) { }

    @Get('report')
    @ApiOperation({ summary: 'Get storage usage report' })
    @ApiResponse({ status: 200, description: 'Returns storage usage report' })
    getStorageReport() {
        return this.storageService.getStorageReport();
    }

    @Get('report/directory/:id')
    @ApiOperation({ summary: 'Get storage report for a specific directory' })
    @ApiParam({ name: 'id', description: 'Directory ID' })
    @ApiResponse({ status: 200, description: 'Returns directory storage report' })
    @ApiResponse({ status: 404, description: 'Directory not found' })
    getDirectoryStorageReport(@Param('id', ParseIntPipe) id: number) {
        return this.storageService.getDirectoryStorageReport(id);
    }

    @Get('nodes')
    @ApiOperation({ summary: 'Get all storage nodes' })
    @ApiResponse({ status: 200, description: 'Returns all storage nodes information' })
    getStorageNodes() {
        return this.storageService.getStorageNodes();
    }
}