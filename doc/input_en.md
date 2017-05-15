Definition file specification
========
Each YML definition file used for defining structure and content for farslide presentation consists of two main sections. 
Following lines describes format and specification of these two parts.

Example of file format - [inpyt.yml](input.yml)

Header
------------
Header section is used for adding meta informations to your presentation
#### Attributes
- **name** - Name of the presentation.
- **author** - Author of the presentation.
- **date** - Date of the presentation creation.

Presentation
------------
All the informations in this section are parsed by Inkscape plugin and converted to final presentation.
Presentation section consists of all frames, that we want to have in final result. Frames are divided to two types.
- **node** - one frame containing markdown content.
- **topic** - one frame, that can contains markdown content as well as other topics and nodes.


Frames are represented by YML list containing **node** and **topic** keywords.


#### Attributes
- **style** - Contains additional css styles, that are added to html result. There is one special style that is specified in addition of normal css specification. **size-ratio** allows you to update font size of slide content according to value you have specified. 
- **content** - Content of frame. It is plain text written in Markdown syntax (to be converted to html after final export). In case of topic, it can be markdown content as well as group of topic and nodes of your choice.

In case of topics **content** attribute, there are two additional attributes, that have be specified in order to define topics content properly. 
Topic has to have defined at least one of these two attributes.

- **node_content** - Plain text written in Markdown syntax.
- **topic_content** - List of other nodes and topics, that are ment to be nested in this topic.

#### Other syntax rules
- Each attribute always has to have its value. If not, it is considered as syntax error and export will not be executed.

