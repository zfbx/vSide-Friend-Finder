const options = {
    caseSensitive: false,
    excludedKeys: ['Dis', 'FB', 'N'],
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
    a = a.N.toLowerCase();
    b = b.N.toLowerCase();
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
                    if (user.M) {
                        res += `<div class="alert alert-warning" role="alert">
                        I don't know who this is, do you? Tell Tony on Discord or <a href="https://github.com/vSide/Friend-Finder/issues/new" target="_blank" class="alert-link">post here</a>.
                      </div>`;
                    }
                    if (user.N !== "?") {
                        res += `<h4>${user.N}</h4>`;
                    }
                    for (i=0; i< user.vSN.length; i++) {
                        if (user.vSN[i].toLowerCase().includes(searchVal.toLowerCase())) {
                            res += `<a href="#" class="badge badge-info">${user.vSN[i]}</a>`;
                        } else {
                            //res += `<a href="#" class="badge badge-dark">${user.OldNames[i]}</a>`;
                        }
                    };
                res += `</div>`;
                res += `<div class="p-2 flex-shrink-1 social">`;
                    if (user.Dis !== "") {
                        res += `<a href="https://discordapp.com/users/${user.Dis}" rel="nofollow" target="_blank" title="Open profile in discord (Only shows if you're in the server)"><i class="fab fa-discord"></i></a>`;
                    }
                    if (user.FB !== "") {
                        res += `<a href="https://www.facebook.com/${user.FB}" rel="nofollow" target="_blank" title="Open Facebook profile"><i class="fab fa-facebook-square"></i></a>`;
                    }
                res += `</div></div>`;
    });

    if (res === "") {
        res = `<h2 class="mt-3 text-center">${searchVal} Could Not Be Found.</h2>
        <p class="text-center mt-1">Would you like them to be added? Ping Tony in the Discord or <a href="https://github.com/vSide/Friend-Finder/issues/new" target="_blank">post here</a>.</p>`;
    }

    $("#results").html(res);
    //console.log(found);
});