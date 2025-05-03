import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Directory } from 'database/models/directory-sequelize.model';
import { FileOperationsLog } from 'database/models/file-operations-log-sequelize.model';
import { File } from 'database/models/file-sequelize.model';

@Module({
  imports: [SequelizeModule.forFeature([Directory, File, FileOperationsLog])],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
