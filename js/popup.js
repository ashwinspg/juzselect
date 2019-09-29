function isNull(value){
    return value == null || value == undefined;
}

$(function(){
    $("#juzselect-options").on('mousedown', function(e){
        chrome.tabs.create({'url': "/options.html" });
    });
    
    chrome.storage.sync.get(['juzselect_isEnable'], function(res){
        $("#isEnable").attr("checked", res.juzselect_isEnable);
        $("#isEnable").on("change", function(){
            chrome.storage.sync.set({juzselect_isEnable: $(this).is(":checked")});
        });
        setTimeout(function(){
            $("#loader-container").hide();
        }, 500);
    });
});