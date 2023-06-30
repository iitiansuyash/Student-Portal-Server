import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Placementcycle } from "./Placementcycle";
import { Spec_Offered_Acadyear } from "./Spec_Offered_Acadyear";
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Academic_Year {

    @PrimaryColumn({ type: 'varchar', length: 10 })
    public year: string

    @OneToMany(() => Spec_Offered_Acadyear, acadYearToSpec => acadYearToSpec.acadYear)
    public acadYearToSpec: Spec_Offered_Acadyear[];

    @OneToMany(() => Placementcycle, (placementCycle) => placementCycle.acadYear)
    public placementCycles: Placementcycle[]

    @IsNotEmpty()
    @Column({ type: 'int', default: 0 })
    public isCurrent: number
}