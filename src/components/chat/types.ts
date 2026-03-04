import type {Event} from 'parlant-client/src/api';

export interface MessageInterface extends Event {
	status: string | null;
	error?: string;
}
