import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "@component/firebase";
import { collection, deleteDoc, doc } from "firebase/firestore";

type Props = {
  id: string;
};

function ChatRow({ id }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [active, setActive] = useState(false);
  const [messages] = useCollection(
    collection(db, "users", session?.user?.email!, "chats", id, "messages")
  );

  useEffect(() => {
    if (!pathname) return;
    setActive(pathname.includes(id));
  }, [pathname]);

  const removeChat = async () => {
    await deleteDoc(doc(db, "users", session?.user?.email!, "chats", id));
    router.replace("/");
  };

  return (
    <Link
      className={`chatRow justify-start ${active && "bg-gray-700/50"}`}
      href={`/chat/${id}`}
    >
      <ChatBubbleLeftIcon className='h-5 w-5 justify-start' />
      <p className='flex-1 hidden md:inline-flex truncate max-w-[120px] overflow-ellipsis '>
        {messages?.docs[messages?.docs.length - 1]?.data().text || "New Chat"}
      </p>
      <TrashIcon
        onClick={removeChat}
        className='h-5 w-5 ml-0 pl-0 text-gray-700 hover:text-red-700'
      />
    </Link>
  );
}

export default ChatRow;
