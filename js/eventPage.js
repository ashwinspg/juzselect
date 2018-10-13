function isNull(value){
    return value == null || value == undefined;
}

function executeScriptAllTabs(){
    chrome.windows.getAll({}, function(allWindow){
        for(var windowIndex in allWindow){
            chrome.tabs.getAllInWindow(allWindow[windowIndex].id, function(allTabs){
                for(var tabIndex in allTabs){
                    try{
                        if(allTabs[tabIndex].url.startsWith("https://") || allTabs[tabIndex].url.startsWith("http://")){
                            (function(){
                                var tabId = allTabs[tabIndex].id;
                                var url = allTabs[tabIndex].url;
                                chrome.tabs.executeScript(tabId, { file: "js/jquery.js", allFrames: true }, function(){
                                    chrome.tabs.executeScript(tabId, { file: "js/content.js", allFrames: true }, function(){
                                        chrome.tabs.executeScript(tabId, { file: "js/processor.js", allFrames: true },function(){
                                            chrome.tabs.insertCSS(tabId, { file: "css/content.css", allFrames: true });
                                        });
                                    });
                                });
                            })();
                        }
                    }catch(error){
                        console.log("error in chrome.tabs.executeScript: " + error);
                    }
                }
            });
        }
    });
}

function addEventListeners(){
    chrome.runtime.onInstalled.addListener(function() {
        var obj = {};
        obj.juzselect_isEnable = true;
        obj.juzselect_notifyDurationEnable = true;
        obj.juzselect_notifyDuration = 5;
        obj.juzselect_googleSearchEnable = true;
        obj.juzselect_selectedWordEnable = true;
        obj.juzselect_theme = 'Classic';
        chrome.storage.sync.set(obj, function(){
            console.log("Default values populated");
            if(obj.juzselect_notifyDuration){
                initNotification(obj.juzselect_notifyDuration);
                chrome.tabs.create({'url': "/options.html" });
            }
        });
    });

    // chrome.management.onEnabled.addListener(function(){
        
    // });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.todo == "findMeaning"){
            var wordMeaning = juzselect_dictionary[request.word];
            sendResponse({todo: "meaningHandler", meaning: wordMeaning});
        }else if (request.todo == "changeDuration"){
            chrome.storage.sync.get(['juzselect_notifyDuration'], function(res){
                initNotification(res.juzselect_notifyDuration);
            });
        }
    });
}

function initNotification(notifyInterval){
    if(typeof notification !== 'undefined' && !isNull(notification)){
        clearInterval(notification);
    }
    notification = setInterval(function(){
        chrome.storage.sync.get(['juzselect_isEnable', 'juzselect_notifyDurationEnable'], function(res){
            if(!isNull(res.juzselect_isEnable) && res.juzselect_isEnable && !isNull(res.juzselect_notifyDurationEnable) && res.juzselect_notifyDurationEnable){
    
                var dictKeys = Object.keys(juzselect_dictionary);
                var keyIndex = Math.floor(Math.random() * 1000000) % dictKeys.length;    // 147784
    
                var key = dictKeys[keyIndex];
                var value = juzselect_dictionary[key];
                
                var opt = {
                    type: "basic",
                    title: key,
                    message: value,
                    iconUrl: "image/icon48.png"
                };
                chrome.notifications.clear('juzselect_notification', function(){
                    chrome.notifications.create('juzselect_notification', opt);
                });
            }
        });
    }, (parseFloat(notifyInterval) * 60 * 1000));
}

// initVariables
(function(){
    chrome.storage.sync.get(['juzselect_notifyDuration'], function(res){
        if(!isNull(res.juzselect_notifyDuration)){
            initNotification(res.juzselect_notifyDuration);
        }
    });
    executeScriptAllTabs();
    console.log("adding background listeners");
    addEventListeners();
})();