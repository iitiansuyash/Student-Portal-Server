import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Notification_Form } from "./Notification_Form";
import { Student } from "./Student";
import { Student_cvs } from "./Student_cvs";

@Entity()
export class NF_Applications{

    @PrimaryColumn({ type: 'int' })
    public nfId: number

    @PrimaryColumn({ type: 'int' })
    public admno: number

    @ManyToOne(() => Notification_Form, (nf) => nf.applications)
    @JoinColumn({ name: 'nfId' })
    public notificationForm: Notification_Form

    @ManyToOne(() => Student, (student) => student.applications)
    @JoinColumn({ name: 'admno' })
    public student: Student

    @ManyToOne(() => Student_cvs, (cv) => cv.applications)
    @JoinColumn({ name: 'cvId' })
    public cv: Student_cvs
}