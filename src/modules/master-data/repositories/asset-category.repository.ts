import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AssetCategory } from '../entities/asset-category.entity';

@Injectable()
export class AssetCategoryRepository extends Repository<AssetCategory> {
  constructor(private dataSource: DataSource) {
    super(AssetCategory, dataSource.createEntityManager());
  }
}
