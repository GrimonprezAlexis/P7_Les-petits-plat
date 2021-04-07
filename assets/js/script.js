//Fetch data from json file
fetch('/data/recipes.json')
.then(response => {
    return response.json();
})
.then(data => {
    console.log(data);
    appendAndMapRecipes(data);
})
.catch(err => {
    console.log(err);
});

let arrayOfIngredients = [];
let arrayOfAppliance = [];
let arrayOfUstensils = [];

//Loop the list of recipes
const appendAndMapRecipes = (recipes) => {
    let recipesList = $("#recipes");
    let ingredientsList = $('#dropdownIngredientList');
    let appliancesList = $('#dropdownAppareilList');
    let ustensilsList = $('#dropdownUstensilList');
    recipes.forEach((r , index) => {

        //Init appareil list, push only if not present in arrayOfAppliance
        if(arrayOfAppliance.indexOf(r.appliance) === -1){
            arrayOfAppliance.push(r.appliance);
        }

        //Init ustanciles lists, push only if not includes in arrayOfUstensils
        r.ustensils.map((ustensil) => { 
            if(!arrayOfUstensils.includes(ustensil)) arrayOfUstensils.push(ustensil); 
        });

        //Add recipes list
        recipesList.append(`
            <div class="col-md-4 recipe">
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
        r.ingredients.forEach(i => {
            if(arrayOfIngredients.indexOf(i.ingredient) === -1){
                arrayOfIngredients.push(i.ingredient);
            }

            //Add ingredient associate to recipe ID
            let cardIngredients = $(`#id-card-ingredients-${r.id}`);
            cardIngredients.append(`
                <li>${i.ingredient}: <span>${i.quantity ? i.quantity : ''} ${i.unit ? i.unit : ''}</span></li>
            `);
        });
    });


    //Add list of ingrédient
    arrayOfIngredients.forEach((ingredient, index) => {
        ingredientsList.append(`
            <li><a href="#" id="ingredient-${index}">${ingredient}</a></li>
        `)
    });
    //Add list of appliance (appareil)
    arrayOfAppliance.forEach((appliance, index) => {
        appliancesList.append(`
            <li><a href="#" id="appliance-${index}">${appliance}</a></li>
        `)
    });
    //Add list of ustanciles
    arrayOfUstensils.forEach((ustensil, index) => {
        ustensilsList.append(`
            <li><a href="#" id="ustensil-${index}">${ustensil}</a></li>
        `)
    });
}

const toggleDropdownList = (dropdownList) => {
    $(`#${dropdownList}`).toggle(); 
    if($(`#${dropdownList}`)[0].style.display == 'block') toggleIconDropdown(true);
    else toggleIconDropdown(false);
}


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
}

const filterFunction = (inputElem, dropdownList) => {
    let input, filter, ul, li, a, i, txtValue;
    let foundValue = [];

    //"dropdownInputPrimary"
    input = document.getElementById(inputElem);
    filter = input.value.toUpperCase();

    if(input.value.length >= 3){
        $(`#${dropdownList}`).css("display", "flex");
        ul = document.getElementById(dropdownList);
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
        ul = document.getElementById(dropdownList);
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            li[i].style.display = 'inherit';
        }

        $(`#${dropdownList}`).css("display", "none");
        toggleIconDropdown(false);
    }
}

const filterAll = () => {
    let searchValue = $('#searchAll').val();
    if(searchValue.length >= 3){
        $('.recipe').hide();
        $('.recipe:contains("'+searchValue+'")').show();
        if(!$('.recipe').is(":visible")){
            $('#recipes-not-found').css('display', 'block');
        }
    } else {
        $('.recipe').show();
    }
}


//Add tag
let arrayOfTag = [];
$(".dropDownList").on("click", "li", function(event){
    let tagList = $("#tags");
    let colorBtn;

    if(arrayOfTag.indexOf(event.target.text) === -1){
        arrayOfTag.push(toKebabCase(event.target.text));

        if(event.delegateTarget.id == 'dropdownIngredientList') colorBtn = 'btnBlue';
        if(event.delegateTarget.id == 'dropdownAppareilList') colorBtn = 'btnGreen';
        if(event.delegateTarget.id == 'dropdownUstensilList') colorBtn = 'btnOrange';

        tagList.append(`
            <button type="button" class="btn btn-info btnDefault ${colorBtn} ${event.target.id}" 
                onclick="deleteTag('${toKebabCase(event.target.text)}', '${event.target.id}')">
                ${event.target.text} 
                <img src="./assets/img/remove-icon.png" class="icon removeIcon" alt="Remove icon"/>
            </button>
        `);
    }
});

//Remove tag
const deleteTag = (el, elemId) => {
    console.log(el);
    for( var i = 0; i < arrayOfTag.length; i++){ 
        if ( arrayOfTag[i] === el) { 
            $(`.${elemId}`).remove();
            arrayOfTag.splice(i, 1);
        }
    }
}

//Transform to Kebab case (some-text)
const toKebabCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-');