const socket = io.connect('http://localhost:3076');
const animation_running = () => !!mixer && mixer._actions.some(action => action.isRunning());
let interval, trigger, coor = null, action = '';

socket.on('truck_start', data => {
    if (animation_running()) return socket.emit('truck_pending');
    action = 'truck_start';
    trigger = true;
    coor = { col: data.col, row: data.row };
    goAction(data);
});

socket.on('truck_takeoff', data => {
    if (animation_running()) return socket.emit('truck_pending');
    action = 'truck_takeoff';
    trigger = true;
    coor = { col: data.col, row: data.row };
    goAction(data, true);
});

interval = setInterval(() => {
    if (!animation_running() && trigger) {
        socket.emit('truck_fulfilled', { ...coor, takeoff: action === 'truck_takeoff' ? true : false });
        trigger = false;
        coor = null;
    }
}, 20);
