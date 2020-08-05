## sp-emp-time-tracker

Steps for configure webpart in your tenant.
1 - Clone code from github in your local. Follow this commands.
    git clone the repo
    npm i
    npm i -g gulp
    gulp
2 - Run -  gulp serve    
3 - Take list template file from assests folder and create employee time tracker list in your site collection.
4 - Create a new page in modern site and drop emp time tracker webpart  in your page.
5 - Edit web part and put your employee tracker list name.
6 - Last, refresh the page and you will have ready this web part in your tenant.

NOTE : 
You can also drop package in appcatalog site and deploy it at tenant level and you can use it.


### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO
