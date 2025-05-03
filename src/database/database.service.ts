import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { InjectConnection } from '@nestjs/sequelize';

@Injectable()
export class DatabaseService {
    constructor(@InjectConnection() private readonly sequelize: Sequelize) { }

    async testConnection() {
        try {
            await this.sequelize.authenticate();
            return '✅ Conexión a PostgreSQL establecida correctamente';
        } catch (error) {
            throw new Error(
                '❌ Error al conectar a la base de datos: ' + error.message,
            );
        }
    }
}
