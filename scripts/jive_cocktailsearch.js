
//for now, this becomes a default what you see when you go to the page load of all recipes
//later, this can become all sorts of things
$.getJSON("./data/cocktails.json", function(data) {

	var items = [];

	// With TDD (test driven development) you write your test FIRST, before even writing the code to satisfy it

	var valuesByIngredient = getIngredientValues(data.recipes, "ingredient", function (ingredient) {
		if (ingredient.isBase)
			{ return true; }
	});
	if (valuesByIngredient.length == 0)
	{
		alert("No values found for base spirit!");
	}
	else
	{
		bindDropdown("#ddlBaseSpirit", valuesByIngredient);
	}	

	var valuesBySpirit = getIngredientValues(data.recipes, "ingredient", function (ingredient) {
		// this line actually returns the boolean (true / false) result of this expression 
		return (ingredient.type == "spirit");
	});
	if (valuesBySpirit.length == 0)
	{
		alert("No values found for spirit!");
	}
	else
	{
		bindDropdown("#ddlSpirits", valuesBySpirit);
	}	

	var valuesByBrand = getIngredientValues(data.recipes, "brand", function (ingredient) {
		if (ingredient.brand)
			{ return true; }
	});
	if (valuesByBrand.length == 0)
	{
		alert("No values found for Brand!");
	}
	else
	{
		bindDropdown("#ddlBrand", valuesByBrand);
	}

	var valuesByBitters = getIngredientValues(data.recipes, "ingredient", function (ingredient) {
		if (ingredient.type == "bitters")
			{ return true; }
	});
	if (valuesByBitters.length == 0)
	{
		alert("No values found for Bitters!");
	}
	else
	{
		bindDropdown("#ddlBitters", valuesByBitters);
	}

	var valuesByEra = getValues(data.recipes, "era");
	if (valuesByEra.length == 0)
	{
		alert("No values found for era!");
	}
	else
	{
		bindDropdown("#ddlEra", valuesByEra);
	}

	var valuesByTechnique = getValues(data.recipes, "technique");
	if (valuesByTechnique.length == 0)
	{
		alert("No values found for technique!");
	}
	else
	{
		bindDropdown("#ddlTechnique", valuesByTechnique);
	}

	// for each recipe in data.recipes
	// WAS: $.each(data.recipes, function ( key, recipe)
	$.each(doRecipeSearch, function(key, recipe)
	{
	   renderRecipe(recipe, items);
	});
 
  $("<table>", {
    id: "recipeContainer",
    html: items.join("")
  }).replaceAll("#recipeContainer");
}); //end of getJSON callback


var DEFAULT_ITEM_SELECT = "--select item--";

//rename this method - it's the search click method at the moment
function performSearchButton() {

	var param = {};

	var ddl = cocktailSearchForm.ddlEra;
	var selected = ddl.options[ddl.selectedIndex].text;
	if (selected);
	{
		//what this implies but doesn't say explicitly is... 
		//not just set era on param, 
		//but create the era field on param if it does not exist
		//therefore, the code that looks at the parameters object to see if era exists or not 
		// 		uses this line to know you want to search with era
		param.era = selected;
	}

	ddl = cocktailSearchForm.ddlTechnique;
	selected = ddl.options[ddl.selectedIndex].text;
	if (selected);
	{
		param.technique = selected;
	}

	ddl = cocktailSearchForm.ddlBaseSpirit;
	selected = ddl.options[ddl.selectedIndex].text;
	if (selected);
	{
		param.baseSpirit = selected;
	}
	ddl = cocktailSearchForm.ddlSpirits;
	selected = ddl.options[ddl.selectedIndex].text;
	if (selected);
	{
		param.spirit = selected;
	}
	ddl = cocktailSearchForm.ddlBitters;
	selected = ddl.options[ddl.selectedIndex].text;
	if (selected);
	{
		param.bitters = selected;
	}
	ddl = cocktailSearchForm.ddlBrand;
	selected = ddl.options[ddl.selectedIndex].text;
	if (selected);
	{
		param.brand = selected;
	}
	//Add a "--select item--" entry to each ddl
	//if the value is that, then do not add a parameter to the parameters object

	doRecipeSearch(param, function(recipeList) {
		renderRecipeInfo(recipeList);
		renderRecipeClickableList(recipeList);
	});
}


