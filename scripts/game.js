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
*/
//------------------------------------------------------------------------------------------------------------ //

function game(){
    'use strict';

    //-------------------------------------------------------------------- //
    /*
    **  Befehlsausführungen, wenn das Browserfenster geöffnet wird.
    */

    window.onload = function(){
        createDatabase();
        // Spielstand wird geladen
        loadGame();
        // Spielfeld wird gezeichnet
        moveIsaac();
        drawIsaac();
        // Es wird überprüft, ob ein Spiel mit
        // ausreichender Spielzeit vorhanden ist
        if(isNaN(game.time) || game.time<=0 || game.time>=game.maxTime){
            onlymenu.click();
        }else{
            game.active = false;
            game.show = "engine";
            // Andere Elemente ausblenden
            onlymenubutton.classList.toggle("hidden");
            ammo.classList.toggle("hidden");
            time.classList.toggle("hidden");
            score.classList.toggle("hidden");
            kugel.classList.toggle("hidden");
            // PauseDiv einblenden
            pauseDiv.classList.toggle("hidden");
        }
    };

    //-------------------------------------------------------------------- //
    /*
    **  Befehlsausführungen, wenn das Browserfenster geschlossen wird.
    */

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


    // Deklaration der Variablen für die Funktion des Hauptmenüs
    //var buttonsDiv = document.getElementById("buttonsDiv");


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
        // Spielstand wird geladen
        //loadGame();
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
        game.show = "menu";
        // Spiel wird gestoppt
        stopGame();
        // Spielstand wird gespeichert
        //saveGame();
        // Andere Dinge werden verarbeitet
        menu.classList.toggle("hidden");
        onlymenubutton.classList.toggle("hidden");
        ammo.classList.toggle("hidden");
        time.classList.toggle("hidden");
        score.classList.toggle("hidden");
        kugel.classList.toggle("hidden");
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
        console.log("Music On");
    };

    var musicOff = function () {
        deactivateMusic();
        console.log("Music Off");
    };

    var soundOn = function () {
        activateSound();
        console.log("Sound On");
    };

    var soundOff = function () {
        deactivateSound();
        console.log("Sound Off");
    };

    var levelEinfach = function () {
        console.log("Level: 1");
        game.level = 1;
    };

    var levelMittel = function () {
        console.log("Level: 2");
        game.level = 2;
    };

    var levelExperte = function () {
        console.log("Level: 3");
        game.level = 3;
    };

    var hidemenusettings = function () {
        spieleinstellungenDiv.classList.toggle("hidden");
        buttonsDiv.classList.toggle("hidden");
        impressumButton.classList.toggle("hidden");
        if(game.music===true){
            document.getElementById("yes").checked = true;
            document.getElementById("no").checked = false;
        }else if(game.music===false){
            document.getElementById("yes").checked = false;
            document.getElementById("no").checked = true;
        }

        if(game.sound===true){
            document.getElementById("on").checked = true;
            document.getElementById("off").checked = false;
        }else if(game.sound===false){
            document.getElementById("on").checked = false;
            document.getElementById("off").checked = true;
        }
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

    var enterName = function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            writeHighscore();
        }
    }

    // Eventlistener für den Button "Zurück"
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
    this.isaac = [];

    this.maxTime = 20;
    this.time = null;

    this.level = null;
    this.active = true;

    this.music = true;
    this.sound = true;

    this.score = null;
    this.ammo = null;
    this.show = null;

    this.timeTimer;
    this.moveTimer;
    this.isaacTimer;
}

