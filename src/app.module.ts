import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ItemsController } from './items/items.controller';
import { ItemsService } from './items/items.service';
import { ItemsModule } from './items/items.module';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { ItemSchema } from './items/schemas/item.schema';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI), MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema}]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_DB_HOST,
      port: process.env.MYSQL_DB_PORT ? parseInt(process.env.MYSQL_DB_PORT) : 3366,
      username: process.env.MYSQL_DB_USERNAME,
      password: process.env.MYSQL_DB_PASSWORD,
      database: process.env.MYSQL_DB_DATABASE,
      entities: [User],
      synchronize: true,
    }),
    ProductsModule, 
    ItemsModule, 
    UsersModule
  ],
  controllers: [AppController, ItemsController, ProductsController],
  providers: [AppService, ItemsService, ProductsService],
})
export class AppModule {}
