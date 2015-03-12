<?php

$dbServer = "localhost";
$dbUser = "root";
$dbName = "db_isaac";
$tblName = "t_highscore";

if ($_GET["aaction"] == 0) {

    // Datenbankverbindung aufbauen
    $mysqli = new mysqli($dbServer,$dbUser,"","");

    if ($mysqli->connect_errno) {

        echo "Keine Verbindung zum Datenbankserver möglich: " . $mysqli->connect_error;

    }else{

        // Zeichensatz setzen
        $mysqli->set_charset('utf8');

        //-------------------------------------------------------------------- //
        /*
        **  Befehlsausführungen, um die Datenbank anzulegen
        */

        // Query vorbereiten
        $sql = "create database if not exists ".$dbName;
        $result = $mysqli->query($sql);

        $sql = "alter database ".$dbName."default character set latin1 default collate latin1_german2_ci";
        $result = $mysqli->query($sql);

        $sql = "use ".$dbName;
        $result = $mysqli->query($sql);

        $sql = "create table if not exists ".$tblName."(
                    id MEDIUMINT NOT NULL AUTO_INCREMENT,
                    name CHAR(30) NOT NULL,
                    punkte DECIMAL(65),
                    PRIMARY KEY (id)
                ) engine=InnoDB";

        $result = $mysqli->query($sql);

    }

}else{

    // Datenbankverbindung aufbauen
    $mysqli = new mysqli($dbServer,$dbUser,"",$dbName);

    if ($mysqli->connect_errno) {

        echo "Keine Verbindung zum Datenbankserver möglich: " . $mysqli->connect_error;

    }else{

        // Zeichensatz setzen
        $mysqli->set_charset('utf8');

        if ($_GET["aaction"] == 1) {
            //-------------------------------------------------------------------- //
            /*
            **  Befehlsausführungen, um den Highscore zu schreiben
            */

            if ((isset($_GET['nname']) && $_GET['nname'] != "")) {

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
            }

            alert("Kein Name eingegeben!!!");

        } elseif ($_GET["aaction"] == 2) {
            //-------------------------------------------------------------------- //
            /*
            **  Befehlsausführungen, um den Highscore zu lesen
            */

            // Query vorbereiten
            $sql = "select Name, Punkte from ".$tblName." order by Punkte desc limit 5";

            //Übergabe an DB
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
            echo "</table>";

        }elseif ($_GET["aaction"] == 3) {
            //-------------------------------------------------------------------- //
            /*
            **  Befehlsausführungen, um den Highscore zu leeren
            */

            // Query vorbereiten
            $sql = "DELETE FROM ".$tblName;

            //Übergabe an DB
            $result = $mysqli->query($sql);

        }
    }
}
?>
