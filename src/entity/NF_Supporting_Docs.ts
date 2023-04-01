import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Document } from "./Document";
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

    @OneToOne(() => Document, { cascade: true, eager: true })
    @JoinColumn({ name: 'docId' })
    public document: Document
}