-- Database Creation
CREATE DATABASE "blinkdrive-distributed-storage";

\c "blinkdrive-distributed-storage"

-- Directories Table
CREATE TABLE directories (
    directory_id SERIAL PRIMARY KEY,
    directory_name VARCHAR(255) NOT NULL,
    parent_directory_id INTEGER,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    size_bytes BIGINT DEFAULT 0,
    owner_user_id INTEGER NOT NULL,
    FOREIGN KEY (parent_directory_id) REFERENCES directories(directory_id) ON DELETE CASCADE
);

-- Directory Permissions Table
CREATE TABLE directory_permissions (
    permission_id SERIAL PRIMARY KEY,
    directory_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    can_view BOOLEAN DEFAULT TRUE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    can_share BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (directory_id) REFERENCES directories(directory_id) ON DELETE CASCADE,
    UNIQUE (directory_id, user_id)
);

-- Files Table
CREATE TABLE files (
    file_id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    directory_id INTEGER NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    file_type VARCHAR(100),
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    checksum VARCHAR(255),
    owner_user_id INTEGER NOT NULL,
    FOREIGN KEY (directory_id) REFERENCES directories(directory_id) ON DELETE CASCADE
);

-- File Permissions Table
CREATE TABLE file_permissions (
    permission_id SERIAL PRIMARY KEY,
    file_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    can_view BOOLEAN DEFAULT TRUE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    can_share BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE CASCADE,
    UNIQUE (file_id, user_id)
);

-- Storage Nodes Table
CREATE TABLE storage_nodes (
    node_id SERIAL PRIMARY KEY,
    node_name VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    port INTEGER NOT NULL,
    total_capacity_bytes BIGINT NOT NULL,
    available_capacity_bytes BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE')),
    last_heartbeat TIMESTAMP
);

-- File Storage Locations (for redundancy - files stored on multiple nodes)
CREATE TABLE file_storage_locations (
    location_id SERIAL PRIMARY KEY,
    file_id INTEGER NOT NULL,
    node_id INTEGER NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    storage_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE CASCADE,
    FOREIGN KEY (node_id) REFERENCES storage_nodes(node_id) ON DELETE CASCADE,
    UNIQUE (file_id, node_id)
);

-- File Shares Table (for sharing files with other users)
CREATE TABLE file_shares (
    share_id SERIAL PRIMARY KEY,
    file_id INTEGER NOT NULL,
    shared_with_user_id INTEGER NOT NULL,
    shared_by_user_id INTEGER NOT NULL,
    permission_level VARCHAR(20) NOT NULL CHECK (permission_level IN ('READ', 'WRITE', 'FULL')),
    share_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE CASCADE,
    UNIQUE (file_id, shared_with_user_id)
);

-- Directory Shares Table (for sharing directories with other users)
CREATE TABLE directory_shares (
    share_id SERIAL PRIMARY KEY,
    directory_id INTEGER NOT NULL,
    shared_with_user_id INTEGER NOT NULL,
    shared_by_user_id INTEGER NOT NULL,
    permission_level VARCHAR(20) NOT NULL CHECK (permission_level IN ('READ', 'WRITE', 'FULL')),
    share_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    include_subdirectories BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (directory_id) REFERENCES directories(directory_id) ON DELETE CASCADE,
    UNIQUE (directory_id, shared_with_user_id)
);

-- File Version History (for tracking changes)
CREATE TABLE file_versions (
    version_id SERIAL PRIMARY KEY,
    file_id INTEGER NOT NULL,
    version_number INTEGER NOT NULL,
    size_bytes BIGINT NOT NULL,
    modified_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by_user_id INTEGER NOT NULL,
    checksum VARCHAR(255),
    FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE CASCADE,
    UNIQUE (file_id, version_number)
);

-- File Operations Log (for auditing)
CREATE TABLE file_operations_log (
    log_id SERIAL PRIMARY KEY,
    operation_type VARCHAR(20) NOT NULL CHECK (operation_type IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'SHARE', 'MOVE')),
    resource_type VARCHAR(10) NOT NULL CHECK (resource_type IN ('FILE', 'DIRECTORY')),
    resource_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    operation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

-- Indexes for performance optimization
CREATE INDEX idx_files_directory_id ON files(directory_id);
CREATE INDEX idx_directories_parent_id ON directories(parent_directory_id);
CREATE INDEX idx_file_permissions_file_id ON file_permissions(file_id);
CREATE INDEX idx_file_permissions_user_id ON file_permissions(user_id);
CREATE INDEX idx_directory_permissions_directory_id ON directory_permissions(directory_id);
CREATE INDEX idx_directory_permissions_user_id ON directory_permissions(user_id);
CREATE INDEX idx_file_storage_file_id ON file_storage_locations(file_id);
CREATE INDEX idx_file_storage_node_id ON file_storage_locations(node_id);
CREATE INDEX idx_file_shares_file_id ON file_shares(file_id);
CREATE INDEX idx_directory_shares_directory_id ON directory_shares(directory_id);
CREATE INDEX idx_file_versions_file_id ON file_versions(file_id);
CREATE INDEX idx_operations_log_resource ON file_operations_log(resource_type, resource_id);