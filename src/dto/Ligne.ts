import { Categorie } from "./Categorie";
import { Compte } from "./Compte";
import { Releve } from "./Releve";
import { Tier } from "./Tier";

export class Ligne {

    id: number;

    categorie: Categorie;

    tier: Tier;

    compte: Compte;

    date: Date

    valeur: number

    note: string

    rapprochement: Releve

    isHorsBudget: boolean

    virement?: Ligne
}
