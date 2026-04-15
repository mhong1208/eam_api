import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Handover } from '../entities/handover.entity';

@Injectable()
export class HandoverRepository extends Repository<Handover> {
  constructor(private dataSource: DataSource) {
    super(Handover, dataSource.createEntityManager());
  }
}
