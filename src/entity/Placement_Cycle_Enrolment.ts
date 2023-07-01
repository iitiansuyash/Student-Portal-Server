import { Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Placementcycle } from "./Placementcycle";
import { Student } from "./Student";

@Entity()
export class Placement_Cycle_Enrolment{

    @PrimaryColumn({ type: "int" })
    public placementCycleId: number

    @PrimaryColumn({ type: "varchar", length: 15 })
    public admno: string

    @ManyToOne(() => Placementcycle, (placementcycle) => placementcycle.students)
    @JoinColumn({ name: 'placementCycleId' })
    public placementCycle: Placementcycle

    @ManyToOne(() => Student, (student) => student.placementcycles)
    @JoinColumn({ name: 'admno' })
    public student: Student
}