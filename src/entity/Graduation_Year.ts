import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Student } from './Student';
import { Placementcycle } from './Placementcycle';

@Entity()
export class Graduation_Year {
    @PrimaryColumn({ type: "varchar", length: 10 })
    public year: string

    @OneToMany(() => Student, (student) => student.graduatingYear)
    public student: Student[]

    @OneToMany(() => Placementcycle, (cycle) => cycle.graduatingYear)
    public placementCycle: Placementcycle
}