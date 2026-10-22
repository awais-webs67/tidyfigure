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
