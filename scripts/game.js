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


//function game(){
'use strict';

window.onload = function(){
    // Spielstand wird geladen
    loadGame();
    // Es wird überprüft, ob ein Spiel mit
    // ausreichender Spielzeit vorhanden ist
    if(isNaN(spielfeld.time) || spielfeld.time<=0 || spielfeld.time>=maxTime){
        onlymenu.click();
    }else{
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
    }
};

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

var anleitung = document.getElementById("anleitungButton");
var buttonsDiv = document.getElementById("buttonsDiv");
var anleitungsDiv = document.getElementById("spielanleitungDiv");
var zuruckButton = document.getElementById("zuruckAnleitungButton");

// Anzeigen des HighScoreEintragenDivs

var frageHighscoreDIV = document.getElementById("eintragenHighscoreDiv");

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
// Funktion zum Verschwinden lassen des Hauptmenüs und Anzeigen des Divs mit der Spielanleitung

var hidemenu = function () {
    anleitungsDiv.classList.toggle("hidden");
    buttonsDiv.classList.toggle("hidden");
};

// Eventlistener für den Button "Spielanleitung" und den "Zurück" Button auf dem Spielanleitungs DIV
    anleitung.addEventListener("click", hidemenu);
    zuruckButton.addEventListener("click", hidemenu);

// Funktion, um nach der Highscoreeingabe den kleinen MenüButton auszublenden und das große Menü wieder einzublenden

    var hideAbfrageHighscore = function () {
        menu.classList.toggle("hidden");
        frageHighscoreDIV.classList.toggle("hidden");
    }

    var zuruckMenuButton = document.getElementById("zurückzumMenüButton");

    zuruckMenuButton.addEventListener("click",hideAbfrageHighscore);






