import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Company } from "./Company";
import { Scpt } from "./Scpt";

@Entity()
export class Company_Spoc{

    @PrimaryColumn({ type: 'int' })
    public companyId: number

    @PrimaryColumn({ type: 'int' })
    public scptId: number

    @ManyToOne(() => Company, (company) => company.spocs)
    @JoinColumn({ name: 'companyId' })
    public company: Company

    @ManyToOne(() => Scpt, (scpt) => scpt.companies)
    @JoinColumn({ name: 'scptId' })
    public scpt: Scpt

    @IsNotEmpty()
    @Column({ type: 'tinyint' })
    public isPrimary: number
}

