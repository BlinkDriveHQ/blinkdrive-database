import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany
} from 'sequelize-typescript';
import { FileStorageLocation } from './file-storage-location-sequelize.model';

@Table({ tableName: 'storage_nodes', timestamps: false })
export class StorageNode extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  node_id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  node_name: string;

  @Column({
    type: DataType.STRING(45),
    allowNull: false
  })
  ip_address: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  port: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false
  })
  total_capacity_bytes: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false
  })
  available_capacity_bytes: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['ACTIVE', 'INACTIVE', 'MAINTENANCE']]
    }
  })
  status: string;

  @Column(DataType.DATE)
  last_heartbeat: Date;

  // Define relationships
  @HasMany(() => FileStorageLocation, 'node_id')
  files: FileStorageLocation[];
}