const initState = {
    cnt: 4,
    won: false,
    lost: false,
    defuse: 0,
    start:false,
    shuffle:false,
    msg:'Press start to begin',
    username:null
}

const gameReducer = (state = initState, action) => {
    switch(action.type){
        case 'cat':
            const newState = {
                ...state,
                cnt: state.cnt - 1,
                msg: 'Nice!'
            }
            if(newState.cnt < 0 )
                return {
                ...newState,
                won: true,
            }
            return newState;
        case 'defuse':
            return {
                ...state,
                cnt: state.cnt - 1,
                defuse: state.defuse + 1,
                won : state.cnt - 1 < 0 ? true : false,
                msg: `You have ${state.defuse+1} defuse card(s).`

            }
        case 'explode':
            if (state.defuse > 0)
                return {
                ...state, 
                cnt: state.cnt - 1,
                defuse:state.defuse - 1,
                won: state.cnt - 1 < 0 ? true : false,
                msg:`One defuse card has been used. You have ${state.defuse-1} defuse card(s) left.`
            }
            else{
                return {
                    ...state, 
                    lost:true,
                    msg:'You have lost :(..... Press start for another game.'
                }
            }
        case 'shuffle':
            return {
                ...initState,
                shuffle:action.value,
                start:true,
                msg: 'From the beginning :)'
            };

        case 'start':
            return {
                ...state,
                start: true,
                msg:'Click on the deck'
            }
        case 'login':
            return {
                ...state,
                username:action.username
            }
        case 'logout':
            return {
                ...initState,
                username:null
            }

        default: return state;
    }
}

export default gameReducer;