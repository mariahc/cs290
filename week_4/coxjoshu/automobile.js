function Automobile( year, make, model, type ){
    this.year = year; //integer (ex. 2001, 1995)
    this.make = make; //string (ex. Honda, Ford)
    this.model = model; //string (ex. Accord, Focus)
    this.type = type; //string (ex. Pickup, SUV)

    this.logMe = function(includeType) {
        if (includeType)
            console.log(`${this.year} ${this.make} ${this.model} ${this.type}`);
        else
            console.log(`${this.year} ${this.make} ${this.model}`);
    }
}

var automobiles = [
    new Automobile(1995, "Honda", "Accord", "Sedan"),
    new Automobile(1990, "Ford", "F-150", "Pickup"),
    new Automobile(2000, "GMC", "Tahoe", "SUV"),
    new Automobile(2010, "Toyota", "Tacoma", "Pickup"),
    new Automobile(2005, "Lotus", "Elise", "Roadster"),
    new Automobile(2008, "Subaru", "Outback", "Wagon")
    ];

/*This function sorts arrays using an arbitrary comparator. You pass it a comparator and an array of objects appropriate for that comparator and it will return a new array which is sorted with the largest object in index 0 and the smallest in the last index*/
function sortArr( comparator, array ){
    var sortedArray = [];
    var _array = array.slice();

    while (sortedArray.length != array.length)
        // Seed first element
        var selectedElem = _array[0];
        for (var elem of _array) {
            selectedElem = comparator(selectedElem, elem) ? selectedElem : elem;
        }

        sortedArray.push(selectedElem);

        // Filter out selected element
        _array = [
            ..._array.slice(0, _array.indexOf(selectedElem)),
            ..._array.slice(_array.indexOf(selectedElem)+1)
        ];
    }

    return sortedArray;
}

/*A comparator takes two arguments and uses some algorithm to compare them. If the first argument is larger or greater than the 2nd it returns true, otherwise it returns false. Here is an example that works on integers*/
function exComparator( int1, int2){
    if (int1 > int2){
        return true;
    } else {
        return false;
    }
}

/*For all comparators if cars are 'tied' according to the comparison rules then the order of those 'tied' cars is not specified and either can come first*/

/*This compares two automobiles based on their year. Newer cars are "greater" than older cars.*/
function yearComparator( auto1, auto2){
    return (auto1.year > auto2.year);
}

/*This compares two automobiles based on their make. It should be case insensitive and makes which are alphabetically earlier in the alphabet are "greater" than ones that come later (from A-Z).*/
function makeComparator( auto1, auto2){
    return (auto1.make.toLowerCase() < auto2.make.toLowerCase());
}

/*This compares two automobiles based on their type. The ordering from "greatest" to "least" is as follows: roadster, pickup, suv, wagon, (types not otherwise listed). It should be case insensitive. If two cars are of equal type then the newest one by model year should be considered "greater".*/
function typeComparator( auto1, auto2){
    let type1 = auto1.type.toLowerCase();
    let type2 = auto2.type.toLowerCase();

    // Check equal types
    if (type1 == type2) {
        return (auto1.year > auto2.year);
    }

    // Check against auto1
    if (type1 == 'roadster') {
        return true;
    } else if (type1 == 'pickup') {
        return (type2 != 'roadster');
    } else if (type1 == 'suv') {
        return (type2 != 'roadster' || type2 != 'pickup');
    } else if (type1 == 'wagon') {
        return (type2 != 'roadster' || type2 != 'pickup' || type2 != 'suv');
    } else {
        return false;
    }
}

/*Your program should output the following to the console.log, including the opening and closing 5 stars. All values in parenthesis should be replaced with appropriate values. Each line is a seperate call to console.log.

Each line representing a car should be produced via a logMe function. This function should be added to the Automobile class and accept a single boolean argument. If the argument is 'true' then it prints "year make model type" with the year, make, model and type being the values appropriate for the automobile. If the argument is 'false' then the type is ommited and just the "year make model" is logged.

*****
The cars sorted by year are:
(year make model of the 'greatest' car)
(...)
(year make model of the 'least' car)

The cars sorted by make are:
(year make model of the 'greatest' car)
(...)
(year make model of the 'least' car)

The cars sorted by type are:
(year make model type of the 'greatest' car)
(...)
(year make model type of the 'least' car)
*****

As an example of the content in the parenthesis:
1990 Ford F-150 */

console.log(`*****\nThe cars sorted by year are:`)
sortArr(yearComparator, automobiles).forEach( auto => auto.logMe());
console.log(`\nThe cars sorted by make are:`)
sortArr(makeComparator, automobiles).forEach( auto => auto.logMe());
console.log(`\nThe cars sorted by type are:`)
sortArr(typeComparator, automobiles).forEach( auto => auto.logMe(true));
console.log(`*****`)
