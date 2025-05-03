import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from 'database/models/file-sequelize.model';
import { Directory } from 'database/models/directory-sequelize.model';
import { FileStorageLocation } from 'database/models/file-storage-location-sequelize.model';
import { StorageNode } from 'database/models/storage-node-sequelize.model';

@Module({
  imports: [SequelizeModule.forFeature([Directory, File, StorageNode, FileStorageLocation])],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
