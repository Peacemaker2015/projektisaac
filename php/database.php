<?php


if ($_GET["aaction"] == 0) {
// Erzeugen der Datenbank



} elseif ($_GET["aaction"] == 1) {

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

} elseif ($_GET["aaction"] == 2) {
    // Lesen aus der Datenbank

    // Verbindung aufbauen
    $mysqli = new mysqli("localhost", "root", "", "projektmm");

    // Verbindung mit dem MySQL-Server aufbauen
    if ($mysqli->connect_errno) {
        echo "Keine Verbindung zum Datenbankserver möglich: " . $mysqli->connect_error;
    }else{

        $mysqli->set_charset('utf8');

        // SQL-Abfrage der Namen und Punkte der besten 20 Spieler
        $sql = "select Name, Punkte from t_highscore order by Punkte desc limit 5";
        $result = $mysqli->query($sql);

        // Erstellen der Tabelle sowie des Tabellenkopfes für die Highscoreliste
        echo "<table class='bordered'>";
        echo "<tr id='tablehead'><th>Platz</th><th>Spielername</th><th>Punkte</th></tr>";

        // Einfügen der Einzelnen "Zeilen" aus der Highscore
        $i = 1;
        while($row = $result->fetch_object() ){
            if($i< 4) $pokale = "<img src=images/$i.png width=\"21px\">";
            else $pokale = $i;
            if ( ($row->Name) == $_GET['nname'] & ($row->Punkte) == $_GET['ppunkte']){

                echo "<tr id=aktiverspieler><td>$pokale</td><td>".$row->Name."</td><td>".$row->Punkte."</td></tr>";
                $row++;
            }
                else{

                    echo "<tr><td>$pokale</td><td>".$row->Name."</td><td>".$row->Punkte."</td></tr>";
                    $i = $i+1;
            }
        }
    }
    echo "</table>";
}

?>
