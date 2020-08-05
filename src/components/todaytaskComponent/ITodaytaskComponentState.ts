import { IPickerTerms} from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import {IColumn} from 'office-ui-fabric-react/lib/DetailsList';
export interface ITodaytaskComponentState  {
    CV_Category: IPickerTerms;
    CV_Description : string;
    isSubmitted : Boolean;
    Title : string;
    isRunning : boolean;
    currentRuningtask : any;
    hour : number ;
    minute : number ;
    second : number;
    isRefresh : boolean;
    todaysTaskCoumns : any,
    isClientDataLoaded : boolean,
    todaysTasks : [],
    totalTime : string,
    secondCounter : number
  }