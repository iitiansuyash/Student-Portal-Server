import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./Company";
import { NF_Applications } from "./NF_Applications";
import { NF_Branch_Eligibility } from "./NF_Branch_Eligibility";
import { NF_History_Criteria } from "./NF_History_Criteria";
import { NF_Job_Stages } from "./NF_Job_Stages";
import { NF_Supporting_Docs } from "./NF_Supporting_Docs";
import { Placementcycle } from "./Placementcycle";

export enum NF_Type {
    INF = 'INF',
    JNF = 'JNF'
}

@Entity()
export class Notification_Form{

    @PrimaryColumn({ type: 'int' })
    public nfId: number

    @IsNotEmpty()
    @Column({
        type: "enum",
        enum: NF_Type,
        default: NF_Type.JNF,
    })
    public type: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public profile: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public placeOfPosting: string


    @IsNotEmpty()
    @Column({ type: 'varchar', length: 500 })
    public jobDescription: string


    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public modeOfInternship: string


    @IsNotEmpty()
    @Column({ type: 'varchar', length: 300 })
    public ctcBreakup: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public bondDetails: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public hasPPO: string

    @IsNotEmpty()
    @Column({ type: 'int' })
    public ismOffersMin: number

    @IsNotEmpty()
    @Column({ type: 'int' })
    public ismOffersMax: number

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public cdcInformation: string

    @ManyToOne(() => Placementcycle, (placementCycle) => placementCycle.nfs)
    @JoinColumn({ name: 'placementCycleId' })
    public placementCycle: Placementcycle

    @ManyToOne(() => Company, (company) => company.nfs)
    @JoinColumn({ name: 'companyId' })
    public company: Company

    @OneToMany(() => NF_Applications, (application) => application.notificationForm)
    public applications: NF_Applications[]

    @OneToMany(() => NF_Branch_Eligibility, (application) => application.notificationForm)
    public nfEligibility: NF_Branch_Eligibility[]

    @OneToMany(() => NF_History_Criteria, (application) => application.notificationForm)
    public nfHistoryCriteria: NF_History_Criteria[]

    @OneToMany(() => NF_Job_Stages, (application) => application.notificationForm)
    public nf_stages: NF_Job_Stages[]

    @OneToMany(() => NF_Supporting_Docs, (application) => application.notificationForm)
    public nf_docs: NF_Supporting_Docs[]
}