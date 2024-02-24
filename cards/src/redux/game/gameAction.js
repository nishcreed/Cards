export const flipCard = (name) => {
    console.log(name)
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

