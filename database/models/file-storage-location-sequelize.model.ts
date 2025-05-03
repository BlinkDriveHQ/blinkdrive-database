import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  Unique,
  CreatedAt
} from 'sequelize-typescript';
import { File } from './file-sequelize.model';
import { StorageNode } from './storage-node-sequelize.model';

@Table({
  tableName: 'file_storage_locations',
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ['file_id'] },
    { fields: ['node_id'] }
  ]
})
export class FileStorageLocation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  location_id: number;

  @ForeignKey(() => File)
  @Unique('file_node_unique')
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  file_id: number;

  @BelongsTo(() => File)
  file: File;

  @ForeignKey(() => StorageNode)
  @Unique('file_node_unique')
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  node_id: number;

  @BelongsTo(() => StorageNode)
  node: StorageNode;

  @Column({
    type: DataType.STRING(512),
    allowNull: false
  })
  file_path: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  is_primary: boolean;

  @CreatedAt
  @Column({ field: 'storage_date' })
  storage_date: Date;
}