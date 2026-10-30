-- TidyFigure database tables. The installer creates these automatically;
-- {prefix} is replaced with your table prefix (default tf_).

CREATE TABLE IF NOT EXISTS `{prefix}settings` (
  `name` VARCHAR(64) NOT NULL PRIMARY KEY,
  `value` MEDIUMTEXT NOT NULL,
  `updated_at` INT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `{prefix}tools` (
  `slug` VARCHAR(80) NOT NULL PRIMARY KEY,
  `enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `title` VARCHAR(160) NOT NULL DEFAULT '',
  `description` VARCHAR(320) NOT NULL DEFAULT '',
  `noindex` TINYINT(1) NOT NULL DEFAULT 0,
  `updated_at` INT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `{prefix}admins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` INT UNSIGNED NOT NULL DEFAULT 0,
  `last_login` INT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `{prefix}login_attempts` (
  `ip` VARCHAR(45) NOT NULL PRIMARY KEY,
  `attempts` INT UNSIGNED NOT NULL DEFAULT 0,
  `last_at` INT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `{prefix}yt_cache` (
  `cache_key` CHAR(32) NOT NULL PRIMARY KEY,
  `body` TEXT NOT NULL,
  `fetched_at` INT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hosted QR codes (dynamic link, file and verification), deleted automatically after their expiry date.
CREATE TABLE IF NOT EXISTS `{prefix}qr_codes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(12) NOT NULL UNIQUE,
  `type` VARCHAR(10) NOT NULL,
  `title` VARCHAR(160) NOT NULL DEFAULT '',
  `target` TEXT NULL,
  `data` MEDIUMTEXT NULL,
  `file_name` VARCHAR(200) NOT NULL DEFAULT '',
  `file_path` VARCHAR(255) NOT NULL DEFAULT '',
  `file_type` VARCHAR(100) NOT NULL DEFAULT '',
  `file_size` INT UNSIGNED NOT NULL DEFAULT 0,
  `manage_hash` CHAR(64) NOT NULL,
  `ip_hash` CHAR(64) NOT NULL DEFAULT '',
  `scans` INT UNSIGNED NOT NULL DEFAULT 0,
  `last_scan_at` INT UNSIGNED NOT NULL DEFAULT 0,
  `status` VARCHAR(10) NOT NULL DEFAULT 'active',
  `reports` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` INT UNSIGNED NOT NULL DEFAULT 0,
  `expires_at` INT UNSIGNED NOT NULL DEFAULT 0,
  KEY `expires_at` (`expires_at`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `{prefix}qr_scans` (
  `qr_id` INT UNSIGNED NOT NULL,
  `day` DATE NOT NULL,
  `mobile` INT UNSIGNED NOT NULL DEFAULT 0,
  `desktop` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`qr_id`, `day`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Share pages people make without an account (friendship quiz, giveaway, wedding invitation) at /s/<code>.
-- The maker gets a secret code (only its hash is stored) to see entries, edit and delete. Deleted after expires_at.
CREATE TABLE IF NOT EXISTS `{prefix}shares` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(12) NOT NULL UNIQUE,
  `type` VARCHAR(12) NOT NULL,
  `title` VARCHAR(200) NOT NULL DEFAULT '',
  `data` MEDIUMTEXT NULL,
  `state` TEXT NULL,
  `image` VARCHAR(255) NOT NULL DEFAULT '',
  `manage_hash` CHAR(64) NOT NULL,
  `ip_hash` CHAR(64) NOT NULL DEFAULT '',
  `views` INT UNSIGNED NOT NULL DEFAULT 0,
  `entries` INT UNSIGNED NOT NULL DEFAULT 0,
  `status` VARCHAR(10) NOT NULL DEFAULT 'active',
  `reports` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` INT UNSIGNED NOT NULL DEFAULT 0,
  `updated_at` INT UNSIGNED NOT NULL DEFAULT 0,
  `expires_at` INT UNSIGNED NOT NULL DEFAULT 0,
  KEY `expires_at` (`expires_at`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quiz plays, giveaway entries and wedding RSVPs.
CREATE TABLE IF NOT EXISTS `{prefix}share_entries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `share_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL DEFAULT '',
  `uniq` VARCHAR(100) NOT NULL DEFAULT '',
  `data` TEXT NULL,
  `score` SMALLINT NOT NULL DEFAULT 0,
  `ip_hash` CHAR(64) NOT NULL DEFAULT '',
  `created_at` INT UNSIGNED NOT NULL DEFAULT 0,
  KEY `share_time` (`share_id`, `created_at`),
  KEY `share_uniq` (`share_id`, `uniq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Resource pages the site owner writes in the admin panel, at /r/<slug> (for links shared on social media).
CREATE TABLE IF NOT EXISTS `{prefix}resources` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `title` VARCHAR(200) NOT NULL DEFAULT '',
  `summary` VARCHAR(320) NOT NULL DEFAULT '',
  `body` MEDIUMTEXT NULL,
  `links` TEXT NULL,
  `image` VARCHAR(255) NOT NULL DEFAULT '',
  `status` VARCHAR(10) NOT NULL DEFAULT 'draft',
  `views` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` INT UNSIGNED NOT NULL DEFAULT 0,
  `updated_at` INT UNSIGNED NOT NULL DEFAULT 0,
  KEY `status` (`status`, `updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
