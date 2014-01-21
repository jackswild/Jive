//test("play tests", function() {
//	var param = {};
//	param.era = "historical";
//	param.spirit = "gin";
//ok(doRecipeSearch(param), )
//});

module("LogicGate Tests");
test("logicgate OR - one arg: round", function() {
	var gateOR = new LogicGate([isItemRound], LogicGate.OR);

	var testItem1 = { shape: "round" };
	var testItem2 = { shape: "square" };
	var testItem3 = { shape: "round", color: "red"};
	var testItem4 = { shape: "round", color:"green"};

    ok(gateOR.Evaluate(testItem1), "round correctly evaluated to true");
    ok(!gateOR.Evaluate(testItem2), "square correctly evaluated to false");
    ok(gateOR.Evaluate(testItem3), "round, red correctly evaluated to true");
    ok(gateOR.Evaluate(testItem4), "round, green correctly evaluated to true");
});

test("logicgate OR - two arg: round, green", function() {
	var gateOR = new LogicGate([isItemRound, isItemGreen], LogicGate.OR);

	var testItem1 = { shape: "round" };
	var testItem2 = { shape: "square" };
	var testItem3 = { shape: "round", color: "red"};
	var testItem4 = { shape: "round", color:"green"};

    ok(gateOR.Evaluate(testItem1), "round correctly evaluated to true");
    ok(!gateOR.Evaluate(testItem2), "square correctly evaluated to false");
    ok(gateOR.Evaluate(testItem3), "round, red correctly evaluated to true");
    ok(gateOR.Evaluate(testItem4), "round, green correctly evaluated to true");
});

test("logicgate OR - three arg: round, green, tall", function() {
	var gateOR = new LogicGate([isItemRound, isItemGreen], LogicGate.OR);

	var testItem1 = { shape: "round" };
	var testItem2 = { shape: "square" };
	var testItem3 = { shape: "round", color: "red"};
	var testItem4 = { shape: "round", color:"green"};
	var testItem5 = {shape: "round", color: "green", height: "tall"};

    ok(gateOR.Evaluate(testItem1), "round correctly evaluated to true");
    ok(!gateOR.Evaluate(testItem2), "square correctly evaluated to false");
    ok(gateOR.Evaluate(testItem3), "round, red correctly evaluated to true");
    ok(gateOR.Evaluate(testItem4), "round, green correctly evaluated to true");
    ok(gateOR.Evaluate(testItem5), "round, green, tall correctly evaluated to true");
});


test("logicgate AND - two arg: round, green", function() {
	var gateAND = new LogicGate([isItemRound, isItemGreen], LogicGate.AND);

	var testItem1 = { shape: "round" };
	var testItem2 = { shape: "square" };
	var testItem3 = { shape: "round", color: "red"};
	var testItem4 = { shape: "round", color:"green"};
	var testItem5 = { shape: "round", color: "green", height: "short"};

    ok(!gateAND.Evaluate(testItem1), "round correctly evaluated to false");
    ok(!gateAND.Evaluate(testItem2), "square correctly evaluated to false");
    ok(!gateAND.Evaluate(testItem3), "round, red correctly evaluated to false");
    ok(gateAND.Evaluate(testItem4), "round, green correctly evaluated to true");
    ok(gateAND.Evaluate(testItem5), "round, green, short correctly evaluated to true");
});

test("logicgate AND - three arg: round, green, short", function() {
	var gateAND = new LogicGate([isItemRound, isItemGreen, isItemShort], LogicGate.AND);

	var testItem1 = { shape: "round" };
	var testItem2 = { shape: "square" };
	var testItem3 = { shape: "round", color: "red" };
	var testItem4 = { shape: "round", color:"green" };
	var testItem5 = { shape: "round", color: "green", height: "short" };
	var testItem6 = { shape: "round", color: "green", height: "tall" };
	var testItem7 = { shape: "round", color: "red", height: "tall" };

    ok(!gateAND.Evaluate(testItem1), "round correctly evaluated to false");
    ok(!gateAND.Evaluate(testItem2), "square correctly evaluated to false");
    ok(!gateAND.Evaluate(testItem3), "round, red correctly evaluated to false");
    ok(!gateAND.Evaluate(testItem4), "round, green correctly evaluated to false");
    ok(gateAND.Evaluate(testItem5), "round, green, short correctly evaluated to true");
    ok(!gateAND.Evaluate(testItem6), "round, green, tall correctly evaluated to false");
    ok(!gateAND.Evaluate(testItem7), "round, red, tall correctly evaluated to false");
});

