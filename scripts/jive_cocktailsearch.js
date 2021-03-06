



$.getJSON("http://www.jiveboston.com/data/cocktails.json", function(data) {

	//substring(1) removes the leading ? from query string
	var queryString = window.location.search.substring(1);

	var qsParams = parseQueryString(queryString);

	//if I have a querystring, give me just the recipes I want (call dorecipesearch(qsParams)), otherwise do the below:
	if (qsParams) {
		doRecipeSearch(qsParams);
	} else {
		renderRecipeInfo(data.recipes.sort(sortRecipesByName));
		//bugfix; set qsParams to an empty object
		qsParams = {};
	}


	var items = [];

	var valuesByIngredient = getIngredientValues(data.recipes, "ingredient", function(ingredient) {
		if (ingredient.isBase) {
			return true;
		}
	});
	if (valuesByIngredient.length === 0) {
		alert("values found for base spirit!");
	} else {
		bindDropdown("#ddlBaseSpirit", valuesByIngredient, qsParams.spirit);
	}

	var valuesBySpirit = getIngredientValues(data.recipes, "ingredient", function(ingredient) {
		// this line actually returns the boolean (true / false) result of this expression 
		return (ingredient.type === "spirit");
	});
	if (valuesBySpirit.length === 0) {
		alert("No values found for spirit!");
	} else {
		bindDropdown("#ddlSpirits", valuesBySpirit, qsParams.spirit);
	}

	var valuesByBrand = getIngredientValues(data.recipes, "brand", function(ingredient) {
		if (ingredient.brand) {
			return true;
		}
	});
	if (valuesByBrand.length === 0) {
		alert("No values found for Brand!");
	} else {
		bindDropdown("#ddlBrand", valuesByBrand, qsParams.brand);
	}

	var valuesByBitters = getIngredientValues(data.recipes, "ingredient", function(ingredient) {
		if (ingredient.type === "bitters") {
			return true;
		}
	});
	if (valuesByBitters.length === 0) {
		alert("No values found for Bitters!");
	} else {
		bindDropdown("#ddlBitters", valuesByBitters, qsParams.bitters);
	}

	var valuesByEra = getValues(data.recipes, "era");
	if (valuesByEra.length === 0) {
		alert("No values found for era!");
	} else {
		bindDropdown("#ddlEra", valuesByEra, qsParams.era);
	}

	var valuesByTechnique = getValues(data.recipes, "technique");
	if (valuesByTechnique.length === 0) {
		alert("No values found for technique!");
	} else {
		bindDropdown("#ddlTechnique", valuesByTechnique, qsParams.technique);
	}
}); //end of getJSON callback

//search click method follows
function performSearchButton() {
	//TODO: Move the code that gets parameters from the form to a BindForm() method
	var param = {};

	var ddl = cocktailSearchForm.ddlEra;
	var selected = ddl.options[ddl.selectedIndex].text;
	if (selected) {
		//what this implies but doesn't say explicitly is... 
		//not just set era on param, 
		//but create the era field on param if it does not exist
		//therefore, the code that looks at the parameters object to see if era exists or not 
		//uses this line to know you want to search with era
		param.era = selected;
	}

	ddl = cocktailSearchForm.ddlTechnique;
	selected = ddl.options[ddl.selectedIndex].text;
	if (selected) {
		param.technique = selected;
	}
	ddl = cocktailSearchForm.ddlSpirits;
	selected = ddl.options[ddl.selectedIndex].text;
	if (selected) {
		param.spirit = selected;
	}
	ddl = cocktailSearchForm.ddlEra;
	selected = ddl.options[ddl.selectedIndex].text;
	if (selected) {
		param.era = selected;
	}
	ddl = cocktailSearchForm.ddlBrand;
	selected = ddl.options[ddl.selectedIndex].text;
	if (selected) {
		param.brand = selected;
	}
	//if the value is that, then do not add a parameter to the parameters object

	doRecipeSearch(param);
}

//Begin library code

//create new method to get recipes, and then filter them with parameter object you pass in.
function doRecipeSearch(parameters) {
	//get recipes - this code exists above 
	$.getJSON("http://www.jiveboston.com/data/cocktails.json", function(data) {
		//getJson callback:
		//filter them - this code already exists
		var filteredRecipes = getRecipe(data.recipes, parameters);

		//render them
		var searchQuery = getSearchQuery(parameters);
//		renderSearchLink(searchQuery);
		renderRecipeInfo(filteredRecipes.sort(sortRecipesByName));
		renderRecipeClickableList(filteredRecipes);
	});
}

