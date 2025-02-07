"use client";

import NewChat from "./NewChat";
import { useSession, signOut } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "@component/firebase";
import ChatRow from "./ChatRow";
import {
  ArrowUpTrayIcon,
  Bars3Icon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { collection, orderBy, query } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

function SideBar() {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const { data: session } = useSession();
  const [chats, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session.user?.email!, "chats"),
        orderBy("createdAt", "desc")
      )
  );
  const chatsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //check size of window to set if the sidebar should be expanded or not on page load
    const isWindowDefined = typeof window !== "undefined";
    if (isWindowDefined) {
      setHidden(window.innerWidth <= 768);
    }
  }, []);

  useEffect(() => {
    const messagesEnd = chatsEndRef.current;
    if (messagesEnd) {
      const lastMessage = messagesEnd as HTMLElement;
      if (lastMessage) {
        lastMessage.scrollIntoView();
      }
    }
  }, [chats]);

  const createBetaChat = async () => {
    router.push(`/beta`);
  };

  const toFAQ = async () => {
    router.push(`/faq`);
  };

  const toHome = async () => {
    router.push(`/`);
  };

  return (
    <div className='max-h-screen overflow-y-hidden overflow-x-hidden'>
      <div
        className={`${
          hidden && "hidden"
        } flex flex-col h-screen min-w-[200px] md:min-w-[210px] relative pt-[8%]`}
      >
        <button
          type='button'
          onClick={() => setHidden(true)}
          className='flex h-10 w-10 items-center justify-center hover:animate-spin  focus:animate-ping absolute -top-[0.5%] -right-[4%] overflow-x-hidden'
        >
          <svg
            stroke='currentColor'
            fill='none'
            strokeWidth='1.5'
            viewBox='0 0 24 24'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-6 w-6 text-white'
            height='0.5em'
            width='0.5em'
            xmlns='http://www.w3.org/2000/svg'
          >
            <line x1='18' y1='6' x2='6' y2='18'></line>
            <line x1='6' y1='6' x2='18' y2='18'></line>
          </svg>
        </button>
        <NewChat />
        <div className='chatSelectScroll flex-1 max-w-xs pt-2 overflow-y-auto'>
          <div className='pt-1 '>
            <div className='flex flex-col space-y-2 my-2 max-h-[100%] overflow-clip'>
              {loading && (
                <div className='animate-pulse text-center text-white'>
                  <p>Loading Chats...</p>
                </div>
              )}
              <div ref={chatsEndRef}></div>
              {chats?.docs.map((chat) => (
                <ChatRow key={chat.id} id={chat.id} />
              ))}
            </div>
          </div>
        </div>
        <hr className='width=70% mb-3 pb-3 opacity-20'></hr>
        {session && (
          <div className='flex flex-col overflow-x-hidden space-y-2 px-2'>
            <img
              onClick={toHome}
              src={session.user?.image! || "https://i.imgur.com/jfLbi1b.png"}
              alt='Home Page'
              className='h-12 w-12 rounded-full cursor-pointed mx-auto border-white mb-2 border:1 border-opacity-0 hover:scale-105'
            />{" "}
            <div
              className='hover:border-gray-700 chatRow align-self-start '
              onClick={toFAQ}
            >
              <QuestionMarkCircleIcon className='h-6 w-6' />
              <p>FAQ</p>
            </div>
            <a
              href='https://www.linkedin.com/in/dylan-kotzer-3a5421190/'
              target='_blank'
            >
              <div className='hover:border-gray-700 chatRow align-self-start '>
                <img
                  src='https://www.svgrepo.com/show/391478/linkedin.svg'
                  className='h-6 w-6 m-0 text-white'
                  alt='LinkedIn'
                />
                <p>Dylan</p>
              </div>
            </a>
            <div
              className='hover:border-gray-700 chatRow align-self-start '
              onClick={() => signOut()}
            >
              <ArrowUpTrayIcon className='h-5 w-6 rotate-90' />
              <p className='md:text-sm'>Log Out</p>
            </div>
            <div className='h-[80px] lg:h-[25px]'></div>
          </div>
        )}
      </div>
      <div
        className={`${
          !hidden && "hidden"
        } h-screen flex flex-col justify-between`}
      >
        <Bars3Icon
          onClick={() => setHidden(false)}
          className='w-11 h-11 text-gray-300/50 border-gray-300/50 border-2 rounded-2xl m-4 p-1 hover:text-gray-300 hover:border-white hover:animate-pulse focus:animate-ping'
        />
        {session && (
          <div className='flex flex-col bottom '>
            <img
              onClick={toHome}
              src={session.user?.image! || "https://i.imgur.com/jfLbi1b.png"}
              alt='Profile Picture'
              className='h-10 w-10 rounded-full cursor-pointed mx-auto mb-2 hover:opacity-50'
            />{" "}
            <div className='wrapper'>
              <div
                className='hover:border-gray-700 chatRow align-self-start  hamburger-item '
                onClick={toFAQ}
              >
                <QuestionMarkCircleIcon className='h-6 w-6' />
              </div>
              <div className='hiddenMouseOver'>FAQ</div>
            </div>
            <div className='wrapper'>
              <div className='hover:border-gray-700 chatRow hamburger-item  '>
                <a href='https://www.linkedin.com/in/dylan-kotzer-3a5421190/'>
                  <img
                    src='https://www.svgrepo.com/show/391478/linkedin.svg'
                    className='h-5 w-5  text-white m-auto'
                    alt='LinkedIn'
                  />
                </a>
              </div>
              <div className='hiddenMouseOver'>LinkedIn</div>
            </div>
            <div className='wrapper'>
              <div
                className='hover:border-gray-700 chatRow align-self-start hamburger-item '
                onClick={() => signOut()}
              >
                <ArrowUpTrayIcon className='h-5 w-5 rotate-90' />
              </div>
              <div className='hiddenMouseOver'>Sign Out</div>
            </div>
            <div className='h-[80px]  lg:h-[25px]' />
          </div>
        )}
      </div>
    </div>
  );
}

export default SideBar;
