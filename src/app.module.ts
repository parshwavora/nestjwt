import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { users } from './user.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'db',
      database: 'Mytestdb',
      entities: [users],
      synchronize: true,
  }),TypeOrmModule.forFeature([users]),JwtModule.register({
    secret:'magic',
    signOptions:{expiresIn:'1d'}
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
