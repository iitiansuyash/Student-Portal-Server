import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./Company";

@Entity()
export class Companycategories{

    @PrimaryGeneratedColumn("increment",{ type: 'int' })
    public categoryId: number

    @IsNotEmpty()
    @Column('varchar', { length: 45 })
    public categoryName: string

    @OneToMany(() => Company, (company) => company.category)
    public companies: Company
}