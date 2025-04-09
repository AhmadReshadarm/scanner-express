import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Scanner } from './scanner.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: string;

  @IsNotEmpty()
  @Column()
  name: string;

  @ManyToMany(() => Scanner, scanner => scanner.tags)
  scanners?: Scanner[];

  @IsNotEmpty()
  @Column({ unique: true })
  url: string;

  constructor(args?: { name: string; scanners?: Scanner[]; url: string }) {
    if (args) {
      this.name = args.name;
      this.scanners = args.scanners;
      this.url = args.url;
    }
  }
}
