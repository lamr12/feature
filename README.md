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

http://hostname/mixer.js?libraryA&libraryB

http://hostname/mixer.js?libraryA=versionA&libraryB


* ##Installation

    MixerJS was made using NodeJS. To install it, you can check the following instructions. 
    
     ###Nodejs
    
    To run mixerJS, you will need to install nodejs. To install it, go to [their website](https://nodejs.org/download/) for instructions.
    Once installed, you can run the following commands in the terminal:  
    
    ```
    npm install
    node mixer.js
    ```
    
    ###Vagrant and ansible
    Vagrant with ansible allow us to create a virtual machine that sets the environment for mixerJS to work. It will 
    install node dependencies, nginx and run mixerJS in the background ready to use. Go to [vagrant]() for installation 
    instructions and to [] to install ansible. Run the following command:
    
    ```
    vagrant up
    ```   
    
    To access it you can just go into a web browser:
     
    http://localhost:9090/mixer.js?jquery

* ##How It Works
    It uses bower for fetching the necessary libraries and some underneth logic to handle library dependancy and errors. 
    Uses grunt for minifying, concataning and making custom builds 

* ##Configuration File
    MixerJs will have by default some basic configuration.
    
    **config.js**
    ``` 
    {
        //Listening port. Use 1024 through 49151.
        port: 3000, 
        
        //controller to handle custom builts
        builds: ['jquery', 'lodash']
    }
    ```
    
* ##Extra Features
     
    + ###Minifying
     
     Minifying the libraries can be optional. Adding .min.js or .min.css to the end of the file will minify automatically.
     
    + ###Custom builds
     
     Some libraries allows to create custom builds in order to just take what you need. MixerJS can accept a json 
     structure throught the query for that specific library. More information in [builds](https://github.com/jortechve/mixerjs/customBuilds)   
        
    + ###Cache and nginx
     
     For better use of MixerJS, we can take advantage of nginx cache. Nginx cache is very fast, with either memcache 
     or disk storage. The first attemp to retrieve the file will go through nginx and it will be proxied to mixerJS. 
     Then, other attempts will be serve by nginx's cache. 
     
     ![Diagram]
     (https://raw.githubusercontent.com/jortechve/mixerjs/develop/images/MNDiagram.jpg)
     
 
* ##Testing TODO
     
     MixerJS have some test you can run by using karma and jasmine. To run the tests, go to the terminal and do:
     
     ```
     karma start
     ```
 
* ##Demo
     For the purpose of testing the tool quickly we have set up a small server using the domain `jort.ch`. Some example uses are:
     
    **JS**
     + http://jort.ch/mixer.js?jquery
     + http://jort.ch/mixer.min,js?lodash=2.5&jquery
     + http://jort.ch/compile.js?lodash=%7B%22category%22%3A%22array%22%2C%22plus%22%3A%5B%22random%22%2C%22template%22%5D%7D
     
    **CSS**
     + http://jort.ch/mixer.css?boostrap
     + http://jort.ch/mixer.css?jquery&foundation