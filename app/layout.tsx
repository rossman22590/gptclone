import "@component/styles/globals.css";
import { SessionProvider } from "@component/components/SessionProvider";
import SideBar from "@component/components/SideBar";
import { getServerSession } from "next-auth";
import { authOptions } from "@component/pages/api/auth/[...nextauth]";
import Login from "@component/components/Login";
import ClientProvider from "@component/components/ClientProvider";

export const metadata = {
  title: "DylanGPT",
  description: "ChatGPT Clone",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang='en'>
      <head />
      <body>
        <SessionProvider session={session}>
          {!session ? (
            <Login />
          ) : (
            <div className='flex'>
              <div className='bg-[#202123] max-w-xs h-screen overflow-y-scroll md:min-w-[20rem]'>
                <SideBar />
              </div>
              {/*sidebar*/}
              {/*client provider - notification*/}
              <ClientProvider />
              <div className='bg-[#343541] flex-1'>{children}</div>
            </div>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
