//------------------------------------------------------------------------------------------------------------ //
/*
*   Document   : game.js
*
*   Author     : Reichert, Tobias, OFR
*                Rothe, Martin, OFR
*
*   History:
*   2015-02-23  -
*   2015-02-26  TR  > Create Main-Game-Engine
*   2015-02-26  MR  > Implementation GUI
*   2015-03-03  TR  > Implementation Code encapsulation
*   2015-03-04  TR  > Implementation left and right direction
*                   > Fixed Errors
*   2015-03-05  MR  > Implementation Database connection
*   2015-03-10  TR  >
*   2015-03-11  TR  >
*   2015-03-12  TR  >
*   2015-03-17  TR  >
*   2015-03-18  TR  >
*   2015-03-19  TR  >
*/
//------------------------------------------------------------------------------------------------------------ //

function game(){
'use strict';

    //-------------------------------------------------------------------- //
    /*
    **  Befehlsausführungen, wenn das Browserfenster geöffnet bzw.
    **  geschlossen wird.
    */

    // Aktionen beim Laden des Browserfenstern
    window.onload = function(){

        // Datenbank wird (falls sie noch nicht vorhanden ist) angelegt
        createDatabase();

        // Spielstand wird geladen
        loadGame();

        // Spielfeld wird gezeichnet
        moveIsaac();
        drawIsaac();

        // Es wird überprüft, ob ein Spiel mit
        // ausreichender Spielzeit vorhanden ist
        if(isNaN(game.time) || game.time<=0 || game.time>=game.maxTime){

            // Wenn nicht, dann wird das Menü angezeigt
            onlymenu.click();

        }else{

            // Wenn ja, dann wird das vorhandene Spiel
            // angezeigt, aber noch nicht aktiviert
            game.active = false;
            game.show = "engine";

            // Andere Div-Elemente die nicht angezeigt
            // werden solle werden ausgeblendet
            onlymenubutton.classList.toggle("hidden");
            ammo.classList.toggle("hidden");
            time.classList.toggle("hidden");
            score.classList.toggle("hidden");
            kugel.classList.toggle("hidden");

            // PauseDiv einblenden
            pauseDiv.classList.toggle("hidden");
        }
    };

    // Aktionen beim Schließen des Browserfenstern
    window.onunload = function(){

        // Spiel wird gestoppt
        stopGame();

        // Spielstand wird gespeichert
        saveGame();
    };

//------------------------------------------------------------------------------------------------------------ //
/*
**  Bereich Dialoge
*/
//------------------------------------------------------------------------------------------------------------ //


    //-------------------------------------------------------------------- //
    /*
    **  Befehlsausführungen, für das Ausblenden
    **  des HauptmenüDIVs und Anzeigen des SpieleanleitungDIVs
    */

    // Elemente des DIVs werden in Variablen gespeichert
    var anleitungsDiv = document.getElementById("spielanleitungDiv");
    var impressumButton = document.getElementById("impressumButton");
    var anleitung = document.getElementById("anleitungButton");
    var zuruckButton = document.getElementById("zuruckAnleitungButton");


    // Funktion für den Eventlistener für die Buttons
    var hidemenu = function () {
        anleitungsDiv.classList.toggle("hidden");
        buttonsDiv.classList.toggle("hidden");
        impressumButton.classList.toggle("hidden");
    };

    // Eventlistener für den Button "Spielanleitung" und den "Zurück"
    anleitung.addEventListener("click", hidemenu);
    zuruckButton.addEventListener("click", hidemenu);


    //-------------------------------------------------------------------- //
    /*
    **  Befehlsausführungen, für das verschwinden lassen
    **  des HauptmenüDIVs und Anzeigen der Spiele-Engine
    **  mit dem kleinen Menü-Button
    */

    // Elemente des DIVs werden in Variablen gespeichert
    var time = document.getElementById("time");
    var ammo = document.getElementById("ammo");
    var score = document.getElementById("score");
    var kugel = document.getElementById("kugel");

    // "Großes" Hauptmenü
    var menu = document.getElementById("menu");
    var playGame = document.getElementById("spielstarten");

    // "Kleiner" Menü-Button
    var onlymenu = document.getElementById("onlymenu");
    var onlymenubutton = document.getElementById("onlymenubuttondiv");

    var showmenu = function () {
        menu.classList.toggle("hidden");
        onlymenubutton.classList.toggle("hidden");
    };

    // Funktion für den Eventlistener für das "große" Hauptmenü,
    // wenn das Spiel nicht läuft. Bei "Click" auf "Spiel satrten" wird der
    // "kleine" Menü-Button eingeblendet und das "große" Hauptmenü ausgeblendet
    var hidemenufornewgamebig = function (){

        // Andere Dinge werden verarbeitet
        menu.classList.toggle("hidden");
        onlymenubutton.classList.toggle("hidden");
        ammo.classList.toggle("hidden");
        time.classList.toggle("hidden");
        score.classList.toggle("hidden");
        kugel.classList.toggle("hidden");

        // Spiel wird gestartet
        if(isNaN(game.level) || game.level===null){

            // Spiel wird gestartet
            if(document.getElementById("Einfach").checked === true){
                startGame(1);
            }
            else if(document.getElementById("Mittel").checked === true){
                startGame(2);
            }
            else if(document.getElementById("Experte").checked === true){
                startGame(3);
            }
        }else{

            // Spiel wird gestartet
            startGame(game.level);
        }
        game.show = "engine";
    };

    // Funktion für den Eventlistener für den kleinen Menübutton oben links,
    // wenn das Hauptmenü ausgeblendet ist. Auf "Click" wird der Menü Button
    // ausgeblendet und das Hauptmenü eingeblendet
    var hidemenufornewgamesmall = function (){

        // Spiel wird gestoppt
        stopGame();

        // Andere Dinge werden verarbeitet
        menu.classList.toggle("hidden");
        onlymenubutton.classList.toggle("hidden");
        ammo.classList.toggle("hidden");
        time.classList.toggle("hidden");
        score.classList.toggle("hidden");
        kugel.classList.toggle("hidden");
        game.show = "menu";
    };

    // Eventlistener für den Button "Einstellungen" und den "Zurück"
    playGame.addEventListener("click", hidemenufornewgamebig);
    onlymenu.addEventListener("click", hidemenufornewgamesmall);


    //-------------------------------------------------------------------- //
    /*
    **  Befehlsausführungen, für das PauseDIVs
    */

    // Elemente des DIVs werden in Variablen gespeichert
    var pauseDiv = document.getElementById("pauseDiv");
    var weiterButton = document.getElementById("weiterButton");

    // Funktion für den Eventlistener für den Button "Weiter"
    var hidemenupause = function () {
        if(isNaN(game.level) || game.level===null){
            // Spiel wird gestartet
            if(document.getElementById("Einfach").checked === true){
                startGame(1);
            }
            else if(document.getElementById("Mittel").checked === true){
                startGame(2);
            }
            else if(document.getElementById("Experte").checked === true){
                startGame(3);
            }
        }else{
            // Spiel wird gestartet
            startGame(game.level);
        }
        // PauseDIV wird ausgeblendet
        pauseDiv.classList.toggle("hidden");
        // Andere Elemente ausblenden
        onlymenubutton.classList.toggle("hidden");
        ammo.classList.toggle("hidden");
        time.classList.toggle("hidden");
        score.classList.toggle("hidden");
        kugel.classList.toggle("hidden");
    };

    // Eventlistener für den Button "Weiter"
    weiterButton.addEventListener("click", hidemenupause);


    //-------------------------------------------------------------------- //
    /*
    **  Befehlsausführungen, für das verschwinden lassen
    **  des HauptmenüDIVs und Anzeigen des EinstellungenDIVs
    */

    // Elemente des DIVs werden in Variablen gespeichert
    var spieleinstellungenDiv = document.getElementById("spieleinestellungenDiv");
    var spieleinstellungenButton = document.getElementById("einstellungenButton");
    var zuruckButtonEinstellungen = document.getElementById("zuruckEinstellungenButton");
    var musikOnSchalter = document.getElementById("yes");
    var musikOffSchalter = document.getElementById("no");
    var soundOnSchalter = document.getElementById("on");
    var soundOffSchalter = document.getElementById("off");
    var levelSchalterEinfach = document.getElementById("Einfach");
    var levelSchalterMittel = document.getElementById("Mittel");
    var levelSchalterExperte = document.getElementById("Experte");
    var highscoreLeerenSchalter = document.getElementById("deleteYes");

    // Funktion für den Eventlistener für die Buttons
    var highscoreLeeren = function () {
        spieleinstellungenDiv.classList.toggle("hidden");
        abfrageDiv.classList.toggle("hidden");

    };

    var musicOn = function () {
        activateMusic();
    };

    var musicOff = function () {
        deactivateMusic();
    };

    var soundOn = function () {
        activateSound();
    };

    var soundOff = function () {
        deactivateSound();
    };

    var levelEinfach = function () {
        game.level = 1;
    };

    var levelMittel = function () {
        game.level = 2;
    };

    var levelExperte = function () {
        game.level = 3;
    };

    var hidemenusettings = function () {
        // Div wird ein- bzw. ausgeblendet
        spieleinstellungenDiv.classList.toggle("hidden");
        buttonsDiv.classList.toggle("hidden");
        impressumButton.classList.toggle("hidden");

        // Überprüfung, ob Musik aktivert oder deaktiviert ist
        // Danach setzen der "Schieberegler" im Div
        if(game.music===true){
            document.getElementById("yes").checked = true;
            document.getElementById("no").checked = false;
        }else if(game.music===false){
            document.getElementById("yes").checked = false;
            document.getElementById("no").checked = true;
        }

        // Überprüfung, ob Sound aktivert oder deaktiviert ist
        // Danach setzen der "Schieberegler" im Div
        if(game.sound===true){
            document.getElementById("on").checked = true;
            document.getElementById("off").checked = false;
        }else if(game.sound===false){
            document.getElementById("on").checked = false;
            document.getElementById("off").checked = true;
        }

        // Überprüfung, welches Level aktivert oder deaktiviert ist
        // Danach setzen der "Schieberegler" im Div
        if(game.level===1){
            document.getElementById("Einfach").checked = true;
            document.getElementById("Mittel").checked = false;
            document.getElementById("Experte").checked = false;
        }
        else if(game.level===2){
            document.getElementById("Einfach").checked = false;
            document.getElementById("Mittel").checked = true;
            document.getElementById("Experte").checked = false;
        }
        else if(game.level===3){
            document.getElementById("Einfach").checked = false;
            document.getElementById("Mittel").checked = false;
            document.getElementById("Experte").checked = true;
        }
    };

    // Eventlistener für die Buttons
    highscoreLeerenSchalter.addEventListener("click", highscoreLeeren);
    musikOnSchalter.addEventListener("click", musicOn);
    musikOffSchalter.addEventListener("click", musicOff);
    soundOnSchalter.addEventListener("click", soundOn);
    soundOffSchalter.addEventListener("click", soundOff);
    levelSchalterEinfach.addEventListener("click", levelEinfach);
    levelSchalterMittel.addEventListener("click", levelMittel);
    levelSchalterExperte.addEventListener("click", levelExperte);
    spieleinstellungenButton.addEventListener("click", hidemenusettings);
    zuruckButtonEinstellungen.addEventListener("click", hidemenusettings);


    //-------------------------------------------------------------------- //
    /*
    **  Befehlsausführungen, für das verschwinden lassen
    **  des HauptmenüDIVs und Anzeigen des HighscoreDIVs
    */

    // Elemente des DIVs werden in Variablen gespeichert
    var hightscoreDiv = document.getElementById("HighscoreDiv");
    var highscoreButton = document.getElementById("highscoreButton");
    var zuruckButtonHighscore = document.getElementById("zuruckHighscoreButton");

    // Funktion für den Eventlistener für die Buttons
    var hidemenuhighscore = function () {
        hightscoreDiv.classList.toggle("hidden");
        buttonsDiv.classList.toggle("hidden");
        impressumButton.classList.toggle("hidden");

        // Inhalt des DIVs "Tabelle" wieder zurücksetzen um alte Highscore zu löschen
        document.getElementById('tabelle').innerHTML = '';
        readHighscore(name, score);
    };

    // Eventlistener für den Button "Ja" und "Nein" beim HighscoreLöschenDialog
    highscoreButton.addEventListener("click", hidemenuhighscore);
    zuruckButtonHighscore.addEventListener("click", hidemenuhighscore);


    //-------------------------------------------------------------------- //
    /*
    **  Befehlsausführungen, für das verschwinden lassen
    **  des HauptmenüDIVs und Anzeigen des HighscoreDIVs
    */

    // Elemente des DIVs werden in Variablen gespeichert
    var abfrageDiv = document.getElementById("abfrageDiv");
    var abfrageJaButton = document.getElementById("abfrageJaButton");
    var abfrageNeinButton = document.getElementById("abfrageNeinButton");

    // Funktion um den Highscore zu löschen und den AbfrageDiv zu schließen und wieder die Einstellungen anzuzeigen
    var leerenJa = function () {
        dropHighscore();
        spieleinstellungenDiv.classList.toggle("hidden");
        abfrageDiv.classList.toggle("hidden");
        document.getElementById("deleteYes").checked = false;
        document.getElementById("deleteNo").checked = true;
    };

    // Funktion um den Highscore NICHT zu löschen und den AbfrageDiv zu schließen und wieder die Einstellungen anzuzeigen
    var leerenNein = function () {
        spieleinstellungenDiv.classList.toggle("hidden");
        abfrageDiv.classList.toggle("hidden");
        document.getElementById("deleteYes").checked = false;
        document.getElementById("deleteNo").checked = true;
    };

    // Eventlistener für den Button "Highscore" und den "Zurück"
    abfrageJaButton.addEventListener("click", leerenJa);
    abfrageNeinButton.addEventListener("click", leerenNein);


    //-------------------------------------------------------------------- //
    /*
    **  Befehlsausführungen, für das verschwinden lassen
    **  des HauptmenüDIVs und Anzeigen des HighScoreEintragenDivs
    **
    **  HINWEIS: Button "Eintragen" wird direkt aus der HTML-Datei
    **  die Funktion writeHighscore() aufrufen
    */

    // Elemente des DIVs werden in Variablen gespeichert
    var inputfeld = document.getElementById("name");
    var textName = document.getElementById("name");
    var frageHighscoreDIV = document.getElementById("eintragenHighscoreDiv");
    var sendenButton = document.getElementById("highscoreSendenButton");
    var zuruckMenuButton = document.getElementById("zurückzumMenüButton");

    // Funktion zum Anzeigen des HighScoreEintragenDivs
    var showHighscoreabfrage = function () {
        var text = "Wow, Du hast " + game.score + " Punkte !!!";
        document.getElementById("punkte").innerHTML = text;
        ammo.classList.toggle("hidden");
        time.classList.toggle("hidden");
        score.classList.toggle("hidden");
        kugel.classList.toggle("hidden");
        onlymenubutton.classList.toggle("hidden");
        frageHighscoreDIV.classList.toggle("hidden");
        textName.focus();
    }

    // Funktion für den Eventlistener für die Buttons
    var hideAbfrageHighscore = function () {
        menu.classList.toggle("hidden");
        frageHighscoreDIV.classList.toggle("hidden");
    }

    var inputText = function (e) {
        var keyCode= e.keyCode;
        if ((keyCode > 47 && keyCode < 58) || (keyCode > 64 && keyCode < 123))  {
            inputfeld.style.border= "3px solid #3498db";
        }
        else{
            inputfeld.style.border= "3px solid #ff0000";

            e.preventDefault();
        }
    }

    var enterName = function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            writeHighscore();
        }
    }

    // Eventlistener für den Button "Zurück"
    inputfeld.addEventListener('keypress', inputText);
    textName.addEventListener("keydown", enterName);
    zuruckMenuButton.addEventListener("click",hideAbfrageHighscore);
    sendenButton.addEventListener("click", writeHighscore);


    //-------------------------------------------------------------------- //
    /*
    **  Befehlsausführungen, für das verschwinden lassen
    **  des HauptmenüDIVs und Anzeigen des Impressums
    **
    */

    // Elemente des DIVs werden in Variablen gespeichert
    var impressumDiv = document.getElementById("impressumDiv");
    var zuruckImpressumButton = document.getElementById("zuruckImpressumButton");

   // Funktion für den Eventlistener für die Buttons
    var hidemenuSettings = function () {
        impressumDiv.classList.toggle("hidden");
        buttonsDiv.classList.toggle("hidden");
        impressumButton.classList.toggle("hidden");
    };

    // Eventlistener für den Button "Spielanleitung" und den "Zurück"
    impressumButton.addEventListener("click", hidemenuSettings);
    zuruckImpressumButton.addEventListener("click", hidemenuSettings);


