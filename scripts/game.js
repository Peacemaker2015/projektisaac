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
        moveMoorhuhn();
        drawMoorhuhn();
        // Es wird überprüft, ob ein Spiel mit
        // ausreichender Spielzeit vorhanden ist
        if(isNaN(spielfeld.time) || spielfeld.time<=0 || spielfeld.time>=spielfeld.maxTime){
            onlymenu.click();
        }else{
            spielfeld.active = false;
            spielfeld.show = "engine";
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
        if(document.getElementById("Einfach").checked === true){
            startGame(1);
        }
        else if(document.getElementById("Mittel").checked === true){
            startGame(2);
        }
        else if(document.getElementById("Experte").checked === true){
            startGame(3);
        }
        spielfeld.show = "engine";
    };

    // Funktion für den Eventlistener für den kleinen Menübutton oben links,
    // wenn das Hauptmenü ausgeblendet ist. Auf "Click" wird der Menü Button
    // ausgeblendet und das Hauptmenü eingeblendet
    var hidemenufornewgamesmall = function (){
        spielfeld.show = "menu";
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
        if(spielfeld.level===null){
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
            startGame(spielfeld.level);
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

    var hidemenusettings = function () {
        spieleinstellungenDiv.classList.toggle("hidden");
        buttonsDiv.classList.toggle("hidden");
        impressumButton.classList.toggle("hidden");
        if(document.getElementById("on").checked === true){
            activateSound();
        }
        else if(document.getElementById("off").checked === true){
            deactivateSound();
        }
    };

    // Eventlistener für die Buttons
    highscoreLeerenSchalter.addEventListener("click", highscoreLeeren);
    musikOnSchalter.addEventListener("click", musicOn);
    musikOffSchalter.addEventListener("click", musicOff);
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
    var frageHighscoreDIV = document.getElementById("eintragenHighscoreDiv");
    var sendenButton = document.getElementById("highscoreSendenButton");
    var zuruckMenuButton = document.getElementById("zurückzumMenüButton");

    // Funktion zum Anzeigen des HighScoreEintragenDivs
    var showHighscoreabfrage = function () {
        var text = "Wow, Du hast " + spielfeld.score + " Punkte !!!";
        document.getElementById("punkte").innerHTML = text;

        ammo.classList.toggle("hidden");
        time.classList.toggle("hidden");
        score.classList.toggle("hidden");
        kugel.classList.toggle("hidden");

        onlymenubutton.classList.toggle("hidden");

        frageHighscoreDIV.classList.toggle("hidden");
    }

    // Funktion für den Eventlistener für die Buttons
    var hideAbfrageHighscore = function () {
        menu.classList.toggle("hidden");
        frageHighscoreDIV.classList.toggle("hidden");
    }

    // Eventlistener für den Button "Zurück"
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
var spielfeld = new createGame();

// Canvas vorbereiten
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

// Listener hinzufügen
canvas.addEventListener("mousedown", mousedownGame, false);
document.addEventListener('keydown', keydownGame);

/* Dinge für das Spiel (allgemein) */

function activateMusic() {
    document.getElementById('background_music').muted = false;
    spielfeld.music = true;
}

function deactivateMusic() {
    document.getElementById('background_music').muted = true;
    spielfeld.music = false;
}

function activateSound() {
    spielfeld.sound = true;
}

function deactivateSound() {
    spielfeld.sound = false;
}

function playSound(elementID){
    document.getElementById(elementID).load();
    document.getElementById(elementID).play();
}

function createGame(){
    this.moorhuhn = [];

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
    this.moorhuhnTimer;
}

function loadGame(){
    if(spielfeld.time<=0){
        // Spielfeld leeren
        ctx.clearRect(0,0,1024,768);
        // Speicher für Moorhühner leeren
        spielfeld.moorhuhn = [];
        // Punktestand wird geladen
        spielfeld.score = parseInt(window.localStorage.getItem("GameScore"));
        // Munition wird geladen
        spielfeld.ammo = parseInt(window.localStorage.getItem("GameAmmo"));
        // Spielzeit wird geladen
        spielfeld.time = parseInt(window.localStorage.getItem("GameTime"));
        // Punktestand wird überprüft
        if(isNaN(spielfeld.score) || spielfeld.time<=0){
            spielfeld.score = 0;
        }
        document.getElementById('score').innerHTML = spielfeld.score;
        // Munition wird überprüft
        if(isNaN(spielfeld.ammo) || spielfeld.time<=0){
            spielfeld.ammo = 10;
            document.getElementById('ammo').setAttribute( "class", "");
        }
        document.getElementById('ammo').innerHTML = spielfeld.ammo;
        // Spielzeit wird überprüft
        if(isNaN(spielfeld.time) || spielfeld.time<=0){
            spielfeld.time = spielfeld.maxTime;
            ;
        }
        document.getElementById('time').innerHTML = spielfeld.time;
        // Moorhühner werden geladen
        var i=0;
        var found = 1;
        while(found===1){
            if((window.localStorage.getItem("Moorhuhn"+i)===null)){
                found=0;
            }else{
                spielfeld.moorhuhn.push(new createMoorhuhn(""));
                spielfeld.moorhuhn[i].src = document.getElementById("moorhuhn");
                spielfeld.moorhuhn[i].y = parseInt(window.localStorage.getItem("Moorhuhn"+i+".y"));
                spielfeld.moorhuhn[i].x = parseInt(window.localStorage.getItem("Moorhuhn"+i+".x"));
                spielfeld.moorhuhn[i].hit = window.localStorage.getItem("Moorhuhn"+i+".hit");
                spielfeld.moorhuhn[i].speed = window.localStorage.getItem("Moorhuhn"+i+".speed");
                spielfeld.moorhuhn[i].direction = window.localStorage.getItem("Moorhuhn"+i+".direction");
                spielfeld.moorhuhn[i].scale = window.localStorage.getItem("Moorhuhn"+i+".scale");
            }
            i++;
        }
    }
}

function startGame(a){
    // Level wird festgesetzt
    spielfeld.level = a;

    if(spielfeld.time===0){
        window.localStorage.clear();
        spielfeld.moorhuhn = [];
        loadGame();
    }
    spielfeld.timeTimer = setInterval(function(){
        timeGame();
    }, 1000);

    spielfeld.moveTimer = setInterval(function(){
        moveMoorhuhn();
        drawMoorhuhn();
    }, 15);

    spielfeld.moorhuhnTimer = setInterval(function(){
        addMoorhuhn();
    }, 1000);

    spielfeld.active=true;
}

function timeGame(){
    spielfeld.time --;
    document.getElementById('time').innerHTML = spielfeld.time;

    if(spielfeld.time<=0){
        stopGame();
        showHighscoreabfrage();
    }
}

function stopGame(){
    window.clearInterval(spielfeld.timeTimer);
    window.clearInterval(spielfeld.moveTimer);
    window.clearInterval(spielfeld.moorhuhnTimer);
    spielfeld.active=false;
}

function saveGame(){

    window.localStorage.clear();

    if(spielfeld.time > 0){
        window.localStorage.clear();
        window.localStorage.setItem("GameTime", spielfeld.time);
        window.localStorage.setItem("GameScore", spielfeld.score);
        window.localStorage.setItem("GameAmmo", spielfeld.ammo);

        for(var i=0; i < spielfeld.moorhuhn.length; i++){
            window.localStorage.setItem("Moorhuhn"+i, "Moorhuhn"+i);
            window.localStorage.setItem("Moorhuhn"+i+".y", spielfeld.moorhuhn[i].y);
            window.localStorage.setItem("Moorhuhn"+i+".x", spielfeld.moorhuhn[i].x);
            window.localStorage.setItem("Moorhuhn"+i+".hit", spielfeld.moorhuhn[i].hit);
            window.localStorage.setItem("Moorhuhn"+i+".speed", spielfeld.moorhuhn[i].speed);
            window.localStorage.setItem("Moorhuhn"+i+".direction", spielfeld.moorhuhn[i].direction);
            window.localStorage.setItem("Moorhuhn"+i+".scale", spielfeld.moorhuhn[i].scale);
        }
    }
    else if(spielfeld.time<=0){
        spielfeld.moorhuhn = [];
        window.localStorage.clear();
    }
}

function keydownGame(e){
    if(spielfeld.time > 0){
        // Munition mit Strg nachladen
        if (e.keyCode === 17  && spielfeld.active===true){
            document.getElementById('ammo').setAttribute( "class", "");
            spielfeld.ammo = 10;
            document.getElementById('ammo').innerHTML = spielfeld.ammo;
            // Sound wiedergeben
            if(spielfeld.sound===true){
                playSound("reload_sound");
            }
        }

        // Spiel mit Leertaste unterbrechen oder fortsetzen
        else if (e.keyCode === 32 && spielfeld.show === "engine") {
            if(spielfeld.active===true){
                // Spiel anhalten
                stopGame();
            }else{
                if(spielfeld.level===null){
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
                    startGame(spielfeld.level);
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
    if(spielfeld.active===true && spielfeld.ammo > 0){

        var mouseX = e.pageX - document.getElementById('game').offsetLeft;
        var mouseY = e.pageY - document.getElementById('game').offsetTop;
        if(spielfeld.time > 0){

            spielfeld.ammo += -1;

            if(spielfeld.ammo<=3){
                document.getElementById('ammo').setAttribute( "class", "nachladen");
            }

            document.getElementById('ammo').innerHTML = spielfeld.ammo;
            //Sound wiedergeben
            if(spielfeld.sound===true){
                playSound("shot_sound");
            }
            // Prüfen, ob Moorhuhn getroffen
            for(var i=0;i<spielfeld.moorhuhn.length;i++){

                if( mouseX > (spielfeld.moorhuhn[i].x - 30)
                        && mouseX < (spielfeld.moorhuhn[i].x + (30 * spielfeld.moorhuhn[i].scale) - 15)
                        && mouseY > (spielfeld.moorhuhn[i].y - 30)
                        && mouseY < (spielfeld.moorhuhn[i].y + (50 * spielfeld.moorhuhn[i].scale) - 15) ){


                    if(spielfeld.moorhuhn[i].hit === false){

                        // Punkte werden vergeben
                        if(spielfeld.moorhuhn[i].scale <= 1.05){
                            spielfeld.score += (15 * spielfeld.level);
                            document.getElementById('score').innerHTML = spielfeld.score;
                        }else{
                            if(spielfeld.moorhuhn[i].scale <= 1.35){
                                spielfeld.score += (10 * spielfeld.level);
                                document.getElementById('score').innerHTML = spielfeld.score;
                            }
                            else if(spielfeld.moorhuhn[i].scale > 1.35){
                                spielfeld.score += (5 * spielfeld.level);
                                document.getElementById('score').innerHTML = spielfeld.score;
                            }
                        }
                    }
                    // Trefferstatus wird gesetzt
                    spielfeld.moorhuhn[i].hit = true;
                }
            }
        }
    }
}

/* Dinge für die Moorhühner */

function createMoorhuhn(direction){
    var min = 0;
    var max = 600;

    this.srcid = 0;
    this.src = document.getElementById("moorhuhn0");
    this.y = Math.floor(Math.random() * (max - min)) + min;

    if(direction === "move_right"){
        this.x = 1024;
    }else{
        this.x = 0;
    }

    this.hit = false;
    this.speed = (parseInt(spielfeld.level) * 2) + 0.5;
    this.direction = direction;

    if(spielfeld.level===3){
        this.scale = 0.7;
    }else{
        this.scale = 0.7 + (Math.random() * 0.8);
    }
}

function addMoorhuhn(){
    // Moorhuhn ("links fliegend") hinzufügen
    spielfeld.moorhuhn.push(new createMoorhuhn("move_left"));
    // Moorhuhn ("rechts fliegend") hinzufügen
    spielfeld.moorhuhn.push(new createMoorhuhn("move_right"));
}

function moveMoorhuhn(){
    // Spielfeld leeren
    ctx.clearRect(0,0,1024,768);
    // Morrhühner in die jeweilige Richtung bewegen
    for(var i=0;i<spielfeld.moorhuhn.length;i++){
        if(spielfeld.moorhuhn[i].direction === "move_right"){
            moveMoorhuhnRight(i);
        }
        else{
            moveMoorhuhnLeft(i);
        }
    }
}

function moveMoorhuhnRight(i){
    if(spielfeld.moorhuhn[i].hit === true){
        // Anzeigebild
        if(spielfeld.moorhuhn[i].srcid === 0){
            spielfeld.moorhuhn[i].src = document.getElementById("moorhuhnRH0");
            spielfeld.moorhuhn[i].srcid = 1;
        }
        else if(spielfeld.moorhuhn[i].srcid === 1){
            spielfeld.moorhuhn[i].src = document.getElementById("moorhuhnRH0");
            spielfeld.moorhuhn[i].srcid = 2;
        }
        else if(spielfeld.moorhuhn[i].srcid === 2){
            spielfeld.moorhuhn[i].src = document.getElementById("moorhuhnRH1");
            spielfeld.moorhuhn[i].srcid = 0;
        }
        // Bewegungsrichtung
        spielfeld.moorhuhn[i].y += +1;
        if(spielfeld.moorhuhn[i].y > 768){
            window.localStorage.removeItem(spielfeld.moorhuhn[i]);
        }
    }else{
        // Anzeigebild
        if(spielfeld.moorhuhn[i].srcid === 0){
            spielfeld.moorhuhn[i].src = document.getElementById("moorhuhnR0");
            spielfeld.moorhuhn[i].srcid = 1;
        }
        else if(spielfeld.moorhuhn[i].srcid === 1){
            spielfeld.moorhuhn[i].src = document.getElementById("moorhuhnR0");
            spielfeld.moorhuhn[i].srcid = 2;
        }
        else if(spielfeld.moorhuhn[i].srcid === 2){
            spielfeld.moorhuhn[i].src = document.getElementById("moorhuhnR1");
            spielfeld.moorhuhn[i].srcid = 0;
        }
        // Bewegungsrichtung
        spielfeld.moorhuhn[i].x += - spielfeld.moorhuhn[i].speed;
        if(spielfeld.moorhuhn[i].x<0){
            window.localStorage.removeItem(spielfeld.moorhuhn[i]);
        }
    }
}

function moveMoorhuhnLeft(i){
    if(spielfeld.moorhuhn[i].hit === true){
        // Anzeigebild
        if(spielfeld.moorhuhn[i].srcid === 0){
            spielfeld.moorhuhn[i].src = document.getElementById("moorhuhnLH0");
            spielfeld.moorhuhn[i].srcid = 1;
        }
        else if(spielfeld.moorhuhn[i].srcid === 1){
            spielfeld.moorhuhn[i].src = document.getElementById("moorhuhnLH0");
            spielfeld.moorhuhn[i].srcid = 2;
        }
        else if(spielfeld.moorhuhn[i].srcid === 2){
            spielfeld.moorhuhn[i].src = document.getElementById("moorhuhnLH1");
            spielfeld.moorhuhn[i].srcid = 0;
        }
        // Bewegungsrichtung
        spielfeld.moorhuhn[i].y += +1;
        if(spielfeld.moorhuhn[i].y > 768){
            window.localStorage.removeItem(spielfeld.moorhuhn[i]);
        }
    }else{
        // Anzeigebild
        if(spielfeld.moorhuhn[i].srcid === 0){
            spielfeld.moorhuhn[i].src = document.getElementById("moorhuhnL0");
            spielfeld.moorhuhn[i].srcid = 1;
        }
        else if(spielfeld.moorhuhn[i].srcid === 1){
            spielfeld.moorhuhn[i].src = document.getElementById("moorhuhnL0");
            spielfeld.moorhuhn[i].srcid = 2;
        }
        else if(spielfeld.moorhuhn[i].srcid === 2){
            spielfeld.moorhuhn[i].src = document.getElementById("moorhuhnL1");
            spielfeld.moorhuhn[i].srcid = 0;
        }
        // Bewegungsrichtung
        spielfeld.moorhuhn[i].x += + spielfeld.moorhuhn[i].speed;
        if(spielfeld.moorhuhn[i].x<0){
            window.localStorage.removeItem(spielfeld.moorhuhn[i]);
        }
    }
}

function drawMoorhuhn(){
    for(var i=0;i<spielfeld.moorhuhn.length;i++){
        ctx.drawImage(spielfeld.moorhuhn[i].src, spielfeld.moorhuhn[i].x, spielfeld.moorhuhn[i].y, 40 * spielfeld.moorhuhn[i].scale, 50 * spielfeld.moorhuhn[i].scale);
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
