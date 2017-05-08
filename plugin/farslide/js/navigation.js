/**
 * Created by lukashab on 4/20/17.
 */

/**
 * Navigation class
 * @param root
 * @param timeLine
 * @constructor
 */
function Navigation() {

    this.svgRoot = document.querySelector("svg");
    this.tl = new TimelineMax({delay:.0});


    /**
     * Function to zoom out to see whole SVG element
     */
    this.zoomOut = function()
    {
        this.svgRoot = document.querySelector("svg");
        this.tl = new TimelineMax({delay:.0});

        var viewBox = this.svgRoot.getBBox();
        this.tl.to(this.svgRoot, 1 ,{attr:{viewBox:viewBox.x + " " + viewBox.y + " " + (viewBox.width + 100) + " " + (viewBox.height + 100)}})
    };
    /**
     * Function to zoom in target frame area
     * @param entry
     */
    this.zoomIn = function(entry)
    {

        var bbox = entry.getBBox();
        //TweenMax.set(svgRoot,{attr:{viewBox:viewBox.x + " " + viewBox.y + " " + viewBox.width + " " + viewBox.height}});
        this.tl.to(this.svgRoot, 1 ,{attr:{viewBox:bbox.x + " " + bbox.y + " " + (bbox.width) + " " + (bbox.height)}});


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