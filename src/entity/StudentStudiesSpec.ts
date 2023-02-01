import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Specialization } from "./Specialization";
import { Student } from "./Student";

@Entity()
export class Student_Studies_Spec{

    @PrimaryColumn({ type: 'int' })
    public study_id: Number

    @ManyToOne(() => Student, (student) => student.specializations)
    @JoinColumn({ name: "admno" })
    public student: Student

    @ManyToOne(() => Specialization, (specialization) => specialization.specId)
    @JoinColumn({ name: "specId" })
    public specialization: Specialization

    @IsNotEmpty()
    @Column({ type: 'tinyint' })
    public isParent: Number

    @IsNotEmpty()
    @Column('varchar', { length: 200 })
    public marksheetLink: string

    @IsNotEmpty()
    @Column({ type: 'float' })
    public cgpaValue: Number

    @IsNotEmpty()
    @Column({ type: 'float', default: 10 })
    public cgpaScale: Number

    @IsNotEmpty()
    @Column({ type: 'int' })
    public totalBacklogs: Number
    
    @IsNotEmpty()
    @Column({ type: 'int' })
    public activeBacklogs: Number
}