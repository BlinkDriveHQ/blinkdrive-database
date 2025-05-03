import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from 'database/models/file-sequelize.model';
import { Directory } from 'database/models/directory-sequelize.model';
import { FileStorageLocation } from 'database/models/file-storage-location-sequelize.model';
import { StorageNode } from 'database/models/storage-node-sequelize.model';

@Module({
  imports: [SequelizeModule.forFeature([File, Directory, FileStorageLocation, StorageNode])],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
