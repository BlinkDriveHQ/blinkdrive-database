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
import { Directory } from './directory-sequelize.model';

@Table({
  tableName: 'directory_permissions',
  timestamps: false,
  indexes: [
    { fields: ['directory_id'] },
    { fields: ['user_id'] }
  ]
})
export class DirectoryPermission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  permission_id: number;

  @ForeignKey(() => Directory)
  @Unique('directory_user_unique')
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  directory_id: number;

  @BelongsTo(() => Directory)
  directory: Directory;

  @Unique('directory_user_unique')
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