/********************************
 *
 *
 *
 ********************************/
let thing = '';
chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === 'install') {
        console.log("First Load");

        chrome.runtime.openOptionsPage();
        thing = 'installed';
    } else if (details.reason == 'update') {
        console.log('Update');
        chrome.runtime.openOptionsPage();
        thing = 'updated';
    } else {
        console.log(details);

    }
    // addEmailOption();
    sortDisabledNavOption();
});

/********************************
 *
 *
 *
 ********************************/
function firstLoad() {
    let returnValue = thing;
    thing = '';
    return returnValue;
}

/********************************
 *
 * Adds right-click menu option to
 * copy student emails to clipboard.
 *
 ********************************/
// function addEmailOption() {
//     chrome.contextMenus.create({
//         id: "email-students",
//         title: "Email Students On This List",
//         contexts: ["page"],
//         documentUrlPatterns: ["https://*.instructure.com/courses/*/quizzes/*/statistics"]
//     });
//
//     chrome.contextMenus.onClicked.addListener(function(info, tab) {
//         if (info.menuItemId == "email-students") {
//             chrome.tabs.query({
//                 "active": true,
//                 "currentWindow": true
//             }, function (tabs) {
//                 chrome.tabs.sendMessage(tabs[0].id, {
//                     "functiontoInvoke": "emailStudents"
//                 });
//             });
//         }
//     });
// }

/********************************
 *
 * Adds right-click menu option to
 * Alphabetically organize the disabled
 * nav items on the settings of a course.
 *
 ********************************/
function sortDisabledNavOption() {
    chrome.contextMenus.create({
        id: "sort-disabled-nav",
        title: "Sort Disabled Navigation",
        contexts: ["page"],
        documentUrlPatterns: ["https://*.instructure.com/courses/*/settings*"]
    });

    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        if (info.menuItemId == "sort-disabled-nav") {
            chrome.tabs.query({
                "active": true,
                "currentWindow": true
            }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    "functiontoInvoke": "sortDisabledNav"
                });
            });
        }
    });
}