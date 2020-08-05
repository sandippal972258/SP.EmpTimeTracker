import * as React from 'react';
import styles from './EmployeeTimeTracker.module.scss';
import { IEmployeeTimeTrackerProps } from './IEmployeeTimeTrackerProps';
import { IEmployeeTimeTrackerState } from './IEmployeeTimeTrackerState';
import TodaytaskComponent from "../../../components/todaytaskComponent/TodaytaskComponent";
import MyAlltasks from "../../../components/myAllTasks/MyAlltasks";
import PageNotFound from "../../../components/pagenotfound/pagenotfound";

import { Route, Link, Switch, BrowserRouter as Router,HashRouter } from 'react-router-dom';  
import {  MessageBar,MessageBarType} from 'office-ui-fabric-react';

require("../../../css/custom.css");
export default class EmployeeTimeTracker extends React.Component<IEmployeeTimeTrackerProps, any> {
  constructor(props: IEmployeeTimeTrackerProps) {
    super(props);
    
    this.state = ({

    });    
  }
  public render(): React.ReactElement<IEmployeeTimeTrackerProps> {
    var isPropertyValidate = true;
    if(this.props.listname == null || this.props.listname == undefined || this.props.listname == ""  )
      isPropertyValidate = false;        

    if(isPropertyValidate)
    {
      return (
        <div className={ styles.employeeTimeTracker }>
          <HashRouter>    
          <div className="mainDivofEmptimetracker">                  
              <div className="ms-Grid" dir="ltr">
                  <div className="ms-Grid-row">                    
                      <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 margin-10">                      
                        <Switch>                            
                          <Route sensitive  exact path="/"  component={(props) => <TodaytaskComponent  listname={this.props.listname} context={this.props.context} isRefresh={this.state.isRefresh} />} />
                          <Route path="/viewalltasks"  component={(props) => <MyAlltasks  listname={this.props.listname} context={this.props.context} />} />
                          <Route component={PageNotFound} />
                        </Switch>                        
                      </div>
                  </div>
              </div>                    
            </div>
            </HashRouter>                      
        </div>
      );
    }
    else
    {
      return (
        <div className={ styles.employeeTimeTracker }>
          <MessageBar
            messageBarType={MessageBarType.blocked}
            isMultiline={false}            
            dismissButtonAriaLabel="Close"
            truncated={true}
            overflowButtonAriaLabel="See more"
          >
            <b>Please configure all the properties from edit web part mode.</b> 
            <div>
            We are using all property some where in entire system.
            So if you miss any of require property, we may lost some functionality.
            Kindly edit the web part and add require properties.
            </div>
          </MessageBar>          
        </div>      
      )      
    }    
  }
  public async componentWillMount(){                                          
  }
  // private _checkPropertyPaneValidation  = () => {
  //   var isPropertyValidate = true;
  //   if(this.props.listname == null || this.props.listname == undefined || this.props.listname == ""  )
  //     isPropertyValidate = false;        
  // }    
}