test("logicgate NOT - one arg: round", function() {
	var gateNOT = new LogicGate([isItemRound], LogicGate.NOT);

	var testItem1 = { shape: "round" };
	var testItem2 = { shape: "square" };
	var testItem3 = { shape: "round", color: "red"};
	var testItem4 = { shape: "round", color:"green"};

    ok(!gateNOT.Evaluate(testItem1), "round correctly evaluated to false");
    ok(gateNOT.Evaluate(testItem2), "square correctly evaluated to true");
    ok(!gateNOT.Evaluate(testItem3), "round, red correctly evaluated to false");
    ok(!gateNOT.Evaluate(testItem4), "round, green correctly evaluated to false");
});

test("logicgate NOT - two arg: round, red", function() {
	var gateNOT = new LogicGate([isItemRound, isItemRed], LogicGate.NOT);

	var testItem1 = { shape: "round" };
	var testItem2 = { shape: "square" };
	var testItem3 = { shape: "round", color: "red"};
	var testItem4 = { shape: "round", color:"green"};
	var testItem5 = { shape: "square", color:"green"};

    ok(!gateNOT.Evaluate(testItem1), "round correctly evaluated to false");
    ok(gateNOT.Evaluate(testItem2), "square correctly evaluated to true");
    ok(!gateNOT.Evaluate(testItem3), "round, red correctly evaluated to false");
    ok(!gateNOT.Evaluate(testItem4), "round, green correctly evaluated to false");
    ok(gateNOT.Evaluate(testItem5), "square, green correctly evaluated to true");
});

test("logicgate NOT - three arg: round, red, short", function() {

	//arrange
	var gateNOT = new LogicGate([isItemRound, isItemRed, isItemShort], LogicGate.NOT);

	var testItem1 = { shape: "round" };
	var testItem2 = { shape: "square" };
	var testItem3 = { shape: "round", color: "red"};
	var testItem4 = { shape: "round", color:"green"};
	var testItem5 = { shape: "square", color:"green"};
	var testItem6 = { shape: "square", color:"green", height: "short"};
	var testItem7 = { shape: "square", color:"green", height: "tall"};

	//act
	var result = gateNOT.Evaluate(testItem1);

	//assert
    ok(!result, "round correctly evaluated to false");
    ok(gateNOT.Evaluate(testItem2), "square correctly evaluated to true");
    ok(!gateNOT.Evaluate(testItem3), "round, red correctly evaluated to false");
    ok(!gateNOT.Evaluate(testItem4), "round, green correctly evaluated to false");
    ok(gateNOT.Evaluate(testItem5), "square, green correctly evaluated to true");
    ok(!gateNOT.Evaluate(testItem6), "square, green, short correctly evaluated to false");
    ok(gateNOT.Evaluate(testItem7), "square, green, tall correctly evaluated to true");
});

module("General Tests");
asyncTest("Verify Test Data is in place", function () {
	// arrange
	expect(1);

	// act
	$.getJSON("http://dev.jessicamarcus.com/jive/tests/qunit/data/test_cocktails.json", function(data) {

		// assert
		ok(data.recipes.length > 0, "Test cocktails were found");
		start();
	});
});

test("subtractArray", function () {
	// arrange 
	var array1 = ["red", "green", "blue"];
	var array2 = ["red", "green", "pink", "blue", "yellow"];

	// act
	var result = subtractArray(array1, array2);

	// assert
	equal(result.length, 2, "should be 2");
	ok(result[0] == "pink", "first item was not pink");
	ok(result[1] == "yellow", "second item was not yellow");
});

asyncTest("getIngredientValues test", function () {
	// arrange
	expect(1);
	var searchParameters = {}; // create search parameter object

	// act
	$.getJSON("http://dev.jessicamarcus.com/jive/tests/qunit/data/test_cocktails.json", function(data) {
		var recipeList = data.recipes;
		var allSpirits = getIngredientValues(recipeList, "ingredient", function(ingredient) {
			return (ingredient.type === "spirit");
		});
	
		// assert
		equal(allSpirits.length, 20, "should be 20");
		start();
	});
});

module("getRecipes Tests");
asyncTest("getRecipes for Historical cocktails", function () {
	// arrange
	expect(1);
	var searchParameters = {}; // create search parameter object
	searchParameters.era = "historical";

	$.getJSON("http://dev.jessicamarcus.com/jive/tests/qunit/data/test_cocktails.json", function(data) {
		var recipeList = data.recipes;

		// act
		var filteredRecipes = getRecipe(recipeList, searchParameters); // fill in all values
	
		// assert
		// Does filteredRecipes have expected number of results?
		// Does filteredRecipes have the expected cocktails in it?
		equal(filteredRecipes.length, 10, "filteredRecipes should have 10 recipes, and had " + filteredRecipes.length); 
		start();
	});
});

