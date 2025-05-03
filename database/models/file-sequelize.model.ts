import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';
import { Directory } from './directory-sequelize.model';
import { FilePermission } from './file-permissions-sequelize.model';
import { FileShare } from './file-share-sequelize.model';
import { FileStorageLocation } from './file-storage-location-sequelize.model';
import { FileVersion } from './file-version-sequelize.model';

@Table({ tableName: 'files', timestamps: true })
export class File extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  file_id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  file_name: string;

  @ForeignKey(() => Directory)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  directory_id: number;

  @BelongsTo(() => Directory)
  directory: Directory;

  @Column({
    type: DataType.BIGINT,
    allowNull: false
  })
  file_size_bytes: number;

  @Column(DataType.STRING(100))
  file_type: string;

  @CreatedAt
  @Column({ field: 'creation_date' })
  creation_date: Date;

  @UpdatedAt
  @Column({ field: 'last_modified_date' })
  last_modified_date: Date;

  @Column(DataType.STRING(255))
  checksum: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  owner_user_id: number;

  // Define relationships
  @HasMany(() => FilePermission, 'file_id')
  permissions: FilePermission[];

  @HasMany(() => FileShare, 'file_id')
  shares: FileShare[];

  @HasMany(() => FileStorageLocation, 'file_id')
  storageLocations: FileStorageLocation[];

  @HasMany(() => FileVersion, 'file_id')
  versions: FileVersion[];
}