CREATE DATABASE IF NOT EXISTS dispatcher;
USE dispatcher;

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(150) NOT NULL,
  contact_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NULL,
  phone VARCHAR(40) NULL,
  address VARCHAR(255) NULL,
  warehouse_phone VARCHAR(40) NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  email VARCHAR(160) NULL,
  license_number VARCHAR(80) NOT NULL UNIQUE,
  truck_number VARCHAR(80) NULL,
  driver_type ENUM('company', 'owner-operator') NOT NULL DEFAULT 'company',
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS containers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  container_number VARCHAR(50) NOT NULL UNIQUE,
  container_type VARCHAR(80) NOT NULL,
  equipment_type VARCHAR(40) NULL,
  booking_number VARCHAR(80) NULL,
  vessel_eta DATE NULL,
  size VARCHAR(20) NOT NULL,
  shipping_line VARCHAR(120) NULL,
  pickup_port VARCHAR(80) NULL,
  pickup_lfd DATE NULL,
  port_pickup_datetime DATETIME NULL,
  warehouse_customer_id INT NULL,
  warehouse_address VARCHAR(255) NULL,
  scac_code VARCHAR(20) NULL,
  seal_number VARCHAR(80) NULL,
  gate_code VARCHAR(80) NULL,
  pin_code VARCHAR(80) NULL,
  checked_in_code VARCHAR(80) NULL,
  status ENUM('available', 'in_transit', 'delivered', 'maintenance') NOT NULL DEFAULT 'available',
  current_location VARCHAR(160) NULL,
  customer_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_containers_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS ports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  city VARCHAR(120) NOT NULL,
  contact_phone VARCHAR(40) NULL,
  operating_hours VARCHAR(120) NULL,
  avg_turn_time VARCHAR(60) NULL,
  status VARCHAR(60) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS yards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  city VARCHAR(120) NOT NULL,
  capacity VARCHAR(80) NULL,
  utilization VARCHAR(80) NULL,
  manager VARCHAR(120) NULL,
  status VARCHAR(60) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS warehouses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  city VARCHAR(120) NOT NULL,
  address VARCHAR(255) NOT NULL,
  docks VARCHAR(80) NULL,
  contact_phone VARCHAR(40) NULL,
  status VARCHAR(60) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dispatches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dispatch_number VARCHAR(50) NOT NULL UNIQUE,
  customer_id INT NOT NULL,
  driver_id INT NULL,
  container_id INT NULL,
  dispatch_type VARCHAR(50) NULL,
  pickup_location VARCHAR(160) NOT NULL,
  pickup_address VARCHAR(255) NULL,
  pickup_date DATE NULL,
  pickup_time TIME NULL,
  delivery_location VARCHAR(160) NULL,
  delivery_address VARCHAR(255) NULL,
  delivery_date DATE NULL,
  delivery_time TIME NULL,
  dropoff_location VARCHAR(160) NOT NULL,
  scheduled_date DATETIME NOT NULL,
  status ENUM('pending', 'assigned', 'in_transit', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_dispatches_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_dispatches_driver
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_dispatches_container
    FOREIGN KEY (container_id) REFERENCES containers(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

SET @customerWarehousePhoneExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'customers' AND COLUMN_NAME = 'warehouse_phone'
);
SET @customerWarehousePhoneSql = IF(
  @customerWarehousePhoneExists = 0,
  'ALTER TABLE customers ADD COLUMN warehouse_phone VARCHAR(40) NULL AFTER address',
  'SELECT 1'
);
PREPARE customerWarehousePhoneStmt FROM @customerWarehousePhoneSql;
EXECUTE customerWarehousePhoneStmt;
DEALLOCATE PREPARE customerWarehousePhoneStmt;

SET @containerBookingNumberExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'containers' AND COLUMN_NAME = 'booking_number'
);
SET @containerBookingNumberSql = IF(
  @containerBookingNumberExists = 0,
  'ALTER TABLE containers ADD COLUMN booking_number VARCHAR(80) NULL AFTER container_type',
  'SELECT 1'
);
PREPARE containerBookingNumberStmt FROM @containerBookingNumberSql;
EXECUTE containerBookingNumberStmt;
DEALLOCATE PREPARE containerBookingNumberStmt;

