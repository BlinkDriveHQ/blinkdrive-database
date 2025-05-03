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
  UpdatedAt,
  DefaultScope
} from 'sequelize-typescript';
import { File } from './file-sequelize.model';
import { DirectoryPermission } from './directory-permissions-sequelize.model';
import { DirectoryShare } from './directory-share-sequelize.model';

@DefaultScope(() => ({
  attributes: { exclude: [] },
}))
@Table({ tableName: 'directories', timestamps: true })
export class Directory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  directory_id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  directory_name: string;

  @ForeignKey(() => Directory)
  @Column(DataType.INTEGER)
  parent_directory_id: number;

  @BelongsTo(() => Directory, 'parent_directory_id')
  parentDirectory: Directory;

  @HasMany(() => Directory, 'parent_directory_id')
  subdirectories: Directory[];

  @CreatedAt
  @Column({ field: 'creation_date' })
  creation_date: Date;

  @UpdatedAt
  @Column({ field: 'last_modified_date' })
  last_modified_date: Date;

  @Column({
    type: DataType.BIGINT,
    defaultValue: 0
  })
  size_bytes: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  owner_user_id: number;

  // Define relationships
  @HasMany(() => File, 'directory_id')
  files: File[];

  @HasMany(() => DirectoryPermission, 'directory_id')
  permissions: DirectoryPermission[];

  @HasMany(() => DirectoryShare, 'directory_id')
  shares: DirectoryShare[];
}