var juzselect_console_logs = true;

function isNull(value){
    return value == undefined || value == null;
}

(function(){
try{

function initJuzSelect($){
    $(document).ready(function(){

        function hidePopup(){
            $('#juzselect-popup').text('').css({
                top: -1,
                left: -1
            }).hide();
            $('#juzselect-popup').remove();
        }

        function isEmptyBoundingClientRect(boundingClientRect){
            var temp = true;
            for(var key in JSON.parse(JSON.stringify(boundingClientRect))){
                temp = temp && (boundingClientRect[key] == 0);
            }
            return temp;
        }

        function calLeftPos(wordSelect, event){
            try{
                var popupWidth = $("#juzselect-popup").outerWidth();
                var windowWidth = $(window).outerWidth();
                var boundingClientRect = wordSelect.getRangeAt(0).getBoundingClientRect();

                if(isEmptyBoundingClientRect(boundingClientRect)){
                    return;
                }

                // left - exact position
                var leftPos = $(window).scrollLeft() + boundingClientRect.left;

                if(boundingClientRect.left < 0){
                    leftPos = leftPos + boundingClientRect.width;
                }else if((windowWidth - boundingClientRect.left) < popupWidth){
                    leftPos = leftPos - popupWidth;     // too left
                }

                return leftPos > 0 ? leftPos : 0;
            }
            catch(error){
                if(juzselect_console_logs){
                    console.log("error in juzselect (leftpos): "+error.message);
                }
                hidePopup();
            }
        }
        function calTopPos(wordSelect, event){
            try{
                var popupHeight = $("#juzselect-popup").outerHeight();
                var windowHeight = $(window).outerHeight();
                var boundingClientRect = wordSelect.getRangeAt(0).getBoundingClientRect();

                if(isEmptyBoundingClientRect(boundingClientRect)){
                    return;
                }

                // top - exact position
                var topPos = $(window).scrollTop() + boundingClientRect.top - (popupHeight + boundingClientRect.height);
                
                if(boundingClientRect.top < popupHeight){
                    // bottom
                    topPos = $(window).scrollTop() + boundingClientRect.top + (boundingClientRect.height);
                }

                return topPos > 0 ? topPos : 0;
            }
            catch(error){
                if(juzselect_console_logs){
                    console.log("error in juzselect (leftpos): "+error.message);
                }
                hidePopup();
            }
        }

        function addEventListener(){
            try{
                var juzselectHandler = function(event){
                    setTimeout(function(){
                        var wordSelect = window.getSelection();
                        var wordArr = wordSelect.toString().split(' ');
                        if(wordArr.length <= 2 && wordArr[0].length > 0 && (wordArr[0] != '\n' && wordArr[0] != ' ' && wordArr[0] != '\n') && !(wordArr[1] && wordArr[1].length > 0)){
                            juzselectProcessor().then(function(res){
                                if(res.juzselect_isEnable){
                                    dictionaryProcessor(wordArr[0].toLowerCase()).then(function(meaning){
                                        if(!isNull($("#juzselect-popup"))){
                                            $("#juzselect-popup").remove();
                                        }
                                        var popupDiv = $('<customeEle />').appendTo('body');
                                        popupDiv.attr('id', 'juzselect-popup');
                                        if(juzselect_console_logs){
                                            console.log("processing juzselect");
                                        }
                                        if(res.juzselect_theme == "Classic"){
                                            $("#juzselect-popup").removeClass("dark");
                                        }else{
                                            $("#juzselect-popup").addClass("dark");
                                        }
                                        var htmlString = "";
                                        if(res.juzselect_selectedWordEnable){
                                            htmlString = htmlString + "<customeEle id='juzselect-word'>" + wordArr[0] + "</customeEle>";
                                        }
                                        var meaningTag = meaning ? "<customeEle>" + meaning + "</customeEle>" : "<customeEle id='juzselect-no-result'>No Results</customeEle>";
                                        htmlString = htmlString + meaningTag;

                                        if(res.juzselect_googleSearchEnable){
                                            htmlString = htmlString + "<customeEle id='juzselect-search'>Search Google for \""+wordArr[0]+"\"</customeEle>";
                                        }

                                        $('#juzselect-popup').html(htmlString);

                                        if(res.juzselect_googleSearchEnable){
                                            $('#juzselect-popup').off('mousedown', '#juzselect-search').on('mousedown', '#juzselect-search', function(e){
                                                var searchTag = "https://www.google.com/search?q="+wordArr[0];
                                                window.open(searchTag, "_blank");
                                            });
                                        }

                                        var leftPos = calLeftPos(wordSelect, event);
                                        var topPos = calTopPos(wordSelect, event);
                                        if(!(isNull(leftPos) && isNull(topPos))){
                                            $('#juzselect-popup').css({
                                                top: topPos,
                                                left: leftPos
                                            }).show();
                                        }
                                    });
                                }
                            });
                        }else{
                            hidePopup();
                        }
                    }, 0);
                };
                $(document).unbind("mouseup keyup scroll", juzselectHandler);
                $(document).off("mouseup keyup scroll").on("mouseup keyup scroll", juzselectHandler);
            }
            catch(error){
                if(juzselect_console_logs){
                    console.log("error in juzselect (listener): "+error.message);
                }
                hidePopup();
            }
        }

        addEventListener();
    });
}

initJuzSelect($);

}
catch(error){
    if(juzselect_console_logs){
        console.log("error in juzselect (init): "+error.message);
    }
}

})();