SET @containerEquipmentTypeExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'containers' AND COLUMN_NAME = 'equipment_type'
);
SET @containerEquipmentTypeSql = IF(
  @containerEquipmentTypeExists = 0,
  'ALTER TABLE containers ADD COLUMN equipment_type VARCHAR(40) NULL AFTER container_type',
  'SELECT 1'
);
PREPARE containerEquipmentTypeStmt FROM @containerEquipmentTypeSql;
EXECUTE containerEquipmentTypeStmt;
DEALLOCATE PREPARE containerEquipmentTypeStmt;

SET @containerVesselEtaExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'containers' AND COLUMN_NAME = 'vessel_eta'
);
SET @containerVesselEtaSql = IF(
  @containerVesselEtaExists = 0,
  'ALTER TABLE containers ADD COLUMN vessel_eta DATE NULL AFTER booking_number',
  'SELECT 1'
);
PREPARE containerVesselEtaStmt FROM @containerVesselEtaSql;
EXECUTE containerVesselEtaStmt;
DEALLOCATE PREPARE containerVesselEtaStmt;

SET @containerShippingLineExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'containers' AND COLUMN_NAME = 'shipping_line'
);
SET @containerShippingLineSql = IF(
  @containerShippingLineExists = 0,
  'ALTER TABLE containers ADD COLUMN shipping_line VARCHAR(120) NULL AFTER size',
  'SELECT 1'
);
PREPARE containerShippingLineStmt FROM @containerShippingLineSql;
EXECUTE containerShippingLineStmt;
DEALLOCATE PREPARE containerShippingLineStmt;

SET @containerPickupPortExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'containers' AND COLUMN_NAME = 'pickup_port'
);
SET @containerPickupPortSql = IF(
  @containerPickupPortExists = 0,
  'ALTER TABLE containers ADD COLUMN pickup_port VARCHAR(80) NULL AFTER shipping_line',
  'SELECT 1'
);
PREPARE containerPickupPortStmt FROM @containerPickupPortSql;
EXECUTE containerPickupPortStmt;
DEALLOCATE PREPARE containerPickupPortStmt;

SET @containerPickupLfdExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'containers' AND COLUMN_NAME = 'pickup_lfd'
);
SET @containerPickupLfdSql = IF(
  @containerPickupLfdExists = 0,
  'ALTER TABLE containers ADD COLUMN pickup_lfd DATE NULL AFTER pickup_port',
  'SELECT 1'
);
PREPARE containerPickupLfdStmt FROM @containerPickupLfdSql;
EXECUTE containerPickupLfdStmt;
DEALLOCATE PREPARE containerPickupLfdStmt;

SET @containerPortPickupDatetimeExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'containers' AND COLUMN_NAME = 'port_pickup_datetime'
);
SET @containerPortPickupDatetimeSql = IF(
  @containerPortPickupDatetimeExists = 0,
  'ALTER TABLE containers ADD COLUMN port_pickup_datetime DATETIME NULL AFTER pickup_lfd',
  'SELECT 1'
);
PREPARE containerPortPickupDatetimeStmt FROM @containerPortPickupDatetimeSql;
EXECUTE containerPortPickupDatetimeStmt;
DEALLOCATE PREPARE containerPortPickupDatetimeStmt;

SET @containerWarehouseCustomerIdExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'containers' AND COLUMN_NAME = 'warehouse_customer_id'
);
SET @containerWarehouseCustomerIdSql = IF(
  @containerWarehouseCustomerIdExists = 0,
  'ALTER TABLE containers ADD COLUMN warehouse_customer_id INT NULL AFTER customer_id',
  'SELECT 1'
);
PREPARE containerWarehouseCustomerIdStmt FROM @containerWarehouseCustomerIdSql;
EXECUTE containerWarehouseCustomerIdStmt;
DEALLOCATE PREPARE containerWarehouseCustomerIdStmt;