//Begin library code

//create new method to get recipes, and then filter them with parameter object you pass in.
function doRecipeSearch(parameters)
{
	//get recipes - this code exists above 
	$.getJSON("./data/cocktails.json", function(data) {
		//getJson callback:
		//filter them - this code already exists
		var filteredRecipes = getRecipe(data.recipes, parameters);  

		//render them
		renderRecipeInfo(filteredRecipes);
		renderRecipeClickableList(filteredRecipes);
	});
}

//create method to render recipes
function renderRecipeInfo(recipeList)
{
	var recipeItems = [];
	// for each recipe in data.recipes
	$.each(recipeList, function (key, recipe)
	{
	   renderRecipe(recipe, recipeItems);
	});
 
    $("<table>", {
    	id: "recipeContainer", 
    	html: recipeItems.join("")
  	}).replaceAll("#recipeContainer");
}

//method to create clickable list of recipes
function renderRecipeClickableList(recipeList)
{

}

 
//take a "values" list, assign it to an existing <select> ID in the html, and generate the dropdown from the
function bindDropdown(ddlId, values) {
	var ddl = $(ddlId);
	ddl.append(
			$("<option></option>")
		);
	$.each(values, function(index, option) {
		ddl.append(
			$("<option></option>").val(index).html(option)
		);
	});
}


//look through all recipes in 'recipes' array for the 'era' item, and sort by given value.

//function getRecipeByEra(recipeList, era) {
//	var resultRecipes =[];
//	for (var i=0; i<recipeList.length; i++) {
//		
//		// get recipe out of array by index
//		var recipe = recipeList[i];
//
//		//if the recipe's era is equal to searchEra, then put it into resultRecipes
//		if (recipe.era == era) {
//			resultRecipes.push(recipe);
//		}
//	}
//	return resultRecipes;	
//}
////////////////////

//to generate any of the dropdowns:

//iterate through all recipes in the array, look for the specified key, and assemble a list of the values found
// -- remove all duplicate values
// -- alphabetize this list
// -- add in a blank item - default state "selected" in the dropdown
// xxxxx feed values into the dropdown

function getValues(data, key) {
	//put all of the recipes into an array;	
	var resultList = []; //where raw list is assembled

	//goes through list of recipes one by one		
	for (var i=0; i<data.length; i++) { 
		//current recipe being worked on
		var item = data[i];  
		//pull the value from the key, and put it in resultList
		addSortedDistinct(resultList,item[key]); 
	}

	return resultList;
}

function getIngredientValues(data, key, validPredicate) {
	//put all of the recipes into an array;	
	var resultIngredientList = []; //where raw list is assembled

	//goes through list of recipes one by one		
	for (var i=0; i<data.length; i++) { 
		//current recipe being worked on
		var recipe = data[i];  
		
		// iterate over recipe.ingredients
		for (var j=0; j<recipe.ingredients.length; j++) { 
			var ingredient = recipe.ingredients[j];

			// if validPredicate exists then use it
			if (validPredicate)
			{
				if (validPredicate(ingredient))
				{
					addSortedDistinct(resultIngredientList, ingredient[key]);
					continue;
				}
			} else //no validPredicate, so always push
			{
				// push ingredient[key] onto resultIngredientList
				addSortedDistinct(resultIngredientList, ingredient[key]);
			}
		}
	}
	return resultIngredientList;
}

