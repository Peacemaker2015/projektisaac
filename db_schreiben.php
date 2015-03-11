<?php

if ((isset($_GET['nname']) && $_GET['nname'] != "")) {

    // Datenbankverbindung aufbauen
$mysqli = new mysqli("localhost", "root", "", "projektmm");


if ($mysqli->connect_errno) {
    echo "Keine Verbindung zum Datenbankserver möglich: " . $mysqli->connect_error;
}

$mysqli->set_charset('utf8');

// Query vorbereiten
$sql = "INSERT INTO t_highscore (Name, Punkte) VALUES (?,?)";

//Übergabe an DB
$result = $mysqli->prepare($sql);

// Namen und Punkte in Variablen binden
$result->bind_param('si', $_GET['nname'], $_GET['ppunkte'] );

//ausführen
$result->execute();

//schließen
$result->close();

//------------------------//

//$sql = "INSERT INTO t_highscore (Name, Punkte) VALUES ('".$_GET['nname']."', '".$_GET['ppunkte']."');";


//Ergebnis der QUERY in die Variable $result schreiben (Ergebnis TRUE oder FALSE)
//$stmt = $mysqli->prepare($sql);
//$stmt->execute();

}

alert("Kein Name eingegeben!!!");

?>
