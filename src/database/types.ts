import type { ColumnType, Generated } from "kysely";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

interface DefaultFields {
	id: Generated<string>;
	createdAt: ColumnType<Date, string | undefined, never>;
	updatedAt: ColumnType<Date, string | undefined, never>;
}

export interface Client extends DefaultFields {
	name: string;
	email: string;
	phoneNumber: string;
}

export interface LegalTerms extends DefaultFields {
	text: string;
}

export interface Shirt extends DefaultFields {
	model: string;
	manufacturingPrice: number;
	prices: number[];
	photos: string[];
	colors: string[];
}

export interface ShirtOrder extends DefaultFields {
	clientId: string;
	shirtId: string;
	size: string;
	babyLook: number | null;
	color: string;
	downPayment: number;
	finalPayment: number | null;
	termAccepted?: string;
	payments: boolean[] | null;
	cancelledAt: Timestamp | null;
	deliveredTo: string | null;
	deliveredAt: Timestamp | null;
	expiredAt: Timestamp | null;
	quantity: number;
}

export interface DB {
	Client: Client;
	LegalTerms: LegalTerms;
	Shirt: Shirt;
	ShirtOrder: ShirtOrder;
}
