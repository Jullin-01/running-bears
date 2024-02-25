import { FiniteStateMachine, State } from './finiteStateMachine.js';

export class Game {
    constructor() {
        console.log('Game constructor');
        this._Init();
    }

    _Init() {
        console.log('Game init');

        this._FSM = new GameFSM(this);
        this._FSM.SetState('loading');
    }   
    Update(timeElapsedSec, input) {
            this._FSM.Update(timeElapsedSec, input);
    }
};
    
class GameFSM extends FiniteStateMachine {
    constructor(game) {
        super();
        this._game = game;
        this._Init();
    }

    _Init() {
        this._AddState('loading', LoadingState);
        this._AddState('waiting', WaitingState);
        this._AddState('gameplay', GameplayState);
        this._AddState('pause', PauseState);
        this._AddState('finish', FinishState);
        this._AddState('end', EndState);
    }
};

class LoadingState extends State {
    constructor(parent) {
        super(parent, 'loading');
    }

    Enter() {
        console.log('LoadingState Enter()');
    }

    Exit() {
        console.log('LoadingState Exit()')
    }

    Update() {
        console.log('LoadingState Update()')
    }
};

class WaitingState extends State {
    constructor(parent) {
        super(parent, 'waiting');
    }

    Enter() {
        console.log('WaitingState Enter()')
    }

    Exit() {
        console.log('WaitingState Exit()')
    }

    Update() {
        console.log('WaitingState Update()')
    }
};

class GameplayState extends State {
    constructor(parent) {
        super(parent, 'gameplay');
    }

    Enter() {
        console.log('GameplayState Enter()')
    }

    Exit() {
        console.log('GameplayState Exit()')
    }

    Update() {
        console.log('GameplayState Update()')
    }
};

class PauseState extends State {
    constructor(parent) {
        super(parent, 'pause');
    }

    Enter() {
        console.log('PauseState Enter()')
    }

    Exit() {
        console.log('PauseState Exit()')
    }

    Update() {
        console.log('PauseState Update()')
    }
};

class FinishState extends State {
    constructor(parent) {
        super(parent, 'finish');
    }

    Enter() {
        console.log('FinishState Enter()')
    }

    Exit() {
        console.log('FinishState Exit()')
    }

    Update() {
        console.log('FinishState Update()')
    }
};

class EndState extends State {
    constructor(parent) {
        super(parent, 'end');
    }

    Enter() {
        console.log('EndState Enter()')
    }

    Exit() {
        console.log('EndState Exit()')
    }

    Update() {
        console.log('EndState Update()')
    }
};
