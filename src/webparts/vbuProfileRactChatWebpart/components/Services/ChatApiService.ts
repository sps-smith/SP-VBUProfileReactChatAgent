import axios from 'axios';
import {
  AadHttpClient,
  AadHttpClientFactory,
  HttpClientResponse
} from '@microsoft/sp-http';
import {
  IMessage,
  IConversation,
  IStartChatResponse,
  IContinueChatResponse
} from '../Models/IChatModels';

const SHAREPOINT_BASE_URL = 'https://ourvolaris.sharepoint.com';

type HttpMethod = 'GET' | 'POST';

interface IRequestOptions {
  method: HttpMethod;
  url: string;
  apiResource: string;
  aadHttpClientFactory: AadHttpClientFactory;
  body?: unknown;
}

const isSharePointUrl = (url: string): boolean => {
  try {
    return new URL(url).origin.toLowerCase() === SHAREPOINT_BASE_URL;
  } catch {
    return false;
  }
};

const request = async <T>(options: IRequestOptions): Promise<T> => {
  const { method, url, apiResource, aadHttpClientFactory, body } = options;

  if (isSharePointUrl(url)) {
    const response = await axios.request<T>({
      method,
      url,
      data: body,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.data;
  }

  if (!apiResource) {
    throw new Error('Azure AD API resource is not configured.');
  }

  const client: AadHttpClient = await aadHttpClientFactory.getClient(apiResource);
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  let response: HttpClientResponse;
  if (method === 'GET') {
    response = await client.get(url, AadHttpClient.configurations.v1, { headers });
  } else {
    response = await client.post(
      url,
      AadHttpClient.configurations.v1,
      { headers, body: JSON.stringify(body) }
    );
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const startConversation = (
  userId: string,
  message: string,
  apiBaseUrl: string,
  apiResource: string,
  aadHttpClientFactory: AadHttpClientFactory
): Promise<IStartChatResponse> => request<IStartChatResponse>({
  method: 'POST',
  url: `${apiBaseUrl}/api/history/start`,
  apiResource,
  aadHttpClientFactory,
  body: { userId, message }
});

export const continueConversation = (
  conversationId: string,
  message: string,
  apiBaseUrl: string,
  apiResource: string,
  aadHttpClientFactory: AadHttpClientFactory
): Promise<IContinueChatResponse> => request<IContinueChatResponse>({
  method: 'POST',
  url: `${apiBaseUrl}/api/history/continue`,
  apiResource,
  aadHttpClientFactory,
  body: { conversationId, message }
});

export const getHistory = (
  conversationId: string,
  apiBaseUrl: string,
  apiResource: string,
  aadHttpClientFactory: AadHttpClientFactory
): Promise<IMessage[]> => request<IMessage[]>({
  method: 'GET',
  url: `${apiBaseUrl}/api/history/${conversationId}/history`,
  apiResource,
  aadHttpClientFactory
});

export const getUserConversations = (
  userId: string,
  apiBaseUrl: string,
  apiResource: string,
  aadHttpClientFactory: AadHttpClientFactory
): Promise<IConversation[]> => request<IConversation[]>({
  method: 'GET',
  url: `${apiBaseUrl}/api/history/user/${encodeURIComponent(userId)}`,
  apiResource,
  aadHttpClientFactory
});
