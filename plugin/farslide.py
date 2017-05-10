#! /usr/bin/env python

import inkex
import re
import sys
import os
import errno
import subprocess
import math
import yaml
import json
import datetime

sys.path.append('/usr/share/inkscape/extensions') # or another path, as necessary

inkex.localize()



class Farslide(inkex.Effect):

    '''
    Plugin constants
    '''
    #order and groups
    ORDER_ATTRIBUTE = "farslide-order"
    GROUP_PARENT_ATTRIBUTE = "farslide-parent"
    ID_ATTRIBUTE = "id"
    GROUP_CLASS = "farslide-is-parent"
    STYLE_ATTRIBUTE = "farslide-style"
    #file export
    SVG_FILENAME = "presentation.svg"
    INDEX_FILENAME = "index.html"
    JS_DIRNAME = "js/"
    IMAGES_DIRNAME = "images/"
    HTML_TEMPLATE_PATH = "./farslide/index_template.html"
    HTML_MIN_TEMPLATE_PATH = "./farslide/index_template_min.html"
    SVG_TAG = "{svg}"

    #parsing of yml file
    PRESENTATION_TAG = "presentation"
    NODE_TAG = "node"
    TOPIC_TAG = "topic"
    CONTENT_TAG = "content"
    NODE_CONTENT_TAG = "node_content"
    TOPIC_CONTENT_TAG = "topic_content"
    STYLE_TAG = "style"

    HEADER_TAG = "header"
    PRESENTATION_NAME_TAG = "name"
    PRESENTATION_AUTHOR_TAG = "author"
    PRESENTATION_DATE_TAG = "date"

    '''
    Plugin class variables
    '''
    parent = 0
    svg = ""
    svgTree = ""
    imagesToExport = []
    jsToExport = []
    presentationName = None
    presentationAuthor = None
    presentationDate = None

    '''
    Constructor
    '''
    def __init__(self):
        inkex.Effect.__init__(self)

        self.OptionParser.add_option("-o", "--order_number",
                                     action="store", type="int",
                                     dest="order_number", default=0,
                                     help="order of the selected slide in presentation")

        self.OptionParser.add_option("", "--active_tab",
                                     action="store", type="string",
                                     dest="active_tab", default="order",
                                     help="Active tab.")
        self.OptionParser.add_option("-e", "--export_location",
                                     action="store", type="string",
                                     dest="export_location", default="",
                                     help="Location of presentation export.")
        self.OptionParser.add_option("-s", "--structure_location",
                                     action="store", type="string",
                                     dest="structure_location", default="",
                                     help="Location file with presentation structure.")
        self.OptionParser.add_option("-m", "--minified",
                                     action="store", type="inkbool",
                                     dest="minified", default=True,
                                     help="Lightweight version")


        #init export paths
        self.imagesToExport.append("./farslide/images/arrow.svg")
        self.imagesToExport.append("./farslide/images/zoom-out.svg")
        self.imagesToExport.append("./farslide/images/zoom-in.svg")

        self.jsToExport.append("./farslide/js/farslide.js")
        self.jsToExport.append("./farslide/js/frame.js")
        self.jsToExport.append("./farslide/js/content.js")
        self.jsToExport.append("./farslide/js/navigation.js")
        self.jsToExport.append("./farslide/js/showdown.min.js")
        self.jsToExport.append("./farslide/js/jquery-3.2.1.min.js")
        self.jsToExport.append("./farslide/js/tweenMax.min.js")



    '''
    Main plugin function
    '''
    def effect(self):

        page_id = self.options.active_tab.replace("\"","")

        if page_id == "order":
            self.order_resolve()
        elif page_id == "groups":
            self.groups_resolve()
        elif page_id == "export":
            self.export_resolve()




    '''
    Export resolver
    '''
    def export_resolve(self):
        exportPart = self.options.export_location
        structurePath = self.options.structure_location
        self.set_svg_content(structurePath)
        self.export_files(exportPart)




    '''
    Function to clear all attributes related with content
    '''
    def clear_content(self):
        svgNodes = self.svgTree.xpath('.//*[@' + self.ORDER_ATTRIBUTE + ']')
        for node in svgNodes:
            node.set(self.CONTENT_TAG, "")
            node.set(self.STYLE_ATTRIBUTE, "")


    '''
    Function to set content attributes to svg document according to given content file path.
    '''
    def set_svg_content(self, path):

        if not path:
            inkex.errormsg(_("You have to define location of content file."))
            exit()

        #creating disctionary with yml content of structure file
        try:
            file = open(path)
            structure = file.read()
            content = yaml.load(structure)
        except IOError:
            inkex.errormsg(_("Content file location is wrong."))
            exit()
        except yaml.YAMLError as exc:
            inkex.errormsg(_("Bad syntax of content file - problem with parsing yml format."))
            exit()



        #validate file content
        if not self.PRESENTATION_TAG in content.keys():
            inkex.errormsg(_("Bad syntax of content file - presentation section is missing."))
            exit()

        self.svgTree = self.document.getroot()

        # clear all the content before synchronization with structure file
        self.clear_content()

        if self.HEADER_TAG in content.keys():
            self.set_header_content(content[self.HEADER_TAG])

        self.set_presentation_content(content[self.PRESENTATION_TAG], None)



    def set_header_content(self, headerDefinition):

        if headerDefinition is None:
            return

        if self.PRESENTATION_NAME_TAG in headerDefinition.keys() and headerDefinition[self.PRESENTATION_NAME_TAG] is not None:
            self.presentationName = headerDefinition[self.PRESENTATION_NAME_TAG]
        if self.PRESENTATION_AUTHOR_TAG in headerDefinition.keys() and headerDefinition[self.PRESENTATION_AUTHOR_TAG] is not None:
            self.presentationAuthor = headerDefinition[self.PRESENTATION_AUTHOR_TAG]
        if self.PRESENTATION_DATE_TAG in headerDefinition.keys() and headerDefinition[self.PRESENTATION_DATE_TAG] is not None:
            self.presentationDate = headerDefinition[self.PRESENTATION_DATE_TAG]

    '''
    Function to set content attributes of given frame layer
    '''
    def set_presentation_content(self, layerDefinition, svgId):
        #get all childs
        if svgId is not None:
            svgNodes = self.svgTree.xpath('.//*[@' + self.ORDER_ATTRIBUTE + ' and @' + self.GROUP_PARENT_ATTRIBUTE + '="' + svgId + '"]')
        else:
            svgNodes = self.svgTree.xpath('.//*[@' + self.ORDER_ATTRIBUTE + ' and not(@' + self.GROUP_PARENT_ATTRIBUTE + ')]')

        if len(layerDefinition) != len(svgNodes):
            inkex.errormsg(_("Content file does not match the svg content - number of frames does not match."))
            exit()

        svgNodes.sort(key=lambda x: x.get(self.ORDER_ATTRIBUTE))
        index = 0


        for key, frame in enumerate(layerDefinition):


            # check compatibility between content file and svg content
            if index >= (len(svgNodes)):
                inkex.errormsg(_("Content file does not match the svg content - number of frames does not match."))
                exit()



            if self.NODE_TAG in frame.keys():
                type = self.NODE_TAG
            elif self.TOPIC_TAG in frame.keys():
                type = self.TOPIC_TAG
            else:
                inkex.errormsg(_("Wrong syntax of content file - bad keyword used for frame definition."))
                exit()


            # set content to node / topic if there is any
            if self.CONTENT_TAG in frame[type].keys():

                if frame[type][self.CONTENT_TAG] is None:
                    inkex.errormsg(_("Wrong syntax of content file - content attribute does not contain any value."))
                    exit()

                # set content to node
                if type == self.NODE_TAG:
                    svgNodes[index].set(self.CONTENT_TAG, frame[type][self.CONTENT_TAG])
                # set content to topic
                elif type == self.TOPIC_TAG:

                    '''set content according to type of topics content attribute'''
                    if isinstance(frame[type][self.CONTENT_TAG], str):
                        svgNodes[index].set(self.CONTENT_TAG, frame[type][self.CONTENT_TAG])
                    elif isinstance(frame[type][self.CONTENT_TAG], list):
                        self.set_presentation_content(frame[type][self.CONTENT_TAG],svgNodes[index].get("id"))

                    else:
                        if self.NODE_CONTENT_TAG in frame[type][self.CONTENT_TAG].keys():
                            if frame[type][self.CONTENT_TAG][self.NODE_CONTENT_TAG] is None:
                                inkex.errormsg(_("Wrong syntax of content file - content attribute does not contain any value."))
                                exit()
                            svgNodes[index].set(self.CONTENT_TAG, frame[type][self.CONTENT_TAG][self.NODE_CONTENT_TAG])
                        if self.TOPIC_CONTENT_TAG in frame[type][self.CONTENT_TAG].keys():
                            if frame[type][self.CONTENT_TAG][self.TOPIC_CONTENT_TAG] is None:
                                inkex.errormsg(_("Wrong syntax of content file - content attribute does not contain any value."))
                                exit()
                            self.set_presentation_content(frame[type][self.CONTENT_TAG][self.TOPIC_CONTENT_TAG], svgNodes[index].get("id"))


            #set additional style attribute if there is any in structure file
            if self.STYLE_TAG in frame[type].keys():
                style = ""
                if frame[type][self.STYLE_TAG] is None:
                    inkex.errormsg(_("Wrong syntax of content file - style attribute does not contain any value."))
                for key, value in frame[type][self.STYLE_TAG].iteritems():
                    style += str(key) + ":" + str(value) + ";"
                svgNodes[index].set(self.STYLE_ATTRIBUTE, style)
            index += 1


    '''
    Function to save all presentation files to target folder.
    '''
    def export_files(self, path):

        if not path:
            inkex.errormsg(_("You must define the location, where the presentation will be exported."))
            exit()

        if not path.endswith("/"):
            path = path + "/"
        # creating directory for presentation
        try:
            original_mask = os.umask(0)
            os.makedirs(path, 0777)
        except OSError as exception:
            if exception.errno != errno.EEXIST:
                raise

        #generate presentation svg file
        curfile = self.args[-1]
        self.export_svg(curfile, path)
        # export images
        self.export_images(path)

        if self.options.minified:
            template = self.HTML_MIN_TEMPLATE_PATH
        else:
            template = self.HTML_TEMPLATE_PATH
            # export js files
            self.export_js(path)

        # create index.html file with presentation
        self.export_html(template, path)


    '''
    Function to save image files to target folder
    '''
    def export_images(self, dirPath):
        # create js directory to store js files
        imgDir = dirPath + self.IMAGES_DIRNAME
        try:
            original_mask = os.umask(0)
            os.makedirs(imgDir, 0777)
        except OSError as exception:
            if exception.errno != errno.EEXIST:
                raise


        for path in self.imagesToExport:
            image = open(path)
            imageContent = image.read()
            imagePath = imgDir + os.path.basename(image.name)
            imageFile = open(imagePath, 'w')
            imageFile.write(imageContent)

    '''
    Create and save all js files, that are needed for successfull run of the presentation
    '''
    def export_js(self, dirPath):
        #create js directory to store js files
        jsDir = dirPath + self.JS_DIRNAME
        try:
            original_mask = os.umask(0)
            os.makedirs(jsDir, 0777)
        except OSError as exception:
            if exception.errno != errno.EEXIST:
                raise

        for path in self.jsToExport:
            js = open(path)
            jsContent = js.read()
            jsPath = jsDir + os.path.basename(js.name)
            js_file = open(jsPath, 'w')
            js_file.write(jsContent)

    '''
    Fuction to create and save index.html file with presentation
    '''
    def export_html(self,templatePath, path):

        #get svg content
        if self.svgTree is not None:
            self.svgTree = self.document.getroot()
        svgString = inkex.etree.tostring(self.svgTree)

        #modify content of template file (adding svg presentation)
        template = open(templatePath)
        template_content = template.read()
        template_content = template_content.replace(self.SVG_TAG, svgString)

        if self.presentationName is None:
            self.presentationName = "Farslide vector presentation"
        if self.presentationAuthor is None:
            self.presentationAuthor = ""
        if self.presentationDate is  None:
            self.presentationDate = datetime.date.today().strftime("%B %d, %Y")

        template_content = template_content.replace("{" + self.PRESENTATION_NAME_TAG + "}", self.presentationName)
        template_content = template_content.replace("{" + self.PRESENTATION_AUTHOR_TAG + "}", self.presentationAuthor)
        template_content = template_content.replace("{" + self.PRESENTATION_DATE_TAG + "}", self.presentationDate)

        #save modified file as index.html to specified path
        filepath = path + self.INDEX_FILENAME
        index_file = open(filepath, 'w')
        index_file.write(template_content)


    '''
    Function to save svg presentation file to specified folder
    '''
    def export_svg(self,curfile, path):
        command = "inkscape -l \"%s%s\" %s" % (path, self.SVG_FILENAME, curfile)
        p = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        return_code = p.wait()
        f = p.stdout
        err = p.stderr


    '''
    Groups page resolver
    '''
    def groups_resolve(self):
        # Checks if at least 2 objects are selected
        if len(self.options.ids) < 2:
            inkex.errormsg(_("This extension requires at least 2 selected objects"))
            exit()

        i = 0
        parentId = 0
        for id in self.options.ids:
            node = self.selected[id]
            if i == 0:
                node.set("class", self.GROUP_CLASS)
                parentId = id

            else:
                node.set(self.GROUP_PARENT_ATTRIBUTE, str(parentId))
            i += 1

    '''
    Order page resolver
    '''
    def order_resolve(self):
        # Checks if one object is selected
        if len(self.options.ids) != 1:
            inkex.errormsg(_("This extension requires one selected object."))
            exit()

        selected = 0
        # get selected element
        for id, node in self.selected.iteritems():
            selected = node
            self.parent = selected.get(self.GROUP_PARENT_ATTRIBUTE)
            break
        # controls wether the given order number can be inserted to selected node.
        svg = self.document.getroot()
        self.control(svg)

        # set given order number to selected node
        selected.set(self.ORDER_ATTRIBUTE, str(self.options.order_number))

    '''
    Function to control numbering of given node with its sub nodes
    '''
    def control(self, node):
        #in case of same parent (or root layer) control the node
        nodeParent = node.get(self.GROUP_PARENT_ATTRIBUTE)
        if str(nodeParent) == str(self.parent):
            self.control_node(node)

        #recursive call on all subnodes of given node
        for child in node:
            self.control(child)

    '''
    Function to control given node numbering
    '''
    def control_node(self, node):
        orderNumber = node.get(self.ORDER_ATTRIBUTE)

        if orderNumber:
            id = node.get(self.ID_ATTRIBUTE)
            sameNumber = int(orderNumber) == int(self.options.order_number)
            selectedNode = str(id) == str(self.options.ids[0])
            if sameNumber and not selectedNode:
                inkex.errormsg(_("This order number is already taken"))
                exit()


'''Initialize and run Farslide plugin'''
e = Farslide()
e.affect()