import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { QuizEvent } from './quizEvent';

@Entity()
export class Quiz {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true})
    quiz_date!: Date;

    @OneToMany(() => QuizEvent, (quizEvent) => quizEvent.quiz, {cascade: true})
    quizEvents?: QuizEvent[];
}