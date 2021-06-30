import { Update, SendMessage, Message, SendAudio, EditMessageText } from './telegram-types.ts'
import Dgram from './dgram.ts'
import { ContextExtra, UpdateType, UpdateSubtype } from './types.ts'


export default class Context {
    update: Update
    dgram: Dgram
    private extra : ContextExtra
    updateType : UpdateType
    updateSubtype : UpdateSubtype
    result : boolean | RegExpExecArray | null | undefined
    constructor(dgram: Dgram, update: Update, extra : ContextExtra) {
        this.dgram = dgram
        this.update = update
        this.extra = extra
        this.updateType = extra.updateType
        this.updateSubtype = extra.updateSubtype
        //this.result = extra.result
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

    async delete(){
        let message = (this.update[this.extra.updateType] as Message)
        return await this.dgram.telegram.deleteMessage({
            chat_id : message.chat.id,
            message_id : message.message_id
        })
    }

    async editMessageText(message_id : number, text : string, extra? : Omit<EditMessageText, "message_id" | "text">){
        let message = (this.update[this.extra.updateType] as Message)
        return await this.dgram.telegram.editMessageText({
            text,
            message_id,
            chat_id : message.chat.id

        })
    }

    


    
}