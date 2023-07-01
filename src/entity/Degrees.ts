import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { NF_History_Criteria } from "./NF_History_Criteria";

export enum DegreeType {
    TENTH = '10',
    TWELVE = '12',
    UG = 'UG',
    PG = 'PG'
}

@Entity()
export class Degrees{
    @PrimaryColumn({ type: 'int' })
    public degreeId: number

    @IsNotEmpty()
    @Column({
        type: "enum",
        enum: DegreeType,
        default: DegreeType.TENTH,
    })
    public degreeType: string

    @OneToMany(() => NF_History_Criteria, (application) => application.degree)
    public nfHistoryCriteria: NF_History_Criteria[]
}