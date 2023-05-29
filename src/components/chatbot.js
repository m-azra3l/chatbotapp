import React, {Component} from 'react';
import axios from 'axios';
import './chatbot.css';
import botImage from '../images/image1.jpg';
import userImage from '../images/image3.jpg';
import diImage from '../images/image2.jpg';
import uImage from '../images/image4.jpg';

class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userInput: ''
    };
    
  }
  
  componentDidMount() {
  // Add initial message from bot to messages list
  this.setState({
    messages: [...this.state.messages, {
      sender: "bot",
      content: "Welcome to the chatbot, how can I help you?",
      image: botImage
    }]
  });
}

  handleInputChange = (event) => {
    this.setState({ userInput: event.target.value });
  }

  handleSendMessage = async () => {
    const { userInput, messages } = this.state;
    const apiKey = process.env.REACT_APP_AI_KEY;
    const endPoint = 'https://api.openai.com/v1/chat/completions';
    const model = 'gpt-3.5-turbo';
    const  headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    const data = {
      'model': model,
      'messages': [{"role": "user", "content": userInput}]
    };

    // Add user message to the chat
    const updatedMessages = [...messages, { content: userInput, sender: 'user', image: userImage }];
    this.setState({ messages: updatedMessages, userInput: '' });
  
    try {
      // Send API call to OpenAI's ChatGPT API endpoint
      const response = await axios.post(endPoint, data, {headers});
  
      // Add AI-generated response to the chat
      const aiResponse = response.data.choices[0].message.content;
      const updatedMessagesWithAI = [...updatedMessages, { content: aiResponse, sender: 'bot', image: botImage }];
      this.setState({ messages: updatedMessagesWithAI });
      console.log(aiResponse);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  }

  handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.handleSendMessage();
    }
  }

  renderMessages = () => {
    const { messages } = this.state;

    return messages.map((message, index) => (
      <div key={index} className={`message ${message.sender}`}>
        {message.image && <img src={message.image} alt="User or AI" />}
        <div className="message-content">{message.content}</div>
      </div>
    ));
  }

  render() {
    const { userInput } = this.state;

    return (
      
      <div className="container">
         <div className="welcome-side">
          <p className="welcome-text">Welcome to our intelligent Chatbot Platform! Our AI-powered chatbot offers assistance, information, and engaging conversations. Interact seamlessly, get relevant answers, and enjoy a human-like experience. Explore the capabilities, ask questions, and unleash the power of AI. Start chatting now for an exceptional experience!</p>
          <div className="welcome-images">
            <img src={diImage} alt="Welcome 1"/>
            <img src={uImage} alt="Welcome 2"/>
          </div>
        </div>
        <div className="chatbot-container">
          <div className="messages-container">{this.renderMessages()}</div>
            <div className="input-container">
                <input
                type="text"
                value={userInput}
                onChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                placeholder="Type your message..."
                />
                <button onClick={this.handleSendMessage}>Send</button>
            </div>
        </div>
      </div>
    );
  }
}

export default Chatbot;
