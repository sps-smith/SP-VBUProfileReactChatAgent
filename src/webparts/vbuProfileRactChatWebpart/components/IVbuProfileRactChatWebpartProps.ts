//import { ChatApiService } from "./Services/ChatApiService";
import { AadHttpClientFactory } from '@microsoft/sp-http';

export interface IVbuProfileRactChatWebpartProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  userEmail: string;
  //apiService: ChatApiService;
  apiUrl: string;
  apiResource: string;
  aadHttpClientFactory: AadHttpClientFactory;
}


