import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, PrimaryColumn } from "typeorm"
import { IsNotEmpty } from "class-validator";
import { User } from "./User";
import { Student_cvs } from "./Student_cvs";
import { Student_Studies_Spec } from "./StudentStudiesSpec";


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
    @OneToOne(() => User, (user) => user.student, { eager: true })
    public user: User

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
    public isPWD: Number

    @IsNotEmpty()
    @Column({ type: 'tinyint' })
    public isEWS: Number

    @IsNotEmpty()
    @Column({ type: 'int', default: 0 })
    public permissions: Number

    @IsNotEmpty()
    @Column("varchar", { length: 45 })
    public uidType: string

    @IsNotEmpty()
    @Column("varchar", { length: 45 })
    public uidValue: string

    @OneToMany(() => Student_cvs, (cv) => cv.student)
    cvs: Student_cvs[]
    
    @OneToMany(() => Student_Studies_Spec, (cv) => cv.student)
    specializations: Student_Studies_Spec[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;
}