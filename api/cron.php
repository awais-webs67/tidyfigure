<?php
// Daily cleanup of expired hosted QR codes. Add a cPanel cron job:  php /path/to/site/api/cron.php
// It only runs from the command line, so visitors can’t trigger it.
declare(strict_types=1);
define('TF_BASE', '');
require __DIR__ . '/../app/bootstrap.php';
require __DIR__ . '/../app/qr.php';
if (PHP_SAPI !== 'cli') { http_response_code(403); exit("Run from a cron job: php " . __FILE__ . "\n"); }
if (!tf_db()) exit("No database.\n");
tf_migrate();
echo 'Removed ' . tf_qr_cleanup(true) . " expired QR codes.\n";
