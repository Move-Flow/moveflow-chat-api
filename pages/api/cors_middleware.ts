import type { NextApiRequest, NextApiResponse } from 'next'

import Cors from 'cors';

export const cors = Cors({
    origin: '*',
    allowedHeaders: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    methods: "GET,OPTIONS,PATCH,DELETE,POST,PUT"
})

export function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {

    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}