//------------------------------------------------------------------------------------------------------------ //
/*
**  Bereich Spiel
*/
//------------------------------------------------------------------------------------------------------------ //

    // Spielfeld vorbereiten
    var game = new createGame();

    // Canvas vorbereiten
    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');

    // Listener hinzufügen
    canvas.addEventListener("mousedown", mousedownGame, false);
    document.addEventListener('keydown', keydownGame);

    /* Dinge für das Spiel (allgemein) */
    function activateMusic() {
        document.getElementById('background_music').muted = false;
        game.music = true;
    }

    function deactivateMusic() {
        document.getElementById('background_music').muted = true;
        game.music = false;
    }

    function activateSound() {
        game.sound = true;
    }

    function deactivateSound() {
        game.sound = false;
    }

    function playSound(elementID){
        document.getElementById(elementID).load();
        document.getElementById(elementID).play();
    }

    function createGame(){

        // Speicher mit Isaac`s wird angelegt
        this.isaac = [];

        // Elemente für die Spieleinstellungen
        this.level = null;
        this.music = true;
        this.sound = true;

        // Elemente für das Spiel selbst
        this.maxTime = 5;
        this.time = null;
        this.score = null;
        this.ammo = null;

        // Elemente für das Handling zwischen Menü und Engine
        this.show = null;
        this.active = true;

        // Timer werden angelegt
        this.timeTimer;
        this.moveTimer;
        this.isaacTimer;
    }

    function loadGame(){

        // Wenn keine Spielzeit (kleiner-gleich-0) mehr vorhanden ist,
        // dann werden Standardwerte geladen bzw. gesetzt
        if(game.time<=0){
            // Spielfeld leeren
            ctx.clearRect(0,0,1024,768);
            // Speicher für Isaac`s leeren
            game.isaac = [];
            // Punktestand wird geladen
            game.score = parseInt(window.localStorage.getItem("GameScore"));
            // Munition wird geladen
            game.ammo = parseInt(window.localStorage.getItem("GameAmmo"));
            // Spielzeit wird geladen
            game.time = parseInt(window.localStorage.getItem("GameTime"));
            // Punktestand wird überprüft
            if(isNaN(game.score) || game.time<=0){
                game.score = 0;
            }
            // Punktestand wird angezeigt
            document.getElementById('score').innerHTML = game.score;
            // Munition wird überprüft
            if(isNaN(game.ammo) || game.time<=0){
                game.ammo = 10;
                document.getElementById('ammo').setAttribute( "class", "");
            }
            document.getElementById('ammo').innerHTML = game.ammo;
            // Spielzeit wird überprüft
            if(isNaN(game.time) || game.time<=0){
                game.time = game.maxTime;
            }
            document.getElementById('time').innerHTML = game.time;
            // Isaac`s werden geladen
            var i=0;
            var found = 1;
            while(found===1){
                // Überprüfen, ein bzw. ein weiterer
                // oder kein bzw. kein Isaac mehr gefunden
                if((window.localStorage.getItem("Isaac"+i)===null)){
                    // Variable umlegen
                    found=0;
                }else{
                    // Isaac generieren und in den internen Speicher ablegen
                    game.isaac.push(new createIsaac(""));
                    // Laden x und y Koordinaten
                    game.isaac[i].y = parseInt(window.localStorage.getItem("Isaac"+i+".y"));
                    game.isaac[i].x = parseInt(window.localStorage.getItem("Isaac"+i+".x"));
                    // Laden des Trefferstatuses
                    game.isaac[i].hit = window.localStorage.getItem("Isaac"+i+".hit");
                    // Laden der Geschwindigkeit
                    game.isaac[i].speed = window.localStorage.getItem("Isaac"+i+".speed");
                    // Laden der Flugrichtung
                    game.isaac[i].direction = window.localStorage.getItem("Isaac"+i+".direction");
                    // Laden der Größe
                    game.isaac[i].scale = window.localStorage.getItem("Isaac"+i+".scale");
                }
                // Zähler hochzählen
                i++;
            }
        }

        // Level wird geladen
        game.level = parseInt(window.localStorage.getItem("GameLevel"));
        // Wenn kein oder ein ungültiges Level geladen wurde, dann wird anhand
        // der Spieleeinstellungen entschieden, welches Level geladen wird.
        if (isNaN(game.level) || game.level===null){
            // Level 1
            if(document.getElementById("Einfach").checked === true){
                game.level = 1;
            }
            // Level 2
            else if(document.getElementById("Mittel").checked === true){
                game.level = 2;
            }
            // Level 3
            else if(document.getElementById("Experte").checked === true){
                game.level = 3;
            }
        }

        // Musik wird geladen
        game.music = window.localStorage.getItem("GameMusic");
        // Deaktivieren bzw. Aktivieren der Musik
        if(game.music==="false"){
            deactivateMusic();
        }else{
            activateMusic();
        }

        // Sound wird geladen
        game.sound = window.localStorage.getItem("GameSound");
        // Deaktivieren bzw. Aktivieren des Sounds
        if(game.sound==="false"){
            deactivateSound();
        }else{
            activateSound();
        }
    }

    function startGame(a){
        if(game.time===0){
            window.localStorage.clear();
            game.isaac = [];
            loadGame();
        }
        game.timeTimer = setInterval(function(){
            timeGame();
        }, 1000);

        game.moveTimer = setInterval(function(){
            moveIsaac();
            drawIsaac();
        }, 15);

        game.isaacTimer = setInterval(function(){
            addIsaac();
        }, 1000);

        game.active=true;
        document.getElementById('time').removeAttribute("class");
        // Level wird festgesetzt
        game.level = a;
    }

    function timeGame(){
        // Spielzeit wird runtergezählt
        game.time --;

        // Zurücksetzen der Anzeige der Spielzeit
        document.getElementById('time').removeAttribute("class");

        // Spielzeit wird angezeigt
        document.getElementById('time').innerHTML = game.time;

        // Wenn Spielzeit nur noch 10 Sekunden beträgt,
        // dann erscheint die Anzeige hervorgehoben
        if(game.time<=10){
            document.getElementById('time').setAttribute("class", "nachladen");
        }

        // Wenn spielzeit abgelaufen, dann wird das Spiel
        // angehalten und der Highscore angezeigt
        if(game.time<=0){
            // Anhalten des Spiels
            stopGame();
            // Anzeigen des Highscores
            showHighscoreabfrage();
        }
    }

    function stopGame(){

        // Timer werden angehalten
        window.clearInterval(game.timeTimer);
        window.clearInterval(game.moveTimer);
        window.clearInterval(game.isaacTimer);

        // Schalter wird umgelegt
        game.active=false;
    }

    function saveGame(){

        // Externer Speicher wird geleert
        window.localStorage.clear();

        // Wenn genügend Spielzeit vorhanden ist, dann werden die
        // Spieleinstellungen und die Isaac`s gespeichert
        if(game.time > 0){
            // Externer Speicher wird geleert
            window.localStorage.clear();
            // Spielzeit wird gespeichert
            window.localStorage.setItem("GameTime", game.time);
            // Punktestand wird gespeichert
            window.localStorage.setItem("GameScore", game.score);
            // Munition wird gespeichert
            window.localStorage.setItem("GameAmmo", game.ammo);
            // Alle Isaac`s im internen Speicher werden
            // in den externen Speicher geschrieben
            for(var i=0; i < game.isaac.length; i++){
                window.localStorage.setItem("Isaac"+i, "Isaac"+i);
                window.localStorage.setItem("Isaac"+i+".y", game.isaac[i].y);
                window.localStorage.setItem("Isaac"+i+".x", game.isaac[i].x);
                window.localStorage.setItem("Isaac"+i+".hit", game.isaac[i].hit);
                window.localStorage.setItem("Isaac"+i+".speed", game.isaac[i].speed);
                window.localStorage.setItem("Isaac"+i+".direction", game.isaac[i].direction);
                window.localStorage.setItem("Isaac"+i+".scale", game.isaac[i].scale);
            }
        }

        // Wenn Spielzeit abgelaufen wird der Speicher
        // geleert und KEINE Isaac`s gespeichert
        else if(game.time<=0){
            // Interner Speicher wird geleert
            game.isaac = [];
            // Externer Speicher wird geleert
            window.localStorage.clear();
        }

        // Leveleinstellung wird abgespeichert
        window.localStorage.setItem("GameLevel", game.level);
        // Musikeinstellung wird abgespeichert
        window.localStorage.setItem("GameMusic", game.music);
        // Soundeinstellung wird abgespeichert
        window.localStorage.setItem("GameSound", game.sound);
    }

    function keydownGame(e){
        // Wenn genügend Spielzeit (größer 0) vorhanden ist, dann dann wird reagiert
        if(game.time > 0){
            // Wenn Strg-Taste gedrückt wurde, wird Munition nachgeladen
            if (e.keyCode === 17  && game.active===true){

                // Anzeige der Munition wird zurückgesetzt
                document.getElementById('ammo').setAttribute( "class", "");
                // Munition wird aufgeladen und angezeigt
                game.ammo = 10;
                document.getElementById('ammo').innerHTML = game.ammo;

                // Wenn genügend Punkte vorhanden sind, werden Punkte abgezogen,
                // wenn nicht, dann werden die Punkte auf 0 gesetzt
                if(game.score>=(10 * game.level)){
                    // Punkte (verrechnet mit Level) werden abgezogen
                    game.score += (-10 * game.level);
                    // Punkte werden angezeigt
                    document.getElementById('score').innerHTML = game.score;
                }else{
                    // Punkte werden auf 0 gesetzt
                    game.score = 0;
                    // Punkte werden angezeigt
                    document.getElementById('score').innerHTML = game.score;
                }

                // Neues Div-Element innerhalb der Spiele-Engine erstellen,
                // damit die Trefferpunkte angezeigt werden
                var parentElement = document.getElementById('game_object');
                var childElement = document.createElement('div');

                // Eigenschaften zum neuen Div-Element setzen
                childElement.innerHTML = (-10 * game.level);
                childElement.setAttribute("class", "anzeigenAbzug");
                childElement.style.position = "absolute";
                childElement.style.zIndex = "1";
                childElement.style.top = "725px";
                childElement.style.left = "580px";

                // Neues Div-Element innerhalb der Spiele-Engine hinzufügen
                parentElement.appendChild(childElement);

                // Neues Div-Element mit Timer wieder verschwinden lassen
                var moveChildElement = setInterval(function(){
                    childElement.style.top = "0px";
                    childElement.style.left = "0px";
                }, 1000);

                // Sound wiedergeben
                if(game.sound===true){
                    playSound("reload_sound");
                }
            }

            // Wenn Leertaste gedrückt wurde, wird Spiel unterbrochen oder fortgesetzt
            else if (e.keyCode === 32 && game.show === "engine") {

                // Wenn ein Spiel aktiv ist, dann wird es angehalten
                // Ansonsten wird es fortgesetzt
                if(game.active===true){
                    // Spiel anhalten
                    stopGame();
                }else{
                    if(game.level===null){
                        // Spiel wird gestartet
                        if(document.getElementById("Einfach").checked === true){
                            startGame(1);
                        }
                        else if(document.getElementById("Mittel").checked === true){
                            startGame(2);
                        }
                        else if(document.getElementById("Experte").checked === true){
                            startGame(3);
                        }
                    }else{
                        // Spiel wird gestartet
                        startGame(game.level);
                    }
                }

                // Andere Elemente ausblenden
                onlymenubutton.classList.toggle("hidden");
                ammo.classList.toggle("hidden");
                time.classList.toggle("hidden");
                score.classList.toggle("hidden");
                kugel.classList.toggle("hidden");

                // PauseDIV wird ausgeblendet
                pauseDiv.classList.toggle("hidden");
            }
        }
    }

    function mousedownGame(e){
        // Prüfen, Spiel aktiv und genügend Munition vorhanden ist
        if(game.active===true && game.ammo > 0){

            // Koordinaten der Maus werden berechnet
            var mouseX = e.pageX - document.getElementById('game').offsetLeft;
            var mouseY = e.pageY - document.getElementById('game').offsetTop;

            // Prüfen, ob genügend Spielzeit vorhanden ist
            if(game.time > 0){
                // Munition wird abgezogen
                game.ammo += -1;
                // Wenn Munition knapp (kleiner-gleich-3 ) ist
                if(game.ammo<=3){
                    // Hervorheben der Munitionsanzeige
                    document.getElementById('ammo').setAttribute( "class", "nachladen");
                }
                // Wenn Munition leer (gleich 0) ist
                if(game.ammo===0){
                    // Einblenden der Schrift
                    document.getElementById('ammo').innerHTML = "RELOAD";
                }else{
                    // Normale Darstellung
                    document.getElementById('ammo').innerHTML = game.ammo;
                }
                //Sound wiedergeben
                if(game.sound===true){
                    playSound("shot_sound");
                }
                // Prüfen, ob Isaac getroffen
                for(var i=0;i<game.isaac.length;i++){
                    // Variable für die Punkte eines Treffers
                    var hidPoints;
                    // Prüfen, ob Mausposition mit Position vom Isaac übereinstimmt
                    if( mouseX > (game.isaac[i].x - 30)
                            && mouseX < (game.isaac[i].x + (30 * game.isaac[i].scale) - 15)
                            && mouseY > (game.isaac[i].y - 30)
                            && mouseY < (game.isaac[i].y + (50 * game.isaac[i].scale) - 15) ){

                        // Prüfen, ob Isaac schon einmal getroffen wurde
                        if(game.isaac[i].hit === false || game.isaac[i].hit === "false"){
                            // Punktevergabe anhand der Größe und des Level
                            if(game.isaac[i].scale <= 1.05){
                                // Punkte werden vergeben
                                hidPoints = (15 * game.level)
                                // Übertragen der Punkte in den Punktestand
                                game.score += hidPoints;
                                // Anzeige der Punkte im Punktestand
                                document.getElementById('score').innerHTML = game.score;
                            }else{
                                if(game.isaac[i].scale <= 1.35){
                                    // Punkte werden vergeben
                                    hidPoints = (10 * game.level)
                                    // Übertragen der Punkte in den Punktestand
                                    game.score += hidPoints;
                                    // Anzeige der Punkte im Punktestand
                                    document.getElementById('score').innerHTML = game.score;
                                }
                                else if(game.isaac[i].scale > 1.35){
                                    // Punkte werden vergeben
                                    hidPoints = (5 * game.level)
                                    // Übertragen der Punkte in den Punktestand
                                    game.score += hidPoints;
                                    // Anzeige der Punkte im Punktestand
                                    document.getElementById('score').innerHTML = game.score;
                                }
                            }

                            // Neues Div-Element innerhalb der Spiele-Engine erstellen,
                            // damit die Trefferpunkte angezeigt werden
                            var parentElement = document.getElementById('game_object');
                            var childElement = document.createElement('div');

                            // Eigenschaften zum neuen Div-Element setzen
                            childElement.innerHTML = "+ " + hidPoints;
                            childElement.setAttribute("class", "anzeigenTreffer");
                            childElement.style.position = "absolute";
                            childElement.style.zIndex = "1";
                            childElement.style.top = e.pageY+"px";
                            childElement.style.left = e.pageX+"px";

                            // Neues Div-Element innerhalb der Spiele-Engine hinzufügen
                            parentElement.appendChild(childElement);

                            // Neues Div-Element mit Timer wieder verschwinden lassen
                            var moveChildElement = setInterval(function(){

                                childElement.style.top = "0px";
                                childElement.style.left = "0px";

                            }, 1000);

                        }

                        // Trefferstatus wird gesetzt
                        game.isaac[i].hit = "true";
                    }
                }
            }
        }
    }

