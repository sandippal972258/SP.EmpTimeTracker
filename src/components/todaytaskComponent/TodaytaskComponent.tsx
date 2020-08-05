import * as React from 'react';  
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import { ShimmeredDetailsList } from 'office-ui-fabric-react/lib/ShimmeredDetailsList';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import {ITodaytaskComponentProps } from './ITodaytaskComponentProps';
import {ITodaytaskComponentState } from './ITodaytaskComponentState';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import {
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from 'office-ui-fabric-react/lib/DetailsList';
import * as moment from 'moment';
import { clone } from '@microsoft/sp-lodash-subset';
import { Route, Link, Switch, BrowserRouter as Router,HashRouter } from 'react-router-dom';  
import { DefaultButton, PrimaryButton, IStackTokens, Label } from 'office-ui-fabric-react';

import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Stack, IStackProps, IStackStyles } from 'office-ui-fabric-react/lib/Stack';
import { TaxonomyPicker ,IPickerTerms} from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
require('../../css/custom.css')


let descriptionText : string = "";
const ShowGrid = () => <IconButton iconProps={{ iconName: 'ShowGrid' }} title="Show my all previous tasks" ariaLabel="Show my all previous tasks" />;
export default class TodaytaskComponent  extends React.Component<ITodaytaskComponentProps, ITodaytaskComponentState> {           
    constructor(props) {  
          super(props);                  
          sp.setup({
            spfxContext: this.props.context
          });
          const columns: IColumn[] = [                                
            {
              key: 'Title',name: 'Title',fieldName: 'Title',minWidth: 100,data: 'string',isMultiline:true ,
              isRowHeader: true,isResizable: true,isSorted: false,              
            },                        
            {
              key: 'CV_Description',name: 'Description',fieldName: 'CV_Description',minWidth: 250,data: 'string',isMultiline:true ,
              isRowHeader: true,isResizable: true,isSorted: false,
              onRender: (item: any) => {                                                              
                  return (
                    <div dangerouslySetInnerHTML={{__html: item.CV_Description}} />
                    // <div >{item.CV_Description}</div>
                  )                
              }              
            },
            {
              key: 'CV_Category',name: 'Category',fieldName: 'CV_Category',minWidth: 100,data: 'string',isMultiline:true ,
              isRowHeader: true,isResizable: true,isSorted: false,
              onRender: (item: any) => {                                                              
                  var termName = "";
                  if(item.TaxCatchAll != null && item.TaxCatchAll != undefined && item.TaxCatchAll.length > 0)
                    termName = item.TaxCatchAll[0].Term
                  return (                    
                    <div>{termName}</div>
                  )                
              }              
            },
            {
              key: 'Created',name: 'Start Time',fieldName: 'Created',minWidth: 100,data: 'string',isMultiline:true ,
              isRowHeader: true,isResizable: true,isSorted: false,
              onRender: (item: any) => {                                                              
                var startTime = moment(item.Created).format("L hh:mm:ss A");
                return (                    
                  <div>{startTime}</div>
                )                
              }              
            },            
            {
              key: 'CV_EndTime',name: 'End Time',minWidth: 100,data: 'string',isMultiline:true ,
              isRowHeader: true,isResizable: true,isSorted: false,
              onRender: (item: any) => {                                
                  var timertime = "18:17:00";
                  if(item.CV_EndTime == null || item.CV_EndTime == undefined || item.CV_EndTime == "")
                  {
                    return (                    
                      <div>                                                  
                          <Spinner size={SpinnerSize.large} />
                      </div>
                    )
                  }
                  else
                  {
                    var endTime = moment(item.CV_EndTime).format("L hh:mm:ss A");
                    return (                    
                      <div>{endTime}</div>
                    )
                  }                                  
                }
              },
              {
                key: 'Duration',name: 'Duration',minWidth: 200,data: 'string',isMultiline:true ,
                isRowHeader: true,isResizable: true,isSorted: false,
                onRender: (item: any) => {                                                    
                    if(item.CV_EndTime != null && item.CV_EndTime != undefined && item.CV_EndTime != "")
                    {
                      var endTime = moment(item.CV_EndTime).format("L hh:mm:ss A");
                      var CurrentDate  = moment(item.CV_EndTime).format("L hh:mm:ss A");
                      var PreviousDate  = moment(item.Created).format("L hh:mm:ss A");
                      var returnString = this._timefunction(CurrentDate,PreviousDate);
                      return (                    
                        <div>{returnString}</div>
                      )
                    }                                                      
                }              
              },            
          ];
          /*this.state = {
            todaysTaskCoumns : columns,
            isClientDataLoaded : false
          };*/
          this.state = ({ CV_Category: [] , CV_Description : "" ,isSubmitted : false,Title : "" , isRunning : false ,currentRuningtask : {},
                    hour : 0,minute : 0,second : 0,isRefresh:false,
                    todaysTaskCoumns : columns,
                    isClientDataLoaded : false,todaysTasks : []
                  });   
          this._onDescriptionChange = this._onDescriptionChange.bind(this);    
          this._onCategoryChanage = this._onCategoryChanage.bind(this);
          this._submitRequest = this._submitRequest.bind(this);       
          this._stopCurrenTask = this._stopCurrenTask.bind(this);                                    
     }          
      public render(): React.ReactElement {                     
          return (  
            <div className="casesMainDiv">
              <HashRouter>    
                <div className="headerSection">
                <div className="ms-Grid" dir="ltr">
                  <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9" >
                      <h3>Employee Time Tracker</h3>                                       
                    </div>                    
                    <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2" >
                      {this.state.isRunning ? <PrimaryButton text={this.state.hour  + ":" + this.state.minute + ":" + this.state.second} onClick={this._stopCurrenTask} ></PrimaryButton> : ""}
                    </div>
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">                      
                        <TextField label="Title"  
                        required 
                        id="Title"
                        disabled={this.state.isRunning}  
                        value={this.state.Title}
                        onChange={this._inputUpdate}
                        errorMessage={this.state.isSubmitted && (this.state.Title == null || this.state.Title == undefined || this.state.Title == "") ? "Title is required": ""}/>
                    </div>
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">                      
                        <Label>Description<span className="required"> *</span></Label>
                        {
                        this.state.isRunning 
                        ?
                        <TextField 
                        label=""                                                  
                        multiline={true}
                        colSpan={4}
                        disabled={true}                                                  
                        />
                        : 
                        <RichText                                               
                          value={this.state.CV_Description}
                          isEditMode={true}
                          onChange={this._onDescriptionChange}
                          className={this.state.isSubmitted && (descriptionText == null || descriptionText == undefined || descriptionText == "") ? "customcontrol_Required": "customcontrol"}
                        /> 
                        }                        
                        <small className="required">{this.state.isSubmitted && (descriptionText == null || descriptionText == undefined || descriptionText == "") ? "Description is required.": ""}</small>
                    </div>
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">                      
                        <Label>Category<span className="required"> *</span></Label>
                        <TaxonomyPicker 
                          disabled={this.state.isRunning}
                          anchorId="00000000-0000-0000-0000-000000000000"
                          allowMultipleSelections={false}
                          termsetNameOrID="CV_Category"
                          panelTitle="Select category"
                          label=""
                          context={this.props.context}
                          onChange={this._onCategoryChanage}                
                          isTermSetSelectable={false}
                          initialValues={this.state.CV_Category}
                          hideDeprecatedTags                          
                          />
                          <small className="required">{this.state.isSubmitted && (this.state.CV_Category == null || this.state.CV_Category == undefined || this.state.CV_Category.length == 0 ) ? "Category is required": ""}</small>
                    </div>
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 margin-10">
                      <PrimaryButton text="Submit" onClick={this._submitRequest} allowDisabledFocus />            
                    </div>

                    <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9" >
                        <h3>Today's Task</h3>
                    </div>  
                    <div>                    
                    {/* <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2" >
                      {this.state.isRunning ? <PrimaryButton text={this.state.hour  + ":" + this.state.minute + ":" + this.state.second} onClick={this._stopCurrenTask} ></PrimaryButton> : ""}
                    </div>                      */}
                    <div className="ms-Grid-col ms-sm1 ms-md1 ms-lg1" >
                      <Link to={'/viewalltasks'}><ShowGrid></ShowGrid>
                      </Link>     
                    </div>
                    </div>                  
                  </div>
                </div>                                
                </div>                                 
                <ShimmeredDetailsList                              
                  items={this.state.todaysTasks}
                  columns={this.state.todaysTaskCoumns}
                  layoutMode={DetailsListLayoutMode.justified}
                  isHeaderVisible={true}                                                
                  enableShimmer={!this.state.isClientDataLoaded}                                  
                  selectionMode={SelectionMode.none}            
                  setKey="set1"                                                  
                  selectionPreservedOnEmptyClick={true}            
                  enterModalSelectionOnTouch={true}                
                />  
                </HashRouter>                         
            </div>  
          );  
        }       
        public async componentWillMount(){   
          console.log("componentWillMount");
          var response = await this._getTodaysTasks(this.props.listname);
          if(response != null)
            this.setState({todaysTasks : response,isClientDataLoaded:true});

          var currentRunningtask = "";
          for(var i=0; i<response.length; i++)
          {
            if(response[i].CV_EndTime == null || response[i].CV_EndTime == undefined || response[i].CV_EndTime == "")
            {
              currentRunningtask = response[i];
              break;
            }
          }
          if(currentRunningtask != null && currentRunningtask != undefined && currentRunningtask != "")
          {
            this.setState({isRunning : true , currentRuningtask : response[0]});
            setInterval(() => {
              var CurrentDate  = moment().format("L hh:mm:ss A");
              var PreviousDate  = moment(this.state.currentRuningtask.Created).format("L hh:mm:ss A");
              this._setTimefunction(CurrentDate,PreviousDate);
            }, 1000);         
          }          
        }
        _inputUpdate = (e) => {
          var currentState = this.state;
          currentState[e.target.id] = e.target.value;
          this.setState(currentState);
        };
        private _onCategoryChanage(terms : IPickerTerms) {    
          this.setState({CV_Category : terms})
        }
        private _onDescriptionChange = (newText: string) => {
          descriptionText = newText;    
      
          return newText;
        }
        private async _submitRequest() {
          this.setState({CV_Description :descriptionText });    
          var IsValid = this._checkValidation();
          if (IsValid) 
          {        
              this.setState({
                isSubmitted: true,
              });
              var postData = {};                
              postData["Title"] = this.state.Title;
              postData["CV_Description"] = descriptionText;        
              postData["CV_Category"] = {
                "__metadata": { "type": "SP.Taxonomy.TaxonomyFieldValue" },
                "Label": this.state.CV_Category[0].name,
                'TermGuid': this.state.CV_Category[0].key,
                'WssId': '-1' // fake
              };
              var updateRespose = await this._postRequest(this.props.listname,postData);
              if( updateRespose != null)
              {    
                var newResponse = await this._getTodaysTasks(this.props.listname);
                if(newResponse != null)
                  this.setState({todaysTasks : newResponse,isClientDataLoaded:true});      
                  
                //var response = await this._getLastRunningTask(this.props.listname);
                var response = updateRespose.data;
                if(response != null)
                {
                  this.setState({ currentRuningtask : response});
                  setInterval(() => {
                    var CurrentDate  = moment().format("L hh:mm:ss A");
                    var PreviousDate  = moment(this.state.currentRuningtask.Created).format("L hh:mm:ss A");
                    this._setTimefunction(CurrentDate,PreviousDate);              
                  }, 1000);      
                  var isRefresh = !this.state.isRefresh;
                  this.setState({ Title : "" , CV_Description : "" , CV_Category : [],isSubmitted : false ,isRefresh : isRefresh,isRunning : true});
                }          
              }          
          }    
          else 
          {
            this.setState({
              isSubmitted: true,
            });
          }
        }
        private async _postRequest(listname : string,data : any): Promise<any> {   
            try { 
              let response = await sp.web.lists.getByTitle(listname).items.add(data)   
              return response;
            } catch (e) {   
              console.error(e);
              return null;   
            }    
        }
        public async componentWillReceiveProps(props) {
          console.log("componentWillReceiveProps");
          // const { isRefresh } = this.props;
          // if (props.isRefresh !== isRefresh) {
          //   var response = await this._getTodaysTasks(this.props.listname);
          //   if(response != null)
          //     this.setState({todaysTasks : response,isClientDataLoaded:true});          
          // }
        }
        public async _getTodaysTasks(listname : string): Promise<any> {   
          try 
          {                         
            var today = new Date();            
            today.setUTCHours(0,0,0,0);
            var filterString = "Created ge '"+today.toISOString()+"' and AuthorId eq "+this.props.context.pageContext.legacyPageContext.userId;
            let result = await sp.web.lists.getByTitle(listname).items.orderBy("Created",false).filter(filterString).select("*,TaxCatchAll/ID,TaxCatchAll/Term").expand("TaxCatchAll").get();
            //let result = await sp.web.lists.getByTitle(listname).items.orderBy("Created",false).top(4999).get();            
            return result;
          } catch (e) {   
            console.error(e);
            return null;   
          }    
      }
      private async _stopCurrenTask(): Promise<any> {   
        try {
          //var updateData = {CV_EndTime  : moment().format("L hh:ss:ss A")};
          var updateData = {CV_EndTime  : new Date()};      
          let response = await sp.web.lists.getByTitle(this.props.listname).items.getById(this.state.currentRuningtask.Id).update(updateData);
          //var isRefresh = !this.state.isRefresh;
          this.setState({currentRuningtask : {} , isRunning : false})
          var newResponse = await this._getTodaysTasks(this.props.listname);
          if(newResponse != null)
            this.setState({todaysTasks : newResponse,isClientDataLoaded:true});
          return response;
        } catch (e) {
          alert(e)   
          console.error(e);
          return null;   
        }    
      }
      private _checkValidation(): any {
        var IsReturn = true;    
        if (this.state.Title == null || this.state.Title == undefined || this.state.Title == "")
          IsReturn = false;
        if (this.state.CV_Category == null || this.state.CV_Category == undefined || this.state.CV_Category.length == 0)
          IsReturn = false;
        //if (this.state.CV_Description == null || this.state.CV_Description == undefined || this.state.CV_Description == "")
        if (descriptionText == null || descriptionText == undefined || descriptionText == "")    
          IsReturn = false;  
        return IsReturn;
      }
      public  _setTimefunction(CurrentDate : string , PreviousDate : string){
        if(CurrentDate != "" &&  PreviousDate != "")
          {				
            var seconds = moment(CurrentDate).diff(moment(PreviousDate), 'second')
            var minutes = Math.floor(seconds/60);
            var hours = Math.floor(minutes/60);
            var days = Math.floor(hours/24);	        
            hours = hours-(days*24);
            minutes = minutes-(days*24*60)-(hours*60);
            seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
            //var returnString = days + " Days : " +hours + " Hours : " + minutes  + " Minutes: " + seconds + " Second";	        
            this.setState({hour : hours , minute : minutes , second : seconds})
            //return returnString;
          }		  
      }
      public  _timefunction(CurrentDate : string , PreviousDate : string){
        if(CurrentDate != "" &&  PreviousDate != "")
          {				
            var seconds = moment(CurrentDate).diff(moment(PreviousDate), 'second')
            var minutes = Math.floor(seconds/60);
            var hours = Math.floor(minutes/60);
            var days = Math.floor(hours/24);	        
            hours = hours-(days*24);
            minutes = minutes-(days*24*60)-(hours*60);
            seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
            //var returnString = hours + ":" + minutes  + ":" + seconds;	                    
            var returnString = days + " Days : " +hours + " Hours : " + minutes  + " Minutes: " + seconds + " Second";	        
            return returnString;
          }
          else 
               return "";   
      }
      
  }     