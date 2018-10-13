function isNull(value){
    return value == null || value == undefined;
}

var cacheData = {};

$(function(){

    function executeConditions(hours, minutes){
        return (hours == 0 && minutes == 0) || (hours < 0 || hours > 23) || (minutes < 0 || minutes > 59) || isNaN(hours) || isNaN(minutes);
    }

    function isInValid(hours, minutes){
        return executeConditions(hours, minutes) || executeConditions(parseInt(hours), parseInt(minutes));
    }

    function showAlert(){
        alert (`
            The notification duration should attain following criteria:
                - hours and minutes should not be empty
                - hours and minutes should not be 0
                - hours and minutes should not be decimal values
                - hours should be between 0 and 23
                - minutes should be between 0 and 59
        `);
    }

    function pad(d) {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }

    function updateDOM(obj){
        var duration = parseInt(obj.juzselect_notifyDuration);
        var hours = Math.floor(duration / 60);
        var minutes = Math.floor(duration % 60);
        $("#hours").val(pad(hours));
        $("#minutes").val(pad(minutes));

        $("#notifyDurationEnable").prop("checked", obj.juzselect_notifyDurationEnable);
        $("#googleSearchEnable").prop("checked", obj.juzselect_googleSearchEnable);
        $("#selectedWordEnable").prop("checked", obj.juzselect_selectedWordEnable);
        $("#theme").val(obj.juzselect_theme);
    }

    function updatePreviewComponents(){
        if(cacheData.juzselect_selectedWordEnable){
            $("#juzselect-word").fadeIn();
        }else{
            $("#juzselect-word").fadeOut();
        }
        if(cacheData.juzselect_googleSearchEnable){
            $("#juzselect-search").fadeIn();
        }else{
            $("#juzselect-search").fadeOut();
        }
        if(cacheData.juzselect_notifyDurationEnable){
            $("#notifyDurationContainer").fadeIn();
        }else{
            $("#notifyDurationContainer").fadeOut();
        }
        if(cacheData.juzselect_theme == "Classic"){
            $("#juzselect-popup").removeClass("dark");
        }else{
            $("#juzselect-popup").addClass("dark");
        }
    }

    function changeHandler(){
        var obj = {};

        var hours = $("#hours").val();
        var minutes = $("#minutes").val();
        var duration;

        if(isInValid(hours, minutes)){

            duration = parseInt(cacheData.juzselect_notifyDuration);
            hours = parseInt(duration / 60);
            minutes = parseInt(duration % 60);
            
            $("#hours").val(pad(hours));
            $("#minutes").val(pad(minutes));

            showAlert();
            return;
        }

        // removing integers
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        $("#hours").val(pad(hours));
        $("#minutes").val(pad(minutes));
        duration = (parseInt(hours) * 60) + (parseInt(minutes));

        var notifyDurationEnable = $("#notifyDurationEnable").prop("checked");
        var googleSearchEnable = $("#googleSearchEnable").prop("checked");
        var selectedWordEnable = $("#selectedWordEnable").prop("checked");
        var theme = $("#theme").val();

        obj.juzselect_notifyDurationEnable = notifyDurationEnable;
        obj.juzselect_notifyDuration = duration;
        obj.juzselect_googleSearchEnable = googleSearchEnable;
        obj.juzselect_selectedWordEnable = selectedWordEnable;
        obj.juzselect_theme = theme;

        chrome.storage.sync.set(obj, function(){
            if(cacheData.juzselect_notifyDuration != obj.juzselect_notifyDuration){
                chrome.runtime.sendMessage({todo: "changeDuration"});
            }
            for(var index in obj){
                cacheData[index] = obj[index];
            }
            updatePreviewComponents();
            $("#changesUpdated").html("Changes updated").fadeIn().fadeOut(1500);
        });
    }

    $("#hours").spinner({
        min: 0, 
        max: 23,
        change: changeHandler
    });

    $("#minutes").spinner({
        min: 0, 
        max: 59,
        change: changeHandler
    });

    $("#notifyDurationEnable, #googleSearchEnable, #selectedWordEnable, #theme").on("change", changeHandler);

    $("#restore-button").click(function(){
        var obj = {};
        obj.juzselect_isEnable = true;
        obj.juzselect_notifyDurationEnable = true;
        obj.juzselect_notifyDuration = 5;
        obj.juzselect_googleSearchEnable = true;
        obj.juzselect_selectedWordEnable = true;
        obj.juzselect_theme = 'Classic';
        chrome.storage.sync.set(obj, function(){
            if(cacheData.juzselect_notifyDuration != obj.juzselect_notifyDuration){
                chrome.runtime.sendMessage({todo: "changeDuration"});
            }
            for(var index in obj){
                cacheData[index] = obj[index];
            }
            updateDOM(obj);
            updatePreviewComponents();
            $("#changesUpdated").html("Restored successfully").fadeIn().fadeOut(2000);
        });
    });

    chrome.storage.sync.get(['juzselect_notifyDurationEnable', 'juzselect_notifyDuration', 'juzselect_googleSearchEnable', 'juzselect_selectedWordEnable', 'juzselect_theme'], function(res){

        updateDOM(res);
        
        for(var index in res){
            cacheData[index] = res[index];
        }
        updatePreviewComponents();
    });
});