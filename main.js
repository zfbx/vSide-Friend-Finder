const options = {
    caseSensitive: false,
    excludedKeys: ['Discord', 'Facebook', 'Name'],
}

const customFind = (collection, term, opts) => {
    const filterBy = () => {
        const searchTerms = (!opts.caseSensitive) ? new RegExp(term, 'i') : new RegExp(term)
        return (obj) => {
            for (const key of Object.keys(obj)) {
                if (searchTerms.test(obj[key]) &&
                !opts.excludedKeys.includes(key)) return true
            }
            return false;
        }
    }
    return collection.filter(filterBy(term))
}

function compare(a, b){
    a = a.Name.toLowerCase();
    b = b.Name.toLowerCase();
    if (a == "?") return 1;
    if (a > b) return 1;
    if (b > a) return -1;
    return 0;
}


var preVal = "";
$( "#usersearch" ).keyup(function() {
    var searchVal = $("#usersearch").val()
    if ( searchVal === preVal) {
        return;
    } else if (searchVal == "") {
        $("#results").html("");
        return;
    } else if (searchVal.length < 2) {
        $("#results").html("");
        return;
    }
    preVal = searchVal;
    const found = customFind(users, searchVal, options);
    found.sort(compare);
    var res = "";

    found.forEach(user => {
        res += `<div class="card card-sm m-3 d-flex d-flex-row" style="flex-direction: row;">
                <div class="p-2 flex-grow-1">`;
                    if (user.Missing) {
                        res += `<div class="alert alert-warning" role="alert">
                        I don't know who this is, do you? Tell Tony on Discord or <a href="https://github.com/vSide/Friend-Finder/issues/new" class="alert-link">post here</a>.
                      </div>`;
                    }
                    if (user.Name !== "?") {
                        res += `<h3>${user.Name}</h3>`;
                    }
                    for (i=0; i< user.vSideNames.length; i++) {
                        if (user.vSideNames[i].toLowerCase().includes(searchVal.toLowerCase())) {
                            res += `<a href="#" class="badge badge-info">${user.vSideNames[i]}</a>`;
                        } else {
                            //res += `<a href="#" class="badge badge-dark">${user.OldNames[i]}</a>`;
                        }
                    };
                res += `</div>`;
                res += `<div class="p-2 flex-shrink-1 social">`;
                    if (user.Discord !== "") {
                        res += `<a href="https://discordapp.com/users/${user.Discord}" rel="nofollow" target="_blank" title="Open profile in discord (Only shows if you're in the server)"><i class="fab fa-discord"></i></a>`;
                    }
                    if (user.Facebook !== "") {
                        res += `<a href="https://www.facebook.com/${user.Facebook}" rel="nofollow" target="_blank" title="Open Facebook profile"><i class="fab fa-facebook-square"></i></a>`;
                    }
                res += `</div></div>`;
    });

    if (res === "") {
        res = "No vSiders Found"
    }

    $("#results").html(res);
    //console.log(found);
});