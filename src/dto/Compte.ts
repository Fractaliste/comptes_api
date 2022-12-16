import { ICompte } from "./ICompte";
import { Ligne } from "./Ligne";
import { Releve } from "./Releve";

export class Compte implements ICompte {

    id: number;

    name: string;

    soldeInitial: number;

    lignes: Ligne[];

    releves: Releve[];

}
