import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Notification_Form } from "./Notification_Form";
import { Student } from "./Student";

@Entity()
export class NF_Shortlisting {

    @PrimaryColumn({ type: "int" })
    public nfId: number

    @PrimaryColumn({ type: "int" })
    public seqNo: number

    @PrimaryColumn({ type: "varchar", length: 15 })
    public admno: string

    @IsNotEmpty()
    @Column({ type: 'int' ,default:1})
    public isSelected: number

    @ManyToOne(() => Notification_Form, (nf) => nf.applicants)
    @JoinColumn({ name: 'nfId' })
    public notificationForm: Notification_Form

    @ManyToOne(() => Student, (student) => student.applications)
    @JoinColumn({ name: 'admno' })
    public student: Student

    @Column({ type: 'int' })
    public listType: number

    @Column({ type: "varchar", length: 45 })
    public finalCTC: string
}