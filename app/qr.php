<?php
// Hosted QR codes (filled in by the QR feature).
declare(strict_types=1);
function tf_qr_route(string $code, string $sub): void { http_response_code(404); }
