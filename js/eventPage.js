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
                                chrome.tabs.executeScript(tabId, { file: "js/lib/jquery.js", allFrames: true }, function(){
                                    chrome.tabs.executeScript(tabId, { file: "js/content.js", allFrames: true }, function(){
                                        chrome.tabs.executeScript(tabId, { file: "js/processor.js", allFrames: true },function(){
                                            chrome.tabs.insertCSS(tabId, { file: "css/content.css", allFrames: true });
                                        });
                                    });
                                });
                            })();
                        }
                    }catch(err){
                        console.error("error in chrome.tabs.executeScript:", err);
                    }
                }
            });
        }
    });
}

function addEventListeners(){
    chrome.runtime.onInstalled.addListener(function() {
        var obj = {};
        obj.jzEnableFlag = true;
        obj.jzNotifyFlag = true;
        obj.jzNotifyDuration = 1;
        obj.jzGoogleSearchFlag = true;
        obj.jsShowSelectedWord = true;
        obj.jzTheme = 'Classic';
        chrome.storage.sync.set(obj, function(){
            console.log("Default values populated");
            if(obj.jzNotifyDuration){
                initNotification(obj.jzNotifyDuration);
                chrome.tabs.create({'url': "/options.html" });
            }
        });
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.todo == "findMeaning"){
            var wordMeaning = jzDictionary[request.word];
            sendResponse({todo: "meaningHandler", meaning: wordMeaning});
        }else if (request.todo == "changeDuration"){
            chrome.storage.sync.get(['jzNotifyDuration'], function(res){
                initNotification(res.jzNotifyDuration);
            });
        }
    });
}

function initNotification(notifyInterval){
    if(typeof notification !== 'undefined' && !isNull(notification)){
        clearInterval(notification);
    }

    notification = setInterval(function(){
        chrome.storage.sync.get(['jzEnableFlag', 'jzNotifyFlag'], function(res){
            if(!isNull(res.jzEnableFlag) && res.jzEnableFlag && !isNull(res.jzNotifyFlag) && res.jzNotifyFlag){
    
                var dictKeys = Object.keys(jzDictionary);
                var keyIndex = Math.floor(Math.random() * 1000000) % dictKeys.length;    // 147784
    
                var key = dictKeys[keyIndex];
                var value = jzDictionary[key];
                
                var opt = {
                    type: "basic",
                    title: key,
                    message: value,
                    iconUrl: "image/icon48.png"
                };
                console.log(Date())
                chrome.notifications.clear('juzselect_notification', function(){
                    chrome.notifications.create('juzselect_notification', opt);
                });
            }
        });
    }, (parseFloat(notifyInterval) * 60 * 60 * 1000));
}

// initVariables
(function(){
    chrome.storage.sync.get(['jzNotifyDuration'], function(res){
        if(!isNull(res.jzNotifyDuration)){
            initNotification(res.jzNotifyDuration);
        }
    });
    executeScriptAllTabs();
    console.log("adding background listeners");
    addEventListeners();
})();