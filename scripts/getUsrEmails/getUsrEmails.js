function getNames() {
    var names = [];
    var ul = $(".answer-response-list li").each(function(i) {
        names.push($(this).text());
    })
    return names;
}



async function getEmails() {
    var names = getNames();
    console.log(names);
    var pathRegex = new RegExp('^/courses/([0-9]+)/?');
    var matches = pathRegex.exec(window.location.pathname);
    try {
        if (matches) {
            var courseId = matches[1];
            const terms = [];
            var nextPage = true;
            var pageCount = 1;
            var emails = ""
            for (let i = 0; i < names.length; i++) {

                names[i] = names[i].replace(/ /g, '%20')
                // console.log(names[i]);
                await $.ajax({
                    url: '/api/v1/courses/' + courseId + '/search_users?search_term=' + names[i],
                    type: 'GET',
                    dataType: 'json', // added data type

                })
                    .done(function(data, status, response) {
                        console.log(data);
                       if(data.length != 0) {
                           if(i != 0) {
                               emails = emails + "," + data[0].email;
                           } else {
                               emails = emails + data[0].email;
                           }
                       }

                    }).fail(function() {
                    console.log( "Error while getting student info by name");
                    nextPage = false;
                });
                await new Promise(r => setTimeout(r, 100));
            }

            if(emails != "") {
                console.log(emails);
                navigator.clipboard.writeText(emails).then(function() {
                    console.log('Async: Copying to clipboard was successful!');
                }, function(err) {
                    console.error('Async: Could not copy text: ', err);
                });
            }


        }
    } catch (err) {
        console.log(err)
    }
}


var showAnotherInfo = function () {
    console.log("Show Another Info");
}
chrome.extension.onMessage.addListener(function (message, sender, callback) {
    if (message.functiontoInvoke == "getEmails") {
        getEmails();
    }
    if (message.functiontoInvoke == "showAnotherInfo") {
        showAnotherInfo();
    }
});