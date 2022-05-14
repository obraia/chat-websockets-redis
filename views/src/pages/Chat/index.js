import React, { useState, useEffect, useRef } from 'react';
import { lighten, desaturate, getContrast } from 'polished';
import { v4 as uuidv4 } from 'uuid';

import UserPersistedState from '../../utils/userPersistedState';
import socket from '../../services/socket';

import {
  Container,
  MessageContainer,
  Message,
  MessageUser,
  MessageText,
  MessageDate,
  InputGroup,
  InputText,
  LabelInput,
  InputMessage,
  SendButtonInput,
} from './styles';

function Chat() {
  const [username, setUsername] = UserPersistedState('username', '');
  const [messageColor, setMessageColor] = UserPersistedState('messageColor', '');
  const [textColor, setTextColor] = UserPersistedState('textColor', '');
  const [messages, setMessages] = useState([]);

  const messageContainer = useRef();
  const messageText = useRef();

  useEffect(() => {
    socket.on('recoveryMessages', messages => {
      setMessages([...messages]);
      scrollToBottom();
    });

    socket.on('recivedMessage', message => {
      message.from = 'others';
      setMessages(messages => [...messages, message]);
      scrollToBottom();
    });
  }, []);

  useEffect(() => {
    if (!messageColor && !textColor) {
      const backgroundColor = getBackgroundColor();
      const textColor = getConstrastColor(backgroundColor);

      setMessageColor(backgroundColor);
      setTextColor(textColor);
    }
  }, [messageColor, setMessageColor, setTextColor, textColor]);

  async function handleSubmit(event) {
    event.preventDefault();

    const hours = new Date()
      .toTimeString()
      .replace(/.*(\d{2}:\d{2}:).*/, '$1')
      .slice(0, -1);

    const timestamp = new Date().getTime();

    const newMessage = {
      id: uuidv4(),
      username,
      text: messageText.current.value,
      backgroundColor: messageColor,
      textColor: textColor,
      hours,
      timestamp,
    };

    setMessages([...messages, newMessage]);

    socket.emit('sendMessage', newMessage);

    messageText.current.value = '';
  }

  function getBackgroundColor() {
    return desaturate(
      0.5,
      lighten(0.2, '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substring(0, 6))
    );
  }

  function getConstrastColor(color) {
    if (getContrast(color, '#fff') < 5.0) return '#3d3d3d';
    else return '#dedede';
  }

  function scrollToBottom() {
    messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
  }

  return (
    <Container autoComplete='off' onSubmit={handleSubmit}>
      <InputGroup>
        <LabelInput htmlFor='username'>Username</LabelInput>

        <InputText
          id='username'
          onChange={e => setUsername(e.target.value)}
          value={username}
          required
        />
      </InputGroup>

      <MessageContainer ref={messageContainer}>
        {messages.map(m => (
          <Message
            className={username === m.username ? 'my' : 'others'}
            key={m.id}
            style={{ background: m.backgroundColor }}
          >
            <MessageText style={{ color: m.textColor }}>
              <MessageUser>{m.username}:</MessageUser>
              {m.text}
            </MessageText>
            <MessageDate>{m.hours}</MessageDate>
          </Message>
        ))}
      </MessageContainer>

      <InputGroup>
        <InputMessage id='message' placeholder='Enviar mensagem...' ref={messageText} required />
        <SendButtonInput>Enviar</SendButtonInput>
      </InputGroup>
    </Container>
  );
}

export default Chat;
