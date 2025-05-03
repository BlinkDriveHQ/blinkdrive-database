import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Directory } from 'database/models/directory-sequelize.model';
import { File } from 'database/models/file-sequelize.model';
import { StorageNode } from 'database/models/storage-node-sequelize.model';

@Injectable()
export class StorageService {
  constructor(
    @InjectModel(Directory)
    private directoryModel: typeof Directory,
    @InjectModel(File)
    private fileModel: typeof File,
    @InjectModel(StorageNode)
    private storageNodeModel: typeof StorageNode,
  ) { }

  async getStorageReport() {
    // Calculate total storage usage
    const allDirectories = await this.directoryModel.findAll({
      where: {
        parent_directory_id: null, // Root directories
      },
      include: [
        {
          model: File,
          as: 'files',
        },
        {
          model: Directory,
          as: 'subdirectories',
          include: [
            {
              model: File,
              as: 'files',
            },
          ],
        },
      ],
    });

    const report: {
      total_storage_bytes: number;
      used_storage_bytes: number;
      usage_percentage: number;
      directories: {
        directory_id: any;
        directory_name: any;
        size_bytes: number;
        file_count: number;
        subdirectory_count: any;
        subdirectories: any[];
        files?: any[];
      }[];
    } = {
      total_storage_bytes: 0,
      used_storage_bytes: 0,
      usage_percentage: 0,
      directories: [],
    };

    // Get total storage capacity from nodes
    const nodes = await this.storageNodeModel.findAll();
    report.total_storage_bytes = nodes.reduce(
      (sum, node) => sum + node.total_capacity_bytes,
      0,
    );

    // Calculate usage for each directory and build the report
    for (const dir of allDirectories) {
      const dirReport = await this.buildDirectoryReport(dir);
      report.used_storage_bytes += dirReport.size_bytes;
      report.directories.push(dirReport);
    }

    report.usage_percentage =
      (report.used_storage_bytes / report.total_storage_bytes) * 100;

    return report;
  }

  async getDirectoryStorageReport(directoryId: number) {
    const directory = await this.directoryModel.findByPk(directoryId, {
      include: [
        {
          model: File,
          as: 'files',
        },
        {
          model: Directory,
          as: 'subdirectories',
          include: [
            {
              model: File,
              as: 'files',
            },
          ],
        },
      ],
    });

    if (!directory) {
      throw new Error(`Directory with ID ${directoryId} not found`);
    }

    return this.buildDirectoryReport(directory);
  }

  async getStorageNodes() {
    const nodes = await this.storageNodeModel.findAll();

    return {
      nodes: nodes.map(node => ({
        node_id: node.node_id,
        node_name: node.node_name,
        ip_address: node.ip_address,
        port: node.port,
        total_capacity_bytes: node.total_capacity_bytes,
        available_capacity_bytes: node.available_capacity_bytes,
        usage_percentage:
          ((node.total_capacity_bytes - node.available_capacity_bytes) /
            node.total_capacity_bytes) * 100,
        status: node.status,
        last_heartbeat: node.last_heartbeat,
      })),
    };
  }

  private async buildDirectoryReport(directory: Directory) {
    // Calculate directory size
    let dirSize = 0;
    let fileCount = 0;
    const files: { file_id: number; file_name: string; file_size_bytes: number; file_type: string }[] = [];

    // Add files in this directory
    if (directory.files && directory.files.length > 0) {
      fileCount += directory.files.length;
      dirSize += directory.files.reduce(
        (sum, file) => sum + file.file_size_bytes,
        0
      );

      for (const file of directory.files) {
        files.push({
          file_id: file.file_id,
          file_name: file.file_name,
          file_size_bytes: file.file_size_bytes,
          file_type: file.file_type,
        });
      }
    }

    // Process subdirectories
    const subdirReports: {
      directory_id: number;
      directory_name: string;
      size_bytes: number;
      file_count: number;
      subdirectory_count: number;
      subdirectories: any[];
      files?: { file_id: number; file_name: string; file_size_bytes: number; file_type: string }[];
    }[] = [];

    if (directory.subdirectories && directory.subdirectories.length > 0) {
      for (const subdir of directory.subdirectories) {
        const subdirReport = await this.buildDirectoryReport(subdir);
        dirSize += subdirReport.size_bytes;
        fileCount += subdirReport.file_count || 0;
        subdirReports.push(subdirReport);
      }
    }

    // Update directory size in database
    await directory.update({ size_bytes: dirSize });

    return {
      directory_id: directory.directory_id,
      directory_name: directory.directory_name,
      size_bytes: dirSize,
      file_count: fileCount,
      subdirectory_count: directory.subdirectories?.length || 0,
      subdirectories: subdirReports,
      files: files.length > 0 ? files : undefined,
    };
  }
}