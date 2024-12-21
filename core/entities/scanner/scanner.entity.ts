import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Scanner {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  qrCode: string;

  @Column()
  barCode: string;

  constructor(args?: { qrCode: string; barCode: string }) {
    if (args) {
      this.qrCode = args.qrCode;
      this.barCode = args.barCode;
    }
  }
}
