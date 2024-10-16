import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()

export class Event {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    type!: string 
    // IE: "event", "birth", "death"

    @Column('int')
    year!: number

    @Column('text')
    description!: string;

    @Column()
    date!: string;
    // Stores date month and day in "Month N" format

    @Column({ nullable: true})
    source_url?: string
    // Source tracking url (IE: MuffinLabs)

    @Column('json', { nullable: true})
    links?: {title: string; link: string}[];
    // Allows for an array of related links, IE: to Wikipedia

    @Column('text', {nullable: true})
    image_url?: string
    // Hopefully we can get some image URLS as well...
}