var jzLog = true;

function isNull(value){
    return value == undefined || value == null;
}

(function(){
try{
    function initJZ($){
        $(document).ready(function(){
            function hidePopup(){
                $('#jz-popup').text('').css({
                    top: -1,
                    left: -1
                }).hide();
                $('#jz-popup').remove();
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
                    var popupWidth = $("#jz-popup").outerWidth();
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
                catch(err){
                    if(jzLog){
                        console.error("Error in juzselect (leftpos):", err.message);
                    }

                    hidePopup();
                }
            }

            function calTopPos(wordSelect, event){
                try{
                    var popupHeight = $("#jz-popup").outerHeight();
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
                catch(err){
                    if(jzLog){
                        console.error("Error in juzselect (leftpos):", err.message);
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
                                    if(res.jzEnableFlag){
                                        dictionaryProcessor(wordArr[0].toLowerCase()).then(function(meaning){
                                            if(!isNull($("#jz-popup"))){
                                                $("#jz-popup").remove();
                                            }

                                            var popupDiv = $('<div />').appendTo('body');
                                            popupDiv.attr('id', 'jz-popup');
                                            if(jzLog){
                                                console.log("processing juzselect");
                                            }

                                            if(res.jzTheme == "Classic"){
                                                $("#jz-popup").removeClass("dark");
                                            }else{
                                                $("#jz-popup").addClass("dark");
                                            }

                                            var htmlString = "";
                                            if(res.jsShowSelectedWord){
                                                htmlString = htmlString + "<div id='jz-word'>" + wordArr[0] + "</div>";
                                            }

                                            var meaningTag = meaning ? "<div>" + meaning + "</div>" : "<div id='juzselect-no-result'>No Results</div>";
                                            htmlString = htmlString + meaningTag;
                                            if(res.jzGoogleSearchFlag){
                                                htmlString = htmlString + "<div id='jz-search'>Search Google for \""+wordArr[0]+"\"</div>";
                                            }

                                            $('#jz-popup').html(htmlString);
                                            if(res.jzGoogleSearchFlag){
                                                $('#jz-popup').off('mousedown', '#jz-search').on('mousedown', '#jz-search', function(e){
                                                    var searchTag = "https://www.google.com/search?q="+wordArr[0];
                                                    window.open(searchTag, "_blank");
                                                });
                                            }

                                            var leftPos = calLeftPos(wordSelect, event);
                                            var topPos = calTopPos(wordSelect, event);
                                            if(!(isNull(leftPos) && isNull(topPos))){
                                                $('#jz-popup').css({
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
                catch(err){
                    if(jzLog){
                        console.error("error in juzselect (listener):", err.message);
                    }
                    
                    hidePopup();
                }
            }

            addEventListener();
        });
    }

initJZ($);
} catch (err) {
    if(jzLog){
        console.error("error in juzselect (init):", err.message);
    }
}

})();