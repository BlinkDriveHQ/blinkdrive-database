# BlinkDrive Database Server

A NestJS and PostgreSQL-based REST API for managing metadata in the BlinkDrive Distributed File System.

## Overview

The Database Server maintains all metadata for the BlinkDrive system, including file and directory information, user permissions, sharing settings, and storage locations. It provides a comprehensive REST API for the BlinkDrive SOAP Server to query and manipulate this metadata.

## Features

- **Complete Metadata Management**: Tracks files, directories, permissions, and storage locations
- **RESTful API**: Clean, well-documented endpoints following RESTful principles
- **PostgreSQL Integration**: Robust relational database with Sequelize ORM
- **User Permissions**: Fine-grained access control for files and directories
- **File Sharing**: Support for sharing resources between users
- **Storage Analytics**: Reporting on storage usage across the system

## Requirements

- Node.js 16.x or higher
- PostgreSQL 13 or higher
- npm or yarn package manager

## Setup and Configuration

1. Clone the repository:

   ```bash
   git clone https://github.com/BlinkDriveHQ/blinkdrive-database.git
   cd blinkdrive-database
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with configuration:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=blinkdrive-distributed-storage
   PORT=3000
   ```

4. Create the database:

   ```bash
   psql -U postgres -c "CREATE DATABASE \"blinkdrive-distributed-storage\";"
   ```

5. Run database migrations:

   ```bash
   npm run migration:run
   ```

6. Start the server:

   ```bash
   npm run start:dev
   ```

## API Documentation

The API follows RESTful principles with the following main resources:

### Directories

- `GET /directories` - List all directories
- `GET /directories/:id` - Get directory details
- `GET /directories/parent/:parentId` - Get subdirectories
- `POST /directories` - Create a directory
- `PUT /directories/:id` - Update a directory
- `PUT /directories/:id/rename` - Rename a directory
- `PUT /directories/:id/move` - Move a directory
- `DELETE /directories/:id` - Delete a directory

### Files

- `GET /files` - List all files
- `GET /files/:id` - Get file details
- `GET /files/directory/:directoryId` - Get files in directory
- `POST /files` - Create file metadata
- `PUT /files/:id` - Update file metadata
- `PUT /files/:id/rename` - Rename a file
- `PUT /files/:id/move` - Move a file
- `DELETE /files/:id` - Delete a file

### Sharing

- `POST /sharing/file/:id` - Share a file
- `GET /sharing/file/:id` - Get file shares
- `POST /sharing/directory/:id` - Share a directory
- `GET /sharing/directory/:id` - Get directory shares
- `DELETE /sharing/file/:id` - Remove file share
- `DELETE /sharing/directory/:id` - Remove directory share

### Storage

- `GET /storage/report` - Get overall storage usage
- `GET /storage/report/directory/:id` - Get directory storage report
- `GET /storage/nodes` - Get all storage nodes

## Database Schema

The main tables in the system are:

- `directories` - Directory metadata
- `files` - File metadata
- `file_storage_locations` - Physical storage locations
- `storage_nodes` - Storage node information
- `file_shares` - File sharing records
- `directory_shares` - Directory sharing records
- `file_permissions` - File access permissions
- `directory_permissions` - Directory access permissions
- `file_operations_log` - Audit log of operations

## Development

### Project Structure

```md
/
├── src/
│   ├── app.module.ts           - Main module
│   ├── main.ts                 - Application entry point
│   ├── directories/            - Directories module
│   ├── files/                  - Files module
│   ├── sharing/                - Sharing module
│   ├── storage/                - Storage module
│   ├── resources/              - Common resources
│   └── database/               - Database configuration
├── database/
│   ├── models/                 - Sequelize models
│   └── postgres.db.ts          - DB connection config
├── scripts/
│   └── database.sql            - SQL schema definition
└── package.json                - Package configuration
```

### API Testing

The API can be tested using the built-in Swagger documentation:

```md
http://localhost:3000/api
```

### Running Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

For production deployment:

1. Build the application

   ```bash
   npm run build
   ```

2. Run with Node.js or using PM2

  ```bash
  npm run start:prod
  ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
