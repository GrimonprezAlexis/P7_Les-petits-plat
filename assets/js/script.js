    //Fetch data from json file
    fetch('/data/recipes.json')
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        appendRecipes(data);
    })
    .catch(err => {
        console.log(err);
    });

    let arrayOfRecipes = [];

    //Loop the list of recipes
    appendRecipes = function appendRecipes(recipes) {
        let recipesList = $("#recipes");
        recipes.forEach(r => {

            recipesList.append(`
                <div class="col-md-4">
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

            r.ingredients.forEach(i => {
                let cardIngredients = $(`#id-card-ingredients-${r.id}`);
                cardIngredients.append(`
                    <li>${i.ingredient}: <span>${i.quantity ? i.quantity : ''} ${i.unit ? i.unit : ''}</span></li>
                `);
            });

        });
    }


// Show / Hide dropdown list
const toggleDropdown = (showList, listElem) => {
    // Icon is up if value is found
    if(showList){
        $("#icon-dropdown-down").css("display", "none");
        $("#icon-dropdown-up").css("display", "inherit");        
        $(`#${listElem} li`).css("display", "inherit");
    } else {
        // Default icon is down
        $("#icon-dropdown-down").css("display", "inherit");
        $("#icon-dropdown-up").css("display", "none");        
        $(`#${listElem} li`).css("display", "none");
    }
}

//Filter words grab by user rather than list of words
//dropdownInputPrimary, dropdownPrimaryList
const filterFunction = (elemInput, listElem) => {
    let input, filter, ul, li, a, i, txtValue;
    let foundValue = [];

    input = document.getElementById(elemInput);
    filter = input.value.toUpperCase();

    if(input.value.length >= 3){
        //By default the list is hide
        $(`#${listElem}`).css("display", "inherit");
        ul = document.getElementById(listElem);
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
            //When is finish
            if(i == li.length -1){
                toggleDropdown(foundValue.includes(true), listElem);
            }
        }
    } else {
        toggleDropdown(false, listElem);
    }
}