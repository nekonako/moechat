import React from 'react';
import { Message } from '../types/message';

export default function ChatBody({ data }): JSX.Element {
  return data.map((message: Message, index: number) => {
    if (message.type == 'recv') {
      return (
        <div
          className="flex flex-col w-full text-right justify-end"
          key={index}
        >
          <div className="text-sm" style={{ color: '#556368' }}>
            {message.username}
          </div>
          <div>
            <div className="px-4 py-1 bg-yellow text-dark-secondary mt-1 rounded-md inline-block">
              {message.message}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div key={index}>
          <div className="text-sm" style={{ color: '#556368' }}>
            {message.username}
          </div>
          <div>
            <div className="px-2 py-1 bg-purple text-dark-secondary mt-1 inline-block rounded-md">
              {message.message}
            </div>
          </div>
        </div>
      );
    }
  });
}
