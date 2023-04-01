import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./Company";

@Entity()
export class Companysectors{

    @PrimaryGeneratedColumn("increment",{ type: 'int' })
    public sectorId: number

    @IsNotEmpty()
    @Column('varchar', { length: 45 })
    public sectorName: string

    @OneToMany(() => Company, (company) => company.sector)
    public companies: Company
}