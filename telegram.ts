import { User, Message, SendMessage, ForwardMessage, CopyMessage, SendPhoto, SendAudio, SendDocument, SendVideo, SendAnimation, SendVoice, SendVideoNote, SendLocation, EditMessageLiveLocation, StopMessageLiveLocation, SendVenue, SendContact, SendPoll, SendDice, SendChatAction, GetUserProfilePhotos, KickChatMember, UnbanChatMember, RestrictChatMember, PromoteChatMember, SetChatAdministratorCustomTitle, SetChatPermissions, ExportChatInviteLink, GetUpdates, Update } from './telegram-types.ts'


export default class Telegram {
    private baseUrl = 'https://api.telegram.org/bot'
    get url() { return `${this.baseUrl}${this.token}` }
    token: string;
    fetcher: typeof fetch
    constructor(token: string, fetcher: (typeof fetch) = fetch) {
        this.token = token
        this.fetcher = fetcher

    }

    async Get(methodName: string, params: Object = {}) {
        let url = new URL(this.url)
        url.pathname = `${url.pathname}/${methodName}`
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value)
        })


        let result = await fetch(url.toString())
            .then(d => d.json())
        if (result.ok == true) {
            return result.result
        } else {
            return Promise.reject(result)
        }
    }

    async Post(methodName: string, params: Object | FormData) {
        let url = new URL(this.url)
        url.pathname = `${url.pathname}/${methodName}`
        let body = params instanceof FormData ? params : new FormData()
        if(!(params instanceof FormData)){
            Object.entries(params).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    body.append(key, value[0], value[1])
                } else {
                    body.append(key, value)
                }
            })
        }

       
       
        
        

        const result = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                connection: 'keep-alive'
            },
            body
        }).then(d => d.json())
        if (result.ok) {
            return result.result
        } else {
            return Promise.reject(result)
        }
    }





    async getMe(): Promise<User> {
        return await this.Get('getMe')
    }

    async getUpdates(config : GetUpdates): Promise<Update[]>{
        return await this.Get('getUpdates')
    }


    async sendMessage(config: SendMessage): Promise<Message> {
        return await this.Get('sendMessage', config)
    }

    async forwardMessage(config: ForwardMessage): Promise<Message> {
        return await this.Get('forwardMessage', config)
    }

    async copyMessage(config: CopyMessage): Promise<Message> {
        return await this.Get('copyMessage', config)
    }

    async sendPhoto(config: SendPhoto, filename?: string): Promise<Message> {
        if (filename) {
            config.photo = [config.photo, filename]
        }
        return await this.Post('sendPhoto', config)
    }

    async sendAudio(config: SendAudio): Promise<Message> {
        return await this.Post('sendAudio', config)
    }

    async sendDocument(config: SendDocument): Promise<Message> {
        return await this.Post('sendAudio', config)
    }

    async sendVideo(config: SendVideo): Promise<Message> {
        return await this.Post('sendVideo', config)
    }

    async sendAnimation(config: SendAnimation): Promise<Message> {
        return await this.Post('sendAnimation', config)
    }
    
    async sendVoice(config: SendVoice): Promise<Message> {
        return await this.Post('sendVoice', config)
    }
    
    async sendVideoNote(config: SendVideoNote): Promise<Message> {
        return await this.Post('sendVideoNote', config)
    }

    async sendMediaGroup(){
        throw new Error('not implemented')
    }

    async sendLocation(config: SendLocation): Promise<Message> {
        return await this.Get('sendLocation', config)
    }
    
    async editMessageLiveLocation(config: EditMessageLiveLocation): Promise<Message> {
        return await this.Get('editMessageLiveLocation', config)
    }
    
    async stopMessageLiveLocation(config: StopMessageLiveLocation): Promise<Message> {
        return await this.Get('stopMessageLiveLocation', config)
    }
    
    async sendVenue(config: SendVenue): Promise<Message> {
        return await this.Get('sendVenue', config)
    }
    
    async sendContact(config: SendContact): Promise<Message> {
        return await this.Get('sendContact', config)
    }
    
    async sendPoll(config: SendPoll): Promise<Message> {
        return await this.Get('sendPoll', config)
    }
   
    async sendDice(config: SendDice): Promise<Message> {
        return await this.Get('sendDice', config)
    }
   
    async sendChatAction(config: SendChatAction): Promise<Message> {
        return await this.Get('sendChatAction', config)
    }
    
    async getUserProfilePhotos(config: GetUserProfilePhotos): Promise<Message> {
        return await this.Get('getUserProfilePhotos', config)
    }

    async getFile(){
        throw new Error('not implemented')
    }
    
    async banChatMember(config: KickChatMember): Promise<Message> {
        return await this.Get('banChatMember', config)
    }
    
    async unbanChatMember(config: UnbanChatMember): Promise<Message> {
        return await this.Get('unbanChatMember', config)
    }
    
    async restrictChatMember(config: RestrictChatMember): Promise<Message> {
        return await this.Get('restrictChatMember', config)
    }
    
    async promoteChatMember(config: PromoteChatMember): Promise<Message> {
        return await this.Get('promoteChatMember', config)
    }
    
    async setChatAdministratorCustomTitle(config: SetChatAdministratorCustomTitle): Promise<Message> {
        return await this.Get('setChatAdministratorCustomTitle', config)
    }
    
    async setChatPermissions(config: SetChatPermissions): Promise<Message> {
        return await this.Get('setChatPermissions', config)
    }
    
    // async exportChatInviteLink(config: ExportChatInviteLink): Promise<Message> {
    //     return await this.Get('exportChatInviteLink', config)
    // }
    
    // async createChatInviteLink(config: ExportChatInviteLink): Promise<Message> {
    //     return await this.Get('createChatInviteLink', config)
    // }
    


}


