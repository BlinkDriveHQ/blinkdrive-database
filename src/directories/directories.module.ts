import { Module } from '@nestjs/common';
import { DirectoriesService } from './directories.service';
import { DirectoriesController } from './directories.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Directory } from 'database/models/directory-sequelize.model';
import { File } from 'database/models/file-sequelize.model';

@Module({
  imports: [SequelizeModule.forFeature([Directory, File])],
  providers: [DirectoriesService],
  controllers: [DirectoriesController],
  exports: [DirectoriesService],
})
export class DirectoriesModule { }
