import prisma from "../../client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
//// @ts-expect-error
import * as React from 'react';
import ShoutBox from "./_Components/ShoutBox";
import MessageList from "./_Components/MessageList";
import { revalidateTag } from "next/cache";


export default async function Chat() {
  ""
  const session = await getServerSession(authOptions);
  //@ts-expect-error
  const userEmail: string = session?.user?.email;
  // const userEmail: string = "kennystwork@gmail.com";
   // //@ts-expect-error
  //  const user: any = session?.user;
  const user = await prisma.user.findFirst({
    where:{
      email: userEmail,
    }
  });
  const myId = user?.id;
  async function updateMessage (message:any) {
    "use server";
    await prisma.chatMessage.update({
      where: {
        id: message.id
      },
      data: {
        message: message.message
      }
    })
  }
  async function removeMessage (messageId: string) {
    "use server";
    
    await prisma.chatMessage.delete({
      where:{
        id:messageId
      }
    });
    revalidateTag("/chat");
  }

  async function like (message: any) {
    "use server"
    let liked = await prisma.tb_pbot.findFirst({
      where:{
        messageId:message.id,
        authorId: myId
      }
    });
    
    if (message.author.id != myId && myId ) {
      if(!liked) {
        await prisma.tb_pbot.create({
          data: { messageId:message.id, authorId: myId}
        });

        await prisma.chatMessage.update({
          where: {
            id: message.id
          },
          data:{like: message.like + 1}
        });
        
      }
      else {
        await prisma.tb_pbot.delete({
          where: { id: liked.id}
        });
        await prisma.chatMessage.update({
          where: {
            id: message.id
          },
          data:{like: message.like - 1}
        });      
      }
      return await prisma.chatMessage.findFirst({
        select: {
          id: true,
          message: true,
          createdAt: true,
          like: true,
          author: { select: { image: true, name: true, id: true, email: true } },
        },
        where:{
          id: message.id
        }
      })
    }

    return message;

  }
  async function sendMessage(message: any) {
    "use server"; 
    if (message.length > 0 && message.length <= 400) {
      let result = await prisma.chatMessage.create({
        data: { message, author: { connect: { email: userEmail } }, like:0 },
      });
      return await prisma.chatMessage.findFirst({
        select: {
          id: true,
          message: true,
          createdAt: true,
          like: true,
          author: { select: { image: true, name: true, id: true, email: true } },
        },
        where:{
          id: result.id
        }
      })
    }
        
  }

  const messages = await prisma.chatMessage.findMany({
    
    select: {
      id: true,
      message: true,
      createdAt: true,
      like: true,
      author: { select: { image: true, name: true, id: true,email: true }},
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  
  return (
    <>
    <section className="bg-white dark:bg-gray-900 md:py-6 lg:py-8 md:py-4">
      <MessageList messages={messages} user={user} like={like} updateMessage={updateMessage} removeMessage={removeMessage} sendMessage={sendMessage}/>
    </section>
    </>
  );
}
