import type { NextApiRequest, NextApiResponse } from 'next'

// Fake users data
const tokens: any[] = [
  {"id":1, name: 'sui', network: 'sui_testnet', logo_uri: '', address: '0x2', description: '', supply: 1000 },
  {"id":2, name: 'sui', network: 'sui_testnet', logo_uri: '', address: '0x2', description: '', supply: 1000 },
  {"id":3, name: 'sui', network: 'sui_testnet', logo_uri: '', address: '0x2', description: '', supply: 1000 }
]

const handler = function (_req: NextApiRequest, res: NextApiResponse<any[]>) {

  // Get data from your database
  res.status(200).json(tokens)

}

export default handler