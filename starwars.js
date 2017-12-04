(function() {
    var _ships = [];

    run(getShips, _ships).catch((err) => {
        console.log(err);
    });
 
 })();


function run(genFunc, massive){
    const genObject= genFunc(massive); //creating a generator object

    function iterate(iteration){ //recursive function to iterate through promises
        if(iteration.done) //stop iterating when done and return the final value wrapped in a promise
            return Promise.resolve(iteration.value);
        return Promise.resolve(iteration.value) //returns a promise with its then() and catch() methods filled
        .then(x => iterate(genObject.next(x))) //calls recursive function on the next value to be iterated
        .catch(x => iterate(genObject.throw(x))); //throws an error if a rejection is encountered
    }

    try {
        return iterate(genObject.next()); //starts the recursive loop
    } catch (ex) {
        return Promise.reject(ex); //returns a rejected promise if an exception is caught
    }
}


function *getShips(ships) {

    function createOption(name) {
        var option = document.createElement('option');
        option.text = name;
        return option;
    }

    for (let i = 1; i < 5; i++){
        //fetch the ships
        let shipsResponse = yield fetch("https://swapi.co/api/starships/?page=" + i);
        
        let currentShips = yield shipsResponse.json();
        ships.push(...currentShips.results);
    }
    
    var first = document.getElementById('firstShip');
    var second = document.getElementById('secondShip');
    for (let i = 0; i < ships.length; i++) {
        first.add(createOption(ships[i].name), i);
        second.add(createOption(ships[i].name), i);
    }

    // Listen for select changes and compare button press
    var firstShip = ships[0];
    var secondShip = ships[0];

    first.addEventListener("change", function() {
        firstShip = ships[first.selectedIndex];
    });

    second.addEventListener("change", function() {
        secondShip = ships[second.selectedIndex];
    });

    var compare = document.getElementById('compare');
    compare.addEventListener("click", function() {

        function compareShips(quality) {
            var firstQuality = document.getElementById(quality + "1");
            var secondQuality = document.getElementById(quality + "2");
            // Null row colors
            firstQuality.setAttribute("style", "background-color: white;");
            secondQuality.setAttribute("style", "background-color: white;");

            firstQuality.innerHTML = firstShip[quality];
            secondQuality.innerHTML = secondShip[quality];
            
            var firstSize = parseInt(firstShip[quality]);
            var secondSize = parseInt(secondShip[quality]);
            
            if (!isNaN(firstSize) && !isNaN(secondSize)) {
                if (firstSize > secondSize) {
                    firstQuality.setAttribute("style", "background-color: red;");
                }
                if (secondSize > firstSize) {
                    secondQuality.setAttribute("style", "background-color: red;");
                }
            }

        }
        
        document.getElementById("name1").innerHTML = firstShip.name;
        document.getElementById("name2").innerHTML = secondShip.name;

        var qualities = [ "cost_in_credits", 
                          "max_atmosphering_speed", 
                          "cargo_capacity",
                          "passengers" ];

        for (var quality of qualities) {
            compareShips(quality);
        }
    });
}