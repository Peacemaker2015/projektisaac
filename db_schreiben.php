<?php

if ((isset($_GET['nname']) && $_GET['nname'] != "") {

$mysqli = new mysqli("localhost", "root", "", "projektmm");

// Verbindung mit dem MySQL-Server aufbauen
if ($mysqli->connect_errno) {
    echo "Keine Verbindung zum Datenbankserver möglich: " . $mysqli->connect_error;
}

$mysqli->set_charset('utf8');

// SQL-Statement vorbereiten (Preparted Statemant)
$sql = "INSERT INTO t_highscore (Name, Punkte) VALUES (?,?)";

//Übergabe an DB (String $sql an die Datenbank senden)
$result = $mysqli->prepare($sql);

// Namen und Punkte in Variablen binden
$result->bind_param(('".$_GET['nname']."', '".$_GET['ppunkte']."');

//ausführen
$result->execute();

//schließen
$result->close();

//------------------------//



//$sql = "INSERT INTO t_highscore (Name, Punkte) VALUES ('".$_GET['nname']."', '".$_GET['ppunkte']."');";


//Ergebnis der QUERY in die Variable $result schreiben (Ergebnis TRUE oder FALSE)
//$stmt = $mysqli->prepare($sql);
//$stmt->execute();

} // ENDE IF ISSET

?>
