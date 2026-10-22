<?php
// The installer (/install/) writes config.php for you. If it can't (folder not writable),
// copy this file to config.php and fill in the database details from cPanel → MySQL Databases.
return [
    'db' => [
        'host' => 'localhost',
        'name' => 'cpaneluser_tidyfigure',
        'user' => 'cpaneluser_tfuser',
        'pass' => 'your-database-password',
        'prefix' => 'tf_',
    ],
];
