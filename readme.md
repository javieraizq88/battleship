# codigo comentado 

var model = {
    boardSize: 7, //  mumero de cajas del tablero 
    numShips: 4, // numero de barcos
    shipLength: 3, // largo de los barcos
    shipsSunk: 0, // parte el juego sin barcos hundidos

# la posición de cada barco se pone 0 y sin disparos para que sea al randoom segun la fx location
    ships: [ 
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
    ],

# fx de disparos HIT y MISS
    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {  //cuenta los disparos 
            var ship = this.ships[i]; // cuantos barcos les han disparado
            var index = ship.locations.indexOf(guess); 

            if (ship.hits[index] === "hit") { 
                view.displayMessage("You already hit this location"); // para no disparar dos veces a la misma posicion
                return true;
            } else if (index >= 0) {
                ship.hits[index] = "hit"; 
                view.displayHit(guess);
                view.displayMessage("Hit!!"); //si disparas y el barco esta en la posicion, muestra hit

                if (this.isSunk(ship)) { // cuando se hunde el barco
                    view.displayMessage("You sank my ship!"); 
                    this.shipsSunk++; //suma cuantos barcos han sido hundidos
                }
                return true;
            }
        }

        view.displayMiss(guess);
        view.displayMessage("You missed!");
        return false;
    },

# cuando el barco le han disparado 3 veces segun las 3 coordenadas return true y se hunde
    isSunk: function(ship) { 
        for (let index = 0; index < this.shipLength; index++)  { 
            if (ship.hits[index] !== "hit") { // indica el index para el hit
                return false;
            }
        }
        return true;
    },

# fx para generar posiciones de los barcos e impide que dos o más barcos estén superpuestos 
    generateShipLocations: function () {
        var locations;

        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        console.log("ships array is in: "); 
        console.log(this.ships); //muestra en console donde estan los barcos
    },

# fx para crear barcos
    generateShip: function () {
        var direction = Math.floor(Math.random() * 2); 
        var row, col;

        if (direction === 1) { // posicion horizontal random
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1)); // random x el lardo del tablero x largo del barco + 1 para q no quede en 0
        } else {// posicion vertical random
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));// random x el lardo del tablero x largo del barco + 1 para q no quede en 0
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) { 
                newShipLocations.push(row + "" + (col + i)); // si la posicion del barco va a ser horizontal, primero va a ser el row 
            } else {
                newShipLocations.push((row + i) + "" + col); // si la posicion del barco va a ser vertical, primero va a ser el col 
            }
        }
        return newShipLocations;
    },

# fx para evitar que dos bardos esten en la misma posicion. Si la posicion del barco en j es >= 0, significa q no hay 2 barcos en el mismo casillero 
    collision: function (locations) {
        for (let i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) { 
                    return true;
                }
            }
        }
        return false;
    },

};

var view = {
    displayMessage: function (msg) { 
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function (location) {
        var cell = document.getElementById(location);
# llama la clase hit de CSS 
        cell.setAttribute("class", "hit"); 
    },

    displayMiss: function (location) {
        var cell = document.getElementById(location);
# llama la clase miss de CSS 
        cell.setAttribute("class", "miss"); 
    }
};

var controller = {
    guesses: 0,

# fx que cuenta los disparos y si el el n° de barcos hundidos es = al n° de barcos manda el msg
    processGuess: function (guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++; //cuenta los disparos
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all the battleships in " + this.guesses + " guesses!");
            }
        }
    }

};

# validacion del input
function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) { // cuando el input esta vacio o tiene mas de 2 caracteres muestra el msg
        alert("Please enter a valid guess. Must be letter and number");
    } else {
        var firstChar = guess.charAt(0); // el primer caracter del input
        var row = alphabet.indexOf(firstChar); // va a convertir la A en 1, la B en 2 ....
        var column = guess.charAt(1); // el segundo caracter del input

        if (isNaN(row) || isNaN(column)) { // si la row o col no existen manda el msg
            alert("Not a valid input");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) { // valida que el input sea dentro del tablero y de los caracteres 
            alert("Input is not located on this board");
        } else { // si el input esta correcto, manda la posicion
            return row + column;
        }
    }
    return null;
};

# codigo de posucion del input
function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value.toUpperCase(); // convierte las letras minusculas a mayusculas

    controller.processGuess(guess);

    guessInput.value = "";
}
# activacion del boton fire por enter o click
function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");

    e = e || window.event; 

    if (e.keyCode === 13) { 
        fireButton.click();
        return false;
    }
};

# se reinicia el juego al actualizar la pagina
window.onload = init;

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
};