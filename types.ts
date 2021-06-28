import Context from './context.ts'

export interface Options {
    timeOut?: number;
}



export type Callback = (ctx: Context, next?: Function) => void;

export interface Rule {
    type: UpdateType | null;
    subType: UpdateSubtype | null;
    text : RegExp | null
    callbacks: Callback[]
}

//custom telegram types

export const updateTypes = [
    "message"
    , "edited_message"
    , "channel_post"
    , "edited_channel_post"
    , "inline_query"
    , "chosen_inline_result"
    , "callback_query"
    , "shipping_query"
    , "pre_checkout_query"
    , "poll"
    , "poll_answer",
] as const

export type UpdateType = typeof updateTypes[number]

export const updateSubtypes = [
    "text",
    "animation",
    "audio",
    "document",
    "photo",
    "sticker",
    "video",
    "video_note",
    "voice",
    "contact",
    "dice",
    "game",
    "poll",
    "venue",
    "location",
    "new_chat_members",
    "left_chat_member",
    "new_chat_title",
    "new_chat_photo",
    "delete_chat_photo",
    "group_chat_created",
    "supergroup_chat_created",
    "channel_chat_created",
    "pinned_message",
    "invoice",
    "successful_payment",
    "connected_website",
    "passport_data",
    "proximity_alert_triggered",
    //"reply_markup", ! need to be revesioned
    //"migrate_to_chat_id", ! need to be revesioned   
] as const

export type UpdateSubtype = typeof updateSubtypes[number]


export interface ContextExtra {
    updateType : UpdateType
    updateSubtype : UpdateSubtype
}