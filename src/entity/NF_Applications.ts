import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Notification_Form } from "./Notification_Form";
import { Student } from "./Student";
import { Student_cvs } from "./Student_cvs";

@Entity()
export class NF_Applications {

    @PrimaryColumn({ type: "int" })
    public nfId: number

    @PrimaryColumn({ type: "varchar", length: 15 })
    public admno: string

    @ManyToOne(() => Notification_Form, (nf) => nf.applicants)
    @JoinColumn({ name: 'nfId' })
    public notificationForm: Notification_Form

    @ManyToOne(() => Student, (student) => student.applications)
    @JoinColumn({ name: 'admno' })
    public student: Student

    @ManyToOne(() => Student_cvs, (cvs) => cvs.applications)
    @JoinColumn({ name: 'cvId' })
    public student_cvs: Student

    @Column({ type: 'tinyint' })
    public addedByAdmin: number
}