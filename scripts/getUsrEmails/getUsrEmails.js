function getNames() {
    var names = [];
    var ul = $(".answer-response-list li").each(function(i) {
        names.push($(this).text());
    })
    return names;
}



async function getStudents() {
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
            var students = []
            for (let i = 0; i < names.length; i++) {

                names[i] = names[i].replace(/ /g, '%20')
                // console.log(names[i]);
                await $.ajax({
                    url: '/api/v1/courses/' + courseId + '/search_users?search_term=' + names[i],
                    type: 'GET',
                    dataType: 'json', // added data type

                })
                    .done(function(data, status, response) {
                        // console.log(data);
                       if(data.length != 0) {
                          students.push(data[0].id);
                       }

                    }).fail(function() {
                    console.log( "Error while getting student info by name");
                    nextPage = false;
                });
                await new Promise(r => setTimeout(r, 100));
            }

            return students;


        }
    } catch (err) {
        console.log(err)
    }
}

function emailStudents() {
    var emailForm = `<div>
                        <label for="emailSubject">Message Students</label>
                        <br />
                        <input placeholder="Subject" id="emailSubject">
                        
                        <textarea style="width: 90%" id="emailMessage" placeholder="Your message..."></textarea>
                        
                        <button id="sendEmail">SEND</button>
                    </div>`
    $(emailForm).insertAfter(".answer-response-list");

    $("#sendEmail").click(function() {
        var subject = $('#emailSubject').val();
        var body = $('#emailMessage').val();

        sendMessage(subject, body);
    })
}


async function sendMessage(subject, body) {
    const CSRFtoken = function() {
        return decodeURIComponent((document.cookie.match('(^|;) *_csrf_token=([^;]*)') || '')[2])
    }
    var studentIds = await getStudents();
    console.log(studentIds);
    var pathRegex = new RegExp('^/courses/([0-9]+)/?');
    var matches = pathRegex.exec(window.location.pathname);
    try {
        if (matches) {
            var courseId = matches[1];
            var message = {
                force_new: "true",
                recipients: studentIds.toString(),
                subject: subject,
                body: body,
                context_code: "course_179890",
            }



            console.log(message);

            await fetch('/api/v1/conversations', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json',
                    'X-CSRF-Token': CSRFtoken()
                },
                body: JSON.stringify(message),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });


            console.log(studentIds);
        } else {
            console.log('User is not in a course page.')
        }
    } catch (err) {
        console.log(err)
    }
}

var showAnotherInfo = function () {
    console.log("Show Another Info");
}
chrome.extension.onMessage.addListener(function (message, sender, callback) {
    if (message.functiontoInvoke == "emailStudents") {
        emailStudents();
    }
    if (message.functiontoInvoke == "showAnotherInfo") {
        showAnotherInfo();
    }
});