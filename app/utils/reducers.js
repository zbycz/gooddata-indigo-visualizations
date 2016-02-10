// generates a reducer that is equivalent to calling specified reducers in sequence
let compose = (reducers) =>
    (state, action) => reducers.reduce((transientState, reducer) => reducer(transientState, action), state);

// generates a reducer that processes the a state object in the shape of the corresponding
// map. Each non-object property is assumed to be a reducer function, which will be
// called to generate the corresponding modified state path
let combine = (map) =>
    (state, action) => {
        let transientState = state;
        Object.keys(map).forEach(name => {
            let reducer = (typeof map[name] === 'object' ? combine(map[name]) : map[name]);
            transientState = transientState.set(name, reducer(transientState.get(name), action));
        });
        return transientState;
    };

export { compose, combine };