function loadGame(){
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
            //;
        }
        document.getElementById('time').innerHTML = game.time;
        // Isaac`s werden geladen
        var i=0;
        var found = 1;
        while(found===1){
            if((window.localStorage.getItem("Isaac"+i)===null)){
                found=0;
            }else{
                game.isaac.push(new createIsaac(""));
                game.isaac[i].y = parseInt(window.localStorage.getItem("Isaac"+i+".y"));
                game.isaac[i].x = parseInt(window.localStorage.getItem("Isaac"+i+".x"));
                game.isaac[i].hit = window.localStorage.getItem("Isaac"+i+".hit");
                game.isaac[i].speed = window.localStorage.getItem("Isaac"+i+".speed");
                game.isaac[i].direction = window.localStorage.getItem("Isaac"+i+".direction");
                game.isaac[i].scale = window.localStorage.getItem("Isaac"+i+".scale");
            }
            i++;
        }
    }
    // Level wird geladen
    game.level = parseInt(window.localStorage.getItem("GameLevel"));
    if (isNaN(game.level) || game.level===null){
        if(document.getElementById("Einfach").checked === true){
            game.level = 1;
        }
        else if(document.getElementById("Mittel").checked === true){
            game.level = 2;
        }
        else if(document.getElementById("Experte").checked === true){
            game.level = 3;
        }
    }
    // Musik wird geladen
    game.music = window.localStorage.getItem("GameMusic");
    if(game.music==="false"){
        deactivateMusic();
    }else{
        activateMusic();
    }
    // Sound wird geladen
    game.sound = window.localStorage.getItem("GameSound");
    if(game.sound==="false"){
        deactivateSound();
    }else{
        activateSound();
    }
    console.log("Level:" + game.level);
    console.log("Musik:" + game.music);
    console.log("Sound:" + game.sound);
}

function startGame(a){
    // Level wird festgesetzt
    game.level = a;
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
}

function timeGame(){
    game.time --;
    document.getElementById('time').removeAttribute("class");
    document.getElementById('time').innerHTML = game.time;

    if(game.time<=10){
        document.getElementById('time').setAttribute("class", "nachladen");
    }

    if(game.time<=0){
        stopGame();
        showHighscoreabfrage();
    }
}

function stopGame(){
    window.clearInterval(game.timeTimer);
    window.clearInterval(game.moveTimer);
    window.clearInterval(game.isaacTimer);
    game.active=false;
}

