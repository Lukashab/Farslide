/**
 * Created by lukashab on 4/20/17.
 */

/**
 * Navigation class. Handle functions to initialize navigation, zoom in/out of SVG document and set animation time
 * @constructor
 */
function Navigation() {


    this.svgRoot = document.querySelector("svg");
    this.tl = new TimelineMax({delay:.0});
    var time = 1;


    /**
     * Function to zoom out to see whole SVG element
     */
    this.zoomOut = function()
    {
        this.svgRoot = document.querySelector("svg");
        this.tl = new TimelineMax({delay:.0});

        var viewBox = this.svgRoot.getBBox();
        this.tl.to(this.svgRoot, time ,{attr:{viewBox:viewBox.x + " " + viewBox.y + " " + (viewBox.width + 100) + " " + (viewBox.height + 100)}})
    };
    /**
     * Function to zoom in target frame area
     * @param entry
     */
    this.zoomIn = function(entry)
    {

        var bbox = entry.getBBox();
        //TweenMax.set(svgRoot,{attr:{viewBox:viewBox.x + " " + viewBox.y + " " + viewBox.width + " " + viewBox.height}});
        this.tl.to(this.svgRoot, time ,{attr:{viewBox:bbox.x + " " + bbox.y + " " + (bbox.width) + " " + (bbox.height)}});


    };

    /**
     * Function to update animation time
     */
    this.updateTime = function()
    {
        //Handle time button click
        $("#time-select input[type=submit]").on("click", function() {
            var value = $("#time-select input[type=text]").val();
            //validate input value (number)
            if(isNaN(value)) {
                alert("Animation time value have to be numeric.");
            }
            //handle zero animation time value
            time = (value == 0) ? 0.001 : value;

            //Show information paragraph to user for some time
            $("#time-value").html(value);
            $("#time-info").fadeIn().delay(3000).fadeOut();
        });
    };




    /**
     * Updates the navigator menu according to current frame position
     * @param frame
     */
    this.updateNavigator = function(frame)
    {
        var up = document.getElementById("up");
        var down = document.getElementById("down");

        if(frame.parent) {
            up.setAttribute("class", "active");
        } else {
            up.setAttribute("class", "");
        }

        if(frame.childs !== null) {
            down.setAttribute("class", "active");
        } else {
            down.setAttribute("class", "");
        }
    };

}