
/**
 * Defaultize an object by filling the missing fields from the default object
 * @param defaultObj the default object of type `T`
 * @param customObj the user input for type `T`
 */
export function defaults<T>(defaultObj : T, customObj : T) : T{
    return{
        ...defaultObj,
        ...customObj
    }
}


export function toArray(input : any | any[]){
    if(Array.isArray(input)){
        return input
    }else{
        return [input]
    }
}


export function toRegExp(input : string | RegExp){
    if(typeof input == 'string'){
        return new RegExp(`^${input}$`)
    }else{
        return input
    }
}