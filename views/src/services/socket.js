import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_WS_URL, {});

socket.on('connect', () => {
  console.log('[IO] Connect => Connection established');
});

export default socket;
