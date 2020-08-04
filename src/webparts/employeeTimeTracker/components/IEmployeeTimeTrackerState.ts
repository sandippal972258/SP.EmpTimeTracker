import { IPickerTerms} from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
export interface IEmployeeTimeTrackerState  {
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
  }