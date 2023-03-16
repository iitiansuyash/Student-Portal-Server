import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Degrees } from "./Degrees";
import { Notification_Form } from "./Notification_Form";

@Entity()
export class NF_History_Criteria{

    @PrimaryColumn({ type: 'int' })
    public nfId: number

    @PrimaryColumn({ type: 'int' })
    public degreeId: number

    @ManyToOne(() => Notification_Form, (nf) => nf.nfHistoryCriteria)
    @JoinColumn({ name: 'nfId' })
    public notificationForm: Notification_Form

    @ManyToOne(() => Degrees, (spec) => spec.nfHistoryCriteria)
    @JoinColumn({ name: 'degreeId' })
    public degree: Degrees

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public percentEquivalent: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public cgpaEquivalentValue: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public cgpaEquivalentScale: string
}