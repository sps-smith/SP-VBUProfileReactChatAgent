import { useState, useEffect, useCallback } from 'react';
import { IMessage, IConversation } from '../Models/IChatModels';
//import axios from 'axios';
import { continueConversation, getHistory, getUserConversations, startConversation } from '../Services/ChatApiService';
import { AadHttpClientFactory } from '@microsoft/sp-http';

interface IUseChatReturn {
	// State
	conversations:        IConversation[];
	messages:             IMessage[];
	activeConversationId: string | null;
	isLoading:            boolean;
	isSidebarOpen:        boolean;
	error:                string | null;

	// Actions
	sendMessage:          (text: string) => Promise<void>;
	selectConversation:   (id: string) => Promise<void>;
	startNewConversation: () => void;
	toggleSidebar:        () => void;
	clearError:           () => void;
}

export function useChat(
	//apiService: ChatApiService,
	userId:     string,
    userEmail: string,
    apiBaseUrl: string,
    apiResource: string,
    aadHttpClientFactory: AadHttpClientFactory
): IUseChatReturn {

	const [conversations,        setConversations]        = useState<IConversation[]>([]);
	const [messages,             setMessages]             = useState<IMessage[]>([]);
	const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
	const [isLoading,            setIsLoading]            = useState(false);
	const [isSidebarOpen,        setIsSidebarOpen]        = useState(true);
	const [error,                setError]                = useState<string | null>(null);

	// Load conversations on mount
	useEffect(() => {
        if (userEmail !== '' && userEmail !== null) {
		    loadConversations().catch(err =>
		    console.error('Failed to load conversations:', err)
		);
    }}, [userEmail]);

	const loadConversations = useCallback(async (): Promise<void> => {
		try {
		const data = await getUserConversations(userEmail, apiBaseUrl, apiResource, aadHttpClientFactory);
		setConversations(data);
		} catch (err) {
		console.error('Failed to load conversations:', err);
		}
	}, [apiBaseUrl, apiResource, aadHttpClientFactory, userEmail]);

	const selectConversation = useCallback(async (id: string): Promise<void> => {
		setActiveConversationId(id);
		setError(null);

		try {
		setIsLoading(true);
		const history = await getHistory(id, apiBaseUrl, apiResource, aadHttpClientFactory);
		setMessages(history);
		} catch (err) {
		setError('Failed to load conversation history.');
		} finally {
		setIsLoading(false);
		}
	}, [apiBaseUrl, apiResource, aadHttpClientFactory]);

	const startNewConversation = useCallback((): void => {
		setActiveConversationId(null);
		setMessages([]);
		setError(null);
	}, []);

	const sendMessage = useCallback(async (text: string): Promise<void> => {
		if (!text.trim() || isLoading) return;

		setError(null);

		// Optimistic user message
		const optimisticMsg: IMessage = {
		id:        `temp-${Date.now()}`,
		role:      'user',
		content:   text,
		createdAt: new Date().toISOString()
		};

		setMessages(prev => [...prev, optimisticMsg]);
		setIsLoading(true);

		try {
		if (!activeConversationId) {
			// ── New conversation ──────────────────────────────────────────────
			const result = await startConversation(userEmail, text, apiBaseUrl, apiResource, aadHttpClientFactory);

			setActiveConversationId(result.conversationId);

			const assistantMsg: IMessage = {
			id:        `resp-${Date.now()}`,
			role:      'assistant',
			content:   result.response,
			createdAt: new Date().toISOString()
			};

			setMessages(prev => [
			...prev.filter(m => m.id !== optimisticMsg.id),
			{ ...optimisticMsg, id: `user-${Date.now()}` },
			assistantMsg
			]);

			// Refresh sidebar with new conversation
			await loadConversations();

		} else {
			// ── Continue existing conversation ────────────────────────────────
			const result = await continueConversation(
			activeConversationId, text, apiBaseUrl, apiResource, aadHttpClientFactory);

			const assistantMsg: IMessage = {
			id:        `resp-${Date.now()}`,
			role:      'assistant',
			content:   result.response,
			createdAt: new Date().toISOString()
			};

			setMessages(prev => [...prev, assistantMsg]);
		}

		} catch (err) {
		setError('Failed to send message. Please try again.');
		// Remove optimistic message on failure
		setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
		} finally {
		setIsLoading(false);
		}
	}, [activeConversationId, apiBaseUrl, apiResource, aadHttpClientFactory, isLoading, loadConversations, userEmail]);

	const toggleSidebar = useCallback((): void => {
		setIsSidebarOpen(prev => !prev);
	}, []);

	const clearError = useCallback((): void => {
		setError(null);
	}, []);

	return {
		conversations,
		messages,
		activeConversationId,
		isLoading,
		isSidebarOpen,
		error,
		sendMessage,
		selectConversation,
		startNewConversation,
		toggleSidebar,
		clearError
	};
}
