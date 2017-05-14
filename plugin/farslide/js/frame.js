/**
 * Created by lukashab on 4/20/17.
 */

/**
 * Frames class
 * @constructor
 */
function Frames() {
    var frameElements = [];
    var frameObjects = [];


    /**
     * FrameElements getter
     * @returns {Array}
     */
    this.getFrameElements = function () {
        return frameElements;
    };

    /**
     * FrameObjects getter
     * @returns {Array}
     */
    this.getFrameObjects = function () {
        return frameObjects;
    };

    /**
     * Function used for frame sort. Sorts array of frames according to their order
     * @param frameA
     * @param frameB
     * @returns {number}
     */
    var compareFrames = function (frameA, frameB) {
        return frameA.getAttribute("farslide-order") - frameB.getAttribute("farslide-order");
    };

    /**
     * Frame class
     * @param id node id
     * @param order order number of node according to its layer
     * @param left left neightbour
     * @param right right neighbour
     * @param childs childs of node
     * @param parent parent of node
     * @constructor
     */
    function Frame(id, order, left, right, childs, parent) {
        this.id = id;
        this.order = order;
        this.left = left;
        this.right = right;
        this.childs = childs;
        this.parent = parent
    }

    /**
     * Gets all childs for frame with given id
     * @param id id of parent frame
     * @returns {*}
     */
    var getChilds = function (id) {

        //if node is not parent
        if (!$("#" + id + ".farslide-is-parent")) {
            return null
        } else {
            var nodes = $("svg [farslide-parent=" + id);
            nodes = nodes.sort(compareFrames);
            return getLayer(nodes, id);
        }
    };
    /**
     * Gets one layer of presentation (according to given nodes and parent)
     * @param nodes nodes
     * @param parentId
     * @returns {*}
     */
    var getLayer = function (nodes, parentId) {

        var previous = null;

        var result = [];
        var index = 0;

        //Iterate through each node and create Frame object from it
        nodes.each(function () {
            frameElements[$(this).attr("id")] = document.getElementById($(this).attr("id"));
            var frame = new Frame($(this).attr("id"), $(this).attr("farslide-order"), previous, null, null, parentId);
            frame.childs = getChilds(frame.id);
            result[index] = frame;
            frameObjects[frame.id] = frame;

            if (index > 0) {
                result[index - 1].right = frame.id;
                frameObjects[result[index - 1].id].right = frame.id;
            }

            previous = frame.id;
            index++;
        });

        //create cycle in navigation for edge frames
        if (index > 1) {
            result[index - 1].right = result[0].id;
            result[0].left = result[index - 1].id;
        }

        if (result.length > 0) {
            return result;
        } else {
            return null;
        }
    };

    /**
     * Gets all frames in presentation
     * @returns {*}
     */
    this.getFrames = function () {
        frameElements = [];
        var frames = $("svg :not([farslide-parent])[farslide-order]");
        frames = frames.sort(compareFrames);
        return getLayer(frames, null);


    };
}