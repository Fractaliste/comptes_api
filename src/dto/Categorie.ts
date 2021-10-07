
export class Categorie {

    id: number;

    name: string;

    type: "FIXE" | "COURANTE" | "EXCEPTIONNELLE";

    children: Categorie[];

    parent: Categorie;

}
