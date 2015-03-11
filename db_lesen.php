<?php

$mysqli = new mysqli("localhost", "root", "", "projektmm");

// Verbindung mit dem MySQL-Server aufbauen
if ($mysqli->connect_errno) {
    echo "Keine Verbindung zum Datenbankserver möglich: " . $mysqli->connect_error;
}else{


$mysqli->set_charset('utf8');

// SQL-Abfrage der Namen und Punkte der besten 20 Spieler
$sql = "select Name, Punkte from t_highscore order by Punkte desc limit 5";
$result = $mysqli->query($sql);

//echo json_encode($result->fetch_all(MYSQLI_NUM));

// Erstellen der Tabelle sowie des Tabellenkopfes für die Highscoreliste
echo "<table class='bordered'>";
echo "<tr id='tablehead'><th>Platz</th><th>Spielername</th><th>Punkte</th></tr>";

// Einfügen der Einzelnen "Zeilen" aus der Highscore
$i = 1;
while($row = $result->fetch_object()){
	if($i< 4) $pokale = "<img src=images/$i.png width=\"21px\">";
	else $pokale = $i;
    echo "<tr><td>$pokale</td><td>".$row->Name."</td><td>".$row->Punkte."</td></tr>";
    $i = $i+1;
}
echo "</table>";
}
?>