asyncTest("getRecipe Historical and Gin cocktails", function () {
	// arrange
	expect(1);
	var searchParameters = {}; // create search parameter object
	searchParameters.era = "historical";
	searchParameters.spirit = "gin";

	// act
	$.getJSON("http://dev.jessicamarcus.com/jive/tests/qunit/data/test_cocktails.json", function(data) {
		var recipeList = data.recipes;
		var filteredRecipes = getRecipe(recipeList, searchParameters); // fill in all values
	
		// assert
		equal(filteredRecipes.length, 4, "There should be 4 Historical Gin Cocktails");
		start();
	});
});

function countByPredicate(items, predicate) {
	var count = 0;
	for (var i = 0; i < items.length; i++)
	{
		if (predicate(items[i]))
			count++;
	}
	return count;
}

asyncTest("getRecipe Historical and Stirred", function () {
	// arrange
	expect(1);
	var searchParameters = {}; // create search parameter object
	searchParameters.era = "historical";
	searchParameters.technique = "stirred";

	// act
	$.getJSON("http://dev.jessicamarcus.com/jive/tests/qunit/data/test_cocktails.json", function(data) {
		var recipeList = data.recipes;
		var filteredRecipes = getRecipe(recipeList, searchParameters); // fill in all values

		// assert

		equal(filteredRecipes.length, 8, "filteredRecipes should have 8 recipes");
		start();
	});
});

asyncTest("getRecipe for Whiskey cocktails", function () {
	// arrange
	expect(1);
	var searchParameters = {}; // create search parameter object
	searchParameters.spirit = "whiskey";
	
	// act
	$.getJSON("http://dev.jessicamarcus.com/jive/tests/qunit/data/test_cocktails.json", function(data) {
		var recipeList = data.recipes;
		var filteredRecipes = getRecipe(recipeList, searchParameters); // fill in all values
	
		// assert
		equal(filteredRecipes.length, 7, "filteredRecipes should have 7 whiskey recipes");
		start();
	});
});

asyncTest("getRecipe Whiskey and Peychaud's Bitters", function () {
	// arrange
	expect(1);
	var searchParameters = {}; // create search parameter object
	searchParameters.spirit = "whiskey";
	searchParameters.bitters = "Peychaud's Bitters";

	// act
	$.getJSON("http://dev.jessicamarcus.com/jive/tests/qunit/data/test_cocktails.json", function(data) {
		var recipeList = data.recipes;
		var filteredRecipes = getRecipe(recipeList, searchParameters); // fill in all values
	
		// assert
		equal(filteredRecipes.length, 2, "filteredRecipes should have 2 recipes");
		start();
	});
});

// (whiskey OR vodka) AND NOT ( <else> )
asyncTest("getRecipe AND / NOT test: recipes containing only the spirits 'whiskey' and 'vodka'", function () {
	// arrange
	expect(2);
	var searchParameters = {}; // create search parameter object
	searchParameters.spirits = ["whiskey", "vodka"];

	// act
	$.getJSON("http://dev.jessicamarcus.com/jive/tests/qunit/data/test_cocktails.json", function(data) {
		var recipeList = data.recipes;
		var filteredRecipes = getRecipe(recipeList, searchParameters); // fill in all values
		
		QUnit.push(true, true, true, JSON.stringify(filteredRecipes));

		// assert
		equal(filteredRecipes.length, 0, "should be 0");
		start();
	});
});

asyncTest("getRecipe for Modern Whiskey or Vodka cocktails", function () {
	// arrange
	expect(1);
	var searchParameters = {}; // create search parameter object
	searchParameters.spirits = ["whiskey", "vodka"];
	searchParameters.era = "modern";
	
	// act
	$.getJSON("http://dev.jessicamarcus.com/jive/tests/qunit/data/test_cocktails.json", function(data) {
		var recipeList = data.recipes;
		var filteredRecipes = getRecipe(recipeList, searchParameters); // fill in all values
	
		// assert
		equal(filteredRecipes.length, 3, "filteredRecipes should have 3 modern whiskey exclusively or vodka recipes");
		start();
	});
});

module("Sample Test");
asyncTest("getRecipe sample test", function () {
	// arrange
	expect(1);
	var searchParameters = {}; // create search parameter object

	// act
	$.getJSON("http://dev.jessicamarcus.com/jive/tests/qunit/data/test_cocktails.json", function(data) {
		var recipeList = data.recipes;
		var filteredRecipes = getRecipe(recipeList, searchParameters); // fill in all values
	
		// assert
		equal(filteredRecipes.length, 24, "should be 24");
		start();
	});
})