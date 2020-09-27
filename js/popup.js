function isNull(value){
    return value == null || value == undefined;
}

$(function(){
    $("#juzselect-options").on('mousedown', function(e){
        chrome.tabs.create({'url': "/options.html" });
    });
    
    chrome.storage.sync.get(['jzEnableFlag'], function(res){
        $("#extension-state").attr("checked", res.jzEnableFlag);
        $("#extension-state").on("change", function(){
            chrome.storage.sync.set({jzEnableFlag: $(this).is(":checked")});
        });
        setTimeout(function(){
            $("#loader").hide();
            $("#container").show();
        }, 500);
    });
});