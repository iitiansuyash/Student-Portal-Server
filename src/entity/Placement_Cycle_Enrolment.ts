import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Placementcycle } from "./Placementcycle";
import { Student } from "./Student";

@Entity()
export class Placement_Cycle_Enrolment{

    @PrimaryGeneratedColumn("increment")
    public PCEId: number

    @ManyToOne(() => Placementcycle, (placementcycle) => placementcycle.students)
    @JoinColumn({ name: 'placementCycleId' })
    public placementCycle: Placementcycle

    @ManyToOne(() => Student, (student) => student.placementcycles)
    @JoinColumn({ name: 'admno' })
    public student: Student
}