import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Academic_Year } from "./Academic_Year";
import { Specialization } from "./Specialization";

@Entity()
export class Spec_Offered_Acadyear{

    @PrimaryGeneratedColumn()
    public idacadyear_spec_rel: number

    @ManyToOne(() => Specialization, (spec) => spec.specToAcadyear)
    public spec: Specialization

    @ManyToOne(() => Academic_Year, (acadYear) => acadYear.acadYearToSpec)
    public acadYear: Academic_Year

}