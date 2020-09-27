function isNull(value){
    return value == null || value == undefined;
}

$(function(){
    $("#juzselect-options").on('mousedown', function(e){
        chrome.tabs.create({'url': "/options.html" });
    });
    
    chrome.storage.sync.get(['jzEnableFlag'], function(res){
        $("#isEnable").attr("checked", res.jzEnableFlag);
        $("#isEnable").on("change", function(){
            chrome.storage.sync.set({jzEnableFlag: $(this).is(":checked")});
        });
        setTimeout(function(){
            $("#loader-container").hide();
        }, 500);
    });
});