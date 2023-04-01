import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { HR_contact } from "./Hr_contact";
import { Notification_Form } from "./Notification_Form";

@Entity()
export class HR_POC_NF {
    @PrimaryColumn({ type: "int" })
    public nfId: number

    @PrimaryColumn({ type: "int" })
    public hrId: number

    @ManyToOne(() => Notification_Form, (nf) => nf.HRs)
    @JoinColumn({ name: "nfId" })
    public notificationForm: Notification_Form

    @ManyToOne(() => HR_contact, (hr) => hr.pocs)
    @JoinColumn({ name: "hrId" })
    public hr: HR_contact

    @IsNotEmpty()
    @Column({ type: "tinyint", default: 0 })
    public isPrimary: number
}