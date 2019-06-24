'use strict';

const config = require('./config');

const lists = {};

const get = (id) => {
    if (lists[id]) {
        const list = lists[id];

        return list[0];
    }

    return null;
};

const getRandom = (id) => {
    if (lists[id]) {
        const list = lists[id];

        return list[Math.floor(Math.random() * list.length)];
    }

    return null;
};

const add = (id, player, onDone, onPlayerExist, onListFull) => {
    if (!lists[id]) {
        lists[id] = [];
    }

    const list = lists[id];

    for (const i in list) {
        if (list[i].id === player.id) {
            return onPlayerExist(list);
        }
    }

    if (list.length < config.multiplayerMaxPlayer) {
        list.push(player);
    } else {
        return onListFull(list);
    }

    return onDone(list);
};

const remove = (id, player, onDone, onPlayerNotExist) => {
    if (lists[id]) {
        const list = lists[id];

        for (const i in list) {
            if (list[i].id === player.id) {
                list.splice(i, 1);

                if (!list.length) {
                    delete lists[id];
                }

                return onDone(list);
            }
        }
    }

    return onPlayerNotExist();
};

// const shuffle = (id, onDone, onNotMultiplayer) => {
//     if (lists[id]) {
//         const list = lists[id];

//         for (let i = list.length - 1; i >= 0; i -= 1) {
//             const j = Math.floor(Math.random() * (i + 1));
//             const first = list[i];
//             const second = list[j];

//             list[i] = second;
//             list[j] = first;
//         }

//         return onDone();
//     }

//     return onNotMultiplayer();
// };

const clear = (id, onDone, onNotMultiplayer) => {
    if (lists[id]) {
        delete lists[id];

        return onDone();
    }

    return onNotMultiplayer();
};

const verify = (id, player, onValid, onNotValid) => {
    if (lists[id]) {
        const list = lists[id];

        if (!list.length) {
            return onValid();
        }

        if (list[0].id === player.id) {
            list.push(list.shift());

            return onValid();
        }

        return onNotValid();
    }

    return onValid();
};

module.exports = {
    get: get,
    getRandom: getRandom,
    add: add,
    remove: remove,
    // shuffle: shuffle,
    clear: clear,
    verify: verify,
};
