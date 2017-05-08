/**
 * Created by lukashab on 4/20/17.
 */


function Content() {
    var paddingPercentil = 10;
    var SIZE_RATIO = "size-ratio";

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
            parent.css("padding-left", (paddingPercentil * 2) + "%");
            parent.css("text-align", "left");
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
        while ((resizer.width() + (2 * (paddingPercentil / 100) * bbox.width)) > bbox.width || (resizer.height() + (2 * (paddingPercentil / 100) * bbox.height)) > bbox.height) {
            children.each(function () {
                reduceSize($(this));
            });
            counter++;
            //to avoid cycle
            if (counter > 1000) {
                break;
            }
        }

        //create inner html object and paste it to svg element
        div.innerHTML = resizer.html();

        var styles = entry.getAttribute("farslide-style");
        if (styles) {
            div = setStyle(div, styles);
        }

        body.appendChild(div);
        object.appendChild(body);
        svg.appendChild(object);

    };
}