<?php
declare(strict_types=1);
/** Verificación SOLO LECTURA de 001+002 en BD staging. */
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
if (!empty($argv[1])) putenv('IQ_APP_CONFIG=' . $argv[1]);
require __DIR__ . '/../backend/src/database.php';
try {
 $db=iqDatabase();
 $tables=(int) $db->query(
     "SELECT COUNT(*) FROM information_schema.TABLES
      WHERE TABLE_SCHEMA=DATABASE() AND TABLE_TYPE='BASE TABLE'"
 )->fetchColumn();
 $fks=(int) $db->query(
     "SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA=DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL"
 )->fetchColumn();
 $vers=$db->query(
     "SELECT version FROM schema_migrations ORDER BY version"
 )->fetchAll(PDO::FETCH_COLUMN);
 $methods=$db->query(
     "SELECT code,amount FROM shipping_methods ORDER BY sort_order"
 )->fetchAll();
 $ok=$tables===38 && $fks===44
     && in_array('001_initial',$vers,true)
     && in_array('002_commerce_gaps',$vers,true)
     && count($methods)>=3;
 echo json_encode(['ok'=>$ok,'tables'=>$tables,'foreign_keys'=>$fks,
     'migrations'=>$vers,'shipping_methods'=>$methods],
     JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR)."\n";
 exit($ok?0:1);
} catch (Throwable $e) {
 fwrite(STDERR, "Verificación 002 fallida: ".get_class($e)."\n");exit(1);
}
