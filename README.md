#MixerJS

![Logo][https://raw.githubusercontent.com/jortechve/librarySystem/develop/logo/LOGO.jpg]

Web server that receives url and serves multiple JavaScript libraries and files in a single http request. Minifying is 
optional. The basic use will be like:

http://domain/libraryA(version)/libraryB(version)/.../compile.js
http://domain/libraryA(version)/libraryB(version)/.../compile.min.js

The first attemp to retrieve the file will go through nginx and it will be create by a node webserver. Then, other 
attempts will be server by nginx as a static file. See Diagram

![Diagram][https://raw.githubusercontent.com/jortechve/librarySystem/develop/logo/LOGO.jpg]


There is a public server that you can try and test: [jort.ch][http://jort.ch]. Some examples are:

+ http://jort.ch/scrips.js?jquery=1.9
+ http://jort.ch/compile.js?jquery=1.2.3&underscore=1.8.2
+ http://jort.ch/compileMinified.min.js?lodash[config][include][]=each&lodash[config][include][]=filter&lodash[config][include][]=map

There are several formats for the query that enables to configure the file you want. The most simple is by using 
?library=version. Another format taken by [jquery.param][http://api.jquery.com/jquery.param/] enables to replicate json 
structure.

##Why?

During web development you will find that in a particular project you will use different kind of libraries, it can be 
frameworks, plugins or tracking scripts. For bigger projects you will find more than 15 files getting requested. that 
means 15 http requests at least. Most of these files will not be minified because of development concerns. This will 
improve efficiency in any project. 

##Multipart request

Experimental. Enables to send multiple files with one http request

##Set your own server

You can download the project and create your own server just by using vagrant

#MixerJS library

Library for creating urls to create the appropriate file



##Other possible features
* Create the same system but for CSS. 
* Add github name project
* Add configuration query for each library


##Configuration File
It will have a configuration file. TO check all atributtes got to the [wiki][] 
A basic example can be:

    ´´´javascript    
    {
        cache: 1w, // 1y, 35d, 5h, 5m
        
        isCached: true,
        
        multipart: false //experimental
        
        cloud: {
            s3: amazon.s3/hash
        }
    }
    ´´´