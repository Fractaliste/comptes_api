import { ICategorie } from "./ICategorie";

export class Categorie implements ICategorie {

    id: number;

    name: string;

    type: "FIXE" | "COURANTE" | "EXCEPTIONNELLE";

    children: Categorie[];

    parent: Categorie;

}
