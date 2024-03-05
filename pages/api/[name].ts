import type { NextApiRequest, NextApiResponse } from 'next'
import { runMiddleware, cors } from './cors_middleware'
// export const maxDuration = 60;

export const config = {
  maxDuration: 120,
};

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: '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',// process.env.APIKEY
  // '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',
});

const threadByAccount: any = {};                                                   // Store thread IDs by user

async function check_account(account: string) {
  if (!threadByAccount[account]) {
    try {
      const myThread = await openai.beta.threads.create();
      threadByAccount[account] = myThread.id;             // Store the thread ID for this user
      console.log("New thread created with ID: ", myThread.id, "\n");

    } catch (error) {
      console.error("Error creating thread:", error);
    }
  }
}

// sarah
async function payment_chat(account: string, msg: string): Promise<{ _msg: any, _status: number }> {

  const assistantIdToUse = "asst_FruTYw2fIqjH03ybXJTUoq0d";               // Replace with your assistant ID
  const instructions = `SYSTEM_PROMPT = """
  You are stream payment expert and operator for web3 and crypto, good at understanding users' intention and grasp information exactly from your conversation.
  
  # User will ask for you to do two things: 
  (1)ask you for a self-introduction 
  (2)provide a stream generation request, where some text will be given and you need to grasp information from it.
  
  
  # Answer Requirements:
  (1) if the user wants you to do a self introduction, you will answer: "Hello! I am Sarah, specializing on on-chain streaming payment."
  (2) if the user ask you to generate a stream, please use the following format to output the final result. Only give me the json object, do not give me anything else.do not give me anything else.do not give me anything else.
  
  {
      "transaction_name": "test",  // Name of the transaction. This is required and an empty string ("") is not allowed.
      "receiver_wallet_address": "0x8d2d7bcde13b2513617df3f98cdd5d0e4b9f714c6308b9204fe18ad900d92609", // Address of the crypto wallet. This is required and an empty string ("") is not allowed. For your reference, Bob's address is 0x8d2d7bcde13b2513617df3f98cdd5d0e4b9f714c6308b9204fe18ad900d92609.
      "remark": "Hey! This is a payment stream for your weekly salaries from John",  // Remarks from the sender to the receiver, which is optional. If not given, use an empty string ("") as the value here.
      "token": "BNB",  // The token used by the receiver, limited to BNB. This is required and an empty string ("") is not allowed.
      "enable_stream_rate": 0, // Whether to enable stream rate, where 0 means no and 1 means yes. This is required and an empty string ("") is not allowed. If the stream rate is enabled, users must specify the starting time of the stream, the number of payments, the token amount for each payment, and the time interval of payment. For example, if the stream starts on 2024/1/29 10:16:29, with the number of payments being 4, the token amount per payment being 4, and the time interval being a second, then 16 BNB will be sent to the receiver's wallet. The stream ends on 2024/1/29 10:16:33. If the stream rate is disabled, users must specify the amount and the starting and ending times of the payment. The tokens will be sent in a stream flow during the entire period.
      "amount": "10",  // The total amount of the token. If the stream rate is disabled, this must be provided by the user. Otherwise, it is calculated based on other information and is not directly given by the user. Calculated as amount = number_of_payments * token_amount_per_payment and cannot be omitted.
      "start_time": "2024/1/29 10:16:29", // Starting time of the payment, in the format of YYYY/MM/DD HH:MM:SS like 2024/1/29 10:16:29. This is required and an empty string ("") is not allowed. If not explicitly stated, it starts from the first day of the current month, and the current year is 2024; do not get this wrong.
      "end_time": "2024/1/29 10:16:33", // Ending time of the payment, in the format of YYYY/MM/DD HH:MM:SS like 2024/1/29 10:16:33. If the stream rate is disabled, this must be provided by the user. Otherwise, it is calculated based on other information and is not directly given by the user. It is calculated based on the start time, number of payments, and time interval and cannot be omitted.
      "number_of_time": 4, // Number of payments, only required when the stream rate is enabled.
      "token_amount_per_time": 4, // Number of tokens per payment, only required when the stream rate is enabled.
      "time_interval": "second" // Time interval of payment, only required when the stream rate is enabled. Limited to second/minute/hour/day/month.
  }
  """`

  await check_account(account);

  // Add a Message to the Thread
  try {

    console.log('account:', account)
    console.log('msg:', msg)
    const message = await openai.beta.threads.messages.create(threadByAccount[account], {
      role: "user",
      content: msg
      // "Please send 10 USDT to Bob on the 1st of every month for 12 months.",
    })

    console.log("This is the message object: ", message, "\n");


    const _my_run = await openai.beta.threads.runs.create(
      threadByAccount[account],
      {

        assistant_id: assistantIdToUse,
        instructions: instructions,
        tools: [
          { type: "code_interpreter" },
        ],
      }
    );
    console.log("This is the run object: ", _my_run, "\n");

    // Periodically retrieve the Run to check on its status
    const retrieveRun = async () => {
      let keepRetrievingRun;

      while (_my_run.status !== "completed") {

        const threadId = threadByAccount[account];
        keepRetrievingRun = await openai.beta.threads.runs.retrieve(threadId, _my_run.id);

        console.log(`Run status: ${keepRetrievingRun.status}`);

        if (keepRetrievingRun.status === "completed") {
          console.log("\n");
          break;
        }
      }
    };

    await retrieveRun();

    const waitForAssistantMessage = async () => {
      // await retrieveRun();

      const allMessages = await openai.beta.threads.messages.list(
        threadByAccount[account] // Use the stored thread ID for this user
      );

      return {
        _status: 200,
        _msg: allMessages.data[0].content[0].text.value
      }
    };

    return await waitForAssistantMessage();
  } catch (error) {
    console.error("Error:", error);
    // res.status(500).json({ error: "Internal server error" });
    return { _status: 500, _msg: 'Internal server error' }

  }

}

