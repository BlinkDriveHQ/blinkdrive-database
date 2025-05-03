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

@Table({
  tableName: 'file_versions',
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ['file_id'] }
  ]
})
export class FileVersion extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  version_id: number;

  @ForeignKey(() => File)
  @Unique('file_version_unique')
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  file_id: number;

  @BelongsTo(() => File)
  file: File;

  @Unique('file_version_unique')
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  version_number: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false
  })
  size_bytes: number;

  @CreatedAt
  @Column({ field: 'modified_date' })
  modified_date: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  modified_by_user_id: number;

  @Column(DataType.STRING(255))
  checksum: string;
}