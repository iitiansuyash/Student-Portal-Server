import { IsNotEmpty } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Discipline } from "./Discipline";
import { Spec_Offered_Acadyear } from "./Spec_Offered_Acadyear";
import { Student_Studies_Spec } from "./StudentStudiesSpec";

@Entity()
export class Specialization{

    @PrimaryColumn({ type: 'int' })
    public specId: number

    @IsNotEmpty()
    @Column('varchar', { length: 60 })
    public specName: string

    @OneToMany(() => Student_Studies_Spec, (cv) => cv.specialization)
    specializations: Student_Studies_Spec[]

    @OneToMany(() => Spec_Offered_Acadyear, (specToAcadyear) => specToAcadyear.spec)
    public specToAcadyear: Spec_Offered_Acadyear[];
}