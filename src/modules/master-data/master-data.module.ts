import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { LocationRepository } from './repositories/location.repository';
import { LocationsService } from './services/locations.service';
import { LocationsController } from './controllers/locations.controller';
import { AssetCategory } from './entities/asset-category.entity';
import { AssetCategoryRepository } from './repositories/asset-category.repository';
import { Vendor } from './entities/vendor.entity';
import { VendorRepository } from './repositories/vendor.repository';
import { Asset } from './entities/asset.entity';
import { AssetRepository } from './repositories/asset.repository';

import { AssetCategoriesService } from './services/asset-categories.service';
import { AssetCategoriesController } from './controllers/asset-categories.controller';
import { VendorsService } from './services/vendors.service';
import { VendorsController } from './controllers/vendors.controller';
import { AssetsService } from './services/assets.service';
import { AssetsController } from './controllers/assets.controller';

import { Department } from './entities/department.entity';

import { DepartmentRepository } from './repositories/department.repository';
import { DepartmentsService } from './services/departments.service';
import { DepartmentsController } from './controllers/departments.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Location,
      AssetCategory,
      Vendor,
      Asset,
      Department,
    ]),
  ],
  controllers: [
    LocationsController,
    AssetCategoriesController,
    VendorsController,
    AssetsController,
    DepartmentsController,
  ],
  providers: [
    LocationRepository,
    LocationsService,
    AssetCategoryRepository,
    AssetCategoriesService,
    VendorRepository,
    VendorsService,
    AssetRepository,
    AssetsService,
    DepartmentRepository,
    DepartmentsService,
  ],
  exports: [
    LocationRepository,
    LocationsService,
    AssetCategoryRepository,
    AssetCategoriesService,
    VendorRepository,
    VendorsService,
    AssetRepository,
    AssetsService,
    DepartmentRepository,
    DepartmentsService,
  ],
})
export class MasterDataModule {}