function getSearchQuery(parameters) {
//take parameters and pull out the key/value pairs. assemble into a search query.
	var queryString = "?";
	$.each(parameters, function(key, value) {
		// put an equals sign between the key and value
		var currentParam = key + "=" + encodeURI(value);
		// put an ampersand between them if currentParam isn't the first value
		// put them into a variable to assemble the string
		if (queryString === "?") {
			queryString += currentParam;
		} else {
			queryString += "&" + currentParam;
		}
	});
	return queryString;
}

function renderSearchLink(queryString) {
	var queryStringURL = window.location + queryString;
	$("#queryStringLink").append(queryStringURL);
}



//create method to render recipes
function renderRecipeInfo(recipeList) {
	var recipeItems = [];
	// for each recipe in data.recipes
	$.each(recipeList, function (key, recipe) {
		renderRecipe(recipe, recipeItems);
	});

	$("<div>", {
		id: "recipeContainer",
		html: recipeItems.join("")
	}).replaceAll("#recipeContainer");
}

//method to create clickable list of recipes
function renderRecipeClickableList(recipeList) {

}

//take a "values" list, assign it to an existing <select> ID in the html, and generate the dropdown from the
function bindDropdown(ddlId, values, selectedValue) {
	var ddl = $(ddlId);
	
	ddl.append(
			$("<option></option>")
		);
	$.each(values, function(index, option) {

		if (selectedValue === option) {
		ddl.append(
			$("<option selected></option>").val(index).html(option)
		)} else {
			ddl.append(
			$("<option></option>").val(index).html(option)
		)}
	});
}

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
	for (var i = 0; i < data.length; i++) { 
		//current recipe being worked on
		var item = data[i];  
		//pull the value from the key, and put it in resultList
		addSortedDistinct(resultList,item[key]); 
	}

	return resultList;
}

function getIngredientValues(data, key, validPredicate) {
	//put all of the recipes into an array;	
	//raw list is assembled in the below array
	var resultIngredientList = [];

	//goes through list of recipes one by one
	for (var i = 0; i < data.length; i++) {
		//current recipe being worked on
		var recipe = data[i];
		
		// iterate over recipe.ingredients
		for (var j = 0; j < recipe.ingredients.length; j++) {
			var ingredient = recipe.ingredients[j];

			// if validPredicate exists then use it
			if (validPredicate) {
				if (validPredicate(ingredient)) {
					addSortedDistinct(resultIngredientList, ingredient[key]);
					continue;
				}
			//no validPredicate, so always push
			} else {
				// push ingredient[key] onto resultIngredientList
				addSortedDistinct(resultIngredientList, ingredient[key]);
			}
		}
	}
	return resultIngredientList;
}

// take data.recipes, sort in descending alphabetical order by "name"
function sortRecipesByName(recipe1, recipe2) {
	if (recipe1.name < recipe2.name) {
		return -1;
	}
	if (recipe1.name > recipe2.name) {
		return 1;
	}
	return 0;
}

/// Add a value to the list in the correctly sorted location, and do not add it if it is a dupe 
function addSortedDistinct(list, value) {
	//if there's just one item, just add it
	if (list.length === 0) {
		list.push(value);
		return;
	}

	//find the correct location in the list, hunting through it
	//iterate through the array
	//find the index where indexed item is less than value, and index+1 is greater than value
	var i = 0;
	var a = list[i];
	// below line MUST take place, it is a bugfix to prevent first item being duplicated
	if (a === value) return;
	
	while (a < value && i < list.length) {
		i++;
		a = list[i];
		if (a === value) return;
	}
	// i is now the index of the first item a that is greater than value
	if (i === list.length) {
		list.push(value);
	} else {
		list.splice(i, 0, value);
	}
}

function renderRecipe(recipe, items) {
	$.each( recipe, function( key, val ) {
		if (key == "name") {
			items.push("<h2 class='cName'>" + val + "</h2><div>");
		}
		if (key == "year") {
			items.push("<span class='cYear'>" + val + "</span>");
		}

		if (key == "description") {
			items.push("<span class='cDesc'>" + val + "</span></div>");
		}
		if (key == "ingredients") {
			// ingredient template
			items.push("<div>" + renderIngredients(val) + "</div>");
		} if (key == "instructions") {
			// these are item templates
			items.push("<p>" + val + "</p>");
		}
	});
}

