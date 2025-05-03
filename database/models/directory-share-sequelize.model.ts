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
import { Directory } from './directory-sequelize.model';

@Table({
  tableName: 'directory_shares',
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ['directory_id'] }
  ]
})
export class DirectoryShare extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  share_id: number;

  @ForeignKey(() => Directory)
  @Unique('directory_user_share_unique')
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  directory_id: number;

  @BelongsTo(() => Directory)
  directory: Directory;

  @Unique('directory_user_share_unique')
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

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  include_subdirectories: boolean;
}