/* Dinge für die Isaac`s */

function createIsaac(direction){

    // ID, welches Bild verwendet wird
    this.srcid = 0;

    // Zufällige y-Koordinate wird berechnet
    var min = 0;
    var max = 600;
    this.y = Math.floor(Math.random() * (max - min)) + min;

    // Startposition x-Koordinate wird festgelegt
    if(direction === "move_right"){
        // Wenn Isaac nach links fliegt
        this.x = 1024;
    }else{
        // Wenn Isaac nach rechts fliegt
        this.x = 0;
    }

    // Trefferstatus wird gesetzt
    this.hit = false;

    // Geschwindigkeit wird anhand des Level berechnet
    this.speed = (parseInt(game.level) * 2) + 0.5;

    // Flugrichtung wird gesetzt
    this.direction = direction;

    // Größe wird abhängig vom Level festgesetzt
    if(game.level===3){
        this.scale = 0.7;
    }else{
        this.scale = 0.7 + (Math.random() * 0.8);
    }
}

function addIsaac(){
    // Isaac ("links fliegend") hinzufügen
    game.isaac.push(new createIsaac("move_left"));
    // Isaac ("rechts fliegend") hinzufügen
    game.isaac.push(new createIsaac("move_right"));
}

function moveIsaac(){

    // Spielfeld leeren
    ctx.clearRect(0,0,1024,768);

    // Morrhühner in die jeweilige Richtung bewegen
    for(var i=0;i<game.isaac.length;i++){

        // Überprüfung in welche Richtung Isaac fliegt
        if(game.isaac[i].direction === "move_right"){

            // Isaac fliegt nach rechts
            moveIsaacRight(i);
        }
        else{

            // Isaac fliegt nach links
            moveIsaacLeft(i);
        }
    }
}

