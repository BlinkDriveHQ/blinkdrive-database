import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { DirectoriesModule } from './directories/directories.module';
import { FilesModule } from './files/files.module';
import { SharingModule } from './sharing/sharing.module';
import { StorageModule } from './storage/storage.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), DatabaseModule, DirectoriesModule, FilesModule, SharingModule, StorageModule, ResourcesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
