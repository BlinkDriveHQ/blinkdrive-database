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
  tableName: 'file_shares',
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ['file_id'] }
  ]
})
export class FileShare extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  share_id: number;

  @ForeignKey(() => File)
  @Unique('file_user_share_unique')
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  file_id: number;

  @BelongsTo(() => File)
  file: File;

  @Unique('file_user_share_unique')
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  shared_with_user_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  shared_by_user_id: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['READ', 'WRITE', 'FULL']]
    }
  })
  permission_level: string;

  @CreatedAt
  @Column({ field: 'share_date' })
  share_date: Date;

  @Column(DataType.DATE)
  expiry_date: Date;
}