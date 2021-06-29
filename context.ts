import { Update, SendMessage, Message, SendAudio } from './telegram-types.ts'
import Dgram from './dgram.ts'
import { ContextExtra, UpdateType, UpdateSubtype } from './types.ts'


export default class Context {
    update: Update
    dgram: Dgram
    private extra : ContextExtra
    updateType : UpdateType
    updateSubtype : UpdateSubtype
    constructor(dgram: Dgram, update: Update, extra : ContextExtra) {
        this.dgram = dgram
        this.update = update
        this.extra = extra
        this.updateType = extra.updateType
        this.updateSubtype = extra.updateSubtype
    }

    async reply(text : string, extra? : Omit<SendMessage, "chat_id" | "text" | "reply_to_message_id">){
        let message = (this.update[this.extra.updateType] as Message)
        return await this.dgram.telegram.sendMessage({
            text,
            chat_id : message.chat.id,
            reply_to_message_id : message.message_id,
            ...extra
        })
    }

    async replyAudio(text : string, extra? : Omit<SendAudio, "chat_id" | "audio" | "reply_to_message_id">){

    }


    
}