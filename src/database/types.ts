import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const ShirtSize = {
    P: "P",
    M: "M",
    G: "G",
    GG: "GG",
    XGG: "XGG"
} as const;
export type ShirtSize = (typeof ShirtSize)[keyof typeof ShirtSize];
export type Client = {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type LegalTerms = {
    id: string;
    text: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type Shirt = {
    id: string;
    model: string;
    manufacturingPrice: number;
    prices: number[];
    photos: string[];
    colors: string[];
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type ShirtOrder = {
    id: string;
    clientId: string;
    shirtId: string;
    color: string;
    size: Generated<ShirtSize>;
    babyLook: Generated<boolean>;
    quantity: Generated<number>;
    downPayment: Generated<number>;
    finalPayment: number | null;
    payments: boolean[];
    termAccepted: string | null;
    orderedAt: Timestamp | null;
    deliveredTo: string | null;
    deliveredAt: Timestamp | null;
    expiredAt: Timestamp | null;
    cancelledAt: Timestamp | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type DB = {
    Client: Client;
    LegalTerms: LegalTerms;
    Shirt: Shirt;
    ShirtOrder: ShirtOrder;
};
