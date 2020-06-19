const socket = io.connect('http://localhost:3076');
const animation_running = () => !!mixer && mixer._actions.some(action => action.isRunning());
let interval, trigger;

socket.on('truck_start', (data) => {
    if (animation_running()) return socket.emit('truck_pending');
    trigger = true;
    goAction(data);
});

interval = setInterval(() => {
    if (!animation_running() && trigger) {
        console.log('truck_fulfilled');
        socket.emit('truck_fulfilled')
        trigger = false;
    }
}, 20);
