import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Notification_Form } from "./Notification_Form";
import { Scpt } from "./Scpt";

@Entity()
export class Notification_Form_spoc{
    @PrimaryColumn({ type: 'int' })
    public scptId: number

    @PrimaryColumn({ type: 'int' })
    public nfId: number

    @ManyToOne(() => Scpt, (scpt) => scpt.nfs)
    @JoinColumn({ name: 'scptId' })
    public scpt: Scpt

    @ManyToOne(() => Notification_Form, (nf) => nf.spocs)
    @JoinColumn({ name: 'nfId' })
    public notificationForm: Notification_Form

    @IsNotEmpty()
    @Column({ type: 'tinyint' })
    public isPrimary: number
}