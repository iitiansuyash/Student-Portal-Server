import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Academic_Year } from "./Academic_Year";
import { Notification_Form } from "./Notification_Form";
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

    @ManyToOne(() => Academic_Year, (acadYear) => acadYear.placementCycles)
    @JoinColumn({ name: 'acadYear' })
    public acadYear: Academic_Year

    @OneToMany(() => Notification_Form, nf => nf.placementCycle)
    public nfs: Notification_Form[];
}