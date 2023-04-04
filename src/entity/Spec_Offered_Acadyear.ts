import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Academic_Year } from "./Academic_Year";
import { Specialization } from "./Specialization";

@Entity()
export class Spec_Offered_Acadyear{

    @PrimaryGeneratedColumn()
    public idacadyear_spec_rel: number

    @ManyToOne(() => Specialization, (spec) => spec.specToAcadyear)
    @JoinColumn({ name: 'specId'})
    public spec: Specialization

    @ManyToOne(() => Academic_Year, (acadYear) => acadYear.acadYearToSpec)
    @JoinColumn({ name: 'acadYear' })
    public acadYear: Academic_Year

}