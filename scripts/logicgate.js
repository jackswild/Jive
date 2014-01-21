/// LogicGate class; this class is used to hold the desired predicates, the operator to evaluate them with, and provides an evaluate method to execute the operator against the predicates
/// LogicGate is a 'superpredicate' - it is a single predicate that can chain multiple predicates to evaluate against a single item
function LogicGate(predicates, operator) {

    // Predicates is an array of predicates to be evaluated by Operator
    this.Predicates = predicates ? predicates : [];
    // Operator is a method that takes an item, and the array of Predicates, and evaluates them
    this.Operator = operator ? operator : LogicGate.OR;

    var _scope = this;
    this.Evaluate = function (item) {
        return _scope.Operator(item, _scope.Predicates);
    };
}

/// LogicGate Operators
LogicGate.AND = function (item, predicates) { 
    //returns true if all predicates are true
    if (predicates) {
        for (var i = 0; i < predicates.length; i++) {
            if (!predicates[i](item)) {
                return false;
            }
        }
        return true;
    }
    return false;
};

LogicGate.OR = function (item, predicates) {
    //returns true if any predicate is true

    //for each predicate, if it evaluates to true, return true;
    if (predicates) {
        for (var i = 0; i < predicates.length; i++) {
            if (predicates[i](item)) {
                return true;
            }
        }
    }
    return false;
};

LogicGate.XOR = function (item, predicates) {
    //returns true only if exactly one predicate is true
    var isTrue = false;
    if (predicates) {
        for (var i = 0; i < predicates.length; i++) {
            if (predicates[i](item)) {
                if (isTrue) {
                    return false;
                } else {
                    isTrue = true;
                }
            }
        }
    }
    return isTrue;
};

LogicGate.NOT = function (item, predicates) {
    //returns true if no predicate is true
    if (predicates) {
        for (var i = 0; i < predicates.length; i++) {
            if (predicates[i](item)) {
                return false;
            }
        }
    }
    return true;
};


//unit tests / demo code ------------------------------------------------------------
//sample predicates
function isItemTall(item) {
    return item.height == "tall";
}
function isItemShort(item) {
    return item.height == "short";
}
function isItemRound(item) {
    return item.shape == "round";
}
function isItemSquare(item) {
    return item.shape == "square";
}
function isItemRed(item) {
    return item.color == "red";
}
function isItemGreen(item) {
    return item.color == "green";
}

//Unit tests
function testOR() {

    var gateOR = new LogicGate([isItemRound, isItemSquare], LogicGate.OR);

    var testItem = { shape: 'round' };

    if (!gateOR.Evaluate(testItem)) {
        alert("testOR failed!");
    }
}

//test is round AND tall AND NOT green
function testAND_withNOT() {
    var gateNOT = new LogicGate([isItemGreen], LogicGate.NOT);
    var gateAND = new LogicGate([isItemRound, isItemTall, gateNOT.Evaluate], LogicGate.AND);
    var testItem = { shape: 'round', height: 'tall', color: 'red' };
    
    if (!gateAND.Evaluate(testItem)) {
        alert("testAND_withNOT failed");
    }
}