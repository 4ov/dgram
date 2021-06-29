import type { Options, Callback, UpdateType, Rule, UpdateSubtype } from './types.ts'
import { defaults as defaultize, toArray, toRegExp } from './utils/misc.ts'
import defaults from './defaults.ts'
import Middleware from './utils/middleware.js'
import Telegram from './telegram.ts'
import { Update } from './telegram-types.ts'
import { getUpdateType, getUpdateSubtype, matchRule } from './utils/detect.ts'

import Context from './context.ts'

export default class Dgram {
    private options: Options
    private token: string
    private middlewares: Callback[] = []
    private rules: Rule[] = []
    private offset = 0;
    telegram: Telegram;

    onUpdate : ((update : Update)=> void) | null = null

    constructor(token: string, options: Options = {}) {
        this.options = defaultize(defaults.options, options)
        this.token = token
        this.telegram = new Telegram(this.token)
    }


    use(...fns: Callback[]) {
        const self = this
        fns.forEach(fn => this.middlewares.push(fn))
    }

    on(type: UpdateType | UpdateType[], ...fns: Callback[]) {
        type = toArray(type)
        type.forEach(type => {
            this.rules.push({
                type,
                subType: null,
                text: null,
                callbacks: fns
            })
        })
    }


    type(type: UpdateSubtype | UpdateSubtype[], ...fns: Callback[]) {
        type = toArray(type)
        type.forEach(type => {
            this.rules.push({
                type: null,
                subType: type,
                text: null,
                callbacks: fns
            })
        })
    }


    text(input: (string | RegExp) | (string | RegExp)[], ...fns: Callback[]) {
        input = toArray(input).map(inp => toRegExp(inp))

        input.forEach((inp: any) => {
            this.rules.push({
                text: inp,
                type: null,
                subType: 'text',
                callbacks: fns
            })
        })


    }


    private invokeMiddleware(ctx : Context) {
        let mid = new Middleware()
        this.middlewares.forEach(mw => mid.use(mw))
        mid.go(ctx, () => { })
    }


    private handle(update: Update) {
        this.onUpdate?.(update)
        const self = this
        let updateType = getUpdateType(update)
        let updateSubtype = getUpdateSubtype(update, updateType)

        const context = new Context(this, update, { updateType, updateSubtype })


        this.rules.forEach(rule => {
            let matched = matchRule(update, rule, updateType, updateSubtype)
            if (matched) {
                self.invokeMiddleware(context)
                rule.callbacks.forEach(callback => {
                    callback(context)
                })
            }


        })

        this.offset = update.update_id + 1



    }







    async poll() {
        let url = new URL(this.telegram.url)
        url.pathname = `${url.pathname}/getUpdates`
        url.searchParams.set('timeout', `${this.options.timeOut}`)
        url.searchParams.set('offset', `${this.offset}`)

        let req = await this.telegram.fetcher(url)

        if (req.status == 502) {
            await this.poll();
        } else if (req.status != 200) {

            console.error(await req.json())
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.poll()
        } else {
            let data = await req.json()
            data.ok ? data.result.forEach((req: any) => {

                this.handle(req)
            }) : console.error(data)
            await this.poll()
        }
    }
}



