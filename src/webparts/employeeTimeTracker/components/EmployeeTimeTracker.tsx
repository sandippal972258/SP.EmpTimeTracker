import * as React from 'react';
import styles from './EmployeeTimeTracker.module.scss';
import { IEmployeeTimeTrackerProps } from './IEmployeeTimeTrackerProps';
import { IEmployeeTimeTrackerState } from './IEmployeeTimeTrackerState';
import TodaytaskComponent from "../../../components/todaytaskComponent/TodaytaskComponent";
import MyAlltasks from "../../../components/myAllTasks/MyAlltasks";
import { Route, Link, Switch, BrowserRouter as Router,HashRouter } from 'react-router-dom';  


require("../../../css/custom.css");
export default class EmployeeTimeTracker extends React.Component<IEmployeeTimeTrackerProps, IEmployeeTimeTrackerState> {
  constructor(props: IEmployeeTimeTrackerProps) {
    super(props);
    
    this.state = ({ CV_Category: [] , CV_Description : "" ,isSubmitted : false,Title : "" , isRunning : false ,currentRuningtask : {},
                    hour : 0,minute : 0,second : 0,isRefresh:false
                  });    
  }
  public render(): React.ReactElement<IEmployeeTimeTrackerProps> {
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
  }  
}
