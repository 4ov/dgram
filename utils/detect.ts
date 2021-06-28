import { Update, Message } from '../telegram-types.ts'

import { updateTypes, UpdateType, updateSubtypes, Rule, UpdateSubtype } from '../types.ts'

export function getUpdateType(update: Update) {
    let type = updateTypes.filter(type => {
        return update[type]
    })[0]
    return type
}


export function getUpdateSubtype(update: Update, updateType: UpdateType) {
    let y = (update[updateType]) as any

    let type = updateSubtypes.filter((type) => {
        return y[type]
    })[0]

    return type

}




export function matchRule(update : Update, rule : Rule, updateType : UpdateType, updateSubtype : UpdateSubtype){
    return [
        rule.type == updateType || rule.type == null,
        rule.subType == updateSubtype || rule.subType == null,
        rule.subType == 'text' && rule.text?.test((update[updateType] as Message).text || "")
    ].every(a=>a)
}