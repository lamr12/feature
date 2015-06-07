#MixerJS

![Logo]
(https://raw.githubusercontent.com/jortechve/mixerjs/develop/images/LOGO.jpg)

Web server that **serves multiple JavaScript or CSS libraries in a single http request.** 
During web development, a project will need the use of different kind of libraries. It can be 
frameworks, plugins or tracking scripts. Some websites load these dependecies one http request at a time, this means 
as dependencies grow it creates an overhead on the performance of the website. To handle this, there are some continuos
integration tools for unifying and minifying files. But, theses tools takes time and knowlege to make proper use of 
them. Hopefully MixerJS will provide a easy solution for it. 


The basic use will be:

+ http://hostname/mixer.js?libraryA&libraryB
+ http://hostname/mixer.js?libraryA=versionA&libraryB


##Installation

MixerJS was made using NodeJS. To install it, you can follow these instructions. 
To run mixerJS you can run it in the terminal by:

```
npm install

node mixer.js
```

##How It Works
It uses bower for fetching the necessary libraries and some underneth logic to handle library dependancy and error 
handling. Uses grunt for minifying, concataning and making custom builds 

##Configuration File
MixerJs will have some basic configuration.

``` 
{
    //Listening port. Use 1024 through 49151.
    port: 3000, 
    
    //controller to handle custom builts
    customBuilts: ['jquery', 'lodash']
}
```
    
 ##Extra Features
 
+ ###Minifying
 
 Minifying the libraries can be optional. Adding .min.js to the end of the file will minify automatically the serve file
 
+ ###Custom builds
 
 Some libraries allow to create custom builds in order to just take what you need. MixerJS will can accept a json 
 structure throught the query for that specific library. More information in [builds](https://github.com/jortechve/mixerjs/customBuilds)   
    
+ ###Cache and nginx
 
 For better use of MixerJS, we can take advantage of nginx cache. 
 Nginx cache is very fast, with either memcache or disk storage. The first attemp to retrieve
 the file will go through nginx and it will be proxied to mixerJS. Then, other 
 attempts will be server by nginx's cache. 

 ![Diagram]
 (https://raw.githubusercontent.com/jortechve/librarySystem/develop/logo/LOGO.jpg)   
 
##Testing TODO
 
 MixerJS have some test you can run by using karma and jasmine. To run the tests, got to the terminal and do:
 ```
 karma start
 ```
 
 ##Demo TODO
 For the purpose of testing the tool quickly we have set up a small server using the domain ``jort.ch``. Some example uses are:
 
 + http://jort.ch/mixer.js?jquery
 + http://jort.ch/mixer.min,js?lodash=2.5&jquery
 + http://jort.ch/mixer.js?lodash={}&jquery=1.15
 
 + http://jort.ch/mixer.css?boostrap
 + http://jort.ch/mixer.css?jquery&foundation 
