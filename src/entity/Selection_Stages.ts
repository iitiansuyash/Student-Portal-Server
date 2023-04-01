import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { NF_Job_Stages } from "./NF_Job_Stages";

@Entity()
export class Selection_Stages{

    @PrimaryColumn({ type: 'int' })
    public stageId: number

    @IsNotEmpty()
    @Column('varchar', { length: 45 })
    public stageName: string

    @OneToMany(() => NF_Job_Stages, (application) => application.stage)
    public nf_stages: NF_Job_Stages[]
}