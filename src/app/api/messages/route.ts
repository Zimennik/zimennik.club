import { NextResponse } from 'next/server';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

export async function GET() {
  try {
    const messages = await rest.get(
      Routes.channelMessages(process.env.DISCORD_CHANNEL_ID!),
      {
        query: new URLSearchParams({
          limit: '10'
        })
      }
    );

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
