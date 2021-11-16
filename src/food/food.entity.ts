import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 100 })
  name: string;

  @Column('int')
  quantity: number;

  @Column({ type: 'nvarchar', length: 50 })
  unit: string;

  @Column()
  buyDate: Date;

  @Column()
  expireDate: Date;
}
