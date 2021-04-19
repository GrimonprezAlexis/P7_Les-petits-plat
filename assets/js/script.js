//Fetch data from json file
fetch('/data/recipes.json')
.then(response => {
    return response.json();
})
.then(data => {
    setArrayOfRecipes(data);
    setArray(data);
    appendRecipesHTML(data);
})
.catch(err => {
    console.log(err);
});

let arrayOfRecipes = [];
let arrayOfIngredients = [];
let arrayOfAppliance = [];
let arrayOfUstensils = [];
let recipesByAppliance, recipesByIngredients, recipesByUstensils = [];

const setArrayOfRecipes = (recipes) => arrayOfRecipes = recipes;

//Init the array of appareil, ustensils, ingredients
const setArray = (recipes) => {
    recipes.forEach(r => {
        //Init appareil list, push only if not present in arrayOfAppliance
        if(arrayOfAppliance.indexOf(r.appliance) === -1) arrayOfAppliance.push(r.appliance);
        //Init ustanciles lists, push only if not includes in arrayOfUstensils
        r.ustensils.map((ustensil) => { 
            if(!arrayOfUstensils.includes(ustensil)) arrayOfUstensils.push(ustensil); 
        });    
        //Init list of ingredients, push only if not present in arrayOfIngredients
        r.ingredients.forEach(i => {
            if(arrayOfIngredients.indexOf(i.ingredient) === -1){
                arrayOfIngredients.push(i.ingredient);
            }
        });
    });
    setTags();
};

//Init tags in dropdown list HTML
const setTags = () => {
    //Add list of ingrédient
    arrayOfIngredients.forEach((ingredient, index) => {
        $('#dropdownIngredientList').append(`<li><a href="#" id="ingredient-${index}">${ingredient}</a></li>`);
    });
    //Add list of appliance (appareil)
    arrayOfAppliance.forEach((appliance, index) => {
        $('#dropdownAppareilList').append(`<li><a href="#" id="appliance-${index}">${appliance}</a></li>`);
    });
    //Add list of ustanciles
    arrayOfUstensils.forEach((ustensil, index) => {
        $('#dropdownUstensilList').append(`<li><a href="#" id="ustensil-${index}">${ustensil}</a></li>`);
    });
};

//Add HTML Recipes
const appendRecipesHTML = (recipes) => {
    let recipesList = $('#recipes');    
    recipes.forEach((r, index) => {
        recipesList.append(`
            <div class="col-md-4 recipe recipeId-${r.id}">
                <div class="card mb-4 box-shadow no-border">
                    <img class="card-img-top" src="/assets/img/bg-recipe.png" alt="Card image cap" />
                    <div class="card-body card-body-style">
                        <div class="d-flex justify-content-between">
                            <label class="card-title">${r.name}</label>
                            <div class="card-time"><img src="./assets/img/clock-icon.png" class="icon clockIcon" /> <span>${r.time} min</span></div>
                        </div>
                        <div class="row d-flex justify-content-between">
                            <ul class="col-md-6 card-ingredients" id="id-card-ingredients-${r.id}"></ul>
                            <small class="col-md-6 card-description">${r.description}</small>
                        </div>
                    </div>
                </div>
            </div>
        `);
        //Init list of ingredients, push only if not present in arrayOfIngredients
        //Add ingredient HTML associate to recipe ID
        r.ingredients.forEach(i => $(`#id-card-ingredients-${r.id}`).append(`<li>${i.ingredient}: <span>${i.quantity ? i.quantity : ''} ${i.unit ? i.unit : ''}</span></li>`));
    });
};

//Show / Hide dropdown list
const toggleDropdownList = (dropdownList) => {
    $(`#${dropdownList}`).toggle(); 
    if($(`#${dropdownList}`)[0].style.display == 'block') toggleIconDropdown(true);
    else toggleIconDropdown(false);
};

// Toggle icon of input
const toggleIconDropdown = (showList) => {
    let boolShowList = showList;
    // Icon is up if value is found
    if(boolShowList){
        $("#icon-dropdown-down").css("display", "none");
        $("#icon-dropdown-up").css("display", "inherit");        
    } else {
        // Default icon is down
        $("#icon-dropdown-down").css("display", "inherit");
        $("#icon-dropdown-up").css("display", "none");        
    }
};

// Show / Hide tag on dropdown list
const filterByDropdownText = (inputElem, dropdownList) => {
    let input, filter, ul, li, a, i, txtValue;
    let foundValue = [];

    //"dropdownInputPrimary"
    input = $(`#${inputElem}`);
    filter = input.value.toUpperCase();

    if(input.value.length >= 3){
        $(`#${dropdownList}`).style.display = "flex";
        ul = $(`#${dropdownList}`);
        li = ul.getElementsByTagName("li");

        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                foundValue.push(true);
                li[i].style.display = "";
            } else {
                foundValue.push(false);
                li[i].style.display = "none";
            }
            if(i == li.length -1){
                if(foundValue.includes(true)) {
                    toggleIconDropdown(foundValue.includes(true));
                } else {
                    toggleIconDropdown(false);
                }
            }
        }
    } else {
        //Reset all dropdownList
        ul = $(`#${dropdownList}`);
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            li[i].style.display = 'inherit';
        }
        $(`#${dropdownList}`).css("display", "none");
        toggleIconDropdown(false);
    }
};

