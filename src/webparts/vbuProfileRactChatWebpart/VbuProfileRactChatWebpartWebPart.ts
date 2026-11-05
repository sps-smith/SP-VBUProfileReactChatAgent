import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'VbuProfileRactChatWebpartWebPartStrings';
import VbuProfileRactChatWebpart from './components/VbuProfileRactChatWebpart';
import { IVbuProfileRactChatWebpartProps } from './components/IVbuProfileRactChatWebpartProps';

export interface IVbuProfileRactChatWebpartWebPartProps {
    description: string;
    title:      string;
    apiBaseUrl: string;
    apiResource: string;
}

const DEFAULT_API_RESOURCE = 'api://8180dcd8-3144-4f32-8f9b-64245ae94ac0';

export default class VbuProfileRactChatWebpartWebPart extends BaseClientSideWebPart<IVbuProfileRactChatWebpartWebPartProps> {

    private _isDarkTheme: boolean = false;
    private _environmentMessage: string = '';
  

    public render(): void {
        const element: React.ReactElement<IVbuProfileRactChatWebpartProps> = React.createElement(
        VbuProfileRactChatWebpart,
        {
            description: this.properties.description,
            isDarkTheme: this._isDarkTheme,
            environmentMessage: this._environmentMessage,
            hasTeamsContext: !!this.context.sdks.microsoftTeams,
            userDisplayName: this.context.pageContext.user.displayName,
            userEmail: this.context.pageContext.user.email,
            apiUrl: this.properties.apiBaseUrl,
            apiResource: this.properties.apiResource || DEFAULT_API_RESOURCE,
            aadHttpClientFactory: this.context.aadHttpClientFactory
        }
        );

        ReactDom.render(element, this.domElement);
    }

    protected onInit(): Promise<void> {
        if (!this.properties.apiResource) {
            this.properties.apiResource = DEFAULT_API_RESOURCE;
        }

        return this._getEnvironmentMessage().then(message => {
        this._environmentMessage = message;
        });
    }


    private _getEnvironmentMessage(): Promise<string> {
        if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
        return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
            .then(context => {
            let environmentMessage: string = '';
            switch (context.app.host.name) {
                case 'Office': // running in Office
                environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
                break;
                case 'Outlook': // running in Outlook
                environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
                break;
                case 'Teams': // running in Teams
                case 'TeamsModern':
                environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
                break;
                default:
                environmentMessage = strings.UnknownEnvironment;
            }

            return environmentMessage;
            });
        }

        return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
    }

    protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
        if (!currentTheme) {
        return;
        }

        this._isDarkTheme = !!currentTheme.isInverted;
        const {
        semanticColors
        } = currentTheme;

        if (semanticColors) {
        this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
        this.domElement.style.setProperty('--link', semanticColors.link || null);
        this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
        }

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
                    }),
                    PropertyPaneTextField('apiBaseUrl', {
                    label:       'API Base URL',
                    placeholder: 'https://your-api.azurewebsites.net',
                    description: 'Base URL of your Azure AI Chat API'
                }),
                    PropertyPaneTextField('apiResource', {
                    label: 'Azure AD API Resource',
                    value: DEFAULT_API_RESOURCE,
                    description: 'Azure AD resource identifier for the Volaris People Directory API'
                })
                ]
                }
            ]
            }
        ]
        };
    }
}
