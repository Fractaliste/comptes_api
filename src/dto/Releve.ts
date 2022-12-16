import { IReleve } from "./IReleve";
import { Compte } from "./Compte";
import { Ligne } from "./Ligne";

export class Releve implements IReleve {

    id: number;

    clot: boolean;

    compte: Compte;

    date: Date;

    solde: number;

    lignes: Ligne[]
}
