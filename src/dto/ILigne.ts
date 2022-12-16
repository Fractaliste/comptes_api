import { Categorie } from "./Categorie";
import { Compte } from "./Compte";
import { Releve } from "./Releve";
import { Tier } from "./Tier";

export interface ILigne {

    id: number;

    categorie: Categorie;

    tier: Tier;

    compte: Compte;

    date: Date

    valeur: number

    note: string

    numeroCheque: number

    rapprochement: Releve

    isHorsBudget: boolean

    virement?: ILigne
}
