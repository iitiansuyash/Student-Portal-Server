import { IsNotEmpty } from "class-validator";
import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Academic_Year } from "./Academic_Year";
import { Placementcycle } from "./Placementcycle";

@Entity()
export class Acadyear_Placementcycle_rel{

    @PrimaryColumn()
    placementCycleId: number;

    @IsNotEmpty()
    @OneToOne(() => Placementcycle)
    @JoinColumn({ name: 'placementCycleId'})
    public placementCycle: Placementcycle

    @ManyToOne(() => Academic_Year, (acadYear) => acadYear.placementcycles)
    @JoinColumn({ name: "acadYear" })
    public acadYear: Academic_Year
}