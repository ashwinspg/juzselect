function isNull(value){
    return value == null || value == undefined;
}

var cacheData = {};

$(function(){
    function updateDOM(obj){        
        $("#notify-duration-enable").prop("checked", obj.jzNotifyFlag);
        $("#hours").val(parseInt(obj.jzNotifyDuration));
        $("#show-hours").html(parseInt(obj.jzNotifyDuration));
        $("#google-search-enable").prop("checked", obj.jzGoogleSearchFlag);
        $("#show-selected-word").prop("checked", obj.jsShowSelectedWord);
        $("#theme").val(obj.jzTheme);

        $('select').formSelect();
    }

    function updatePreviewComponents(){
        if(cacheData.jzNotifyFlag){
            $("#notify-duration-container").fadeIn();
        }else{
            $("#notify-duration-container").fadeOut();
        }

        if(cacheData.jsShowSelectedWord){
            $("#jz-word").fadeIn();
        }else{
            $("#jz-word").fadeOut();
        }

        if(cacheData.jzGoogleSearchFlag){
            $("#jz-search").fadeIn();
        }else{
            $("#jz-search").fadeOut();
        }

        if(cacheData.jzTheme == "Classic"){
            $("#jz-popup").removeClass("dark");
        }else{
            $("#jz-popup").addClass("dark");
        }
    }

    function changeHandler(){
        var obj = {};

        obj.jzNotifyFlag = $("#notify-duration-enable").prop("checked");
        obj.jzNotifyDuration = $("#hours").val();
        obj.jzGoogleSearchFlag = $("#google-search-enable").prop("checked");
        obj.jsShowSelectedWord = $("#show-selected-word").prop("checked");
        obj.jzTheme = $("#theme").val();

        chrome.storage.sync.set(obj, function(){
            if(cacheData.jzNotifyDuration != obj.jzNotifyDuration){
                chrome.runtime.sendMessage({todo: "changeDuration"});
            }

            for(var index in obj){
                cacheData[index] = obj[index];
            }
            updatePreviewComponents();
            M.toast({html: 'Changes Saved', displayLength: 2000})
        });
    }

    $("#notify-duration-enable, #hours, #google-search-enable, #show-selected-word, #theme").on("change", changeHandler);
    $("#hours").on("input", function(){
        $("#show-hours").html($("#hours").val())
    })

    $("#restore-button").click(function(){
        var obj = {};
        obj.jzEnableFlag = true;
        obj.jzNotifyFlag = true;
        obj.jzNotifyDuration = 1;
        obj.jzGoogleSearchFlag = true;
        obj.jsShowSelectedWord = true;
        obj.jzTheme = 'Classic';
        chrome.storage.sync.set(obj, function(){
            if(cacheData.jzNotifyDuration != obj.jzNotifyDuration){
                chrome.runtime.sendMessage({todo: "changeDuration"});
            }

            for(var index in obj){
                cacheData[index] = obj[index];
            }
            updateDOM(obj);
            updatePreviewComponents();
            M.toast({html: 'Restored successfully', displayLength: 2000});
        });
    });

    chrome.storage.sync.get(['jzNotifyFlag', 'jzNotifyDuration', 'jzGoogleSearchFlag', 'jsShowSelectedWord', 'jzTheme'], function(res){
        $('.tooltipped').tooltip();
        $(("input[type=range]")).range();
        
        updateDOM(res);
        
        for(var index in res){
            cacheData[index] = res[index];
        }
        updatePreviewComponents();
        setTimeout(function(){
            $("#loader").hide();
            $("#container").show();
        }, 500);
    });
});