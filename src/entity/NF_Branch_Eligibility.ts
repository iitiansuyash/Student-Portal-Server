import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Notification_Form } from "./Notification_Form";
import { Specialization } from "./Specialization";

@Entity()
export class NF_Branch_Eligibility{

    @PrimaryColumn({ type: 'int' })
    public nfId: number

    @PrimaryColumn({ type: 'int' })
    public specId: number

    @ManyToOne(() => Notification_Form, (nf) => nf.nfEligibility)
    @JoinColumn({ name: 'nfId' })
    public notificationForm: Notification_Form

    @ManyToOne(() => Specialization, (spec) => spec.nfEligibility)
    @JoinColumn({ name: 'specId' })
    public spec: Specialization

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public minLPA: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public maxLPA: string

    @IsNotEmpty()
    @Column({ type: 'float' })
    public cgpaValue: number
}