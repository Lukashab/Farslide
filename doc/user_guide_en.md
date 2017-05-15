Farslide - user guide
======
Presentation creation process consists of 3 main parts.

Presentation content creation
-------
As Farslide plugin follows "separation of content" concept, you have 
to specify content of presentation separately from visual part of the presentation.
Content of presentation is specified in YML file with predefined format.
Content file format is described deeper in this documentation [file](input_en.md)

This file is mandatory input for successful export of presentation.

Presentation graphic creation
-----
Visual part of the presentation is created via Inkscape application.

Farslide plugin use
-----
Farslide plugin is used for connecting content and visual parts of the presentation and their export to final HTML presentation file.

### Plugin use process
#### Parts connecting
Connection between two presentation parts is achieved by two plugin tools, which together specifies frames of final presentation.

##### Order
For use of this tool, go to **Order** item in plugin menu.
Function provides specification of selected frame order in final presentation.

1. Select graphical element you want to assign the order.
2. Paste order number in order input field.
3. By clicking **apply** specified order number is set to selected graphical element (frame).
4. In case order number is already used in this frame layer, error message is displayed.

##### Groups
For use of this tool, go to **Groups** item in plugin menu.
Function provides specification nested frames and their parent frame.

1. Select graphical element you want to be parent frame.
2. Do additional selection of elements you want to be nested in first selected element (parent).
3. By clicking **apply** parent and all selected nested elements are specified.

##### Export
For use of this tool, go to **Groups** item in plugin menu.
Function provides export of created inputs to final directory containing presentation.
At time this tool is used, prepared and valid connection between graphical and content presentation part is expected.

1. Choose location of your YML content file.
2. Choose location of presentation export.
3. By clicking **apply** export of the presentation is executed.


Presentation
-------
Exported directory contains **index.html** file. This file is used to start and run exported presentation.

1. Open index.html file in your favourite web browser.
2. You can change animation time by form input in upper left corner.
3. You can navigate through the presentation by clicking on navigation buttons located in lower right corner.

