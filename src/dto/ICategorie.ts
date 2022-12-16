
export interface ICategorie {

    id: number;

    name: string;

    type: "FIXE" | "COURANTE" | "EXCEPTIONNELLE";

    children: ICategorie[];

    parent: ICategorie;

}
