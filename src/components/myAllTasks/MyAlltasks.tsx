import * as React from 'react';  
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import { ShimmeredDetailsList } from 'office-ui-fabric-react/lib/ShimmeredDetailsList';

import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import {IMyAllTaskComponentProps } from './IMyAllTaskComponentProps';
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
import { IconButton } from 'office-ui-fabric-react/lib/Button';


const NavigateBack = () => (<IconButton iconProps={{ iconName: "NavigateBack" }}title="Back to view"ariaLabel="Back to view"/>);
export default class MyAlltasksComponent  extends React.Component<IMyAllTaskComponentProps, any> {           
    constructor(props) {  
          super(props);                  
          sp.setup({
            spfxContext: this.props.context
          });
          const columns: IColumn[] = [                                
            {
              key: 'Title',name: 'Title',fieldName: 'Title',minWidth: 100,data: 'string',isMultiline:true ,
              isRowHeader: true,isResizable: true,              
              isSorted: true,onColumnClick: this._onColumnClick,
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
              key: 'CV_Category',name: 'Category',fieldName: 'CV_Category_custom',minWidth: 100,data: 'string',isMultiline:true ,
              isRowHeader: true,isResizable: true,isSorted: true,onColumnClick: this._onColumnClick,
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
              key: 'Created',name: 'Start Time',fieldName: 'Created_custom',minWidth: 100,data: 'number',isMultiline:true ,
              isRowHeader: true,isResizable: true,isSorted: true,onColumnClick: this._onColumnClick,
              onRender: (item: any) => {                                                              
                var startTime = moment(item.Created).format("L hh:mm:ss A");
                return (                    
                  <div>{startTime}</div>
                )                
              }              
            },            
            {
              key: 'CV_EndTime',name: 'End Time',fieldName: 'CV_EndTime_custom',minWidth: 100,data: 'number',isMultiline:true ,
              isRowHeader: true,isResizable: true,isSorted: true,onColumnClick: this._onColumnClick,
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
              }              
          ];
          this.state = {
            myallTaskCoumns : columns,
            isClientDataLoaded : false
          }                 
     }          
      public render(): React.ReactElement {                     
          return (  
            <div className="myalltasks">
                <HashRouter> 
                <div className="headerSection">
                <div className="ms-Grid" dir="ltr">
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm10 ms-md10 ms-lg10" >
                        <h3>My all tasks</h3>
                    </div>                    
                    <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2" >
                        <Link to={"/"}>
                        <NavigateBack></NavigateBack>
                    </Link>
                    </div>                    
                  </div>
                </div>                                
                </div>                                 
                <ShimmeredDetailsList                              
                  items={this.state.myAllTasks}
                  columns={this.state.myallTaskCoumns}
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
          var response = await this._getTodaysTasks(this.props.listname);
          if(response != null)
          {
            for(var i=0; i<response.length; i++)
            {            
              response[i]["CV_Category_custom"] = response[i].TaxCatchAll[0].Term;
              response[i]["CV_EndTime_custom"] = null;            
              var Created =  new Date(response[i].Created);
              response[i]["Created_custom"] = Created.valueOf();
              if(response[i].CV_EndTime == null || response[i].CV_EndTime == undefined || response[i].CV_EndTime == "")
              {
                var CV_EndTime =  new Date(response[i].CV_EndTime);
                response[i]["CV_EndTime_custom"] = CV_EndTime.valueOf();                                       
              }              
            }
          }
            this.setState({myAllTasks : response,isClientDataLoaded:true});          
        }        
        public async _getTodaysTasks(listname : string): Promise<any> {   
          try 
          {                         
            var today = new Date();            
            today.setUTCHours(0,0,0,0);
            //var filterString = "Created ge '"+today.toISOString()+"'";
            var filterString = "AuthorId eq "+this.props.context.pageContext.legacyPageContext.userId;
            let result = await sp.web.lists.getByTitle(listname).items.orderBy("Created",false).filter(filterString).select("*,TaxCatchAll/ID,TaxCatchAll/Term").expand("TaxCatchAll").get();            
            return result;
          } catch (e) {   
            console.error(e);
            return null;   
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
      private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        const { myallTaskCoumns, myAllTasks } = this.state;
        const newColumns: IColumn[] = myallTaskCoumns.slice();
        const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
        newColumns.forEach((newCol: IColumn) => {
          if (newCol === currColumn) {
            currColumn.isSortedDescending = !currColumn.isSortedDescending;
            currColumn.isSorted = true;
            this.setState({
              announcedMessage: `${currColumn.name} is sorted ${
                currColumn.isSortedDescending ? 'descending' : 'ascending'
              }`,
            });
          } else {
            newCol.isSorted = false;
            newCol.isSortedDescending = true;
          }
        });
        const newItems = _copyAndSort(myAllTasks, currColumn.fieldName!, currColumn.isSortedDescending);
        this.setState({
          myallTaskCoumns: newColumns,
          myAllTasks: newItems,
        });
      };
  }     
  function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
  }