/****************************************************************
 * VARIABLES
 ****************************************************************/

// the chart containing hypotheses
var CHART = new Object();
CHART.size = function() {
    var size = -1;
    for (var key in this)
        size++;
    return size;
};

// this maps DP state signatures to valid CSS element IDS
var IDS = new Object();
IDS.size = function() {
    var size = -1;
    for (var key in this)
        size++;
    return size;
}

// start- and end-of-sentence
var SOS = "&lt;s&gt";
var EOS = "&lt;/s&gt";

// the stacks that hypotheses are placed in
var STACKS = Array();


/****************************************************************
 * INITIALIZATION CODE
 ****************************************************************/

/*
 * Build lists of source- and target-language words.
 */
var row = $("<div></div>").css({"height": "200px"});
for (i = 0; i < WORDS.length; i++) {
    
    var word = WORDS[i][0];

    // This function creates the list of translations when a source
    // word is clicked.  It has to be a separate function like this
    // due to Javascripts lexical binding.
    var clickfunc = function(index) {
        return function() {
            // make sure the list is created
            var list = create_translations_list(index);

            // animate it
            if (list.is(":visible")) {
                list.slideUp();
                $("#source" + index).find('p').css({border: "1px solid white"});
            } else {
                list.slideDown();
                $("#source" + index).find('p').css({border: "1px solid black"});
            }
        }
    };

    var label = "source" + i;
    var td = $("<div></div>")
        .addClass("source")
        .attr("id",label)
        .append($("<p></p>")
                .append(word)
                .click(clickfunc(i)));
    row.append(td);
    // document.write("<td><p class='source' id='" + label + "'>" + word + "</p></td>");
    // $("td#" + label).click(function() { translation_options(i); });
}

$("div#content")
    .append(row)
    .append($("<div></div>").css({"clear":"both"}))
    .append($("<div></div>").
            attr("id","stacks"));
// document.writeln("</tr></table></p>");

/*
 * Builds the list of target-language translations of a given source
 * word, creating it if necessary, and inserts it into the source word div.
 */
function create_translations_list(i) {
    var id = "targetlist" + i;

    var list = $("#" + id);
    if (list.size() == 0) {
        list = $("<ul></ul>")
            .attr("id", "targetlist" + i)
            .addClass("translation")
            .hide();

        var num_candidates = min($("#numcandidates").val(), WORDS[i].length - 1);
        for (j = 1; j <= num_candidates; j++) {
            var word = WORDS[i][j];
            var label = "target" + i + "-" + j;

            var item = $("<li></li>")
                .attr("id", label)
                .addClass("translation nohilite")
                .text(word)
                .data('word', word)
                .data('pos', i)
                .data('itemno', j)
                .click(function() { 
                    /* Use the word to extend a hypothesis if one is
                     * selected.
                     */
                    if (count_selected() == 1) {
                        var hypothesis = $(".selected");
                        if (is_legal($(".selected"), $(this))) {
                            var pos = $(this).data('pos');
                            if (hypothesis.data('pos')[pos] != 1) {
                                var item = extend_item(hypothesis, $(this));
                                get_stack(item.data('stack')).append(item.fadeIn());
                            }
                        }
                    }
                })
                .hover(function(e) {
                    /* On hovering, we highlight the word if one other
                     * item is selected and this word is a valid
                     * extension of that hypothesis (according to
                     * various constraints). 
                     */
                    var num_selected = count_selected();
                    switch(num_selected) {
                    case 0:
                        // nothing can be done if nothing is selected
                        $(this).removeClass('nohilite').addClass('illegal');
                        debug("Select a hypothesis to extend.");
                        break;
                    case 1:
                        if (is_legal($(".selected"), $(this))) {
                            $(this).removeClass('nohilite').addClass('hilite');
                        } else {
                            $(this).removeClass('nohilite').addClass('illegal');
                        }

                    }
                },function(e) {
                    $(this).removeClass("hilite illegal").addClass('nohilite');
                });
            // .draggable({
            //     cancel: "a.ui-icon",
            //     revert: function(dropped) {
            //         return true;
            //     },
            //     cursor: "move",
            // });
            list.append(item);
            // document.writeln("<p class='target' id='" + label + "'>" + word + "</p>");
            // document.write(p.html());
        }
        list.append($("<br></br>").css({"clear":"both"}));

        $("#source" + i).append(list);
    }

    return list;
}

