import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseService } from './database.service';
import * as dotenv from 'dotenv';
import { Directory } from '../../database/models/directory-sequelize.model';
import { DirectoryPermission } from '../../database/models/directory-permissions-sequelize.model';
import { File } from '../../database/models/file-sequelize.model';
import { FilePermission } from '../../database/models/file-permissions-sequelize.model';
import { StorageNode } from '../../database/models/storage-node-sequelize.model';
import { FileStorageLocation } from '../../database/models/file-storage-location-sequelize.model';
import { FileShare } from '../../database/models/file-share-sequelize.model';
import { DirectoryShare } from '../../database/models/directory-share-sequelize.model';
import { FileVersion } from '../../database/models/file-version-sequelize.model';
import { FileOperationsLog } from '../../database/models/file-operations-log-sequelize.model';

dotenv.config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // logging: process.env.NODE_ENV === 'development',
      autoLoadModels: true,
      synchronize: true, // Set to true in development if you want auto-sync
      models: [
        Directory,
        DirectoryPermission,
        File,
        FilePermission,
        StorageNode,
        FileStorageLocation,
        FileShare,
        DirectoryShare,
        FileVersion,
        FileOperationsLog
      ],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule { }