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
    addEmailOption();
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
function addEmailOption() {
    chrome.contextMenus.create({
        id: "get-emails",
        title: "Copy Emails From Clipboard",
        contexts: ["page"],
        documentUrlPatterns: ["https://*.instructure.com/courses/*/quizzes/*"]
    });

    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        if (info.menuItemId == "get-emails") {
            alert("TEST WORKING");
        }
    });
}

