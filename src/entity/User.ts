import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, BeforeUpdate, BeforeInsert, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt'
import { Notices } from './Notices';

@Entity()
export class User {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    public id: number

    @Column({ type: "varchar", length: 50 })
    public name: string

    @Column({ type: "varchar", length: 25 })
    public phone: string

    @Column({ type: "varchar", length: 100, unique: true })
    public email: string

    @Column({ type: "varchar", length: 50, unique: true })
    public username: string

    @Column({ type: "bigint", default: 0 })
    public permissions: number

    @Column({ type: "varchar", length: 200 })
    public password: string

    @BeforeUpdate()
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(unencryptedPassword: string): Promise<boolean> {
        return await bcrypt.compare(unencryptedPassword, this.password);
    }

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date

    @DeleteDateColumn({ type: 'timestamp', default: () => null })
    public deletedAt: Date

    @OneToMany(() => Notices,(notice) => notice.user)
    public notices: Notices[]
}