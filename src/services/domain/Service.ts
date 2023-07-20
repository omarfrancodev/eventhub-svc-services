import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Service extends BaseEntity {
    @PrimaryGeneratedColumn()
    serviceId!: number;

    @Column()
    providerId!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column()
    lowerDescription!: string;

    @Column('varchar', {array: true, nullable: true})
    tags!: string[] | null;

    @Column('simple-array')
    urlImages!: string[];

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date;
}