SET @containerWarehouseAddressExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'containers' AND COLUMN_NAME = 'warehouse_address'
);
SET @containerWarehouseAddressSql = IF(
  @containerWarehouseAddressExists = 0,
  'ALTER TABLE containers ADD COLUMN warehouse_address VARCHAR(255) NULL AFTER warehouse_customer_id',
  'SELECT 1'
);
PREPARE containerWarehouseAddressStmt FROM @containerWarehouseAddressSql;
EXECUTE containerWarehouseAddressStmt;
DEALLOCATE PREPARE containerWarehouseAddressStmt;

SET @containerScacExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'containers' AND COLUMN_NAME = 'scac_code'
);
SET @containerScacSql = IF(
  @containerScacExists = 0,
  'ALTER TABLE containers ADD COLUMN scac_code VARCHAR(20) NULL AFTER shipping_line',
  'SELECT 1'
);
PREPARE containerScacStmt FROM @containerScacSql;
EXECUTE containerScacStmt;
DEALLOCATE PREPARE containerScacStmt;

SET @containerSealExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'containers' AND COLUMN_NAME = 'seal_number'
);
SET @containerSealSql = IF(
  @containerSealExists = 0,
  'ALTER TABLE containers ADD COLUMN seal_number VARCHAR(80) NULL AFTER scac_code',
  'SELECT 1'
);
PREPARE containerSealStmt FROM @containerSealSql;
EXECUTE containerSealStmt;
DEALLOCATE PREPARE containerSealStmt;

SET @containerGateExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'containers' AND COLUMN_NAME = 'gate_code'
);
SET @containerGateSql = IF(
  @containerGateExists = 0,
  'ALTER TABLE containers ADD COLUMN gate_code VARCHAR(80) NULL AFTER seal_number',
  'SELECT 1'
);
PREPARE containerGateStmt FROM @containerGateSql;
EXECUTE containerGateStmt;
DEALLOCATE PREPARE containerGateStmt;

SET @containerPinExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'containers' AND COLUMN_NAME = 'pin_code'
);
SET @containerPinSql = IF(
  @containerPinExists = 0,
  'ALTER TABLE containers ADD COLUMN pin_code VARCHAR(80) NULL AFTER gate_code',
  'SELECT 1'
);
PREPARE containerPinStmt FROM @containerPinSql;
EXECUTE containerPinStmt;
DEALLOCATE PREPARE containerPinStmt;

SET @containerCheckedInExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'containers' AND COLUMN_NAME = 'checked_in_code'
);
SET @containerCheckedInSql = IF(
  @containerCheckedInExists = 0,
  'ALTER TABLE containers ADD COLUMN checked_in_code VARCHAR(80) NULL AFTER pin_code',
  'SELECT 1'
);
PREPARE containerCheckedInStmt FROM @containerCheckedInSql;
EXECUTE containerCheckedInStmt;
DEALLOCATE PREPARE containerCheckedInStmt;

SET @dispatchTypeExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'dispatches' AND COLUMN_NAME = 'dispatch_type'
);
SET @dispatchTypeSql = IF(
  @dispatchTypeExists = 0,
  'ALTER TABLE dispatches ADD COLUMN dispatch_type VARCHAR(50) NULL AFTER container_id',
  'SELECT 1'
);
PREPARE dispatchTypeStmt FROM @dispatchTypeSql;
EXECUTE dispatchTypeStmt;
DEALLOCATE PREPARE dispatchTypeStmt;

