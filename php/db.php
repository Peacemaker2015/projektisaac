<?php

// Verbindung zum DB-Server aufbauen
$mysqli = new mysqli("localhost", "root", "", "HS02_Gruppe_4");

if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: " . $mysqli->connect_errno;
}

$mysqli->set_charset('utf8') . "<br>";


// ---------------------------------------------------------
// Fallunterscheidung (Daten auslesen oder neuen Highscore eintragen)
// Flag(0) = Daten lesen
// Flag(1) = Daten schreiben
//Daten lesen
if ($_GET["flag"] == 0) {
    //SQL Statement für die DB-Abfrage
    $sql = "SELECT * from t_highscore order by punkte desc limit 15";
    //Ergebnis der QUERY in die Variable $result schreiben
    $result = $mysqli->query($sql);

    //HTML Code zur späteren Darstellung generieren

    echo "<table border=1>";
    echo "<tr><th>Spielername</th><th>Punkte</th><th>Level</th><th>Linien</th></tr>";
    while ($row = $result->fetch_object()) {
        echo "<tr>";
        echo "<td>" . $row->name . '</td>';
        echo "<td>" . $row->punkte . '</td>';
        echo "<td>" . $row->level . '</td>';
        echo "<td>" . $row->linien . '</td>';
        echo "</tr>";
    }
    echo "</table>";

//Daten schreiben
} elseif ($_GET["flag"] == 1) {

    $name = $_GET["nname"];
    $punkte = $_GET["ppunkte"];
    $level = $_GET["llevel"];
    $linien = $_GET["llinien"];

    //SQL Statement für die DB-Abfrage
    //$eintrag = "INSERT INTO t_highscore (name, punkte, level, linien) VALUES ('".$_GET["nname"]."', ".$_GET["ppunkte"].",'".$_GET["llevel"]."','".$_GET["llinien"]."');";
    $eintrag = "INSERT INTO t_highscore (name, punkte, level, linien) VALUES (?,?,?,?);";
    //Ergebnis der QUERY in die Variable $result schreiben (Ergebnis TRUE oder FALSE)
    $stmt = $mysqli->prepare($eintrag);
    $stmt->bind_param('ssss', $name, $punkte, $level, $linien);
    $stmt->execute();

    //Kontrolle ob die Daten in die DB geschrieben wurden
    if ($stmt == true) {
        echo "Eintrag war erfolgreich";
    } else {
        echo "Fehler beim Speichern";
    }


//Wenn Flag falsch oder nicht gesetzt wurde
} else {
    echo "Fehler bei den Übergabearametern";
}
?>
