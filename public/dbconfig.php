<?php namespace FGTA4;

// define('DB_CONFIG', [
// 	'FGTA' => [
// 	],

// 	'DSR' => [
// 		'DSN' => "firebird:dbname=172.18.10.11:DSR.FDB",
// 		'user' => "SYSDBA",
// 		'pass' => "Modul@Oblongata"
// 	],

// 	'KALISTA' => [
// 		'DSN' => "mysql:host=kalistadb-dev;dbname=kalista",
// 		'user' => "root",
// 		'pass' => "rahasia"
// 	],

// 	'ETAP' => [
// 		'DSN' => "mysql:host=kalistadb-dev;dbname=etapdb",
// 		'user' => "root",
// 		'pass' => "rahasia"
// 	]	
// ]);


define('DB_CONFIG', [
	'KALISTA' => [
		'DSN' => "mysql:host=kalistadb-dev;dbname=kalistadb",
		'user' => "root",
		'pass' => "rahasia"
	],

	'DSR' => [
		'DSN' => "firebird:dbname=172.18.10.11:DSR.FDB",
		'user' => "SYSDBA",
		'pass' => "Modul@Oblongata"
	],	

	'FRM2' => [
		'DSN' => 'dblib:host=172.18.10.20;dbname=E_FRM2_MGP',
		'user' => 'transminer',
		'pass' => 'rahasiatfi2012!*'	
	],

	'FRM2_WIN' => [
		'DSN' => 'sqlsrv:server=172.18.10.20;Database=E_FRM2_MGP',
		'user' => 'transminer',
		'pass' => 'rahasiatfi2012!*'	
	]	

]);



$GLOBALS['MAINDB'] = 'KALISTA';
$GLOBALS['MAINDBTYPE'] = 'mariadb';

$GLOBALS['MAIN_USERTABLE'] = 'kalistadb.fgt_user';
