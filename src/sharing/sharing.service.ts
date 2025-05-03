// src/sharing/sharing.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileShare } from 'database/models/file-share-sequelize.model';
import { DirectoryShare } from 'database/models/directory-share-sequelize.model';
import { File } from 'database/models/file-sequelize.model';
import { Directory } from 'database/models/directory-sequelize.model';
import { ShareFileDto } from './dto/share-file.dto';
import { ShareDirectoryDto } from './dto/share-directory.dto';

@Injectable()
export class SharingService {
  constructor(
    @InjectModel(FileShare)
    private fileShareModel: typeof FileShare,
    @InjectModel(DirectoryShare)
    private directoryShareModel: typeof DirectoryShare,
    @InjectModel(File)
    private fileModel: typeof File,
    @InjectModel(Directory)
    private directoryModel: typeof Directory,
  ) { }

  async shareFile(fileId: number, shareFileDto: ShareFileDto, sharedByUserId: number): Promise<FileShare[]> {
    // Verify file exists
    const fileExists = await this.fileModel.findByPk(fileId);
    if (!fileExists) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    // Create share records for each user
    const shares: FileShare[] = [];
    for (const user of shareFileDto.users) {
      const shareData = {
        file_id: fileId,
        shared_with_user_id: user.user_id,
        shared_by_user_id: sharedByUserId,
        permission_level: user.permission_level || 'READ',
        expiry_date: user.expiry_date,
      };

      // Check if the share already exists
      const existingShare = await this.fileShareModel.findOne({
        where: {
          file_id: fileId,
          shared_with_user_id: user.user_id,
        },
      });

      if (existingShare) {
        // Update existing share
        await existingShare.update(shareData);
        shares.push(existingShare);
      } else {
        // Create new share
        const share = await this.fileShareModel.create(shareData);
        shares.push(share);
      }
    }

    return shares;
  }

  async getFileShares(fileId: number): Promise<FileShare[]> {
    // Verify file exists
    const fileExists = await this.fileModel.findByPk(fileId);
    if (!fileExists) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    return this.fileShareModel.findAll({
      where: {
        file_id: fileId,
      },
    });
  }

  async shareDirectory(
    directoryId: number,
    shareDirectoryDto: ShareDirectoryDto,
    sharedByUserId: number
  ): Promise<DirectoryShare[]> {
    // Verify directory exists
    const directoryExists = await this.directoryModel.findByPk(directoryId);
    if (!directoryExists) {
      throw new NotFoundException(`Directory with ID ${directoryId} not found`);
    }

    // Create share records for each user
    const shares: DirectoryShare[] = [];
    for (const user of shareDirectoryDto.users) {
      const shareData = {
        directory_id: directoryId,
        shared_with_user_id: user.user_id,
        shared_by_user_id: sharedByUserId,
        permission_level: user.permission_level || 'READ',
        expiry_date: user.expiry_date,
        include_subdirectories: user.include_subdirectories !== false,
      };

      // Check if the share already exists
      const existingShare = await this.directoryShareModel.findOne({
        where: {
          directory_id: directoryId,
          shared_with_user_id: user.user_id,
        },
      });

      if (existingShare) {
        // Update existing share
        await existingShare.update(shareData);
        shares.push(existingShare);
      } else {
        // Create new share
        const share = await this.directoryShareModel.create(shareData);
        shares.push(share);
      }
    }

    return shares;
  }

  async getDirectoryShares(directoryId: number): Promise<DirectoryShare[]> {
    // Verify directory exists
    const directoryExists = await this.directoryModel.findByPk(directoryId);
    if (!directoryExists) {
      throw new NotFoundException(`Directory with ID ${directoryId} not found`);
    }

    return this.directoryShareModel.findAll({
      where: {
        directory_id: directoryId,
      },
    });
  }

  async removeShare(shareId: number, type: 'file' | 'directory'): Promise<void> {
    if (type === 'file') {
      const share = await this.fileShareModel.findByPk(shareId);
      if (!share) {
        throw new NotFoundException(`File share with ID ${shareId} not found`);
      }
      await share.destroy();
    } else {
      const share = await this.directoryShareModel.findByPk(shareId);
      if (!share) {
        throw new NotFoundException(`Directory share with ID ${shareId} not found`);
      }
      await share.destroy();
    }
  }
}