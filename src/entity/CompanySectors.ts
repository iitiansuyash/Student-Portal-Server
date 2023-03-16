import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CompanySectors{

    @PrimaryGeneratedColumn("increment",{ type: 'int' })
    public sectorId: number

    @IsNotEmpty()
    @Column('varchar', { length: 45 })
    public sectorName: string
}