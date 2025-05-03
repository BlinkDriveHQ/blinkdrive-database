import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  Index
} from 'sequelize-typescript';

@Table({
  tableName: 'file_operations_log',
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ['resource_type', 'resource_id'] }
  ]
})
export class FileOperationsLog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  log_id: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['CREATE', 'READ', 'UPDATE', 'DELETE', 'SHARE', 'MOVE']]
    }
  })
  operation_type: string;

  @Index
  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['FILE', 'DIRECTORY']]
    }
  })
  resource_type: string;

  @Index
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  resource_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  user_id: number;

  @CreatedAt
  @Column({ field: 'operation_date' })
  operation_date: Date;

  @Column(DataType.TEXT)
  details: string;
}