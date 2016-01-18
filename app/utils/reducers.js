// generates a reducer that is equivalent to calling specified reducers in sequence
let compose = (reducers) =>
    (state, action) => reducers.reduce((reducedState, reducer) => reducer(reducedState, action), state);

// generates a reducer that processes the a state object in the shape of the corresponding
// map. Each non-object property is assumed to be a reducer function, which will be
// called to generate the corresponding modified state path
let combine = (map) =>
    (state, action) => {
        let mutatedState = state;
        Object.keys(map).forEach(name => {
            let reducer = typeof map[name] === 'object' ? combine(map[name]) : map[name];
            mutatedState = mutatedState.set(name, reducer(mutatedState.get(name), action));
        });
        return mutatedState;
    };

export { compose, combine };
