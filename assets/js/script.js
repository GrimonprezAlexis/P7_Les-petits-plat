const filterFunction = () => {
    let input, filter, ul, li, a, i, txtValue;
    let foundValue = [];

    input = document.getElementById("dropdownInputPrimary");
    filter = input.value.toUpperCase();

    if(input.value.length >= 3){
        $("#dropdownPrimaryList").css("display", "inherit");
        ul = document.getElementById("dropdownPrimaryList");
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
                    $("#icon-dropdown-down").css("display", "none");
                    $("#icon-dropdown-up").css("display", "inherit");
                } else {
                    $("#icon-dropdown-down").css("display", "inherit");
                    $("#icon-dropdown-up").css("display", "none");
                }
            }
        }
    } else {
        $("#dropdownPrimaryList").css("display", "none");
        $("#icon-dropdown-down").css("display", "inherit");
        $("#icon-dropdown-up").css("display", "none");
    }

}