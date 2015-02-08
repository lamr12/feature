#*(There is no name yet)

Web server that receives url and serves multiple JavaScript libraries and files in a single http request. Minifying is optional. The basic use will be like:

http://domain/libraryA(version)/libraryB(version)/.../compile.js
http://domain/libraryA(version)/libraryB(version)/.../compile.min.js

The first attemp to retrieve the file will go through nginx and it will be create by a node webserver. Then, other attepms will be server by nginx as a static file. See Diagram

![Diagram][img1]

There is a public server that you can try and test: [jort.ch][link1]

You can download the project and create your own server just by doing vagrant up

##Why?
During web development you will find that in a particular project you will use different kind of libraries, it can be frameworks, plugins or tracking scripts. For bigger projects you will find more than 15 files getting requested. that means 15 http requests at least. Most of these files will not be minified because of development concerns. This will improve performance in any project. 

##Other possible features
* Create the same system but for CSS. 
* Add github name project
* Add configuration query for each library


##Configuration File
		Cache: 365


//Links

[link1]: http://jort.ch

//Images
[img1]: https://drive.google.com/uc?id=0B5v0fcVOVVEoM09uNHRxTUc3WkE