function moveIsaacRight(i){
    // Überprüfung, ob Isaac getroffen wurde
    if(game.isaac[i].hit === "true"){

        // Anzeigebild wird anhand der ID ausgewählt
        if(game.isaac[i].srcid === 0){
            // Grafik wird geladen
            game.isaac[i].src = document.getElementById("isaacRH0");
            // ID wird gesetzt
            game.isaac[i].srcid = 1;
        }
        else if(game.isaac[i].srcid === 1){
            // Grafik wird geladen
            game.isaac[i].src = document.getElementById("isaacRH0");
            // ID wird gesetzt
            game.isaac[i].srcid = 2;
        }
        else if(game.isaac[i].srcid === 2){
            // Grafik wird geladen
            game.isaac[i].src = document.getElementById("isaacRH1");
            // ID wird gesetzt
            game.isaac[i].srcid = 0;
        }

        // Bewegungsrichtung
        game.isaac[i].y += +1;

        // Überprüfung, ob Isaac außerhalb des Spielfeldes
        if(game.isaac[i].y > 768){
            // Enfernen des Isaacs aus den Speicher
            window.localStorage.removeItem(game.isaac[i]);
        }
    }else{

        // Anzeigebild wird anhand der ID ausgewählt
        if(game.isaac[i].srcid === 0){
            // Grafik wird geladen
            game.isaac[i].src = document.getElementById("isaacR0");
            // ID wird gesetzt
            game.isaac[i].srcid = 1;
        }
        else if(game.isaac[i].srcid === 1){
            // Grafik wird geladen
            game.isaac[i].src = document.getElementById("isaacR0");
            // ID wird gesetzt
            game.isaac[i].srcid = 2;
        }
        else if(game.isaac[i].srcid === 2){
            // Grafik wird geladen
            game.isaac[i].src = document.getElementById("isaacR1");
            // ID wird gesetzt
            game.isaac[i].srcid = 0;
        }

        // Bewegungsrichtung
        game.isaac[i].x += - game.isaac[i].speed;

        // Überprüfung, ob Isaac außerhalb des Spielfeldes
        if(game.isaac[i].x<0){
            // Enfernen des Isaacs aus den Speicher
            window.localStorage.removeItem(game.isaac[i]);
        }
    }
}

