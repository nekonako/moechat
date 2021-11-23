import React from 'react';
import { Message } from '../types/message';

export default function ChatBody({ data }): JSX.Element {
  return data.map((message: Message, index : number) => {
    if (message.type == 'recv') {
      return (
        <div className="flex w-full justify-end" key={index}>
          <div className="p-2 bg-yellow text-dark-secondary my-2 rounded-md inline-block">
            {message.message}
          </div>
        </div>
      );
    } else {
      return (
        <div key={index}>
          <div className="p-2 bg-purple text-dark-secondary my-2 inline-block rounded-md">
            {message.message}
          </div>
        </div>
      );
    }
  });
}
