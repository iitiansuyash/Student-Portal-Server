import { Entity, Column, OneToMany, PrimaryColumn, DeleteDateColumn, ManyToOne, JoinColumn, JoinTable } from "typeorm"
import { IsNotEmpty } from "class-validator";
import { Student_cvs } from "./Student_cvs";
import { Student_Studies_Spec } from "./StudentStudiesSpec";
import { Placement_Cycle_Enrolment } from "./Placement_Cycle_Enrolment";
import { Graduation_Year } from './Graduation_Year';
import { Edu_History } from './Edu_History';
import { NF_Applications } from "./NF_Applications";
import { StudiesSemwiseCgpa } from "./Studies_Semwise_Cgpa";

export enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = 'other'
}

export enum Category {
    GENERAL = "Gen",
    SC = "SC",
    ST = 'ST',
    OBCNCL = 'OBC-NCL',
    OBC = 'OBC'
}

@Entity()
export class Student {

    @PrimaryColumn("varchar", { length: 15 })
    public admno: string

    @IsNotEmpty()
    @Column("varchar", { length: 45 })
    public first_name: string

    @IsNotEmpty()
    @Column("varchar", { length: 45 })
    public middle_name: string

    @IsNotEmpty()
    @Column("varchar", { length: 45 })
    public last_name: string

    @IsNotEmpty()
    @Column("varchar", { length: 6 })
    public phonePref: string

    @IsNotEmpty()
    @Column("varchar", { length: 45 })
    public phone: string

    @IsNotEmpty()
    @Column({ type: 'date' })
    public dob: Date

    @IsNotEmpty()
    @Column({
        type: "enum",
        enum: Gender,
        default: Gender.MALE,
    })
    public gender: string


    @IsNotEmpty()
    @Column("varchar", { length: 100 })
    public instiMailId: string

    @IsNotEmpty()
    @Column("varchar", { length: 45 })
    public personalMailId: string

    @IsNotEmpty()
    @Column({ type: 'tinyint' })
    public isPWD: number

    @IsNotEmpty()
    @Column({
        type: "enum",
        enum: Category,
        default: Category.GENERAL,
    })
    public category: string

    @IsNotEmpty()
    @Column({ type: 'tinyint' })
    public isEWS: number

    @IsNotEmpty()
    @Column({ type: 'int', default: 0 })
    public permissions: number

    @IsNotEmpty()
    @Column("varchar", { length: 45 })
    public uidType: string

    @IsNotEmpty()
    @Column("varchar", { length: 45 })
    public uidValue: string

    @Column({ type: 'tinyint', default: 0 })
    public isRegistered: number

    @OneToMany(() => Student_cvs, (cv) => cv.student,{ cascade: true })
    public cvs: Student_cvs[]

    @OneToMany(() => Edu_History, (edu) => edu.student, { cascade: true })
    public edu_historys: Edu_History[]

    @OneToMany(() => Student_Studies_Spec, (cv) => cv.student,{ cascade: true })
    public specializations: Student_Studies_Spec[]

    @OneToMany(() => StudiesSemwiseCgpa, (semwise_gpa) => semwise_gpa.student,{ cascade: true })
    public semwise_gpas: StudiesSemwiseCgpa[]

    @OneToMany(() => Placement_Cycle_Enrolment, placementcycles => placementcycles.student,{ cascade: true })
    public placementcycles: Placement_Cycle_Enrolment[];

    @ManyToOne(() => Graduation_Year, (year) => year.student,{ cascade: true, eager: true })
    @JoinColumn({ name: 'graduatingYear' })
    public graduatingYear: Graduation_Year

    @OneToMany(() => NF_Applications, (application) => application.student)
    public applications: NF_Applications[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', default: () => null })
    public deletedAt: Date
}