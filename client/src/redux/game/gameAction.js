export const flipCard = (name) => {
    return {
        type: name
    }
}


export const startGame = () => {
    return {
        type:'start'
    }
}

export const shuffleCards = (value) => {
    return {
        type:'shuffle',
        value:value
    }
}

export const log = (username) => {
    return{
        type:'login',
        username:username
    }
}

export const setState = (state) => {
    return {
        type:'state',
        state:state
    }
}

export const lBoardUpdate = (value) => {
    return {
        type:'lBoard',
        value:value
    }
}

