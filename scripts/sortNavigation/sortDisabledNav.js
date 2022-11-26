


async function getDisabledNavItems() {
    var disabledItems = [];

    var pathRegex = new RegExp('^/courses/([0-9]+)/settings*');
    var matches = pathRegex.exec(window.location.pathname);

    try {
        if (matches) {
            var courseId = matches[1];

            var nextPage = true;
            var pageCount = 1;
            var disabledItems = []

            while(nextPage) {
                await $.ajax({
                    url: '/api/v1/courses/' + courseId + '/tabs?page=' + pageCount + '&per_page=90',
                    type: 'GET',
                    dataType: 'json', // added data type

                })
                    .done(function(data, status, response) {

                        if(data.length != 0) {
                            disabledItems = disabledItems.concat(data);

                        }
                        if(response.getResponseHeader("Link")) {
                            if(response.getResponseHeader("Link").includes("next")) {
                                pageCount++;
                            } else {
                                nextPage = false;
                            }
                        } else {
                            nextPage = false;
                        }

                    }).fail(function() {
                        console.log( "Error while getting student info by name");
                        nextPage = false;
                    });
                await new Promise(r => setTimeout(r, 100));
                pageCount++;
            }



        return disabledItems;


        }

    } catch (err) {
        console.log("NO")
        console.log(err)
    }


}

async function sortDisabledNav() {

    // Get disabled Nav Items
    var navItems = await getDisabledNavItems();
    var disabledItems = [];

    // separate hidden items.
    for(let i = 0; i < navItems.length; i++) {
        if(navItems[i].hidden) {
            disabledItems.push(navItems[i]);
        }
    }

    // Sort Items Alphabetically
    var sortedItems = disabledItems.sort((a, b) =>
        a.label.localeCompare(b.label));

    var disabledStart = navItems.length - sortedItems.length;


    // Update Sorted Items
    for (let i = 0; i < sortedItems.length; i++) {
        sortedItems[i].position = disabledStart + i;
        await updateNav(sortedItems[i])
    }

    // Reload page to show changes
    location.reload();


}


async function updateNav(navItem) {
    const CSRFtoken = function() {
        return decodeURIComponent((document.cookie.match('(^|;) *_csrf_token=([^;]*)') || '')[2])
    }


    var pathRegex = new RegExp('^/courses/([0-9]+)/settings*');
    var matches = pathRegex.exec(window.location.pathname);
    try {
        if (matches) {
            var courseId = matches[1];
            var currItem = {
                position: navItem.position,
                hidden: navItem.hidden
            }
            console.log(currItem);

            await fetch(`/api/v1/courses/${courseId}/tabs/${navItem.id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json',
                    'X-CSRF-Token': CSRFtoken()
                },
                body: JSON.stringify(currItem),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                })
                .catch((error) => {
                    console.log(error);
                });



        } else {
            console.log('User is not in a course page.')
        }
    } catch (err) {
        console.log(err)
    }
}

// var showAnotherInfo = function () {
//     console.log("Show Another Info");
// }
chrome.extension.onMessage.addListener(function (message, sender, callback) {
    if (message.functiontoInvoke == "sortDisabledNav") {

        sortDisabledNav();
    }
    if (message.functiontoInvoke == "showAnotherInfo") {
        showAnotherInfo();
    }
});