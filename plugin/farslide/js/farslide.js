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

    var frames = framesResolver.getFrames();
    var frameElements = framesResolver.getFrameElements();
    var frameObjects = framesResolver.getFrameObjects();
    var current = null;
    var zoomedOut = false;
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
                if(content) {
                    content.addEventListener("click", function(){
                        navigationResolver.zoomIn(element);
                        current = frameObjects[frame.id];
                        navigationResolver.updateNavigator(current);
                        changeZoomBtn(true);

                    })
                }
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


    //get frames of SVG presentation


    if(frames.length > 0) {
        //set current frame (used by fixed navigation bar)
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