function saveGame(){

    window.localStorage.clear();

    if(game.time > 0){
        window.localStorage.clear();
        window.localStorage.setItem("GameTime", game.time);
        window.localStorage.setItem("GameScore", game.score);
        window.localStorage.setItem("GameAmmo", game.ammo);

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
    else if(game.time<=0){
        game.isaac = [];
        window.localStorage.clear();
    }
    window.localStorage.setItem("GameLevel", game.level);
    window.localStorage.setItem("GameMusic", game.music);
    window.localStorage.setItem("GameSound", game.sound);
}

function keydownGame(e){
    if(game.time > 0){
        // Munition mit Strg nachladen
        if (e.keyCode === 17  && game.active===true){
            document.getElementById('ammo').setAttribute( "class", "");
            game.ammo = 10;
            document.getElementById('ammo').innerHTML = game.ammo;
            if(game.score>=10){
                game.score += (-10 * game.level);
                document.getElementById('score').innerHTML = game.score;
            }else{
                game.score = 0;
                document.getElementById('score').innerHTML = game.score;
            }
            // Eltern-Div-Element auswählen
            var parentElement = document.getElementById('game_object');
            // Neues Kind-Div-Element erzeugen
            var childElement = document.createElement('div');
            childElement.innerHTML = (-10 * game.level);
            // Eigenschaften zum Kind-Div-Element setzen
            childElement.setAttribute("class", "anzeigenAbzug");
            childElement.style.position = "absolute";
            childElement.style.zIndex = "1";
            childElement.style.top = "725px";
            childElement.style.left = "580px";
            // zum Eltern-Div-Element hinzufügen
            parentElement.appendChild(childElement);
            // Kind-Div-Element verschwinden lassen
            var moveChildElement = setInterval(function(){
                childElement.style.top = "0px";
                childElement.style.left = "0px";
            }, 1000);
            // Sound wiedergeben
            if(game.sound===true){
                playSound("reload_sound");
            }
        }

        // Spiel mit Leertaste unterbrechen oder fortsetzen
        else if (e.keyCode === 32 && game.show === "engine") {
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
    // Prüfen, ob Munition vorhanden ist
    if(game.active===true && game.ammo > 0){
        var mouseX = e.pageX - document.getElementById('game').offsetLeft;
        var mouseY = e.pageY - document.getElementById('game').offsetTop;
        if(game.time > 0){
            game.ammo += -1;

            if(game.ammo<=3){
                document.getElementById('ammo').setAttribute( "class", "nachladen");
            }

            if(game.ammo===0){
                document.getElementById('ammo').innerHTML = "RELOAD";
            }else{
                document.getElementById('ammo').innerHTML = game.ammo;
            }
            //Sound wiedergeben
            if(game.sound===true){
                playSound("shot_sound");
            }
            // Prüfen, ob Isaac getroffen
            for(var i=0;i<game.isaac.length;i++){

                var hidPoints;
                if( mouseX > (game.isaac[i].x - 30)
                        && mouseX < (game.isaac[i].x + (30 * game.isaac[i].scale) - 15)
                        && mouseY > (game.isaac[i].y - 30)
                        && mouseY < (game.isaac[i].y + (50 * game.isaac[i].scale) - 15) ){

                    if(game.isaac[i].hit === false || game.isaac[i].hit === "false"){
                        // Punkte werden vergeben
                        if(game.isaac[i].scale <= 1.05){
                            hidPoints = (15 * game.level)
                            game.score += hidPoints;
                            document.getElementById('score').innerHTML = game.score;
                        }else{
                            if(game.isaac[i].scale <= 1.35){
                                hidPoints = (10 * game.level)
                                game.score += hidPoints;
                                document.getElementById('score').innerHTML = game.score;
                            }
                            else if(game.isaac[i].scale > 1.35){
                                hidPoints = (5 * game.level)
                                game.score += hidPoints;
                                document.getElementById('score').innerHTML = game.score;
                            }
                        }

                        // Eltern-Div-Element auswählen
                        var parentElement = document.getElementById('game_object');
                        // Neues Kind-Div-Element erzeugen
                        var childElement = document.createElement('div');
                        childElement.innerHTML = "+ " + hidPoints;
                        // Eigenschaften zum Kind-Div-Element setzen
                        childElement.setAttribute("class", "anzeigenTreffer");
                        childElement.style.position = "absolute";
                        childElement.style.zIndex = "1";
                        childElement.style.top = e.pageY+"px";
                        childElement.style.left = e.pageX+"px";
                        // zum Eltern-Div-Element hinzufügen
                        parentElement.appendChild(childElement);
                        // Kind-Div-Element verschwinden lassen
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
    var min = 0;
    var max = 600;

    this.srcid = 0;
    this.y = Math.floor(Math.random() * (max - min)) + min;

    if(direction === "move_right"){
        this.x = 1024;
    }else{
        this.x = 0;
    }

    this.hit = false;
    this.speed = (parseInt(game.level) * 2) + 0.5;
    this.direction = direction;

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
        if(game.isaac[i].direction === "move_right"){
            moveIsaacRight(i);
        }
        else{
            moveIsaacLeft(i);
        }
    }
}

function moveIsaacRight(i){
    if(game.isaac[i].hit === "true"){
        // Anzeigebild
        if(game.isaac[i].srcid === 0){
            game.isaac[i].src = document.getElementById("isaacRH0");
            game.isaac[i].srcid = 1;
        }
        else if(game.isaac[i].srcid === 1){
            game.isaac[i].src = document.getElementById("isaacRH0");
            game.isaac[i].srcid = 2;
        }
        else if(game.isaac[i].srcid === 2){
            game.isaac[i].src = document.getElementById("isaacRH1");
            game.isaac[i].srcid = 0;
        }
        // Bewegungsrichtung
        game.isaac[i].y += +1;
        if(game.isaac[i].y > 768){
            window.localStorage.removeItem(game.isaac[i]);
        }
    }else{
        // Anzeigebild
        if(game.isaac[i].srcid === 0){
            game.isaac[i].src = document.getElementById("isaacR0");
            game.isaac[i].srcid = 1;
        }
        else if(game.isaac[i].srcid === 1){
            game.isaac[i].src = document.getElementById("isaacR0");
            game.isaac[i].srcid = 2;
        }
        else if(game.isaac[i].srcid === 2){
            game.isaac[i].src = document.getElementById("isaacR1");
            game.isaac[i].srcid = 0;
        }
        // Bewegungsrichtung
        game.isaac[i].x += - game.isaac[i].speed;
        if(game.isaac[i].x<0){
            window.localStorage.removeItem(game.isaac[i]);
        }
    }
}

function moveIsaacLeft(i){
    if(game.isaac[i].hit === "true"){
        // Anzeigebild
        if(game.isaac[i].srcid === 0){
            game.isaac[i].src = document.getElementById("isaacLH0");
            game.isaac[i].srcid = 1;
        }
        else if(game.isaac[i].srcid === 1){
            game.isaac[i].src = document.getElementById("isaacLH0");
            game.isaac[i].srcid = 2;
        }
        else if(game.isaac[i].srcid === 2){
            game.isaac[i].src = document.getElementById("isaacLH1");
            game.isaac[i].srcid = 0;
        }
        // Bewegungsrichtung
        game.isaac[i].y += +1;
        if(game.isaac[i].y > 768){
            window.localStorage.removeItem(game.isaac[i]);
        }
    }else{
        // Anzeigebild
        if(game.isaac[i].srcid === 0){
            game.isaac[i].src = document.getElementById("isaacL0");
            game.isaac[i].srcid = 1;
        }
        else if(game.isaac[i].srcid === 1){
            game.isaac[i].src = document.getElementById("isaacL0");
            game.isaac[i].srcid = 2;
        }
        else if(game.isaac[i].srcid === 2){
            game.isaac[i].src = document.getElementById("isaacL1");
            game.isaac[i].srcid = 0;
        }
        // Bewegungsrichtung
        game.isaac[i].x += + game.isaac[i].speed;
        if(game.isaac[i].x<0){
            window.localStorage.removeItem(game.isaac[i]);
        }
    }
}

function drawIsaac(){
    for(var i=0;i<game.isaac.length;i++){
        ctx.drawImage(game.isaac[i].src, game.isaac[i].x, game.isaac[i].y, 40 * game.isaac[i].scale, 50 * game.isaac[i].scale);
    }
}


//------------------------------------------------------------------------------------------------------------ //
/*
**  Bereich Datenbank
*/
//------------------------------------------------------------------------------------------------------------ //

    function createDatabase(){

        var action = 0;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', 'php/database.php?&aaction=' + action, true);
        xmlhttp.send();

    }


    function writeHighscore(){
        // Das HIGHSCORE-Eintragen-Div wird ausgeblendet und das Highscore-Anzeigen-DIV eingeblendet
        var action = 1;
        var name = document.getElementById("name").value;
        var score = document.getElementById("score").innerHTML;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', 'php/database.php?&aaction=' + action + '&nname=' + name + '&ppunkte=' + score, true);
        xmlhttp.send();

        stopGame();

        menu.classList.toggle("hidden");
        frageHighscoreDIV.classList.toggle("hidden");
        buttonsDiv.classList.toggle("hidden");
        impressumButton.classList.toggle("hidden");
        hightscoreDiv.classList.toggle("hidden");

        // Inhalt des DIVs "Tabelle" wieder zurücksetzen um alte Highscore zu löschen

        document.getElementById('tabelle').innerHTML = '';

        window.setTimeout( function() {

            readHighscore(name, score);

        }, 1000 );
    };




    function readHighscore(name,score){
        var action = 2;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', 'php/database.php?&aaction=' + action + '&nname=' + name + '&ppunkte=' + score, true);

        xmlhttp.addEventListener('readystatechange', function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                document.getElementById('tabelle').innerHTML = xmlhttp.responseText;
            }
        });
        xmlhttp.send();
    }


    function dropHighscore(){

        var action = 3;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', 'php/database.php?&aaction=' + action, true);
        xmlhttp.send();

    }




};
game();
