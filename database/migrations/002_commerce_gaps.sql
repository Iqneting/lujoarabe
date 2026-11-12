-- IQ Commerce POS V41 → MariaDB: entidades complementarias.
-- Depende de 001_initial. Reversible SOLO mediante plan formal; no DROP.
CREATE TABLE IF NOT EXISTS bank_accounts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  bank_name VARCHAR(120) NOT NULL,
  beneficiary_name VARCHAR(191) NOT NULL,
  clabe CHAR(18) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_bank_clabe_length CHECK (CHAR_LENGTH(clabe) = 18),
  KEY idx_bank_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shipping_methods (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(60) NOT NULL,
  label VARCHAR(150) NOT NULL,
  amount DECIMAL(13,2) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_shipmethod_code (code),
  CONSTRAINT chk_shipmethod_amount CHECK (amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS exchanges (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  return_id BIGINT UNSIGNED NOT NULL,
  replacement_variant_id BIGINT UNSIGNED NULL,
  quantity INT UNSIGNED NOT NULL,
  status ENUM('pending_fulfillment','preparing','shipped','fulfilled','cancelled') NOT NULL DEFAULT 'pending_fulfillment',
  carrier VARCHAR(120) NULL,
  tracking_number VARCHAR(120) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fulfilled_at DATETIME NULL,
  UNIQUE KEY uq_exchange_return (return_id),
  KEY idx_exchange_variant (replacement_variant_id),
  CONSTRAINT chk_exchange_qty CHECK (quantity > 0),
  CONSTRAINT fk_exchange_return FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE RESTRICT,
  CONSTRAINT fk_exchange_variant FOREIGN KEY (replacement_variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO shipping_methods (code,label,amount,is_active,sort_order)
VALUES ('estandar','Entrega estándar',99.00,1,1),
       ('express','Entrega express',149.00,1,2),
       ('recoger','Recoger en tienda',0.00,1,3)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO schema_migrations (version) VALUES ('002_commerce_gaps')
ON DUPLICATE KEY UPDATE version=VALUES(version);
