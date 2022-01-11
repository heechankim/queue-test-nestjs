import { JOB_REF, OnGlobalQueueCompleted, OnQueueActive, OnQueueCompleted, Process, Processor } from "@nestjs/bull";
import {Job} from "bull";
import { Inject, Logger } from "@nestjs/common";

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
    //console.log(`Processing job "${job.id}" of type "${job.name}" with data "${job.data}"...`)
    console.log(`${job.id} 번 작업을 수신`)
    return someWork(job.data)
  }
  @OnQueueCompleted()
  onCompleted(job: Job<unknown>, result: any) {
    console.log(job.name, "is completed!! => ", result)
  }
  // @OnQueueActive()
  // onActivate(job: Job<unknown>, result: any) {
  //   console.log(`Processing job "${job.id}" of type "${job.name}" with data "${job.data}"...`)
  //   if(job.isActive()) {
  //     console.log(job.name, "is started! => ", result)
  //   }
  // }
  // @OnGlobalQueueCompleted()
  // onCompleted(job: Job<unknown>) {
  //   console.log(job.name, "is completed!!")
  // }



  // readOperationJob(job: Job<unknown>) {
  //   console.log(job.data)
  // }
}