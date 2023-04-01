import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Document {
    @PrimaryColumn({ type: 'varchar', length: 100 })
    public id: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 100 })
    public name: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 50 })
    public mimeType: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 250 })
    public previewLink: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 250 })
    public downloadLink: string
}