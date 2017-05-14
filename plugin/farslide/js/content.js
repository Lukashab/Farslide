/**
 * Created by lukashab on 4/20/17.
 */

/**
 * Content class. Takes care of frame content creation.
 * @constructor
 */
function Content() {
    var paddingPercentil = 10;
    var SIZE_RATIO = "size-ratio";
    var ignore_elements = ["li", "a"];

    /**
     * Function used to scale html content to fit the svg object
     * @param parent html element
     */
    var reduceSize = function (parent) {

        var size = parseInt(parent.css("font-size"), 10);
        parent.css("font-size", size - 1 + "px");
        parent.css("margin", "0px");
        parent.css("padding", "0px");
        var tag = parent.prop("tagName").toLowerCase();
        if (tag == "ul") {
            parent.css("margin", "0.5em 0 0.5em " + (paddingPercentil / 3) + "em");
        } else if (!ignore_elements.includes(tag) ) {
             parent.css("padding", "0.3em 0");
        }
        var children = parent.children();
        if (children) {
            children.each(function () {
                reduceSize($(this));
            })
        }
    };


    /**
     * Function to recursively update fontsize according to given ratio
     * @param node
     * @param ratio
     */
    var updateFontSize = function (node, ratio) {
        var size = parseInt(node.style.fontSize, 10);
        if (size) {
            node.style.fontSize = (ratio * size) + "px";
        }

        var children = node.children;
        var i;
        for (i = 0; i < children.length; i++) {
            updateFontSize(children[i], ratio);
        }
    };

    /**
     * Function to set additional styles to given div element
     * @param div element
     * @param styles styles to be set to div element
     * @returns div with modified styles
     */
    var setStyle = function (div, styles) {
        styles = styles.split(";");
        styles.forEach(function (item) {
            var list = item.split(":");
            if (list.length == 2) {
                if (list[0] == SIZE_RATIO) {
                    var children = div.children;
                    var i;
                    for (i = 0; i < children.length; i++) {
                        updateFontSize(children[i], list[1]);
                    }

                } else {
                    div.style[list[0]] = list[1];
                }
            }
        });

        return div;
    };

    /**
     * Function to set content to given element
     * It converts the plain content attribute and creates scaled foreignObject according to size of covering svg element
     * @param entry svg element
     */
    this.setContent = function (entry) {

        //get coordinates and content
        var bbox = entry.getBBox();

        //In case of circle typed object with r parameter, width and height borders for content computation must be doubled
        if(entry.getAttribute("r")) {
            var maxWidth = 2 * bbox.width;
            var maxHeight = 2 * bbox.height;
        } else {
            var maxWidth = bbox.width;
            var maxHeight = bbox.height;
        }

        //In case there is no content atribute contained in SVG element, nothing to be done here
        var content = entry.getAttribute("content");
        if (!content) return;


        //convert content to html
        var converter = new showdown.Converter(),
            html = converter.makeHtml(content);


        //create svg foreignObject to handle the html content
        var svg = document.querySelector("svg");
        var object = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        object.setAttributeNS(null, "x", bbox.x);
        object.setAttributeNS(null, "y", bbox.y);
        object.setAttributeNS(null, "width", bbox.width);
        object.setAttributeNS(null, "height", bbox.height);
        object.setAttributeNS(null, "class", "node " + entry.getAttribute("id"));
        object.setAttributeNS(null, "id", "content-" + entry.getAttribute("id"));


        //html elements--------------------------------
        //body
        var body = document.createElement("body");
        body.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
        body.style.padding = "0px";
        body.style.margin = "0px";

        //div
        var div = document.createElement("div");
        div.style.fontFamily = "Arial";
        div.style.margin = "0";
        div.style.textAlign = "left";
        div.style.padding = paddingPercentil + "%";


        //Div element used to rezise html content to fit svg object
        var resizer = $("#hidden-resizer");
        resizer.css("font-family", "Arial");
        resizer.html(html);

        var counter = 0;
        var children = resizer.children();
        //reducing font size of each element until the whole html content fits the svg element area
        while ((resizer.width() + (2 * (paddingPercentil / 100) * bbox.width)) > maxWidth || (resizer.height() + (2 * (paddingPercentil / 100) * bbox.height)) > maxHeight) {
            children.each(function () {
                reduceSize($(this));
            });
            counter++;

        }

        //create inner html object and paste it to svg element
        div.innerHTML = resizer.html();

        //apply additional styles specified in content atribute
        var styles = entry.getAttribute("farslide-style");
        if (styles) {
            div = setStyle(div, styles);
        }

        //apend created div to html document
        body.appendChild(div);
        object.appendChild(body);
        svg.appendChild(object);

    };
}