function moveIsaacLeft(i){
    // Überprüfung, ob Isaac getroffen wurde
    if(game.isaac[i].hit === "true"){

        // Anzeigebild wird anhand der ID ausgewählt
        if(game.isaac[i].srcid === 0){
            // Grafik wird geladen
            game.isaac[i].src = document.getElementById("isaacLH0");
            // ID wird gesetzt
            game.isaac[i].srcid = 1;
        }
        else if(game.isaac[i].srcid === 1){
            // Grafik wird geladen
            game.isaac[i].src = document.getElementById("isaacLH0");
            // ID wird gesetzt
            game.isaac[i].srcid = 2;
        }
        else if(game.isaac[i].srcid === 2){
            // Grafik wird geladen
            game.isaac[i].src = document.getElementById("isaacLH1");
            // ID wird gesetzt
            game.isaac[i].srcid = 0;
        }
        // Bewegungsrichtung
        game.isaac[i].y += +1;

        // Überprüfung, ob Isaac außerhalb des Spielfeldes
        if(game.isaac[i].y > 768){
            // Enfernen des Isaacs aus den Speicher
            window.localStorage.removeItem(game.isaac[i]);
        }
    }else{

        // Anzeigebild wird anhand der ID ausgewählt
        if(game.isaac[i].srcid === 0){
            // Grafik wird geladen
            game.isaac[i].src = document.getElementById("isaacL0");
            // ID wird gesetzt
            game.isaac[i].srcid = 1;
        }
        else if(game.isaac[i].srcid === 1){
            // Grafik wird geladen
            game.isaac[i].src = document.getElementById("isaacL0");
            // ID wird gesetzt
            game.isaac[i].srcid = 2;
        }
        else if(game.isaac[i].srcid === 2){
            // Grafik wird geladen
            game.isaac[i].src = document.getElementById("isaacL1");
            // ID wird gesetzt
            game.isaac[i].srcid = 0;
        }
        // Bewegungsrichtung
        game.isaac[i].x += + game.isaac[i].speed;

        // Überprüfung, ob Isaac außerhalb des Spielfeldes
        if(game.isaac[i].x<0){
            // Enfernen des Isaacs aus den Speicher
            window.localStorage.removeItem(game.isaac[i]);
        }
    }
}

