import { NextResponse } from "next/server";

export async function GET() {
  try {
    const channelId = process.env.DISCORD_CHANNEL_ID;
    const botToken = process.env.DISCORD_BOT_TOKEN;

    if (!channelId || !botToken) {
      return NextResponse.json(
        { error: "Missing Discord configuration" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const messages = await response.json();
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
