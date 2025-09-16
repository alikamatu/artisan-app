import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { User } from './user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'thread_id' })
  @Index()
  threadId: string;

  @ManyToOne(() => User, user => user.sentMessages)
  @Index()
  fromUser: User;

  @ManyToOne(() => User, user => user.receivedMessages)
  @Index()
  toUser: User;

  @Column('text')
  content: string;

  @Column('jsonb', { nullable: true })
  attachments: Array<{
    url: string;
    type: 'image' | 'video' | 'document';
    name: string;
  }>;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  @Index()
  createdAt: Date;
}