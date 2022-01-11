import { Injectable } from '@nestjs/common';
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";

@Injectable()
export class MessageProducerService {
  constructor(@InjectQueue('message-queue') private queue: Queue) {}

  async sendMessage(message:string) {
    for (let i = 1; i <= 2; i++)
    {
      await this.queue.add('some-job', {
        text: message,
        iter: i,
      })
    }
  }

}
