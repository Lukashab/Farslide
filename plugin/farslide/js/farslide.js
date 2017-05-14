/**
 * Created by lukashab on 4/16/17.
 */

/**
 * Initialize frames. Adds event listeners and creates elements with its content (if any)
 * @param frames
 */


/**
 * Initialization of presentation
 */
window.onload = function() {

    var navigationResolver = new Navigation();
    var framesResolver = new Frames();
    var contentResolver = new Content();

    //get all presentation frames
    var frames = framesResolver.getFrames();
    var frameElements = framesResolver.getFrameElements();
    var frameObjects = framesResolver.getFrameObjects();
    //set global presentation operation variables
    var current = null;
    var zoomedOut = true;
    //zoom out to see full presentation view in the beginning
    navigationResolver.zoomOut();
    //listen to animation time value change
    navigationResolver.updateTime();

    /**
     * initialization of all frames
     * @param frames
     */
    var initFrames = function(frames){
        if(frames === null) return;

        frames.forEach(function(frame) {
            var element = document.querySelector("#" + frame.id);

            if(element) {
                contentResolver.setContent(element);
                var content = document.querySelector("#content-" + frame.id);
                //create zoomIn listener to content click action
                if(content) {
                    content.addEventListener("click", function(){
                        navigationResolver.zoomIn(element);
                        current = frameObjects[frame.id];
                        navigationResolver.updateNavigator(current);
                        changeZoomBtn(true);

                    })
                }
                //create zoomIn listener to element click action
                element.addEventListener("click", function() {
                    navigationResolver.zoomIn(element);
                    current = frameObjects[frame.id];
                    navigationResolver.updateNavigator(current);
                    changeZoomBtn(true);
                });

            }
            initFrames(frame.childs);
        });
    };

    /**
     * Up navigation function
     */
    var up = function(){
        if(current === null) {
            current = frames[0];
        } else if (current.parent){
            current = frameObjects[current.parent];
        } else {
            return;
        }
        navigationResolver.zoomIn(frameElements[current.id]);
        navigationResolver.updateNavigator(current);
        changeZoomBtn(true);
    };
    /**
     * Down navigation function
     */
    var down = function(){
        if(current === null) {
            current = frames[0];
        } else if(current.childs) {
            current = frameObjects[current.childs[0].id];
        } else {
            return;
        }
        navigationResolver.zoomIn(frameElements[current.id]);
        navigationResolver.updateNavigator(current);
        changeZoomBtn(true);
    };
    /**
     * Left navigation function
     */
    var left = function(){
        if(current === null) {
            current = frames[0];
        } else  if(current.left){
            current = frameObjects[current.left];
        } else {
            return;
        }
        navigationResolver.zoomIn(frameElements[current.id]);
        navigationResolver.updateNavigator(current);
        changeZoomBtn(true);
    };
    /**
     * Right navigation function
     */
    var right = function(){
        if(current === null) {
            current = frames[0];
        } else if(current.right){
            current = frameObjects[current.right];
        } else {
            return;
        }
        navigationResolver.zoomIn(frameElements[current.id]);
        navigationResolver.updateNavigator(current);
        changeZoomBtn(true);
    };
    /**
     * Function to zoom out/in according to current presentation view/state
     * @param button
     */
    var zoom = function(button) {
        if(zoomedOut) {
            navigationResolver.zoomIn(frameElements[current.id]);
            button.setAttribute('class', "active");
        } else {
            navigationResolver.zoomOut();
            button.setAttribute('class', "active out");
        }

        zoomedOut = !zoomedOut;
    };

    /**
     * Change zoom indicator value
     * @param zoomOut
     */
    var changeZoomBtn = function(zoomOut) {
        var buttonZoom = document.getElementById("zoom");

        if(zoomOut) {
            zoomedOut = false;
            buttonZoom.setAttribute("class","active");
        } else {
            zoomedOut = true;
            buttonZoom.setAttribute("class","active out")
        }

    };



    //set all navigation listeners to navigation buttons click actions
    if(frames.length > 0) {
        //set click eventListeners for each frame (used to zoom in the frame area)
        initFrames(frames, navigationResolver);

        //set listeners to navigation buttons
        //right button
        var buttonRight = document.getElementById("right");
        buttonRight.addEventListener("click", function (){
            right();

        });
        //left button
        var buttonLeft = document.getElementById("left");
        buttonLeft.addEventListener("click", function (){
            left();

        });

        //left button
        var buttonUp = document.getElementById("up");
        buttonUp.addEventListener("click", function (){
            up();

        });

        //left button
        var buttonDown = document.getElementById("down");
        buttonDown.addEventListener("click", function (){
            down();

        });

        //set event listener to zoom out of current svg area
        var buttonZoom = document.getElementById("zoom");
        buttonZoom.addEventListener("click", function() {
            zoom(buttonZoom);


        });

        /**
         * arrow keys navigation
         * @param e
         */
        document.onkeydown = function(e) {
            e = e || window.event;

            if (e.keyCode == '38') {
                up()
            }
            else if (e.keyCode == '40') {
                down()
            }
            else if (e.keyCode == '37') {
                left()
            }
            else if (e.keyCode == '39') {
                right()
            } else if (e.keyCode == '13') {
                zoom(buttonZoom);
            }
        };
    }

};


