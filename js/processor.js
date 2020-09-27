function dictionaryProcessor(selectedWord){
    return new Promise(function(resolve, reject){
        try{
            chrome.runtime.sendMessage({todo: "findMeaning", word: selectedWord}, function(response){
                if (response.todo == "meaningHandler"){
                    resolve(response.meaning);
                }
            });
        }
        catch(error){
            console.log("error in juzselect (dictionary processor): "+error);
        }
    });
}

function juzselectProcessor(){
    return new Promise(function(resolve, reject){
        try{
            chrome.storage.sync.get(['jzEnableFlag', 'jzGoogleSearchFlag', 'jsShowSelectedWord', 'jzTheme'], function(res){
                resolve(res);
            });
        }
        catch(error){
            console.log("error in juzselect (processor): "+error);
        }
    });
}