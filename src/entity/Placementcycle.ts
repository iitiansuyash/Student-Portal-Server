import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Placement_Cycle_Enrolment } from "./Placement_Cycle_Enrolment";

@Entity()
export class Placementcycle{

    @PrimaryColumn()
    public placementCycleId: number

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 60 })
    public placementCycleName: string

    @OneToMany(() => Placement_Cycle_Enrolment, students => students.placementCycle)
    public students: Placement_Cycle_Enrolment[];
}