/// Add a value to the list in the correctly sorted location, and do not add it if it is a dupe 
function addSortedDistinct(list, value)
{
	//if there's just one item, just add it
	if (list.length == 0)
	{
		list.push(value);
		return;
	}

	//find the correct location in the list, hunting through it
	//iterate through the array
	//find the index where indexed item is less than value, and index+1 is greater than value
	var i=0;
	var a=list[i];
	// below line MUST take place, it is a bugfix to prevent first item being duplicated
	if (a==value) return;
	
	while (a<value && i<list.length)
	{
		i++;
		a = list[i];
		if (a==value) return;
	}
	// i is now the index of the first item a that is greater than value
	if (i==list.length)
	{
		list.push(value);
	} else {
		list.splice(i, 0, value);
	}
}


//////////////////////

function renderRecipe(recipe, items)
{
  $.each( recipe, function( key, val ) {
      if (key == "ingredients")
      {
        // ingredient template
        items.push("<tr><td class='key'>" + key + "</td><td class='val'>" + renderIngredients(val) + "</td></tr>"); 
      }
      else
      {
        // these are item templates
        items.push("<tr><td class='key'>" + key + "</td><td class='val'>" + val + "</td></tr>");
      }

  });
}

function renderIngredients(ingredientList)
{
	var output = "<ul class='ingredients'>";
	if (ingredientList.length > 0)
	{
		for (var i=0; i<ingredientList.length;i++)
		{
			var ingredient = ingredientList[i];
			// this line is my template
			if (ingredient.tradeName) //if ingredient.tradeName is NOT null
			{
				//if there is a tradeName present
				output +="<li>" + ingredient.tradeName + ": " + ingredient.amount + "</li>";
			}
			else	
			{
				//if the ingredient is not a tradeName
				output += "<li>" + ingredient.ingredient + ": " + ingredient.amount + "</li>";		
			}
		}
	}
	output += "</ul>";
	return output;
}


// SEARCH CODE BELOW ***************************
// Take parameters object and load predicates into predicateList for getRecipeByAdvancedSearch
function getRecipe(allRecipes, parameters) {
	var predicateList = [];

	addSearchPredicate(predicateList, predicateBittersIs, parameters.bitters);
	addSearchPredicate(predicateList, predicateBaseSpiritIs, parameters.baseSpirit);
	addSearchPredicate(predicateList, predicateSpiritIs, parameters.spirit);
	addSearchPredicate(predicateList, predicateEraIs, parameters.era);
	addSearchPredicate(predicateList, predicateTechniqueIs, parameters.technique);	
	addSearchPredicate(predicateList, predicateBrandIs, parameters.brand);

	return getRecipeByAdvancedSearch(allRecipes, predicateList, parameters.flagAll);
}

function addSearchPredicate (predicateList, predicate, parameter)
{
	if (parameter)
	{
		predicateList.push(function (item) {
			return predicate(item, parameter);
		});
	}
}

// if one ingredient in recipe matches predicate, return true, otherwise return false
function matchRecipe(recipe, predicate) {
	if (predicate(recipe))
	{
		return true;
	}
	//we iterate through the 'ingredients' array inside each recipe
	for (var i=0; i < recipe.ingredients.length; i++) 
	{		
		if (predicate(recipe.ingredients[i]))
		{
			return true;
		}
	}
	return false;
}
function getRecipeByAdvancedSearch(recipeList, findPredicateList, flagAll) {
// this new array is where the list of recipes that satisfies the criteria is assembled
	var resultRecipes = [];

	  //so you'd iterate over all the recipes
	 for (var i=0; i < recipeList.length; i++) {
	   
		//for each iteration, 'recipe' is the holder as you work through each item in allRecipes
		var recipe = recipeList[i];

		//for each recipe, if an ingredient is found that contains both ingredient="gin" AND isBase = true, put the cocktail 
		//in the resultRecipes array.	
		var matched = false;
			
		//AND: cocktail must have ingredients that match all predicates
		//OR: cocktail must match one predicate
		 for (var k=0; k < findPredicateList.length; k++)
		 {
			if (matchRecipe(recipe, findPredicateList[k]))
			{
				// set initial true if this is the first match
				matched = true;									
				if (!flagAll)
				{
					// if we only have to match one, then go ahead and exit the loop because we've just matched one
					break;
				}								
			}	
			else
			{
				//DO NOT UNSET the matched value UNLESS we must match all
				//if all predicates have to match, and we've reached here, it means a predicate did not match, and we fail.				
				if (flagAll)
				{
					matched = false; 
					break;
				}
			}			
		}
		if (matched)
		{
			 resultRecipes.push(recipe)
		}			 					
	}
	//and then return those that satisfy that criteria
	return resultRecipes;
}

