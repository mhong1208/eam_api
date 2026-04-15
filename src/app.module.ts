import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterDataModule } from './modules/master-data/master-data.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransferHandoverModule } from './modules/transfer-handover/transfer-handover.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, AuthModule, MasterDataModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>('DB_TYPE'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('SYNCHRONIZE') === 'true',
        logging: configService.get<string>('LOGGING') === 'true',
      }),
    }),
    
    AuthModule,
    MasterDataModule,
    TransferHandoverModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
