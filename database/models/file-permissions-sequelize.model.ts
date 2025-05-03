import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  Unique
} from 'sequelize-typescript';
import { File } from './file-sequelize.model';

@Table({
  tableName: 'file_permissions',
  timestamps: false,
  indexes: [
    { fields: ['file_id'] },
    { fields: ['user_id'] }
  ]
})
export class FilePermission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  permission_id: number;

  @ForeignKey(() => File)
  @Unique('file_user_unique')
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  file_id: number;

  @BelongsTo(() => File)
  file: File;

  @Unique('file_user_unique')
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  user_id: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  can_view: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  can_edit: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  can_delete: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  can_share: boolean;
}