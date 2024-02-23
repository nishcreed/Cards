const initState = {
    cnt: 4,
    won: false,
    lost: false,
    defuse: false,
    start:false,
    shuffle:false
}

const gameReducer = (state = initState, action) => {
    switch(action.type){
        case 'cat':
            const newState = {
                ...state,
                cnt: state.cnt - 1
            }
            if(newState.cnt < 0 )
                return {...newState,won: true}
            return newState;
        case 'defuse':
            return {
                ...state,
                cnt: state.cnt - 1,
                defuse: true
            }
        case 'explode':
            if (state.defuse)
                return {...state, cnt: state.cnt - 1}
            else{
                return {...state, lost:true}
            }
        case 'shuffle':
            return {...initState,shuffle:action.value};

        
        case 'start':
            return {
                ...state,
                start: true
            }

        default: return state;
    }
}

export default gameReducer;