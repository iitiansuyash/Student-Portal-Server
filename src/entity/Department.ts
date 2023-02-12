import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Discipline_Department_Rel } from "./Discipline_Department_Rel";

@Entity()
export class Department{

    @PrimaryGeneratedColumn("increment" ,{ type: 'int' })
    public deptId: number

    @IsNotEmpty()
    @Column('varchar', { length: 100 })
    public deptName: string

    @OneToMany(() => Discipline_Department_Rel, (discipline) => discipline.dept)
    disciplines: Discipline_Department_Rel[]
}