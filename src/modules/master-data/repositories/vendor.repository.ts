import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Vendor } from '../entities/vendor.entity';

@Injectable()
export class VendorRepository extends Repository<Vendor> {
  constructor(private dataSource: DataSource) {
    super(Vendor, dataSource.createEntityManager());
  }
}
