const socket = io.connect('http://localhost:3076');

socket.on('truck_start', () => goAction());
