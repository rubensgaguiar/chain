import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Message } from './Message';
import { Messages} from "../../../lib/collections";
import { Mongo } from 'meteor/mongo';
import styled from "styled-components";

const MessagesBox = styled.div`
    height: 576px;
    width: 100%;
    overflow-y: auto;
    text-align:left;
    margin-bottom:24px;
    word-break: break-word;
`;

const PageWrapper = styled.div`
    height: 100%;
    margin-left: 10px;
    margin-right: 10px;
`;

export class MessageList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            mixins: [ReactMeteorData],
            messagesList: 'Please Wait...',
            numMessages: 0,
            chatRoomId: undefined,
        };
    };

    updateMessages = (messages) => {
        let messagesList;
        messagesList = (
            messages.map((message) => (
                <Message key={message._id} message={message} myUser={this.state.myUser}/>
            ))
        );

        this.setState(() => ({
            messagesList: messagesList,
        }));

        this.scrollDown();
    };


    test = () => {
        const chatRoomId = this.props.match.params.chatRoomId;
        const messages = Messages.find({chatRoomId: chatRoomId});
        const numMessages = messages.count();

        if(numMessages > this.state.numMessages || chatRoomId !== this.state.chatRoomId) {
            this.setState(() => ({
                numMessages: numMessages,
                chatRoomId: chatRoomId,
            }));
            this.updateMessages(messages);
        }
    };

    componentDidMount = () => {
        this.interval = setInterval(() => this.test(), 150);
    };

    componentWillMount = () => {
        clearInterval(this.interval);
    };

    componentDidUpdate = () => {
        this.interval = setTimeout(() => this.test(), 150);
    };

    scrollDown = () => {
        let messageDiv = document.getElementById("message_box");
        if(messageDiv !== null){
            messageDiv.scrollTop = 2*messageDiv.scrollHeight;
        }
    };

    render() {

        return (
            <PageWrapper>
                <MessagesBox id="message_box">
                    {this.state.messagesList}
                </MessagesBox>
            </PageWrapper>
        );
    }
}