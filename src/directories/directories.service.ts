import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Directory } from 'database/models/directory-sequelize.model';
import { File } from 'database/models/file-sequelize.model';
import { CreateDirectoryDto } from './dto/create-directory.dto';
import { UpdateDirectoryDto } from './dto/update-directory.dto';

@Injectable()
export class DirectoriesService {
    constructor(
        @InjectModel(Directory)
        private directoryModel: typeof Directory,
    ) { }

    async create(createDirectoryDto: CreateDirectoryDto): Promise<Directory> {
        // If parent directory is specified, verify it exists
        if (createDirectoryDto.parent_directory_id) {
            const parentExists = await this.directoryModel.findByPk(
                createDirectoryDto.parent_directory_id,
            );
            if (!parentExists) {
                throw new NotFoundException('Parent directory not found');
            }
        }

        return this.directoryModel.create(
            {
                directory_name: createDirectoryDto.directory_name,
                parent_directory_id: createDirectoryDto.parent_directory_id || null,
                owner_user_id: createDirectoryDto.owner_user_id
            }
        );
    }

    findAll(): Promise<Directory[]> {
        return this.directoryModel.findAll();
    }

    async findOne(id: number): Promise<Directory> {
        const directory = await this.directoryModel.findByPk(id, {
            include: [
                {
                    model: File,
                    as: 'files',
                },
                {
                    model: Directory,
                    as: 'subdirectories',
                },
            ],
        });

        if (!directory) {
            throw new NotFoundException(`Directory with ID ${id} not found`);
        }

        return directory;
    }

    findByParent(parentId: number): Promise<Directory[]> {
        return this.directoryModel.findAll({
            where: {
                parent_directory_id: parentId,
            },
        });
    }

    async update(
        id: number,
        updateDirectoryDto: UpdateDirectoryDto,
    ): Promise<Directory> {
        const directory = await this.findOne(id);

        // If parent directory is being updated, verify it exists
        if (updateDirectoryDto.parent_directory_id) {
            const parentExists = await this.directoryModel.findByPk(
                updateDirectoryDto.parent_directory_id,
            );
            if (!parentExists) {
                throw new NotFoundException('Parent directory not found');
            }
        }

        await directory.update(updateDirectoryDto);
        return directory;
    }

    async rename(id: number, newName: string): Promise<Directory> {
        const directory = await this.findOne(id);
        await directory.update({ directory_name: newName });
        return directory;
    }

    async move(id: number, newParentId: number): Promise<Directory> {
        const directory = await this.findOne(id);
        const parentExists = await this.directoryModel.findByPk(newParentId);

        if (!parentExists) {
            throw new NotFoundException('Parent directory not found');
        }

        await directory.update({ parent_directory_id: newParentId });
        return directory;
    }

    async remove(id: number): Promise<void> {
        const directory = await this.findOne(id);
        await directory.destroy();
    }

    async calculateSize(id: number): Promise<number> {
        // Calculate total size including files and subdirectories
        const directory = await this.findOne(id);
        let totalSize = 0;

        // Add file sizes
        if (directory.files && directory.files.length > 0) {
            totalSize += directory.files.reduce((sum, file) => sum + file.file_size_bytes, 0);
        }

        // Recursively calculate subdirectory sizes
        if (directory.subdirectories && directory.subdirectories.length > 0) {
            for (const subdir of directory.subdirectories) {
                totalSize += await this.calculateSize(subdir.directory_id);
            }
        }

        // Update directory size in database
        await directory.update({ size_bytes: totalSize });

        return totalSize;
    }
}
