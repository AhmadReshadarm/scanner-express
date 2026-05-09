import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { Tag } from './tag.entity';

@Entity()
export class Scanner {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  qrCode: string;

  @Column()
  barCode: string;

  @Column({ default: 0 })
  query_count: number;

  @ManyToMany(() => Tag, tag => tag.scanners, { cascade: true, nullable: true })
  @JoinTable()
  tags?: Tag[];

  constructor(args?: { qrCode: string; barCode: string; query_count: number; tags?: Tag[] }) {
    if (args) {
      this.qrCode = args.qrCode;
      this.barCode = args.barCode;
      this.query_count = args.query_count;
      this.tags = args.tags;
    }
  }
}
