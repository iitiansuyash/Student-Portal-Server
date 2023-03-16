import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CompanyCategories{

    @PrimaryGeneratedColumn("increment",{ type: 'int' })
    public categoryId: number

    @IsNotEmpty()
    @Column('varchar', { length: 45 })
    public categoryName: string
}