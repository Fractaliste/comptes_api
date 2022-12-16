import { Compte } from "./Compte";
import { Ligne } from "./Ligne";

export interface IReleve {

    id: number;

    clot: boolean;

    compte: Compte;

    date: Date;

    solde: number;

    lignes: Ligne[]
}
