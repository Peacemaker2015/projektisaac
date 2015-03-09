<?php

$mysqli = new mysqli("localhost", "root", "", "projektmm");

// Verbindung mit dem MySQL-Server aufbauen
if ($mysqli->connect_errno) {
    echo "Keine Verbindung zum Datenbankserver möglich: " . $mysqli->connect_error;
}

$mysqli->set_charset('utf8');

$sql = "INSERT INTO t_highscore (Name, Punkte) VALUES ('".$_GET['nname']."', '".$_GET['ppunkte']."');";

    //Ergebnis der QUERY in die Variable $result schreiben (Ergebnis TRUE oder FALSE)
$stmt = $mysqli->prepare($sql);
$stmt->execute();

?>