// Funktion bei Klick auf "Spiel starten" um Menü auszublenden, damit ein neues Spiel gestartet werden kann.

    var playGame = document.getElementById("spielstarten");
    var menu = document.getElementById("menu");
    var onlymenubutton = document.getElementById("onlymenubuttondiv");
    var time = document.getElementById("time");
    var ammo = document.getElementById("ammo");
    var score = document.getElementById("score");
    var kugel = document.getElementById("kugel");

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
    };

    var hidemenufornewgamesmall = function (){
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

    playGame.addEventListener("click", hidemenufornewgamebig);

// Funktion des OnlyMenüButtons, damit das große Menü wieder angezeigt wird

    var onlymenu = document.getElementById("onlymenu");

    var showmenu = function () {
        menu.classList.toggle("hidden");
        onlymenubutton.classList.toggle("hidden");
    };

// Aktionlistener für den kleinen Menübutton oben links, wenn das Hauptmenü ausgeblendet ist
// Auf "Click" wird der Menü Button ausgeblendet und das Hauptmenü eingeblendet

    onlymenu.addEventListener("click", hidemenufornewgamesmall);



// Funktion zum Verschwinden lassen des Hauptmenüs und Anzeigen des Divs mit der Spieleinstellungen

    var spieleinstellungenButton = document.getElementById("einstellungenButton");
    var spieleinstellungenDiv = document.getElementById("spieleinestellungenDiv");
    var zuruckButtonEinstellungen = document.getElementById("zuruckEinstellungenButton");

var hidemenusettings = function () {
    spieleinstellungenDiv.classList.toggle("hidden");
    buttonsDiv.classList.toggle("hidden");
    if(document.getElementById("yes").checked === true){
        if(music===false){
            activateMusic();
        }
    }
    else if(document.getElementById("no").checked === true){
        deactivateMusic();
    }
    if(document.getElementById("on").checked === true){
        activateSound();
    }
    else if(document.getElementById("off").checked === true){
        deactivateSound();
    }
};

// Eventlistener für den Button "Spielanleitung" und den "Zurück" Button auf dem Spielanleitungs DIV
    spieleinstellungenButton.addEventListener("click", hidemenusettings);
    zuruckButtonEinstellungen.addEventListener("click", hidemenusettings);


    //------------------------------------------------------------------------------------------------------------ //

// Funktion zum Verschwinden lassen des Hauptmenüs und Anzeigen des Divs mit dem Highscore

    var highscoreButton = document.getElementById("highscoreButton");
    var hightscoreDiv = document.getElementById("HighscoreDiv");
    var zuruckButtonHighscore = document.getElementById("zuruckHighscoreButton");

var hidemenuhighscore = function () {
    hightscoreDiv.classList.toggle("hidden");
    buttonsDiv.classList.toggle("hidden");
    auslesen();

};

// Eventlistener für den Button "Spielanleitung" und den "Zurück" Button auf dem Spielanleitungs DIV
    highscoreButton.addEventListener("click", hidemenuhighscore);
    zuruckButtonHighscore.addEventListener("click", hidemenuhighscore);


// Funktion zum Anzeigen des Pause Divs

    var pauseDiv = document.getElementById("pauseDiv");
    var weiterButton = document.getElementById("weiterButton");

    var hidemenupause = function () {
        startGame(level);
        pauseDiv.classList.toggle("hidden");
    };

    // Eventlistener für den Button "Spielanleitung" und den "Zurück" Button auf dem Spielanleitungs DIV
    weiterButton.addEventListener("click", hidemenupause);






//------------------------------------------------------------------------------------------------------------ //
/*
**  Bereich Spiel
*/
//------------------------------------------------------------------------------------------------------------ //

// Canvas vorbereiten
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

// Listener hinzufügen
canvas.addEventListener("mousedown", mousedownSpielfeld, false);
document.addEventListener('keydown', keydownSpielfeld);

// Variablen vorbereiten
var maxTime = 30;
var spielfeld = new createSpielfeld();
var active = true;
var music = true;
var sound = true;
var level = null;
var moorhuhn = [];

// Timer vorbereiten
var timeTimer;
var moveTimer;
var moorhuhnTimer;

/* Dinge für das Spiel (allgemein) */

function activateMusic() {
    document.getElementById('background_music').muted = false;
    music = true;
}

function deactivateMusic() {
    document.getElementById('background_music').muted = true;
    music = false;
}

function activateSound() {
    sound = true;
}

function deactivateSound() {
    sound = false;
}

function playSound(elementID){
    document.getElementById(elementID).load();
    document.getElementById(elementID).play();
}

function loadGame(){
    if(spielfeld.time<=0){
        // Spielfeld leeren
        ctx.clearRect(0,0,1024,768);
        // Speicher für Moorhühner leeren
        moorhuhn = [];
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
        }
        document.getElementById('ammo').innerHTML = spielfeld.ammo;
        // Spielzeit wird überprüft
        if(isNaN(spielfeld.time) || spielfeld.time<=0){
            spielfeld.time = maxTime;
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
                addMoorhuhn();
                moorhuhn[i].src = document.getElementById("moorhuhn");
                moorhuhn[i].y = parseInt(window.localStorage.getItem("Moorhuhn"+i+".y"));
                moorhuhn[i].x = parseInt(window.localStorage.getItem("Moorhuhn"+i+".x"));
                moorhuhn[i].hit = window.localStorage.getItem("Moorhuhn"+i+".hit");
                moorhuhn[i].speed = window.localStorage.getItem("Moorhuhn"+i+".speed");
                moorhuhn[i].direction = window.localStorage.getItem("Moorhuhn"+i+".direction");
                moorhuhn[i].scale = window.localStorage.getItem("Moorhuhn"+i+".scale");
            }
            i++;
        }
    }
}

function startGame(a){
    // Level wird festgesetzt
    level = a;

    if(spielfeld.time===0){
        window.localStorage.clear();
        moorhuhn = [];
        loadGame();
    }
    timeTimer = setInterval(function(){
        timeSpielfeld();
    }, 1000);

    moveTimer = setInterval(function(){
        moveMoorhuhn();
        drawMoorhuhn();
    }, 15);

    moorhuhnTimer = setInterval(function(){
        addMoorhuhn();
    }, 1000);

    active=true;
}

function stopGame(){
    window.clearInterval(timeTimer);
    window.clearInterval(moveTimer);
    window.clearInterval(moorhuhnTimer);
    active=false;
}

function saveGame(){

    window.localStorage.clear();

    if(spielfeld.time > 0){
        window.localStorage.clear();
        window.localStorage.setItem("GameTime", spielfeld.time);
        window.localStorage.setItem("GameScore", spielfeld.score);
        window.localStorage.setItem("GameAmmo", spielfeld.ammo);

        for(var i=0; i < moorhuhn.length; i++){
            window.localStorage.setItem("Moorhuhn"+i, "Moorhuhn"+i);
            window.localStorage.setItem("Moorhuhn"+i+".y", moorhuhn[i].y);
            window.localStorage.setItem("Moorhuhn"+i+".x", moorhuhn[i].x);
            window.localStorage.setItem("Moorhuhn"+i+".hit", moorhuhn[i].hit);
            window.localStorage.setItem("Moorhuhn"+i+".speed", moorhuhn[i].speed);
            window.localStorage.setItem("Moorhuhn"+i+".direction", moorhuhn[i].direction);
            window.localStorage.setItem("Moorhuhn"+i+".scale", moorhuhn[i].scale);
        }
    }
    else if(spielfeld.time<=0){
        moorhuhn = [];
        window.localStorage.clear();
    }
}

