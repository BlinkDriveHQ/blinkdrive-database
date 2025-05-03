import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from 'database/models/file-sequelize.model';
import { Directory } from 'database/models/directory-sequelize.model';
import { FileStorageLocation } from 'database/models/file-storage-location-sequelize.model';
import { StorageNode } from 'database/models/storage-node-sequelize.model';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FilesService {
    constructor(
        @InjectModel(File)
        private fileModel: typeof File,
        @InjectModel(Directory)
        private directoryModel: typeof Directory,
        @InjectModel(FileStorageLocation)
        private fileStorageLocationModel: typeof FileStorageLocation,
    ) { }

    async create(createFileDto: CreateFileDto): Promise<File> {
        // Verify directory exists
        const directoryExists = await this.directoryModel.findByPk(
            createFileDto.directory_id,
        );

        if (!directoryExists) {
            throw new NotFoundException('Directory not found');
        }

        // Create the file
        return this.fileModel.create({
            file_name: createFileDto.file_name,
            directory_id: createFileDto.directory_id,
            file_size_bytes: createFileDto.file_size_bytes,
            file_type: createFileDto.file_type || null,
            checksum: createFileDto.checksum || null,
            owner_user_id: createFileDto.owner_user_id
        });
    }

    findAll(): Promise<File[]> {
        return this.fileModel.findAll();
    }

    async findOne(id: number): Promise<File> {
        const file = await this.fileModel.findByPk(id, {
            include: [
                {
                    model: FileStorageLocation,
                    as: 'storageLocations',
                    include: [
                        {
                            model: StorageNode,
                            as: 'node',
                        },
                    ],
                },
            ],
        });

        if (!file) {
            throw new NotFoundException(`File with ID ${id} not found`);
        }

        return file;
    }

    findByDirectory(directoryId: number): Promise<File[]> {
        return this.fileModel.findAll({
            where: {
                directory_id: directoryId,
            },
        });
    }

    async update(id: number, updateFileDto: UpdateFileDto): Promise<File> {
        const file = await this.findOne(id);

        // If directory is being updated, verify it exists
        if (updateFileDto.directory_id) {
            const directoryExists = await this.directoryModel.findByPk(
                updateFileDto.directory_id,
            );
            if (!directoryExists) {
                throw new NotFoundException('Directory not found');
            }
        }

        await file.update(updateFileDto);
        return file;
    }

    async rename(id: number, newName: string): Promise<File> {
        const file = await this.findOne(id);
        await file.update({ file_name: newName });
        return file;
    }

    async move(id: number, newDirectoryId: number): Promise<File> {
        const file = await this.findOne(id);
        const directoryExists = await this.directoryModel.findByPk(newDirectoryId);

        if (!directoryExists) {
            throw new NotFoundException('Directory not found');
        }

        await file.update({ directory_id: newDirectoryId });
        return file;
    }

    async remove(id: number): Promise<void> {
        const file = await this.findOne(id);
        await file.destroy();
    }
}