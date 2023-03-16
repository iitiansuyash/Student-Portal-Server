import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Notification_Form } from "./Notification_Form";

@Entity()
export class NF_Supporting_Docs{

    @PrimaryColumn({ type: 'int' })
    public nfId: number

    @ManyToOne(() => Notification_Form, (nf) => nf.nf_docs)
    @JoinColumn({ name: 'nfId' })
    public notificationForm: Notification_Form

    @PrimaryColumn({ type: 'varchar', length: 45 })
    public docType: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 100 })
    public docLink: string
}