import { Module } from '@nestjs/common';
import {BullModule} from "@nestjs/bull";
import { AppController } from './app.controller';
import { AppService } from './app.service';

// queue service
import {MessageProducerService} from "./message.producer.service";
import {MessageConsumer} from "./message.consumer";

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'message-queue',
    })
  ],
  controllers: [AppController],
  providers: [AppService, MessageProducerService, MessageConsumer],
})
export class AppModule {}
