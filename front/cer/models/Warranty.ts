import type { Usuario } from "./usuario";

export enum WARRANTY_STATUS {
    'Pendent'='P',
    'A'='Approved',
    'R'='Refused'
}

export type Warranty = {
    id?: number;
    status: WARRANTY_STATUS;
    createdByFK: number;
    items: Array<string>;
}
