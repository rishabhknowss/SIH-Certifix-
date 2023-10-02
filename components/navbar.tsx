"use client";
import { Code2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import MainNav from "./main-nav";
import { ModeToggle } from "./mode-toggle";
import MobileNav from "./mobile-nav";
import { usePathname } from "next/navigation";
import { useState } from "react"; 

const Navbar = () => {
  const pathname = usePathname();

  const routes = [
    {
      href: "/generate",
      label: "Generate",
      active: pathname === "/generate",
    },
  ];

  const [walletConnected, setWalletConnected] = useState(false);

  const connectWallet = () => {
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        const account = accounts[0];
        console.log(account);
        setWalletConnected(true);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className="px-4 h-16 flex items-center border-b">
      <div className="flex items-center w-full">
        <div className="flex gap-x-6">
          <Link
            href={"/"}
            className="text-md font-semibold flex gap-x-2 py-2 px-2 items-center"
          >
            <div className={`bg-${walletConnected ? 'green' : 'black'} dark:bg-white p-1.5 rounded-lg`}>
              <ShieldCheck
                size={20}
                className={`text-${walletConnected ? 'green' : 'white'} dark:text-black`}
              />
            </div>
            CertifiX
          </Link>
          <button onClick={connectWallet} className={`text-${walletConnected ? 'green' : 'white'} font-semibold flex gap-x-2 py-2 px-2 items-center`}>
            <div style={{ backgroundColor: walletConnected ? 'green' : 'white' }} className="p-1.5 rounded-lg">
            </div>
            <span style={{ color: walletConnected ? 'green' : 'white' }}>
               {walletConnected ? "Connected" : "Connect Wallet"}
            </span>
         </button>
          <MainNav routes={routes} />
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          <Link
            href="https://github.com/ArjunVarshney/CertifiX"
            className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hidden sm:block"
          >
            <Code2 size={20} />
          </Link>
          <ModeToggle />
          <MobileNav
            routes={[
              ...routes,
              {
                href: "https://github.com/ArjunVarshney/CertifiX",
                label: "View on Github",
                active: false,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
