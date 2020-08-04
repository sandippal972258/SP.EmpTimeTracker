import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'EmployeeTimeTrackerWebPartStrings';
import EmployeeTimeTracker from './components/EmployeeTimeTracker';
import { IEmployeeTimeTrackerProps } from './components/IEmployeeTimeTrackerProps';

export interface IEmployeeTimeTrackerWebPartProps {
  description: string;
}

export default class EmployeeTimeTrackerWebPart extends BaseClientSideWebPart <IEmployeeTimeTrackerWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IEmployeeTimeTrackerProps> = React.createElement(
      EmployeeTimeTracker,
      {
        listname: this.properties.description,
        context : this.context        
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription            
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
