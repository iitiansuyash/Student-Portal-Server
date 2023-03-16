import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Notification_Form } from "./Notification_Form";
import { Selection_Stages } from "./Selection_Stages";

export enum Stage_Type {
    TECHNICAL = 'Tech',
    APTITUDE = 'Apti',
    OTHER='Other'
}

export enum Stage_Mode {
    PHYSICAL = 'Physical',
    VIRTUAL = 'Virtual'
}

@Entity()
export class NF_Job_Stages{

    @PrimaryColumn({ type: 'int' })
    public nfId: number

    @ManyToOne(() => Notification_Form, (nf) => nf.nf_stages)
    @JoinColumn({ name: 'nfId' })
    public notificationForm: Notification_Form

    @ManyToOne(() => Selection_Stages, (stage) => stage.nf_stages)
    @JoinColumn({ name: 'stageId' })
    public stage: Selection_Stages

    @IsNotEmpty()
    @Column({ type: "enum", enum: Stage_Type, default: Stage_Type.TECHNICAL })
    public stageType: Stage_Type

    @IsNotEmpty()
    @Column({ type: "enum", enum: Stage_Mode, default: Stage_Mode.VIRTUAL })
    public stageMode: Stage_Mode

    @PrimaryColumn({ type: 'int' })
    public seqNo: number

    @IsNotEmpty()
    @Column({ type: 'tinyint' })
    public isFinalRound: number
}