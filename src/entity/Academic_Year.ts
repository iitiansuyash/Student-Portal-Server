import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Acadyear_Placementcycle_rel } from "./Acadyear_Placementcycle_rel";
import { Spec_Offered_Acadyear } from "./Spec_Offered_Acadyear";

@Entity()
export class Academic_Year{

    @PrimaryColumn({ type: 'varchar', length: 10 })
    public year: string

    @OneToMany(() => Spec_Offered_Acadyear, acadYearToSpec => acadYearToSpec.acadYear)
    public acadYearToSpec: Spec_Offered_Acadyear[];

    @OneToMany(() => Acadyear_Placementcycle_rel, (placementcycles) => placementcycles.acadYear)
    public placementcycles: Acadyear_Placementcycle_rel[]
}