/* Dinge für das Spielfeld */

function createSpielfeld(){
    this.time = null;
    this.score = null;
    this.ammo = null;
}

function timeSpielfeld(){
    spielfeld.time --;
    document.getElementById('time').innerHTML = spielfeld.time;

    if(spielfeld.time<=0){
        stopGame();
        //onlymenu.click();
        showHighscoreabfrage();
        console.log( "bla" );
    }
}

function keydownSpielfeld(e){
    if(spielfeld.time > 0){
        // Munition mit Strg nachladen
        if (e.keyCode === 17  && active===true){
            spielfeld.ammo = 10;
            document.getElementById('ammo').innerHTML = spielfeld.ammo;
            // Sound wiedergeben
            if(sound===true){
                playSound("reload_sound");
            }
        }

        // Spiel mit Leertaste unterbrechen
        else if (e.keyCode === 32) {
            if(active===true){
                // Spiel anhalten
                stopGame();
                // PauseDiv einblenden
                pauseDiv.classList.toggle("hidden");
            }else{
                // Spiel fortsetzen
                pauseDiv.classList.toggle("hidden");
                // PauseDIV ausblenden
                startGame(level);
            }
        }
    }
}

function mousedownSpielfeld(e){

    // Prüfen, ob Munition vorhanden ist
    if(active===true && spielfeld.ammo > 0){

        var mouseX = e.pageX - document.getElementById('game').offsetLeft;
        var mouseY = e.pageY - document.getElementById('game').offsetTop;
        if(spielfeld.time > 0){

            spielfeld.ammo += -1;
            document.getElementById('ammo').innerHTML = spielfeld.ammo;
            //Sound wiedergeben
            if(sound===true){
                playSound("shot_sound");
            }
            // Prüfen, ob Moorhuhn getroffen
            for(var i=0;i<moorhuhn.length;i++){

                if( mouseX > (moorhuhn[i].x - 30)
                        && mouseX < (moorhuhn[i].x + (30 * moorhuhn[i].scale) - 15)
                        && mouseY > (moorhuhn[i].y - 30)
                        && mouseY < (moorhuhn[i].y + (50 * moorhuhn[i].scale) - 15) ){


                    if(moorhuhn[i].hit === false){

                        // Punkte werden vergeben
                        if(moorhuhn[i].scale <= 1.05){
                            spielfeld.score += (15 * level);
                            document.getElementById('score').innerHTML = spielfeld.score;
                        }else{
                            if(moorhuhn[i].scale <= 1.35){
                                spielfeld.score += (10 * level);
                                document.getElementById('score').innerHTML = spielfeld.score;
                            }
                            else if(moorhuhn[i].scale > 1.35){
                                spielfeld.score += (5 * level);
                                document.getElementById('score').innerHTML = spielfeld.score;
                            }
                        }
                    }
                    // Trefferstatus wird gesetzt
                    moorhuhn[i].hit = true;
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
    this.speed = (parseInt(level) * 2) + 0.5;
    this.direction = direction;

    if(level===3){
        this.scale = 0.7;
    }else{
        this.scale = 0.7 + (Math.random() * 0.8);
    }
}

function addMoorhuhn(){
    // Moorhuhn ("links fliegend") hinzufügen
    moorhuhn.push(new createMoorhuhn("move_left"));
    // Moorhuhn ("rechts fliegend") hinzufügen
    moorhuhn.push(new createMoorhuhn("move_right"));
}

function moveMoorhuhn(){
    // Spielfeld leeren
    ctx.clearRect(0,0,1024,768);
    // Morrhühner in die jeweilige Richtung bewegen
    for(var i=0;i<moorhuhn.length;i++){
        if(moorhuhn[i].direction === "move_right"){
            moveMoorhuhnRight(i);
        }
        else{
            moveMoorhuhnLeft(i);
        }
    }
}

function moveMoorhuhnRight(i){
    if(moorhuhn[i].hit === true){
        // Anzeigebild
        if(moorhuhn[i].srcid === 0){
            moorhuhn[i].src = document.getElementById("moorhuhnRH0");
            moorhuhn[i].srcid = 1;
        }
        else if(moorhuhn[i].srcid === 1){
            moorhuhn[i].src = document.getElementById("moorhuhnRH0");
            moorhuhn[i].srcid = 2;
        }
        else if(moorhuhn[i].srcid === 2){
            moorhuhn[i].src = document.getElementById("moorhuhnRH1");
            moorhuhn[i].srcid = 0;
        }
        // Bewegungsrichtung
        moorhuhn[i].y += +1;
        if(moorhuhn[i].y > 768){
            window.localStorage.removeItem(moorhuhn[i]);
        }
    }else{
        // Anzeigebild
        if(moorhuhn[i].srcid === 0){
            moorhuhn[i].src = document.getElementById("moorhuhnR0");
            moorhuhn[i].srcid = 1;
        }
        else if(moorhuhn[i].srcid === 1){
            moorhuhn[i].src = document.getElementById("moorhuhnR0");
            moorhuhn[i].srcid = 2;
        }
        else if(moorhuhn[i].srcid === 2){
            moorhuhn[i].src = document.getElementById("moorhuhnR1");
            moorhuhn[i].srcid = 0;
        }
        // Bewegungsrichtung
        moorhuhn[i].x += - moorhuhn[i].speed;
        if(moorhuhn[i].x<0){
            window.localStorage.removeItem(moorhuhn[i]);
        }
    }
}

function moveMoorhuhnLeft(i){
    if(moorhuhn[i].hit === true){
        // Anzeigebild
        if(moorhuhn[i].srcid === 0){
            moorhuhn[i].src = document.getElementById("moorhuhnLH0");
            moorhuhn[i].srcid = 1;
        }
        else if(moorhuhn[i].srcid === 1){
            moorhuhn[i].src = document.getElementById("moorhuhnLH0");
            moorhuhn[i].srcid = 2;
        }
        else if(moorhuhn[i].srcid === 2){
            moorhuhn[i].src = document.getElementById("moorhuhnLH1");
            moorhuhn[i].srcid = 0;
        }
        // Bewegungsrichtung
        moorhuhn[i].y += +1;
        if(moorhuhn[i].y > 768){
            window.localStorage.removeItem(moorhuhn[i]);
        }
    }else{
        // Anzeigebild
        if(moorhuhn[i].srcid === 0){
            moorhuhn[i].src = document.getElementById("moorhuhnL0");
            moorhuhn[i].srcid = 1;
        }
        else if(moorhuhn[i].srcid === 1){
            moorhuhn[i].src = document.getElementById("moorhuhnL0");
            moorhuhn[i].srcid = 2;
        }
        else if(moorhuhn[i].srcid === 2){
            moorhuhn[i].src = document.getElementById("moorhuhnL1");
            moorhuhn[i].srcid = 0;
        }
        // Bewegungsrichtung
        moorhuhn[i].x += + moorhuhn[i].speed;
        if(moorhuhn[i].x<0){
            window.localStorage.removeItem(moorhuhn[i]);
        }
    }
}

function drawMoorhuhn(){
    for(var i=0;i<moorhuhn.length;i++){
        ctx.drawImage(moorhuhn[i].src, moorhuhn[i].x, moorhuhn[i].y, 40 * moorhuhn[i].scale, 50 * moorhuhn[i].scale);
    }
}


//------------------------------------------------------------------------------------------------------------ //
/*
**  Bereich Datenbank
*/
//------------------------------------------------------------------------------------------------------------ //

function schreiben(){

    // Das HIGHSCORE-Eintragen-Div wird ausgeblendet und das Highscore-Anzeigen-DIV eingeblendet





    var name = document.getElementById("name").value;
    var score = document.getElementById("score").innerHTML;

    //alert(name +" "+score);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'db_schreiben.php?&nname=' + name + '&ppunkte=' + score, true);
    xmlhttp.send();

    stopGame();

    menu.classList.toggle("hidden");
    frageHighscoreDIV.classList.toggle("hidden");
    buttonsDiv.classList.toggle("hidden");
    hightscoreDiv.classList.toggle("hidden");

    window.setTimeout( auslesen(), 5000 );

};




function auslesen(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'db_lesen.php', true);

    xmlhttp.addEventListener('readystatechange', function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        //console.log(xmlhttp.responseText);
        document.getElementById('tabelle').innerHTML = xmlhttp.responseText;
    }
});
xmlhttp.send();
}

 var senden = document.getElementById("highscoreSendenButton");
// Funktion zum Verschwinden lassen des Hauptmenüs und Anzeigen des Divs mit der Spielanleitung


// Eventlistener für den Button "Spielanleitung" und den "Zurück" Button auf dem Spielanleitungs DIV
    senden.addEventListener("click", schreiben);


//};
//game();




