import { Module } from '@nestjs/common';
import { SharingService } from './sharing.service';
import { SharingController } from './sharing.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from 'database/models/file-sequelize.model';
import { Directory } from 'database/models/directory-sequelize.model';
import { FileShare } from 'database/models/file-share-sequelize.model';
import { DirectoryShare } from 'database/models/directory-share-sequelize.model';

@Module({
  imports: [SequelizeModule.forFeature([FileShare, DirectoryShare, File, Directory])],
  controllers: [SharingController],
  providers: [SharingService],
  exports: [SharingService],
})
export class SharingModule {}