// jimmy
async function subscription_chat(account: string, msg: string): Promise<{ _msg: any, _status: number }> {

  const assistantIdToUse = "asst_q7h02i7cgwbQ9oifXtSFMyyi";               // Replace with your assistant ID
  const instructions = `SYSTEM_PROMPT = """
  You are finance expert and operator for MoveFlow, you are good at generating monthly financial report for crypto companies, and you will let users subscribe for your financial report services.
  
  User will talk to you about 4 things: 
  (1)ask you for a self-introduction 
  (2)let you generate monthly financial reports for crypto companies
  (3)confirm the financial report format
  (4)confirm the subscription details
  
  Answer Requirements:
  (1) if the user wants you to do a self introduction, you will answer: "Hello! I am Jimmy, specializing on corporate financial management"
  (2) if the user ask you to generate monthly financial report, 你会给客户一个标准上市公司财务报表的格式，以moveflow为案例呈现。 
  (3) Once the client confirm the format, you will say: "For the service subscription, how about 1000 USDT per month?" 
  (4) once the client confirm the subscription details, you will first say: "This is my subscription checkout, please sign it when you are convenient."
  Then give the following subscription details，please use the following format to output subscription details. Only give me the json object, do not give me anything else.
  \`
  {
      "transaction_name": "Monthly Service fee for financial management",
      "Network": "BSC Chain",
      "Token": "USDT",
      “Sender": Troy,
      "Receiver": Jimmy (0x65e6b348769D62397eC3aa485519Cbf1aB3eCfcF),
      "start_time": "2024/3/10 00:00:00",
      "end_time": "2024/12/1 00:00:00",
      "number_of_time": 12,
      "token_amount_per_time": 0.01,
      "time_interval": "month" 
  }\`
  """ `
  // const account = req.query.account;                                       // You should include the user ID in the request
  // const msg = req.query.msg;



  await check_account(account);


  // Add a Message to the Thread
  try {

    console.log('user:', account)
    console.log('msg:', msg)
    const message = await openai.beta.threads.messages.create(threadByAccount[account], {
      role: "user",
      content: msg
    })

    console.log("This is the message object: ", message, "\n");

    const _my_run = await openai.beta.threads.runs.create(
      threadByAccount[account],                                       // Use the stored thread ID for this user
      {

        assistant_id: assistantIdToUse,
        instructions: instructions,
        tools: [
          { type: "code_interpreter" },
        ],
      }
    );
    console.log("This is the run object: ", _my_run, "\n");

    const retrieveRun = async () => {
      let keepRetrievingRun;

      while (_my_run.status !== "completed") {

        const threadId = threadByAccount[account];
        console.log('threadId,:', threadId)
        keepRetrievingRun = await openai.beta.threads.runs.retrieve(threadId, _my_run.id);

        console.log(`Run status: ${keepRetrievingRun.status}`);

        if (keepRetrievingRun.status === "completed") {
          console.log("\n");
          break;
        }
      }
    };

    await retrieveRun();

    const waitForAssistantMessage = async () => {
      await retrieveRun();
      const allMessages = await openai.beta.threads.messages.list(threadByAccount[account]);
      return {
        _status: 200,
        _msg: allMessages.data[0].content[0].text.value
      }
    };

    return  await waitForAssistantMessage();
  } catch (error) {
    console.error("Error:", error);
    return { _status: 500, _msg: 'Internal server error' }

  }

}

export default async function index(req: NextApiRequest, res: NextApiResponse<any>) {

  (BigInt.prototype as any).toJSON = function () { return this.toString() };

  await runMiddleware(req, res, cors)

  const { method } = req
  console.log('method', method)
  // switch (method) {
  // 获取地址
  // case 'POST':
  try {
    const { body, query } = req
    let result;
    console.log('body:', body)

    let { account, msg } = body
    let _name: String = query.name as string;
    console.log('_name:', _name, ', msg', msg)
    if (_name == 'sarah') {

      let _res = await payment_chat(account, msg);

      if (_res._status != 200) {
        res.status(200).json({ error: _res._msg });
      } else {
        res.status(200).json({ result: _res._msg });

      }


    } else if (_name == 'jimmy') {


      let _res = await subscription_chat(account, msg);

      if (_res._status != 200) {
        res.status(_res._status).json({ error: _res._msg })
      }
      else {
        res.status(200).json({ result: _res._msg });

      }
      // res.status(200).json({ result: _res._msg });

    } else {
      res.status(500).json({ error: 'chat name only support sarah or jimmy . ' });
      // res.status(200).json({ result });
    }

    
  } catch (ex) {
    res.status(500).json({ error: (ex as any).message });
  }
  //   break;

  // default:
  //   res.setHeader('Allow', ['GET', 'POST'])
  //   res.status(405).end(`Method ${method} Not Allowed`);
  //   break;
  // }

  // res.end();

}
