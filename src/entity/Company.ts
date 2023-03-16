import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Company_Spoc } from "./Company_Spoc";
import { Notification_Form } from "./Notification_Form";

@Entity()
export class Company{

    @PrimaryGeneratedColumn("increment",{ type: 'int' })
    public companyId: number

    @IsNotEmpty()
    @Column('varchar', { length: 70 })
    public companyName: string

    @Column({ type: 'int' })
    public companyCategoryId: number

    @Column({ type: 'int' })
    public companySectorId: number

    @Column({ type: 'varchar', length: 60 })
    public companyWebsite: string

    @OneToMany(() => Company_Spoc, (spoc) => spoc.company)
    public spocs: Company_Spoc[]

    @OneToMany(() => Notification_Form, nf => nf.company)
    public nfs: Notification_Form[];
}