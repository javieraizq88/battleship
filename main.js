// Codigo para jugar battleship


var model = {
    boardSize: 7, 
    numShips: 4, 
    shipLength: 3, 
    shipsSunk: 0, 

    ships: [ 
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
    ], //  la posición de cada barco se pone 0 y sin disparos para que los ubique randoom segun la fx location



    fire: function (guess) {
     // fx de disparos HIT cuando el disparo le da a algun barco segun la posición por la fx location 
     // Opción que no deja disparar dos veces a la misma posición
     // fx para MISS cuando las coordenadas ingresadas no hay ningun barco
     
        for (let i = 0; i < this.numShips; i++) {  
            var ship = this.ships[i]; 
            var index = ship.locations.indexOf(guess); 

     // cuando ya se dispararon las 3 posiciones del barco
            if (ship.hits[index] === "hit") { 
                view.displayMessage("You already hit this location"); 
                return true;
            } else if (index >= 0) {
                ship.hits[index] = "hit"; 
                view.displayHit(guess);
                view.displayMessage("Hit!!"); 

                if (this.isSunk(ship)) { 
                    view.displayMessage("You sank my ship!"); 
                    this.shipsSunk++; 
                }
                return true;
            }
        }

        view.displayMiss(guess);
        view.displayMessage("You missed!");
        return false;
    },

    isSunk: function(ship) { 
     // cuando el barco le han disparado 3 veces segun las 3 coordenadas return true y se hunde
      
        for (let index = 0; index < this.shipLength; index++)  { 
            if (ship.hits[index] !== "hit") { 
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function () {
      // fx para generar posiciones de los barcos
       
        var locations;

        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        
      // muesta en console las coordenadas de las posiciones de los barcos
        console.log("ships array is in: "); 
        console.log(this.ships);
    },

    generateShip: function () {
     // fx para crear barcos y ponerlos de manera aleatoria en el tablero 
     
        var direction = Math.floor(Math.random() * 2); 
        var row, col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1)); 
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1)); 
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) { 
                newShipLocations.push(row + "" + (col + i)); 
            } else {
                newShipLocations.push((row + i) + "" + col); 
            }
        }
        return newShipLocations;
    },

    collision: function (locations) {
      //fx para evitar que dos barcos esten en la misma posicion. 
      // Si la posicion del barco en j es >= 0, significa q no hay 2 barcos en el mismo casillero 
      
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
     // llama la clase hit de CSS 
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit"); 
    },

    displayMiss: function (location) {
     // llama la clase miss de CSS 
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss"); 
    }
};

var controller = {
    guesses: 0,

    processGuess: function (guess) {
// fx que cuenta los disparos
// Si el el n° de barcos hundidos es = al n° de barcos, manda el msg
        var location = parseGuess(guess);
        if (location) {
            this.guesses++; 
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) { 
                view.displayMessage("You sank all the battleships in " + this.guesses + " guesses!");
            }
        }
    }

};

function parseGuess(guess) {
  // validacion del input
  
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) { 
        alert("Please enter a valid guess. Must be letter and number");
    } else {
        var firstChar = guess.charAt(0); 
        var row = alphabet.indexOf(firstChar); 
        var column = guess.charAt(1); 

        if (isNaN(row) || isNaN(column)) { 
            alert("Not a valid input");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Input is not located on this board");
        } else { 
            return row + column;
        }
    }
    return null;
};

function handleFireButton() {
  // codigo de posicion del input
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value.toUpperCase(); 

    controller.processGuess(guess);

    guessInput.value = "";
}

function handleKeyPress(e) {
 // activacion del boton fire por Enter o al hacer click
    var fireButton = document.getElementById("fireButton");

    e = e || window.event; 

    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
};

window.onload = init;  // se reinicia el juego al actualizar la pagina

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}