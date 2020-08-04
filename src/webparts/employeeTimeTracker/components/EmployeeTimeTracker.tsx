import * as React from 'react';
import styles from './EmployeeTimeTracker.module.scss';
import { IEmployeeTimeTrackerProps } from './IEmployeeTimeTrackerProps';
import { IEmployeeTimeTrackerState } from './IEmployeeTimeTrackerState';
import { escape,clone } from '@microsoft/sp-lodash-subset';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Stack, IStackProps, IStackStyles } from 'office-ui-fabric-react/lib/Stack';
import { TaxonomyPicker ,IPickerTerms} from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import TodaytaskComponent from "../../../components/todaytaskComponent/TodaytaskComponent";
import MyAlltasks from "../../../components/myAllTasks/MyAlltasks";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import { DefaultButton, PrimaryButton, IStackTokens, Label } from 'office-ui-fabric-react';
import { Route, Link, Switch, BrowserRouter as Router,HashRouter } from 'react-router-dom';  
import * as moment from 'moment';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

require("../../../css/custom.css");


let descriptionText : string = "";
const ShowGrid = () => <IconButton iconProps={{ iconName: 'ShowGrid' }} title="ShowGrid" ariaLabel="ShowGrid" />;
export default class EmployeeTimeTracker extends React.Component<IEmployeeTimeTrackerProps, IEmployeeTimeTrackerState> {
  constructor(props: IEmployeeTimeTrackerProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = ({ CV_Category: [] , CV_Description : "" ,isSubmitted : false,Title : "" , isRunning : false ,currentRuningtask : {},
                    hour : 0,minute : 0,second : 0,isRefresh:false
                  });
    this._onDescriptionChange = this._onDescriptionChange.bind(this);    
    this._onCategoryChanage = this._onCategoryChanage.bind(this);
    this._submitRequest = this._submitRequest.bind(this);    
    this._stopCurrenTask = this._stopCurrenTask.bind(this);        
  }
  public render(): React.ReactElement<IEmployeeTimeTrackerProps> {
    return (
      <div className={ styles.employeeTimeTracker }>
        <HashRouter>    
        <div className="mainDivofEmptimetracker">                  
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
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 margin-10">                      
                      <Switch>                            
                        <Route sensitive  exact path="/"  component={(props) => <TodaytaskComponent  listname={this.props.listname} context={this.props.context} isRefresh={this.state.isRefresh} />} />
                        <Route path="/viewalltasks"  component={(props) => <MyAlltasks  listname={this.props.listname} context={this.props.context} isRefresh={this.state.isRefresh} />} />
                      </Switch>                        
                    </div>
                </div>
            </div>                    
          </div>
          </HashRouter>                      
      </div>
    );
  }
  public async componentWillMount(){                                
    var response = await this._getLastRunningTask(this.props.listname);
    if(response != null && response.length > 0)
    {
      this.setState({isRunning : true , currentRuningtask : response[0]});
      // setInterval(() => {
      //   var CurrentDate  = moment().format("L hh:mm:ss A");
      //   var PreviousDate  = moment(this.state.currentRuningtask.Created).format("L hh:mm:ss A");
      //   this._timefunction(CurrentDate,PreviousDate);
      // }, 1000);      
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
        var returnString = days + " Days : " +hours + " Hours : " + minutes  + " Minutes: " + seconds + " Second";	        
        this.setState({hour : hours , minute : minutes , second : seconds})
        //return returnString;
		  }
		  else 
		     	return "";   
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
        postData["CV_Description"] = this.state.CV_Description;        
        postData["CV_Category"] = {
          "__metadata": { "type": "SP.Taxonomy.TaxonomyFieldValue" },
          "Label": this.state.CV_Category[0].name,
          'TermGuid': this.state.CV_Category[0].key,
          'WssId': '-1' // fake
        };
        var updateRespose = await this._postRequest(this.props.listname,postData);
        if( updateRespose != null)
        {          
          //var response = await this._getLastRunningTask(this.props.listname);
          var response = updateRespose.data;
          if(response != null)
          {
            this.setState({ currentRuningtask : response});
            setInterval(() => {
              var CurrentDate  = moment().format("L hh:mm:ss A");
              var PreviousDate  = moment(this.state.currentRuningtask.Created).format("L hh:mm:ss A");
              this._timefunction(CurrentDate,PreviousDate);              
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
  private async _getLastRunningTask(listname : string): Promise<any> {   
    try { 
      let response = await sp.web.lists.getByTitle(listname).items.filter("CV_EndTime eq null").top(1).get()   
      return response;
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
      var isRefresh = !this.state.isRefresh;
      this.setState({currentRuningtask : {} , isRunning : false , isRefresh : isRefresh})
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
}
