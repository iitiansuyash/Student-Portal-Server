import { Entity, Column, OneToMany, PrimaryColumn, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { IsNotEmpty } from "class-validator";
import { Student_cvs } from "./Student_cvs";
import { Student_Studies_Spec } from "./StudentStudiesSpec";
import { Placement_Cycle_Enrolment } from "./Placement_Cycle_Enrolment";
import { Graduation_Year } from './Graduation_Year';
// import { NF_Applications } from "./NF_Applications";

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
    @Column({
        type: "enum",
        enum: Category,
        default: Category.GENERAL,
    })
    public category: string

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

    @OneToMany(() => Student_cvs, (cv) => cv.student)
    public cvs: Student_cvs[]

    @OneToMany(() => Student_Studies_Spec, (cv) => cv.student)
    public specializations: Student_Studies_Spec[]

    @OneToMany(() => Placement_Cycle_Enrolment, placementcycles => placementcycles.student)
    public placementcycles: Placement_Cycle_Enrolment[];

    @ManyToOne(() => Graduation_Year, (year) => year.student)
    @JoinColumn({ name: 'graduatingYear' })
    public graduatingYear: Graduation_Year

    // @OneToMany(() => NF_Applications, (application) => application.student)
    // public applications: NF_Applications[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', default: () => null })
    public deletedAt: Date
}