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
    private rules: Rule[] = []
    private offset = 0;
    telegram: Telegram;

    onUpdate: ((update: Update) => void) | null = null

    constructor(token: string, options: Options = {}) {
        this.options = defaultize(defaults.options, options)
        this.token = token
        this.telegram = new Telegram(this.token)
    }


    use(...fns: Callback[]) {

        const self = this
        self.rules.push({
            type: null,
            subType: null,
            text: null,
            callbacks: fns
        })
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





    handle(update: Update) {
        this.onUpdate?.(update)
        const self = this
        let updateType = getUpdateType(update)
        let updateSubtype = getUpdateSubtype(update, updateType)
        const context = new Context(this, update, { updateType, updateSubtype })


        const passedRules = this.rules.filter(rule => {
            if (rule) {
                let [matched, result] = matchRule(update, rule, updateType, updateSubtype)
                if (matched) {
                    return true
                }
            }

        })

        function go(id = 0) {
            function next() {
                go(id + 1)
            }
            const rule = passedRules[id]
            let [, result] = matchRule(update, rule, updateType, updateSubtype)
            context.result = result
            rule?.callbacks.forEach(callback => {
                try {
                    callback(context, next)
                } catch (err) {
                    console.log(err)
                }
            })
        }

        go()

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



