import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Handover } from './entities/handover.entity';
import { HandoverController } from './controllers/handover.controller';
import { HandoverService } from './services/handover.service';
import { HandoverRepository } from './repositories/handover.repository';
// import { Vendor } from './entities/vendor.entity'; // if needed
// import { VendorRepository } from './repositories/vendor.repository'; // if needed

@Module({
  imports: [TypeOrmModule.forFeature([Handover])],
  controllers: [HandoverController],
  providers: [HandoverService, HandoverRepository],
  exports: [HandoverService],
})
export class TransferHandoverModule {}
