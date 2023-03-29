import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Academic_Year } from "./Academic_Year";
import { Notification_Form } from "./Notification_Form";
import { Placement_Cycle_Enrolment } from "./Placement_Cycle_Enrolment";
import { Specialization_Placementcycle_rel } from "./Specialization_placementcycle_rel";

@Entity()
export class Placementcycle{

    @PrimaryColumn()
    public placementCycleId: number

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 60 })
    public placementCycleName: string

    @OneToMany(() => Placement_Cycle_Enrolment, students => students.placementCycle)
    public students: Placement_Cycle_Enrolment[];

    @ManyToOne(() => Academic_Year, (acadYear) => acadYear.placementCycles, { cascade: true, eager: true })
    @JoinColumn({ name: 'acadYear' })
    public acadYear: Academic_Year

    @OneToMany(() => Notification_Form, nf => nf.placementCycle)
    public nfs: Notification_Form[];

    @OneToMany(() => Specialization_Placementcycle_rel, (spec) => spec.placementCycles, { cascade: true })
    public specializations: Specialization_Placementcycle_rel[]
}