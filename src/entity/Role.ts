import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, BeforeInsert } from "typeorm"
import * as bcrypt from 'bcryptjs';
import { IsNotEmpty } from "class-validator";

@Entity()
export class Role {

    @PrimaryGeneratedColumn('uuid')
    public id: string

    @IsNotEmpty()
    @Column()
    public name: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;
}