//Add tag and filter
let arrayOfTagId = [];
let arrayOfTagValue = [];
$(".dropDownList").on("click", "li", function(event){
    let tagList = $("#tags");
    let colorBtn;
    let delegateTarget = event.delegateTarget.id;

    if(!arrayOfTagId.includes(event.target.id)){
        arrayOfTagId.push(event.target.id); //For delete tag
        arrayOfTagValue.push(event.target.text); //For filter list of recipes

        if(delegateTarget == 'dropdownIngredientList') colorBtn = 'btnBlue';
        if(delegateTarget == 'dropdownAppareilList') colorBtn = 'btnGreen';
        if(delegateTarget == 'dropdownUstensilList') colorBtn = 'btnOrange';
        tagList.append(`
            <button type="button" class="btn btn-info btnDefault ${colorBtn} ${event.target.id}" 
                onclick="deleteTagById('${event.target.id}')">
                ${event.target.text} 
                <img src="./assets/img/remove-icon.png" class="icon removeIcon" alt="Remove icon"/>
            </button>
        `);
    }
    filterRecipesByTags(arrayOfTagValue);
});

//Show list by text field
//Recherche des recettes dans : le titre de la recette, la liste des ingrédients de la recette, la description de la recette
const filterAllByText = () => {
    let arrayOfRecipesFiltered = [];
    let searchValue = document.getElementById("inputSearchAll").value.toLowerCase(); 
    if(searchValue.length >= 3) {
        //Search recipe by appliance or name
        recipesByAppliance = arrayOfRecipes.filter(currentElement => {
            return currentElement.appliance.toLowerCase().includes(searchValue) || currentElement.name.toLowerCase().includes(searchValue);
        });
        //Search recipe by ingredients
        recipesByIngredients = arrayOfRecipes.filter(r => r.ingredients.filter(i => i.ingredient.toLowerCase().includes(searchValue)).length > 0);
        //Search recipe by ustensils
        recipesByUstensils = arrayOfRecipes.filter(r => {
            return r.ustensils.some(u => u.toLowerCase().includes(searchValue));
        });

        arrayOfRecipesFiltered = new Set(arrayOfRecipesFiltered.concat(recipesByAppliance, recipesByIngredients, recipesByUstensils));
        if(arrayOfRecipesFiltered.size == 0) {
            $('#recipes-not-found').css('display', 'block');
            $('.recipe').hide();
        } else {
            showHideRecipesFiltered(arrayOfRecipesFiltered);
        }
    } else $('.recipe').show();
};

//Filter recipes by tags
const filterRecipesByTags = (tags) => {
    if(tags.length > 0){
        let arrayOfRecipesFiltered = [];
    
        //Filter list of recipes by appliance
        recipesByAppliance = arrayOfRecipes.filter(currentElement => {
            return tags.includes(currentElement.appliance || currentElement.name);
        });
        //Filter list of recipes by ingredients
        recipesByIngredients = arrayOfRecipes.filter(r => r.ingredients.filter(i => tags.indexOf(i.ingredient) >= 0).length > 0);
        //Filter list of recipes by ustensils
        recipesByUstensils = arrayOfRecipes.filter(r => {
            return r.ustensils.some(u => tags.indexOf(u) >= 0);
        });
    
        arrayOfRecipesFiltered = new Set(arrayOfRecipesFiltered.concat(recipesByAppliance, recipesByIngredients, recipesByUstensils));
        if(arrayOfRecipesFiltered.size == 0) {
            $('#recipes-not-found').css('display', 'block');
            $('.recipe').hide();
        } else {
            showHideRecipesFiltered(arrayOfRecipesFiltered);
        }
    } else {
        $('.recipe').show();
    }
};

//Show and Hide recipes rather than tags
const showHideRecipesFiltered = (recipes) => {
    if(recipes){
        $('.recipe').hide();
        recipes.forEach(r => {
            $(`.recipeId-${r.id}`).show();
        });
    } else {
        $('.recipe').show();
    }
};

//Remove tag
const deleteTagById = (elemId) => {
    for( var i = 0; i < arrayOfTagId.length; i++){ 
        if ( arrayOfTagId[i] === elemId) { 
            $(`.${elemId}`).remove();
            arrayOfTagValue.splice(i, 1);
            arrayOfTagId.splice(i, 1);
            filterRecipesByTags(arrayOfTagValue);
        }
    }
};

//Transform to Kebab case (some-text)
const toKebabCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
.join('-');