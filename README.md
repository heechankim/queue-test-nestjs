# 작업이력

#### app.module.ts
```typescript
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
```
#### app.controller.ts
```typescript
@Get('invoke-msg')  
getInvokeMsg(@Query('msg') msg:string) {  
  this.messageProducerService.sendMessage(msg)  
  return msg;  
}
```
#### message.producer.service.ts
```typescript
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
```
#### message.consumer.ts
```typescript
async function someWork(data) {  
	  console.log(data, " work start!")  
	  let wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))  
	  await wait(5000)  
	  return {result: "successful"}  
}

@Processor('message-queue')  
export class MessageConsumer {  
	  private readonly logger = new Logger(MessageConsumer.name)  
	  
	  @Process('some-job')  
	  async transcode(job: Job<unknown>): Promise<any> {  
	    // some work  
	    return someWork(job.data)  
	  }  
	  @OnQueueCompleted()  
	  onCompleted(job: Job<unknown>, result: any) {  
	    console.log(job.name, "is completed!! => ", result)  
	  }
}
```