function drawIsaac(){
    // Durchlaufen des Speichers für die Isaac`s
    for(var i=0;i<game.isaac.length;i++){
        // Isaac wird im Canvas-Element gezeichnet
        ctx.drawImage(game.isaac[i].src, game.isaac[i].x, game.isaac[i].y, 40 * game.isaac[i].scale, 50 * game.isaac[i].scale);
    }
}


//------------------------------------------------------------------------------------------------------------ //
/*
**  Bereich Datenbank
*/
//------------------------------------------------------------------------------------------------------------ //

    function createDatabase(){

        // Action-ID wird gesetzt
        var action = 0;

        // Neuer Request wird erzeugt
        var xmlhttp = new XMLHttpRequest();

        // Verweis auf auszuführenden PHP-Code mit Übergabe der Parameter
        xmlhttp.open('GET', 'php/database.php?&aaction=' + action, true);

        // Senden des Requests
        xmlhttp.send();
    }

    function writeHighscore(){

        // Action-ID wird gesetzt
        var action = 1;

        // Eingegebener Name wird aus Div gelesen
        var name = document.getElementById("name").value;

        // Punktestand wird aus Div gelesen
        var score = document.getElementById("score").innerHTML;

        // Neuer Request wird erzeugt
        var xmlhttp = new XMLHttpRequest();

        // Verweis auf auszuführenden PHP-Code mit Übergabe der Parameter
        xmlhttp.open('GET', 'php/database.php?&aaction=' + action + '&nname=' + name + '&ppunkte=' + score, true);

        // Senden des Requests
        xmlhttp.send();

        // Spiel wird gestoppt
        stopGame();

        // Das HIGHSCORE-Eintragen-Div wird ausgeblendet und das Highscore-Anzeigen-DIV eingeblendet
        menu.classList.toggle("hidden");
        frageHighscoreDIV.classList.toggle("hidden");
        buttonsDiv.classList.toggle("hidden");
        impressumButton.classList.toggle("hidden");
        hightscoreDiv.classList.toggle("hidden");

        // Inhalt des DIVs "Tabelle" wieder zurücksetzen um alte Highscore zu löschen
        document.getElementById('tabelle').innerHTML = '';

        // Kurzen Moment warten
        window.setTimeout( function() {

            // Highscore auslesen
            readHighscore(name, score);

        }, 1000 );
    };

    function readHighscore(name,score){

        // Action-ID wird gesetzt
        var action = 2;

        // Neuer Request wird erzeugt
        var xmlhttp = new XMLHttpRequest();

        // Verweis auf auszuführenden PHP-Code mit Übergabe der Parameter
        xmlhttp.open('GET', 'php/database.php?&aaction=' + action + '&nname=' + name + '&ppunkte=' + score, true);

        // Generieren der Tabele mit dem Highscore
        xmlhttp.addEventListener('readystatechange', function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                document.getElementById('tabelle').innerHTML = xmlhttp.responseText;
            }
        });

        // Senden des Requests
        xmlhttp.send();
    }


    function dropHighscore(){

        // Action-ID wird gesetzt
        var action = 3;

        // Neuer Request wird erzeugt
        var xmlhttp = new XMLHttpRequest();

        // Verweis auf auszuführenden PHP-Code mit Übergabe der Parameter
        xmlhttp.open('GET', 'php/database.php?&aaction=' + action, true);

        // Senden des Requests
        xmlhttp.send();
    }




};
game();
