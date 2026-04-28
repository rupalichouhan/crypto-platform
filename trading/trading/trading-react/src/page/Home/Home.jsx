import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import AssetTable from './AssetTable';
import StockChart from './StockChart';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { DotIcon, MessageCircleCode } from 'lucide-react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getCoinList, getTop50CoinList } from '../../State/Coin/Action';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const categoryOptions = [
  { label: 'All', value: 'all' },
  { label: 'Top 50', value: 'top50' },
  { label: 'Top Gainers', value: 'topGainers' },
  { label: 'Top Losers', value: 'topLosers' },
];

function Home() {
  const [category, setCategory] = useState('all');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const chatContainerRef = useRef(null);
  const { coin } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleCategory = (value) => {
    setCategory(value);
  };

  const handleSend = () => {
    if (!userInput.trim()) return;

    const newMessages = [
      ...chatMessages,
      { type: 'user', text: userInput },
      {
        type: 'bot',
        text: `You said: "${userInput}"\n(This is a demo response.)`,
      },
    ];

    setChatMessages(newMessages);
    setUserInput('');
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
  if (category === 'top50') {
    dispatch(getTop50CoinList());
  }
}, [category, dispatch]);

  useEffect(() => {
  if (!coin.coinList || coin.coinList.length === 0) {
    dispatch(getCoinList(1));
  }
}, [dispatch, coin.coinList]);


  return (
    <div className="relative">
      <div className="lg:flex">
        <div className="lg:w-[50%] lg:border-r">
          <div className="p-3 flex flex-wrap items-center gap-4">
            {categoryOptions.map((item) => (
              <Button
                key={item.value}
                onClick={() => handleCategory(item.value)}
                variant={category === item.value ? 'default' : 'outline'}
                className="rounded-full"
              >
                {item.label}
              </Button>
            ))}
          </div>
          <AssetTable coin={category === 'top50' ? coin?.top50 || [] : coin?.coinList || []} category={category} />
          <div>
          <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
        </div>
        </div>
        <div className="hidden lg:block lg:w-[50%] p-5">
          <StockChart coinId={"bitcoin"}/>
          <div className="flex gap-5 items-center mt-1">
            <Avatar>
              <AvatarImage
                src="https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400"
                className="w-40 h-40"
                alt="Bitcoin"
              />
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p>BTC</p>
                <DotIcon className="text-gray-400" />
                <p className="text-gray-400">Bitcoin</p>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-xl font-bold"></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Chat Section */}
      <section className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        {showChat && (
          <div className="rounded-md w-[20rem] md:w-[25rem] lg:w-[25rem] h-[70vh] bg-gray-800 text-white shadow-lg flex flex-col">
            {/* Chat Header */}
            <div className="flex justify-between items-center border-b border-white/20 px-6 h-[12%]">
              <p className="font-semibold">Chat Bot</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChat(false)}
              >
                <Cross1Icon />
              </Button>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="h-[76%] flex flex-col overflow-y-auto gap-5 px-5 py-2 scroll-container"
            >
              {/* Welcome Message */}
              {chatMessages.length === 0 && (
                <div className="self-start pb-5 w-auto">
                  <div className="px-5 py-2 rounded-md bg-white text-black max-w-[80%]">
                    <p>Hi, Raam Arora</p>
                    <p>You can ask any crypto-related question</p>
                    <p>Like, price, market cap, etc...</p>
                  </div>
                </div>
              )}

              {/* Dynamic Messages */}
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`pb-2 w-auto ${msg.type === 'user' ? 'self-end' : 'self-start'}`}
                >
                  <div
                    className={`px-4 py-2 rounded-md whitespace-pre-wrap ${
                      msg.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-black'
                    } max-w-[80%]`}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="h-[12%] border-t border-white/20 px-5 py-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 rounded-md px-3 py-2 bg-white text-black outline-none"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend}>Send</Button>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <div className="relative w-[10rem] cursor-pointer group">
          <Button
            className="w-full h-[3rem] gap-2 items-center transition hover:scale-105"
            onClick={() => setShowChat(true)}
          >
            <MessageCircleCode size={30} />
            <span className="text-2xl">Chat Bot</span>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Home;
