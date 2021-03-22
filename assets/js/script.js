
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