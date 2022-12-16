import { Ligne } from "./Ligne";
import { Releve } from "./Releve";

export interface ICompte {

    id: number;

    name: string;

    soldeInitial: number;

    lignes: Ligne[];

    releves: Releve[];

}
