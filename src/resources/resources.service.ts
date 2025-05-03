// src/resources/resources.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Directory } from 'database/models/directory-sequelize.model';
import { File } from 'database/models/file-sequelize.model';
import { FileOperationsLog } from 'database/models/file-operations-log-sequelize.model';
import { MoveResourceDto } from './dto/move-resource.dto';
import { RenameDirectoryDto } from './dto/rename-resource.dto';
import { RenameFileDto } from './dto/rename-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectModel(Directory)
    private directoryModel: typeof Directory,
    @InjectModel(File)
    private fileModel: typeof File,
    @InjectModel(FileOperationsLog)
    private operationsLogModel: typeof FileOperationsLog,
  ) { }

  async moveFile(id: number, moveResourceDto: MoveResourceDto, userId: number): Promise<File> {
    // Verify file exists
    const file = await this.fileModel.findByPk(id);
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    // Verify target directory exists
    const targetDirectory = await this.directoryModel.findByPk(
      moveResourceDto.directory_id,
    );
    if (!targetDirectory) {
      throw new NotFoundException(`Target directory not found`);
    }

    const previousDirectoryId = file.directory_id;

    // Update file location
    await file.update({ directory_id: moveResourceDto.directory_id });

    // Log the operation
    await this.operationsLogModel.create({
      operation_type: 'MOVE',
      resource_type: 'FILE',
      resource_id: id,
      user_id: userId,
      details: JSON.stringify({
        previous_directory_id: previousDirectoryId,
        new_directory_id: moveResourceDto.directory_id,
      }),
    });

    return file;
  }

  async renameFile(id: number, renameFileDto: RenameFileDto, userId: number): Promise<File> {
    // Verify file exists
    const file = await this.fileModel.findByPk(id);
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    const previousName = file.file_name;

    // Update file name
    await file.update({ file_name: renameFileDto.file_name });

    // Log the operation
    await this.operationsLogModel.create({
      operation_type: 'UPDATE',
      resource_type: 'FILE',
      resource_id: id,
      user_id: userId,
      details: JSON.stringify({
        previous_name: previousName,
        new_name: renameFileDto.file_name,
      }),
    });

    return file;
  }

  async deleteFile(id: number, userId: number): Promise<void> {
    // Verify file exists
    const file = await this.fileModel.findByPk(id);
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    // Store file info for logging
    const fileInfo = {
      file_id: file.file_id,
      file_name: file.file_name,
      directory_id: file.directory_id,
    };

    // Delete the file
    await file.destroy();

    // Log the operation
    await this.operationsLogModel.create({
      operation_type: 'DELETE',
      resource_type: 'FILE',
      resource_id: id,
      user_id: userId,
      details: JSON.stringify(fileInfo),
    });
  }

  async moveDirectory(id: number, moveResourceDto: MoveResourceDto, userId: number): Promise<Directory> {
    // Verify directory exists
    const directory = await this.directoryModel.findByPk(id);
    if (!directory) {
      throw new NotFoundException(`Directory with ID ${id} not found`);
    }

    // Verify target directory exists
    const targetDirectory = await this.directoryModel.findByPk(
      moveResourceDto.directory_id,
    );
    if (!targetDirectory) {
      throw new NotFoundException(`Target directory not found`);
    }

    // Prevent circular reference
    if (moveResourceDto.directory_id === id) {
      throw new Error('Cannot move a directory into itself');
    }

    const previousParentId = directory.parent_directory_id;

    // Update directory location
    await directory.update({ parent_directory_id: moveResourceDto.directory_id });

    // Log the operation
    await this.operationsLogModel.create({
      operation_type: 'MOVE',
      resource_type: 'DIRECTORY',
      resource_id: id,
      user_id: userId,
      details: JSON.stringify({
        previous_parent_id: previousParentId,
        new_parent_id: moveResourceDto.directory_id,
      }),
    });

    return directory;
  }

  async renameDirectory(id: number, renameDirectoryDto: RenameDirectoryDto, userId: number): Promise<Directory> {
    // Verify directory exists
    const directory = await this.directoryModel.findByPk(id);
    if (!directory) {
      throw new NotFoundException(`Directory with ID ${id} not found`);
    }

    const previousName = directory.directory_name;

    // Update directory name
    await directory.update({ directory_name: renameDirectoryDto.directory_name });

    // Log the operation
    await this.operationsLogModel.create({
      operation_type: 'UPDATE',
      resource_type: 'DIRECTORY',
      resource_id: id,
      user_id: userId,
      details: JSON.stringify({
        previous_name: previousName,
        new_name: renameDirectoryDto.directory_name,
      }),
    });

    return directory;
  }

  async deleteDirectory(id: number, userId: number): Promise<void> {
    // Verify directory exists
    const directory = await this.directoryModel.findByPk(id);
    if (!directory) {
      throw new NotFoundException(`Directory with ID ${id} not found`);
    }

    // Store directory info for logging
    const directoryInfo = {
      directory_id: directory.directory_id,
      directory_name: directory.directory_name,
      parent_directory_id: directory.parent_directory_id,
    };

    // Delete the directory and all its contents (cascade delete should be defined in the model)
    await directory.destroy();

    // Log the operation
    await this.operationsLogModel.create({
      operation_type: 'DELETE',
      resource_type: 'DIRECTORY',
      resource_id: id,
      user_id: userId,
      details: JSON.stringify(directoryInfo),
    });
  }
}