import { User, Message, SendMessage, ForwardMessage, CopyMessage, SendPhoto, SendAudio, SendDocument, SendVideo, SendAnimation, SendVoice, SendVideoNote, SendLocation, EditMessageLiveLocation, StopMessageLiveLocation, SendVenue, SendContact, SendPoll, SendDice, SendChatAction, GetUserProfilePhotos, KickChatMember, UnbanChatMember, RestrictChatMember, PromoteChatMember, SetChatAdministratorCustomTitle, SetChatPermissions, ExportChatInviteLink, GetUpdates, Update, EditMessageText, DeleteMessage, SetMyCommands } from './telegram-types.ts'
import urlcat from 'https://esm.sh/urlcat'

export default class Telegram {
    private baseUrl = 'https://api.telegram.org/bot'
    url(method: string, params: object) {
        let u = urlcat(`https://api.telegram.org/bot:token/:method`, {
            method,
            ...params,
            token: this.token
        })
        return u;
        
    }
    token: string;
    onRequest: Function | undefined
    fetcher: typeof fetch
    constructor(token: string, fetcher: (typeof fetch) = fetch) {
        this.token = token
        this.fetcher = fetcher

    }

    Get(methodName: string, params: Object = {}) {
        return new Promise(async (res, rej) => {
            let url = this.url(methodName, params)
            this?.onRequest?.({
                url: url,
                params
            })

            let result = await fetch(url)
                .then(d => d.json())
                //! remove if it is not beta
                .catch(err => rej(err))
            if (result.ok == true) {
                res(result.result)
            } else {
                rej(result)
            }
        })
    }

    async Post(methodName: string, params: Object | FormData) {
        return new Promise(async (res, rej) => {
            let url = this.url(methodName, {})
            let body = params instanceof FormData ? params : new FormData()
            if (!(params instanceof FormData)) {
                Object.entries(params).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        body.append(key, value[0], value[1])
                    } else {
                        body.append(key, value)
                    }
                })
            }

            this?.onRequest?.({
                url: url,
                params
            })
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    connection: 'keep-alive'
                },
                body
            }).then(d => d.json())
                //! remove if it is not beta
                .catch(err => {
                    rej(err)

                })
            if (result.ok) {
                res(result.result)
            } else {
                rej(result)
            }
        })
    }




    //--- methods ---//
    async getMe(): Promise<User> {
        return await this.Get('getMe') as any
    }

    async getUpdates(config: GetUpdates): Promise<Update[]> {
        return await this.Get('getUpdates') as any
    }


    async sendMessage(config: SendMessage): Promise<Message> {
        return await this.Get('sendMessage', config) as any
    }

    async editMessageText(config: EditMessageText): Promise<Message> {
        return await this.Get('editMessageText', config) as any
    }

    async deleteMessage(config: DeleteMessage): Promise<Message> {
        return await this.Get('deleteMessage', config) as any
    }



    async forwardMessage(config: ForwardMessage): Promise<Message> {
        return await this.Get('forwardMessage', config) as any
    }

    async copyMessage(config: CopyMessage): Promise<Message> {
        return await this.Get('copyMessage', config) as any
    }

    async sendPhoto(config: SendPhoto, filename?: string): Promise<Message> {
        if (filename) {
            config.photo = [config.photo, filename]
        }
        return await this.Post('sendPhoto', config) as any
    }

    async sendAudio(config: SendAudio): Promise<Message> {
        return await this.Post('sendAudio', config) as any
    }

    async sendDocument(config: SendDocument): Promise<Message> {
        return await this.Post('sendAudio', config) as any
    }

    async sendVideo(config: SendVideo): Promise<Message> {
        return await this.Post('sendVideo', config) as any
    }

    async sendAnimation(config: SendAnimation): Promise<Message> {
        return await this.Post('sendAnimation', config) as any
    }

    async sendVoice(config: SendVoice): Promise<Message> {
        return await this.Post('sendVoice', config) as any
    }

    async sendVideoNote(config: SendVideoNote): Promise<Message> {
        return await this.Post('sendVideoNote', config) as any
    }

    async sendMediaGroup() {
        throw new Error('not implemented')
    }

    async sendLocation(config: SendLocation): Promise<Message> {
        return await this.Get('sendLocation', config) as any
    }

    async editMessageLiveLocation(config: EditMessageLiveLocation): Promise<Message> {
        return await this.Get('editMessageLiveLocation', config) as any
    }

    async stopMessageLiveLocation(config: StopMessageLiveLocation): Promise<Message> {
        return await this.Get('stopMessageLiveLocation', config) as any
    }

    async sendVenue(config: SendVenue): Promise<Message> {
        return await this.Get('sendVenue', config) as any
    }

    async sendContact(config: SendContact): Promise<Message> {
        return await this.Get('sendContact', config) as any
    }

    async sendPoll(config: SendPoll): Promise<Message> {
        return await this.Get('sendPoll', config) as any
    }

    async sendDice(config: SendDice): Promise<Message> {
        return await this.Get('sendDice', config) as any
    }

    async sendChatAction(config: SendChatAction): Promise<Message> {
        return await this.Get('sendChatAction', config) as any
    }

    async getUserProfilePhotos(config: GetUserProfilePhotos): Promise<Message> {
        return await this.Get('getUserProfilePhotos', config) as any
    }

    async getFile() {
        throw new Error('not implemented')
    }

    async banChatMember(config: KickChatMember): Promise<Message> {
        return await this.Get('banChatMember', config) as any
    }

    async unbanChatMember(config: UnbanChatMember): Promise<Message> {
        return await this.Get('unbanChatMember', config) as any
    }

    async restrictChatMember(config: RestrictChatMember): Promise<Message> {
        return await this.Get('restrictChatMember', config) as any
    }

    async promoteChatMember(config: PromoteChatMember): Promise<Message> {
        return await this.Get('promoteChatMember', config) as any
    }

    async setChatAdministratorCustomTitle(config: SetChatAdministratorCustomTitle): Promise<Message> {
        return await this.Get('setChatAdministratorCustomTitle', config) as any
    }

    async setChatPermissions(config: SetChatPermissions): Promise<Message> {
        return await this.Get('setChatPermissions', config) as any
    }

    async setMyCommands(config: SetMyCommands) {
        return await this.Get('setMyCommands', config)
    }


}



