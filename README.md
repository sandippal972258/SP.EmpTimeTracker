## sp-emp-time-tracker

Steps for configure webpart in your tenant.
<br/>
<br/>
1 - Clone code from github in your local directory. Follow below commands.<br/>
    git clone the repo<br/>
    npm i<br/>
2 - To run the project, execute this command. -> gulp serve
<br/>
3 - File list template file(EmployeeTimeTracker_ListTemplate.stp) from src -> assets location. Create employee time tracker list using this list template.
<br/>
4 - Create a new page in modern site and drop emp time tracker web-part.
<br/>
5 - Configure target list name from edit web-part properties tool-pane.
<br/>
6 - Save your page and refresh once.
<br/>
<br/>

NOTE : 
<b>You can also drop package in appcatalog site and deploy it at tenant level and you can use it.</b>


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

gulp clean - TODO<br/>
gulp test - TODO<br/>
gulp serve - TODO<br/>
gulp bundle - TODO<br/>
gulp package-solution - TODO<br/>