// PREDICATES

function predicateBaseSpiritIs(ingredient, baseSpirit) {
	//we poll to see if a given ingredient is a base spirit
	if (ingredient.isBase == true) {
		if (ingredient.ingredient == baseSpirit) {
			return true;	  
		}
	}
	return false;
}

function predicateBrandIs(ingredient, brand) {
	if (ingredient.brand==brand) {
			return true;	  
		}
	return false;
}

function predicateBittersIs(ingredient, bitters) {
	if (ingredient.type == "bitters") {
		if (ingredient.ingredient == bitters) {
			return true;	  
		}
	}
	return false;
}

function predicateSpiritIs(ingredient, spirit) {
	if (ingredient.type == "spirit") {
		if (ingredient.ingredient == spirit) {
			return true;	  
		}  
	}
	return false;
}	

function predicateEraIs(recipe, era) {
	if (recipe.era == era) {
		return true;
	}
	return false;
}

function predicateTechniqueIs(recipe, technique) {
	if (recipe.technique == technique) {
		return true;
	}
	return false;
}


// ARCHIVAL CODE BELOW ###################################

//function getRecipeByBaseSpirit(allRecipes, baseSpirit) {
//	return getRecipeByIngredient(allRecipes, function (ingredient) {
//		return predicateBaseSpiritIs(ingredient, baseSpirit);
//	});
//}

//function getRecipeByBitters(allRecipes, bitters) {
//	return getRecipe(allRecipes, { bitters: bitters });
//}

//function getRecipeByIngredient(recipeList, findPredicate) {
// this new array is where the list of recipes that satisfies the criteria is assembled
//	var resultRecipes = [];
//	  //so you'd iterate over all the recipes
//	 for (var i=0; i < recipeList.length; i++) {   
//		//for each iteration, 'recipe' is the holder as you work through each item in allRecipes
//		var recipe = recipeList[i];
		//for each recipe, if an ingredient is found that contains both ingredient="gin" AND isBase = true, put the cocktail 
		//in the resultRecipes array.

		//we iterate through the 'ingredients' array inside each recipe
//		for (var j=0; j < recipe.ingredients.length; j++ ) {
//			 var ingredient = recipe.ingredients[j];
//			 if (findPredicate(ingredient))
//			{
//			 	resultRecipes.push(recipe)
//			}
//		}
//	}
	//and then return those that satisfy that criteria
//	return resultRecipes;

//}

// NOTE: added baseSpirit parameter (was just "gin", which would fail)
//function old_getRecipeByBaseSpirit(allRecipes, baseSpirit) {
// this new array is where the list of recipes that satisfies the criteria is assembled
//	var resultRecipes = [];

	  //so you'd iterate over all the recipes
//	 for (var i=0; i < allRecipes.length; i++) {
	   
		//for each iteration, 'recipe' is the holder as you work through each item in allRecipes
//		var recipe = allRecipes[i];

		//for each recipe, if an ingredient is found that contains both ingredient="gin" AND isBase = true, put the cocktail 
		//in the resultRecipes array.

		//we iterate through the 'ingredients' array inside each recipe
//		for (var j=0; j < recipe.ingredients.length; j++ ) {

//			 var ingredient = recipe.ingredients[j];

//			 if (predicateBaseSpiritIs(ingredient, baseSpirit))
//			 {
//			 	resultRecipes.push(recipe)
//			 }
//		}
//	}
	//and then return those that satisfy that criteria
//	return resultRecipes;
//}