function renderIngredients(ingredientList) {
	var output = "<ul class='cIngredients'>";
	if (ingredientList.length > 0) {
		for (var i = 0; i < ingredientList.length; i++) {
			var ingredient = ingredientList[i];
			// this line is my template
			//if ingredient.tradeName is NOT null
			if (ingredient.tradeName) {
				//if there is a tradeName present
				output += "<li>" + ingredient.tradeName + ": " + ingredient.amount + "</li>";
			} else {
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
	//TODO: This code has changed enough that it should be refactored; move the addSearchPredicate list to a new method to get that list
	var predicateList = [];

	addSearchPredicate(predicateList, predicateEraIs, parameters.era);
	addSearchPredicate(predicateList, predicateTechniqueIs, parameters.technique);	
	// put ingredient search predicates second because they are less performant
	//addIngredientSearchPredicate(predicateList, predicateBittersIs, parameters.bitters);
	//addIngredientSearchPredicate(predicateList, predicateBaseSpiritIs, parameters.baseSpirit);
	addIngredientSearchPredicate(predicateList, predicateSpiritIs, parameters.spirit);
	addIngredientSearchPredicate(predicateList, predicateBrandIs, parameters.brand);

	return getRecipeByAdvancedSearch(allRecipes, predicateList);
}

// subtract array1 from array2
function subtractArray(array1, array2) {
	var result = [];
	for (var i = 0; i < array2.length; i++) {
		var currentItem = array2[i];
		var itemExists = false;

		for (var j = 0; j < array1.length; j++) {
			
			if (currentItem === array1[j]) {
				itemExists = true;
			}
		}
		if (!itemExists) {
			result.push(currentItem);
		}
	}
	return result;
}

// add a search predicate wrapper to the list
function addSearchPredicate(predicateList, predicate, parameter) {
	if (parameter) {
		predicateList.push(function(item) {
			return predicate(item, parameter);
		});
	}
}

// add a predicate wrapper that searches all ingredients for item
function addIngredientSearchPredicate(predicateList, predicate, parameter) {	
	if (parameter) {
		predicateList.push(function(item) {
			//we iterate through the 'ingredients' array inside each recipe
			for (var i = 0; i < item.ingredients.length; i++) {
				if (predicate(item.ingredients[i], parameter)) {
					return true;
				}
			}
		});
	}
}

function getRecipeByAdvancedSearch(recipeList, predicateList) {
// this new array is where the list of recipes that satisfies the criteria is assembled
	var resultRecipes = [];

	var recipesAND = new LogicGate(predicateList, LogicGate.AND);

	//so you'd iterate over all the recipes
	for (var i = 0; i < recipeList.length; i++) {
		//for each iteration, 'recipe' is the holder as you work through each item
		var recipe = recipeList[i];
			
		if (recipesAND.Evaluate(recipe)) {
			resultRecipes.push(recipe);	
		}
	}
	return resultRecipes;
}

// PREDICATES

function predicateBaseSpiritIs(ingredient, baseSpirit) {
	//we poll to see if a given ingredient is a base spirit
	if (ingredient.isBase === true) {
		if (ingredient.ingredient === baseSpirit) {
			return true;
		}
	}
	return false;
}

function predicateBrandIs(ingredient, brand) {
	if (ingredient.brand === brand) {
		return true;
		}
	return false;
}

function predicateBittersIs(ingredient, bitters) {
	if (ingredient.type === "bitters") {
		if (ingredient.ingredient === bitters) {
			return true;
		}
	}
	return false;
}

function predicateSpiritIs(ingredient, spirit) {
	if (ingredient.type === "spirit") {
		if (ingredient.ingredient === spirit) {
			return true;
		}
	}
	return false;
}	

function predicateEraIs(recipe, era) {
	if (recipe.era === era) {
		return true;
	}
	return false;
}

function predicateTechniqueIs(recipe, technique) {
	if (recipe.technique === technique) {
		return true;
	}
	return false;
}

//url query string parsing
function parseQueryString(queryString) {
	var params = {},
		queries,
		temp,
		i;

	queries = queryString.split("&");
	var isSet = false;
	for (i = 0; i < queries.length; i++) {
		temp = queries[i].split("=");
				//only set a key/value if we have a value
		if (temp[1]) {
			params[temp[0]] = decodeURI(temp[1]);
			isSet = true;
		}
	}
	//if we do not have any values, return null
	if (!isSet) {
		params = null;
	}
	return params;
}