/*
 * Takes two JQuery objects representing a hypothesis and a word, and
 * return true if the extension is legal under the current set of
 * constraints.
 */

function is_legal(hypothesis, word) {
    // only highlight if this is a valid extension of that hyp.
    // a word is illegal if it is already covered
    if (hypothesis.data('pos')[word.data('pos')])
        return false;
    else {
        var permitted_distance = $("#constraints").val();
        var lastpos = hypothesis.data('lastpos');
        var curpos = word.data('pos');
        // permitted
        if (permitted_distance == "0")
            return true;
        else if (permitted_distance == "+1") {
            if (curpos == lastpos + 1)
                return true;
            else 
                return false;
        } else {
            // if we're extending the empty hypothesis, or the
            // distance is within the permitted distance, we can
            // extend
            if (lastpos == -1 || (abs(curpos - lastpos) <= permitted_distance) ){
                return true;
            } else {
                return false;
            }
        }
    }
}


/*
 * Returns the requested stack, adding it if it doesn't already exist.
 * Handles different stack scenarios (single, word-based,
 * coverage-based).
 */
function get_stack(which) {
    // If we're doing just one stack, make sure it exists and return it
    if ($("#numstacks").val() == "one") {
        // create the stack if it doesn't exist
        if (STACKS.length == 0) {
            var stackdiv = $("<div></div>")
                .attr("id", "stack" + i)
                .addClass('stack-header')
                .append($("<h3></h3>")
                        .text("Stack"))
            $("div#stacks").append(stackdiv);
            STACKS.push(stackdiv);
        }

        return STACKS[0];
    } else {
        for (i = STACKS.length; i <= which; i++) {
            var stackdiv = $("<div></div>")
                .attr("id", "stack" + i)
                .addClass('stack-header')
                .append($("<h3></h3>")
                        .text("Stack (" + i + " word" + ((i >= 1 || i == 0) ? "s" : "") + " translated)"));
            $("div#stacks").append(stackdiv);
            STACKS.push(stackdiv);
            // $("#debug").append("<p>creating stack " + i + "</p>");
            debug("creating stack " + i)
        }
        return STACKS[which];
    }
}

$(".source")
    .click(function() {
        make_start_item();
    });

function compute_dpstate(phrase) {

    if ($("#dp").attr('checked')) {
        var histsize = 1;

        var words = phrase.split(' ');
        if (words.length > histsize) {
            phrase = "...";
            for (i = words.length - histsize; i < words.length; i++)
                phrase += " " + words[i];
        }
    }
    
    // debug("returning " + phrase);

    return phrase;
}

function make_start_item() {
    var empty_word_item = $("<div></div>")
        .data('word', SOS)
        .data('pos', -1);

    var item = make_item(empty_word_item);

    var key = item.data('key');
    if (! (key in CHART)) {
        // create the chart entry
        CHART[key] = item;

        // update the chart size display
        $("#chartsize").text(CHART.size());

        // display it
        if (! item.is(':visible'))
            get_stack(item.data('stack')).append(item.fadeIn());
    }

    return CHART[key];
}


/*
 * This function maps from cell signatures to unique names, which
 * names are valid as CSS Id identifiers.  This allows us to easily
 * select cells visually by referring to this latter name.  
 */
function id(key) {
    if (! (key in IDS)) {
        IDS[key] = "cell" + IDS.size();
    }

    return IDS[key];
}