SET @pickupAddressExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'dispatches' AND COLUMN_NAME = 'pickup_address'
);
SET @pickupAddressSql = IF(
  @pickupAddressExists = 0,
  'ALTER TABLE dispatches ADD COLUMN pickup_address VARCHAR(255) NULL AFTER pickup_location',
  'SELECT 1'
);
PREPARE pickupAddressStmt FROM @pickupAddressSql;
EXECUTE pickupAddressStmt;
DEALLOCATE PREPARE pickupAddressStmt;

SET @pickupDateExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'dispatches' AND COLUMN_NAME = 'pickup_date'
);
SET @pickupDateSql = IF(
  @pickupDateExists = 0,
  'ALTER TABLE dispatches ADD COLUMN pickup_date DATE NULL AFTER pickup_address',
  'SELECT 1'
);
PREPARE pickupDateStmt FROM @pickupDateSql;
EXECUTE pickupDateStmt;
DEALLOCATE PREPARE pickupDateStmt;

SET @pickupTimeExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'dispatches' AND COLUMN_NAME = 'pickup_time'
);
SET @pickupTimeSql = IF(
  @pickupTimeExists = 0,
  'ALTER TABLE dispatches ADD COLUMN pickup_time TIME NULL AFTER pickup_date',
  'SELECT 1'
);
PREPARE pickupTimeStmt FROM @pickupTimeSql;
EXECUTE pickupTimeStmt;
DEALLOCATE PREPARE pickupTimeStmt;

SET @deliveryLocationExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'dispatches' AND COLUMN_NAME = 'delivery_location'
);
SET @deliveryLocationSql = IF(
  @deliveryLocationExists = 0,
  'ALTER TABLE dispatches ADD COLUMN delivery_location VARCHAR(160) NULL AFTER pickup_time',
  'SELECT 1'
);
PREPARE deliveryLocationStmt FROM @deliveryLocationSql;
EXECUTE deliveryLocationStmt;
DEALLOCATE PREPARE deliveryLocationStmt;

SET @deliveryAddressExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'dispatches' AND COLUMN_NAME = 'delivery_address'
);
SET @deliveryAddressSql = IF(
  @deliveryAddressExists = 0,
  'ALTER TABLE dispatches ADD COLUMN delivery_address VARCHAR(255) NULL AFTER delivery_location',
  'SELECT 1'
);
PREPARE deliveryAddressStmt FROM @deliveryAddressSql;
EXECUTE deliveryAddressStmt;
DEALLOCATE PREPARE deliveryAddressStmt;

SET @deliveryDateExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'dispatches' AND COLUMN_NAME = 'delivery_date'
);
SET @deliveryDateSql = IF(
  @deliveryDateExists = 0,
  'ALTER TABLE dispatches ADD COLUMN delivery_date DATE NULL AFTER delivery_address',
  'SELECT 1'
);
PREPARE deliveryDateStmt FROM @deliveryDateSql;
EXECUTE deliveryDateStmt;
DEALLOCATE PREPARE deliveryDateStmt;

SET @deliveryTimeExists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dispatcher' AND TABLE_NAME = 'dispatches' AND COLUMN_NAME = 'delivery_time'
);
SET @deliveryTimeSql = IF(
  @deliveryTimeExists = 0,
  'ALTER TABLE dispatches ADD COLUMN delivery_time TIME NULL AFTER delivery_date',
  'SELECT 1'
);
PREPARE deliveryTimeStmt FROM @deliveryTimeSql;
EXECUTE deliveryTimeStmt;
DEALLOCATE PREPARE deliveryTimeStmt;

UPDATE dispatches
SET
  delivery_location = COALESCE(delivery_location, dropoff_location),
  pickup_date = COALESCE(pickup_date, DATE(scheduled_date)),
  pickup_time = COALESCE(pickup_time, TIME(scheduled_date)),
  delivery_date = COALESCE(delivery_date, DATE(scheduled_date)),
  delivery_time = COALESCE(delivery_time, TIME(scheduled_date))
WHERE
  delivery_location IS NULL
  OR pickup_date IS NULL
  OR pickup_time IS NULL
  OR delivery_date IS NULL
  OR delivery_time IS NULL;