function make_item(worditem, olditem) {
    var obj = $("<div></div>")
        .addClass("stack");

    var words = (olditem ? (olditem.data('words') + " ") : "") + worditem.data('word');
    var pos   = worditem.data('pos');

    obj.data('words', compute_dpstate(words));
    obj.data('pos',   olditem ? olditem.data('pos').slice(0) : new Array());
    if (pos != -1)
        obj.data('pos')[pos] = 1;
    obj.data('lastpos', -1);
    obj.data('stack', olditem ? (olditem.data('stack') + 1) : 0);
    obj.data('backpointer', olditem ? olditem : null);
    obj.data('word', worditem);
    obj.data('covered', create_coverage_display(obj.data('pos')));
    obj.data('key', obj.data('words') + " ||| " + obj.data('covered'));
    obj.attr('id', id(obj.data('key')));

    // debug('make_item(' + words + ',' + pos + ')');
    // debug("obj stack = " + obj.data('stack') + " wordslen = " + WORDS.length);

    // check if the item is complete, and if so, extend it
    if (obj.data('stack') == WORDS.length) {
        obj.data('words', obj.data('words') + " " + EOS);
        obj.data('complete', true);
    } else {
        obj.data('complete', false);
    }

    obj.append($("<p></p>")
                .append(obj.data('words')))
        .append(obj.data('covered'))
        .hide()
        .click(function () { 
            var obj = this; toggle_selection(obj); 
        })
        .droppable({
            accept: ".translation",
            hoverClass: "highlight",
            tolerance: 'intersect',
            drop: function(event, ui) {
                var item = extend_item($(this), ui.draggable);
                get_stack(item.data('stack')).append(item.fadeIn());
            },
        })
        .hover(function () { 
            $(this).removeClass("stacknohilite").addClass("stackhilite");
            
            // highlight backpointers
            $("." + $(this).attr('id')).addClass("dp-hilite");
        }, function () { 
            if (! ($(this).hasClass("selected")))
                $(this).removeClass("stackhilite").addClass("stacknohilite");

            // un-hilite DP backpointers
            $("." + $(this).attr('id')).removeClass('dp-hilite');
            // restore hilites to selected items
            // $(".selected").removeClass('stacknohilite').addClass('stackhilite');
            // $('["' + item.signature + '"]').removeClass("stacknohilite");
        });

    if (obj.data('complete')) {
        obj.addClass("stackcomplete");
    } else {
        obj.addClass("stacknohilite")
    }


    // mark the backpointer with this item's class id, so that we can highlight it
    if (obj.data('backpointer') != null) {
        // add this item's class to the hypothesis
        obj.data('backpointer').addClass(obj.attr('id'));
        // add this item's class to the word
        obj.data('word').addClass(obj.attr('id'));
    }

    // if (item.backpointer) {
    //     item.backpointer.$.attr(item.signature, 1);
    // }

    return obj;

        // over: function(event, ui) {
        //     var item = ui.draggable.data('item');
        //     var word = item.words;
        //     var pos  = item.pos;
        //     if (item.pos[pos] == 1)
        // }
}


/**
 * Takes an existing item and a new word and creates a new item that
 * also covers that word.
 */
function extend_item(olditem,worditem) {
    var item = make_item(worditem, olditem);

    var key = item.data('key');
    if (! (key in CHART)) {
        // create the chart entry
        CHART[key] = item;

        // update the chart size display
        $("#chartsize").text(CHART.size());

        // display it (TODO?)
    }

    return CHART[key];
}


// This function takes an array with 1s denoting source-language words
// that have been consumed.  It returns a nice HTML display of it.  It
// assumes access to the global "words" array (to determine sentence
// length only).
function create_coverage_display(array) {
    var covered = "";
    for (i = 0; i < WORDS.length; i++) {
        if (array[i] == 1) {
            covered += "◉";
        } else {
            covered += "◎";
        }
    }
    return covered;
}


function translation_options() {
    // for (i = 1; i < WORDS[index].length; i++) {
    // $("div#debug").append("<p>" + i + "/" + j + "</p>");
    ensure_stack_exists(2);
    $("div#debug").append("<p>MATT</p>");
    // }
}

// Converts an ID to the word it represents.
function id2word(label) {
    var matches = label.match(/(\d+)-(\d+)/);
    var i = matches[1];
    var j = matches[2];
    return WORDS[i][j];
}

function id2index(label) {
    var matches = label.match(/(\d+)-(\d+)/);
    var i = matches[1];
    return i;
}

function deselect_item(div) {
    // deselect this item
    $(div).removeClass("selected stackhilite").addClass("stacknohilite");
    // debug("DESELECT: num=" + count_selected());
}

function select_item(div) {
    // deselect all other items
    $(".selected").removeClass("selected stackhilite").addClass("stacknohilite");

    // select this item
    $(div).addClass("stackhilite selected");
}

function toggle_selection(div) {
    if (! ($(div).hasClass("selected"))) 
        select_item(div);
    else 
        deselect_item(div);
}

function highlight(o) {
    $(o).addClass('highlight');
    debug("highlighting DIV:'" + $(o).id + "'");
}


// returns the number of current selected objects
function count_selected() {
    var num = $(".selected").size();
    return num;
}

function debug(message) {
    $("#debug > div").prepend("<p>" + message + "</p>");
}

function min(a,b) {
    if (a < b)
        return a;
    else
        return b;
}

function abs(a) {
    if (a < 0)
        return -a;
    return a;
}
